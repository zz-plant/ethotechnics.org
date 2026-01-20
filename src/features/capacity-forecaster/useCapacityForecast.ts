import { useEffect, useMemo, useRef, useState } from 'react';
import { projectCapacity } from './utils/projectionEngine';
import type {
  OperationalMetrics,
  SimulationParams,
  SystemStability,
} from './types';

const DEFAULT_METRICS: OperationalMetrics = {
  velocityIndex: 40,
  interruptionRate: 35,
  stability: 'DEGRADED',
};

const DEFAULT_PARAMS: SimulationParams = {
  refusalWeeks: 4,
};

const STABILITY_ORDER: SystemStability[] = ['RESILIENT', 'DEGRADED', 'UNSTABLE'];
const STORAGE_KEY = 'capacity-forecaster-state';
const QUERY_KEYS = {
  velocityIndex: 'velocity',
  interruptionRate: 'interruptions',
  stability: 'stability',
  refusalWeeks: 'refusal',
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseNumericParam = (
  params: URLSearchParams,
  key: string,
  min: number,
  max: number,
) => {
  const rawValue = params.get(key);
  if (rawValue === null) return null;
  const numericValue = Number(rawValue);
  if (Number.isNaN(numericValue)) return null;
  return clamp(numericValue, min, max);
};

const parseStabilityParam = (params: URLSearchParams) => {
  const rawValue = params.get(QUERY_KEYS.stability);
  if (!rawValue) return null;
  if (STABILITY_ORDER.includes(rawValue as SystemStability)) {
    return rawValue as SystemStability;
  }
  return null;
};

const readStoredState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (!storedValue) return null;
    return JSON.parse(storedValue) as {
      metrics?: Partial<OperationalMetrics>;
      params?: Partial<SimulationParams>;
    };
  } catch {
    return null;
  }
};

const resolveInitialState = () => {
  if (typeof window === 'undefined') {
    return { metrics: DEFAULT_METRICS, params: DEFAULT_PARAMS };
  }

  const storedState = readStoredState();
  const searchParams = new URLSearchParams(window.location.search);
  const metrics = {
    ...DEFAULT_METRICS,
    ...storedState?.metrics,
  } as OperationalMetrics;
  const params = {
    ...DEFAULT_PARAMS,
    ...storedState?.params,
  } as SimulationParams;

  const velocityIndex = parseNumericParam(searchParams, QUERY_KEYS.velocityIndex, 0, 100);
  const interruptionRate = parseNumericParam(searchParams, QUERY_KEYS.interruptionRate, 0, 100);
  const stability = parseStabilityParam(searchParams);
  const refusalWeeks = parseNumericParam(searchParams, QUERY_KEYS.refusalWeeks, 0, 12);

  return {
    metrics: {
      velocityIndex: velocityIndex ?? metrics.velocityIndex,
      interruptionRate: interruptionRate ?? metrics.interruptionRate,
      stability: stability ?? metrics.stability,
    },
    params: {
      refusalWeeks: refusalWeeks ?? params.refusalWeeks,
    },
  };
};

export const useCapacityForecast = () => {
  const startDate = useMemo(() => new Date(), []);
  const initialState = useMemo(() => resolveInitialState(), []);
  const [metrics, setMetrics] = useState<OperationalMetrics>(initialState.metrics);
  const [params, setParams] = useState<SimulationParams>(initialState.params);
  const hasSyncedUrl = useRef(false);
  const forecast = useMemo(
    () => projectCapacity(metrics, params, startDate),
    [metrics, params, startDate],
  );

  const updateMetrics = (updates: Partial<OperationalMetrics>) => {
    setMetrics((current) => ({ ...current, ...updates }));
  };

  const updateParams = (updates: Partial<SimulationParams>) => {
    setParams((current) => ({ ...current, ...updates }));
  };

  const reset = () => {
    setMetrics(DEFAULT_METRICS);
    setParams(DEFAULT_PARAMS);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(QUERY_KEYS.velocityIndex, String(metrics.velocityIndex));
    searchParams.set(QUERY_KEYS.interruptionRate, String(metrics.interruptionRate));
    searchParams.set(QUERY_KEYS.stability, metrics.stability);
    searchParams.set(QUERY_KEYS.refusalWeeks, String(params.refusalWeeks));

    const nextSearch = searchParams.toString();
    const nextSearchWithPrefix = nextSearch ? `?${nextSearch}` : '';
    const nextUrl = `${window.location.pathname}${nextSearchWithPrefix}${window.location.hash}`;

    if (window.location.search !== nextSearchWithPrefix) {
      if (hasSyncedUrl.current) {
        window.history.pushState({}, '', nextUrl);
      } else {
        window.history.replaceState({}, '', nextUrl);
        hasSyncedUrl.current = true;
      }
    } else if (!hasSyncedUrl.current) {
      hasSyncedUrl.current = true;
    }

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ metrics, params }),
    );
  }, [metrics, params]);

  return {
    metrics,
    params,
    forecast,
    updateMetrics,
    updateParams,
    reset,
    stabilityOptions: STABILITY_ORDER,
  };
};
