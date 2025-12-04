export type SystemStability = 'RESILIENT' | 'DEGRADED' | 'UNSTABLE';

export interface OperationalMetrics {
  velocityIndex: number; // 0-100
  interruptionRate: number; // 0-100
  stability: SystemStability;
}

export interface SimulationParams {
  refusalWeeks: number; // 0-12
}

export interface CapacityPoint {
  monthIndex: number;
  dateLabel: string;
  baseline: number; // 0.0 - 1.0
  remediated: number;
  isSaturated: boolean;
}

export interface ForecastResult {
  data: CapacityPoint[];
  saturationDate: string | null;
  saturationIndex: number;
}
