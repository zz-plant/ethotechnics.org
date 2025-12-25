import { useMemo, useState } from 'react';
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

export const useCapacityForecast = () => {
  const startDate = useMemo(() => new Date(), []);
  const [metrics, setMetrics] = useState<OperationalMetrics>(DEFAULT_METRICS);
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
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
