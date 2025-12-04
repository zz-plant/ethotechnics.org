import type {
  CapacityPoint,
  ForecastResult,
  OperationalMetrics,
  SimulationParams,
  SystemStability,
} from '../types';

const BASE_DECAY = 0.02;
const MAX_IMPACT = 0.05;
const SATURATION_THRESHOLD = 0.35;
const MONTHS_TO_PROJECT = 24;

const STABILITY_MULTIPLIER: Record<SystemStability, number> = {
  RESILIENT: 0.85,
  DEGRADED: 1,
  UNSTABLE: 1.2,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeToDecay = (value: number) => (clamp(value, 0, 100) / 100) * MAX_IMPACT;

const formatLabel = (base: Date, monthOffset: number) => {
  const labelDate = new Date(base);

  labelDate.setMonth(base.getMonth() + monthOffset);

  return labelDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const projectCapacity = (
  metrics: OperationalMetrics,
  params: SimulationParams,
  startDate: Date = new Date(),
): ForecastResult => {
  const velocityImpact = normalizeToDecay(metrics.velocityIndex);
  const interruptImpact = normalizeToDecay(metrics.interruptionRate);
  const stabilityMultiplier = STABILITY_MULTIPLIER[metrics.stability];
  const totalDecay = (BASE_DECAY + velocityImpact + interruptImpact) * stabilityMultiplier;
  const refusalMonths = clamp(params.refusalWeeks, 0, 12) / 4;

  let baselineCapacity = 1;
  let remediatedCapacity = 1;
  let saturationIndex = -1;
  let saturationDate: string | null = null;

  const data: CapacityPoint[] = Array.from({ length: MONTHS_TO_PROJECT }, (_, monthIndex) => {
    baselineCapacity *= 1 - totalDecay;

    if (monthIndex >= refusalMonths) {
      remediatedCapacity *= 1 - totalDecay * 0.7;
    }

    baselineCapacity = clamp(baselineCapacity, 0, 1);
    remediatedCapacity = clamp(remediatedCapacity, 0, 1);

    const isSaturated = remediatedCapacity <= SATURATION_THRESHOLD;

    if (isSaturated && saturationIndex === -1) {
      saturationIndex = monthIndex;
      saturationDate = formatLabel(startDate, monthIndex);
    }

    return {
      monthIndex,
      dateLabel: formatLabel(startDate, monthIndex),
      baseline: baselineCapacity,
      remediated: remediatedCapacity,
      isSaturated,
    };
  });

  return {
    data,
    saturationDate,
    saturationIndex,
  };
};
