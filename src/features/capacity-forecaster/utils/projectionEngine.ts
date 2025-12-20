import type {
  CapacityPoint,
  ForecastResult,
  OperationalMetrics,
  SimulationParams,
} from '../types';
import { MODEL_CONFIG } from './modelConfig';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeToDecay = (value: number) =>
  (clamp(value, 0, MODEL_CONFIG.metricScaleMax) / MODEL_CONFIG.metricScaleMax) *
  MODEL_CONFIG.maxImpact;

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
  const stabilityMultiplier = MODEL_CONFIG.stabilityMultipliers[metrics.stability];
  const totalDecay = (MODEL_CONFIG.baseDecay + velocityImpact + interruptImpact) * stabilityMultiplier;
  const refusalMonths =
    clamp(params.refusalWeeks, 0, MODEL_CONFIG.maxRefusalWeeks) / MODEL_CONFIG.refusalWeeksPerMonth;

  let baselineCapacity = 1;
  let remediatedCapacity = 1;
  let saturationIndex = -1;
  let saturationDate: string | null = null;

  const data: CapacityPoint[] = Array.from({ length: MODEL_CONFIG.monthsToProject }, (_, monthIndex) => {
    baselineCapacity *= 1 - totalDecay;

    if (monthIndex >= refusalMonths) {
      remediatedCapacity *= 1 - totalDecay * MODEL_CONFIG.remediatedDecayMultiplier;
    }

    baselineCapacity = clamp(baselineCapacity, 0, 1);
    remediatedCapacity = clamp(remediatedCapacity, 0, 1);

    const isSaturated = remediatedCapacity <= MODEL_CONFIG.saturationThreshold;

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
