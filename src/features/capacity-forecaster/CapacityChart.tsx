import type { CapacityPoint } from './types';

type CapacityChartProps = {
  data: CapacityPoint[];
  saturationIndex: number;
  saturationDate: string | null;
};

const CHART_WIDTH = 860;
const CHART_HEIGHT = 360;
const MARGINS = { top: 16, right: 16, bottom: 40, left: 54 };

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const buildLinePath = (
  points: CapacityPoint[],
  xForIndex: (index: number) => number,
  yForValue: (value: number) => number,
  key: 'baseline' | 'remediated',
) =>
  points
    .map((point, index) => {
      const x = xForIndex(index).toFixed(2);
      const y = yForValue(point[key]).toFixed(2);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

const buildAreaPath = (
  points: CapacityPoint[],
  xForIndex: (index: number) => number,
  yForValue: (value: number) => number,
  key: 'baseline' | 'remediated',
) => {
  const zeroY = yForValue(0).toFixed(2);
  const firstX = xForIndex(0).toFixed(2);
  const lastX = xForIndex(points.length - 1).toFixed(2);

  const segments = points
    .map((point, index) => {
      const x = xForIndex(index).toFixed(2);
      const y = yForValue(point[key]).toFixed(2);
      return `L ${x} ${y}`;
    })
    .join(' ');

  return `M ${firstX} ${zeroY} ${segments} L ${lastX} ${zeroY} Z`;
};

export function CapacityChart({ data, saturationIndex, saturationDate }: CapacityChartProps) {
  if (data.length === 0) {
    return (
      <div className="forecaster__chart">
        <div className="forecaster__chart-header">
          <p className="eyebrow">Forecast</p>
          <h3>Capacity projection (24 months)</h3>
          <p className="muted">Baseline decay versus mitigated decay with refusal runway applied.</p>
        </div>
        <div className="forecaster__chart-body">
          <p className="muted">No data available.</p>
        </div>
      </div>
    );
  }

  const denominator = Math.max(data.length - 1, 1);
  const innerWidth = CHART_WIDTH - MARGINS.left - MARGINS.right;
  const innerHeight = CHART_HEIGHT - MARGINS.top - MARGINS.bottom;
  const xForIndex = (index: number) => MARGINS.left + (index / denominator) * innerWidth;
  const yForValue = (value: number) => MARGINS.top + (1 - value) * innerHeight;

  const xTicks = data.reduce<number[]>((indices, _, index) => {
    if (index === data.length - 1 || index % 3 === 0) {
      indices.push(index);
    }
    return indices;
  }, []);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const baselineLine = buildLinePath(data, xForIndex, yForValue, 'baseline');
  const remediatedLine = buildLinePath(data, xForIndex, yForValue, 'remediated');
  const baselineArea = buildAreaPath(data, xForIndex, yForValue, 'baseline');
  const remediatedArea = buildAreaPath(data, xForIndex, yForValue, 'remediated');

  const saturationLabel = saturationIndex >= 0 ? data[saturationIndex]?.dateLabel : saturationDate;
  const saturationX = (() => {
    if (saturationIndex >= 0 && data[saturationIndex]) {
      return xForIndex(saturationIndex);
    }

    const matchingIndex = data.findIndex((point) => point.dateLabel === saturationDate);
    return matchingIndex >= 0 ? xForIndex(matchingIndex) : null;
  })();

  return (
    <div className="forecaster__chart">
      <div className="forecaster__chart-header">
        <p className="eyebrow">Forecast</p>
        <h3>Capacity projection (24 months)</h3>
        <p className="muted">Baseline decay versus mitigated decay with refusal runway applied.</p>
      </div>
      <div className="forecaster__chart-body">
        <svg
          className="forecaster__chart-svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Area chart comparing baseline and remediated capacity over 24 months"
        >
          <defs>
            <linearGradient id="baselineArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="remediatedArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          <g className="forecaster__chart-grid">
            {yTicks.map((tick) => {
              const y = yForValue(tick);
              return <line key={tick} x1={MARGINS.left} x2={CHART_WIDTH - MARGINS.right} y1={y} y2={y} />;
            })}
          </g>

          <line
            x1={MARGINS.left}
            x2={CHART_WIDTH - MARGINS.right}
            y1={yForValue(0)}
            y2={yForValue(0)}
            className="forecaster__axis-line"
          />
          <line
            x1={MARGINS.left}
            x2={MARGINS.left}
            y1={MARGINS.top}
            y2={CHART_HEIGHT - MARGINS.bottom}
            className="forecaster__axis-line"
          />

          <g className="forecaster__chart-axis">
            {xTicks.map((tickIndex) => {
              const x = xForIndex(tickIndex);
              const label = data[tickIndex]?.dateLabel ?? '';

              return (
                <g key={label} transform={`translate(${x}, ${CHART_HEIGHT - MARGINS.bottom + 16})`}>
                  <line y1={-8} y2={0} />
                  <text textAnchor="middle" dominantBaseline="hanging">
                    {label}
                  </text>
                </g>
              );
            })}

            {yTicks.map((tick) => {
              const y = yForValue(tick);
              return (
                <g key={tick} transform={`translate(${MARGINS.left - 12}, ${y})`}>
                  <text textAnchor="end" dominantBaseline="middle">
                    {formatPercent(tick)}
                  </text>
                </g>
              );
            })}
          </g>

          {saturationLabel && saturationX ? (
            <g className="forecaster__saturation">
              <line x1={saturationX} x2={saturationX} y1={MARGINS.top} y2={CHART_HEIGHT - MARGINS.bottom} />
              <text x={saturationX + 6} y={MARGINS.top + 12} className="forecaster__saturation-label">
                Saturation
              </text>
            </g>
          ) : null}

          <path className="forecaster__chart-area forecaster__chart-area--baseline" d={baselineArea} />
          <path className="forecaster__chart-line forecaster__chart-line--baseline" d={baselineLine} />

          <path className="forecaster__chart-area forecaster__chart-area--remediated" d={remediatedArea} />
          <path className="forecaster__chart-line forecaster__chart-line--remediated" d={remediatedLine} />
        </svg>

        <div className="forecaster__chart-legend">
          <div className="forecaster__legend-item">
            <span className="forecaster__legend-swatch forecaster__legend-swatch--baseline" aria-hidden />
            <span>Baseline</span>
          </div>
          <div className="forecaster__legend-item">
            <span className="forecaster__legend-swatch forecaster__legend-swatch--remediated" aria-hidden />
            <span>Remediated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapacityChart;
