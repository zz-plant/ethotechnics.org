import type {
  CapacityPoint,
  ForecastResult,
  OperationalMetrics,
  SimulationParams,
  SystemStability,
} from './types';
import { projectCapacity } from './utils/projectionEngine';

export const DEFAULT_METRICS: OperationalMetrics = {
  velocityIndex: 40,
  interruptionRate: 35,
  stability: 'DEGRADED',
};

export const DEFAULT_PARAMS: SimulationParams = {
  refusalWeeks: 4,
};

export const STABILITY_OPTIONS: SystemStability[] = ['RESILIENT', 'DEGRADED', 'UNSTABLE'];

const VIEWBOX = { width: 960, height: 420 } as const;
const PADDING = { top: 20, right: 32, bottom: 56, left: 72 } as const;
const INNER_WIDTH = VIEWBOX.width - PADDING.left - PADDING.right;
const INNER_HEIGHT = VIEWBOX.height - PADDING.top - PADDING.bottom;
const BASELINE_Y = PADDING.top + INNER_HEIGHT;

const Y_TICKS = [1, 0.75, 0.5, 0.25, 0];

const toX = (index: number, total: number) => {
  if (total <= 1) return PADDING.left;

  return PADDING.left + (index / (total - 1)) * INNER_WIDTH;
};

const toY = (value: number) => PADDING.top + (1 - value) * INNER_HEIGHT;

const buildLine = (points: CapacityPoint[], key: 'baseline' | 'remediated') =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(index, points.length)} ${toY(point[key])}`)
    .join(' ');

const buildArea = (points: CapacityPoint[], key: 'baseline' | 'remediated') => {
  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(index, points.length)} ${toY(point[key])}`)
    .join(' ');

  const lastX = toX(points.length - 1, points.length);
  const firstX = toX(0, points.length);

  return `${line} L ${lastX} ${BASELINE_Y} L ${firstX} ${BASELINE_Y} Z`;
};

const monthTicks = (points: CapacityPoint[]) => {
  const indexes = points
    .map((point, index) => ({ index, label: point.dateLabel }))
    .filter(({ index }) => index % 3 === 0 || index === points.length - 1);

  return indexes.map(({ index, label }) => ({
    label,
    x: toX(index, points.length),
  }));
};

const saturationLine = (points: CapacityPoint[], saturationIndex: number) => {
  if (saturationIndex < 0) return null;

  const x = toX(saturationIndex, points.length);

  return { x };
};

export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const getForecast = (
  metrics: OperationalMetrics = DEFAULT_METRICS,
  params: SimulationParams = DEFAULT_PARAMS,
  startDate?: Date,
): ForecastResult => projectCapacity(metrics, params, startDate);

export const buildChartModel = (forecast: ForecastResult) => {
  const { data, saturationIndex } = forecast;

  return {
    viewBox: `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`,
    innerWidth: INNER_WIDTH,
    innerHeight: INNER_HEIGHT,
    padding: PADDING,
    baselineY: BASELINE_Y,
    yTicks: Y_TICKS.map((value) => ({ value, y: toY(value) })),
    xTicks: monthTicks(data),
    baselinePath: buildLine(data, 'baseline'),
    remediatedPath: buildLine(data, 'remediated'),
    baselineArea: buildArea(data, 'baseline'),
    remediatedArea: buildArea(data, 'remediated'),
    saturation: saturationLine(data, saturationIndex),
  } as const;
};
