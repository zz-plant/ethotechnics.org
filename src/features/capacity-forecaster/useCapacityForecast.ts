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

type ScenarioState = {
  metrics: OperationalMetrics;
  params: SimulationParams;
};

type ViewMode = 'single' | 'compare';

const STABILITY_ORDER: SystemStability[] = ['RESILIENT', 'DEGRADED', 'UNSTABLE'];
const STORAGE_KEY = 'capacity-forecaster-state';
const QUERY_KEYS = {
  scenarioA: {
    velocityIndex: 'velocity',
    interruptionRate: 'interruptions',
    stability: 'stability',
    refusalWeeks: 'refusal',
  },
  scenarioB: {
    velocityIndex: 'velocityB',
    interruptionRate: 'interruptionsB',
    stability: 'stabilityB',
    refusalWeeks: 'refusalB',
  },
  viewMode: 'mode',
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

const parseStabilityParam = (params: URLSearchParams, key: string) => {
  const rawValue = params.get(key);
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
      scenarioA?: Partial<ScenarioState>;
      scenarioB?: Partial<ScenarioState>;
      viewMode?: ViewMode;
    };
  } catch {
    return null;
  }
};

type ScenarioQueryKeys = {
  velocityIndex: string;
  interruptionRate: string;
  stability: string;
  refusalWeeks: string;
};

const resolveScenarioState = (
  searchParams: URLSearchParams,
  keys: ScenarioQueryKeys,
  fallback: ScenarioState,
): ScenarioState => {
  const velocityIndex = parseNumericParam(searchParams, keys.velocityIndex, 0, 100);
  const interruptionRate = parseNumericParam(searchParams, keys.interruptionRate, 0, 100);
  const stability = parseStabilityParam(searchParams, keys.stability);
  const refusalWeeks = parseNumericParam(searchParams, keys.refusalWeeks, 0, 12);

  return {
    metrics: {
      velocityIndex: velocityIndex ?? fallback.metrics.velocityIndex,
      interruptionRate: interruptionRate ?? fallback.metrics.interruptionRate,
      stability: stability ?? fallback.metrics.stability,
    },
    params: {
      refusalWeeks: refusalWeeks ?? fallback.params.refusalWeeks,
    },
  };
};

const resolveViewMode = (
  searchParams: URLSearchParams,
  storedMode: ViewMode | undefined,
): ViewMode => {
  const rawMode = searchParams.get(QUERY_KEYS.viewMode);
  if (rawMode === 'compare') {
    return 'compare';
  }
  if (rawMode === 'single') {
    return 'single';
  }
  return storedMode ?? 'single';
};

const resolveInitialState = (): {
  scenarioA: ScenarioState;
  scenarioB: ScenarioState;
  viewMode: ViewMode;
  hasCustomScenarioB: boolean;
} => {
  if (typeof window === 'undefined') {
    return {
      scenarioA: { metrics: DEFAULT_METRICS, params: DEFAULT_PARAMS },
      scenarioB: { metrics: DEFAULT_METRICS, params: DEFAULT_PARAMS },
      viewMode: 'single',
      hasCustomScenarioB: false,
    };
  }

  const storedState = readStoredState();
  const searchParams = new URLSearchParams(window.location.search);
  const legacyScenario = storedState?.metrics || storedState?.params
    ? {
        metrics: storedState.metrics ?? {},
        params: storedState.params ?? {},
      }
    : null;
  const baseScenarioA = {
    metrics: {
      ...DEFAULT_METRICS,
      ...legacyScenario?.metrics,
      ...storedState?.scenarioA?.metrics,
    },
    params: {
      ...DEFAULT_PARAMS,
      ...legacyScenario?.params,
      ...storedState?.scenarioA?.params,
    },
  } as ScenarioState;
  const baseScenarioB = {
    metrics: {
      ...baseScenarioA.metrics,
      ...storedState?.scenarioB?.metrics,
    },
    params: {
      ...baseScenarioA.params,
      ...storedState?.scenarioB?.params,
    },
  } as ScenarioState;

  const scenarioA = resolveScenarioState(
    searchParams,
    QUERY_KEYS.scenarioA,
    baseScenarioA,
  );
  const scenarioB = resolveScenarioState(
    searchParams,
    QUERY_KEYS.scenarioB,
    baseScenarioB,
  );
  const viewMode = resolveViewMode(searchParams, storedState?.viewMode);
  const hasScenarioBParams = Object.values(QUERY_KEYS.scenarioB).some((key) =>
    searchParams.has(key),
  );
  const hasCustomScenarioB = Boolean(storedState?.scenarioB || hasScenarioBParams);

  return { scenarioA, scenarioB, viewMode, hasCustomScenarioB };
};

export const useCapacityForecast = () => {
  const startDate = useMemo(() => new Date(), []);
  const initialState = useMemo(() => resolveInitialState(), []);
  const [scenarioA, setScenarioA] = useState<ScenarioState>(initialState.scenarioA);
  const [scenarioB, setScenarioB] = useState<ScenarioState>(initialState.scenarioB);
  const [viewMode, setViewModeState] = useState<ViewMode>(initialState.viewMode);
  const hasSyncedUrl = useRef(false);
  const hasCustomScenarioB = useRef(initialState.hasCustomScenarioB);
  const forecastA = useMemo(
    () => projectCapacity(scenarioA.metrics, scenarioA.params, startDate),
    [scenarioA.metrics, scenarioA.params, startDate],
  );
  const forecastB = useMemo(
    () => projectCapacity(scenarioB.metrics, scenarioB.params, startDate),
    [scenarioB.metrics, scenarioB.params, startDate],
  );

  const updateMetrics = (
    scenarioId: 'A' | 'B',
    updates: Partial<OperationalMetrics>,
  ) => {
    const updater = scenarioId === 'A' ? setScenarioA : setScenarioB;
    if (scenarioId === 'B') {
      hasCustomScenarioB.current = true;
    }
    updater((current) => ({
      ...current,
      metrics: { ...current.metrics, ...updates },
    }));
  };

  const updateParams = (
    scenarioId: 'A' | 'B',
    updates: Partial<SimulationParams>,
  ) => {
    const updater = scenarioId === 'A' ? setScenarioA : setScenarioB;
    if (scenarioId === 'B') {
      hasCustomScenarioB.current = true;
    }
    updater((current) => ({
      ...current,
      params: { ...current.params, ...updates },
    }));
  };

  const resetToSingleScenario = () => {
    setScenarioB({
      metrics: { ...scenarioA.metrics },
      params: { ...scenarioA.params },
    });
    hasCustomScenarioB.current = false;
    setViewModeState('single');
  };

  const mirrorScenario = (source: 'A' | 'B', target: 'A' | 'B') => {
    if (source === target) return;
    const sourceScenario = source === 'A' ? scenarioA : scenarioB;
    const targetSetter = target === 'A' ? setScenarioA : setScenarioB;
    if (target === 'B') {
      hasCustomScenarioB.current = true;
    }
    targetSetter({
      metrics: { ...sourceScenario.metrics },
      params: { ...sourceScenario.params },
    });
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState((current) => {
      if (mode === 'compare' && current === 'single' && !hasCustomScenarioB.current) {
        setScenarioB({
          metrics: { ...scenarioA.metrics },
          params: { ...scenarioA.params },
        });
      }
      return mode;
    });
  };

  const reset = () => {
    setScenarioA({ metrics: DEFAULT_METRICS, params: DEFAULT_PARAMS });
    setScenarioB({ metrics: DEFAULT_METRICS, params: DEFAULT_PARAMS });
    hasCustomScenarioB.current = false;
    setViewModeState('single');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(
      QUERY_KEYS.scenarioA.velocityIndex,
      String(scenarioA.metrics.velocityIndex),
    );
    searchParams.set(
      QUERY_KEYS.scenarioA.interruptionRate,
      String(scenarioA.metrics.interruptionRate),
    );
    searchParams.set(
      QUERY_KEYS.scenarioA.stability,
      scenarioA.metrics.stability,
    );
    searchParams.set(
      QUERY_KEYS.scenarioA.refusalWeeks,
      String(scenarioA.params.refusalWeeks),
    );
    searchParams.set(
      QUERY_KEYS.scenarioB.velocityIndex,
      String(scenarioB.metrics.velocityIndex),
    );
    searchParams.set(
      QUERY_KEYS.scenarioB.interruptionRate,
      String(scenarioB.metrics.interruptionRate),
    );
    searchParams.set(
      QUERY_KEYS.scenarioB.stability,
      scenarioB.metrics.stability,
    );
    searchParams.set(
      QUERY_KEYS.scenarioB.refusalWeeks,
      String(scenarioB.params.refusalWeeks),
    );
    if (viewMode === 'compare') {
      searchParams.set(QUERY_KEYS.viewMode, 'compare');
    } else {
      searchParams.delete(QUERY_KEYS.viewMode);
    }

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
      JSON.stringify({ scenarioA, scenarioB, viewMode }),
    );
  }, [scenarioA, scenarioB, viewMode]);

  return {
    scenarioA,
    scenarioB,
    forecastA,
    forecastB,
    updateMetrics,
    updateParams,
    reset,
    resetToSingleScenario,
    mirrorScenario,
    viewMode,
    setViewMode,
    stabilityOptions: STABILITY_ORDER,
  };
};
