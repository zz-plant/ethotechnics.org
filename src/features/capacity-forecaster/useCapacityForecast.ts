import { useEffect, useState } from 'react';
import { projectCapacity } from './utils/projectionEngine';
import type {
  ForecastResult,
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

export const useCapacityForecast = () => {
  const [metrics, setMetrics] = useState<OperationalMetrics>(DEFAULT_METRICS);
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [forecast, setForecast] = useState<ForecastResult>(() =>
    projectCapacity(DEFAULT_METRICS, DEFAULT_PARAMS),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForecast(projectCapacity(metrics, params));
    }, 100);

    return () => window.clearTimeout(timer);
  }, [metrics, params]);

  const updateMetrics = (updates: Partial<OperationalMetrics>) => {
    setMetrics((current) => ({ ...current, ...updates }));
  };

  const updateParams = (updates: Partial<SimulationParams>) => {
    setParams((current) => ({ ...current, ...updates }));
  };

  const reset = () => {
    setMetrics(DEFAULT_METRICS);
    setParams(DEFAULT_PARAMS);
    setForecast(projectCapacity(DEFAULT_METRICS, DEFAULT_PARAMS));
  };

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
