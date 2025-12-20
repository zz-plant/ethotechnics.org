import type { SystemStability } from '../types';

export interface ModelConfig {
  baseDecay: number;
  maxImpact: number;
  saturationThreshold: number;
  monthsToProject: number;
  remediatedDecayMultiplier: number;
  stabilityMultipliers: Record<SystemStability, number>;
  metricScaleMax: number;
  refusalWeeksPerMonth: number;
  maxRefusalWeeks: number;
}

export const MODEL_CONFIG: ModelConfig = Object.freeze({
  baseDecay: 0.02,
  maxImpact: 0.05,
  saturationThreshold: 0.35,
  monthsToProject: 24,
  remediatedDecayMultiplier: 0.7,
  stabilityMultipliers: {
    RESILIENT: 0.85,
    DEGRADED: 1,
    UNSTABLE: 1.2,
  },
  metricScaleMax: 100,
  refusalWeeksPerMonth: 4,
  maxRefusalWeeks: 12,
});
