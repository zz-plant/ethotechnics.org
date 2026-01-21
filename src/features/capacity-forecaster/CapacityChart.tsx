import { useId } from "react";

import type { CapacityPoint } from "./types";

type ScenarioChartData = {
  data: CapacityPoint[];
  saturationIndex: number;
  saturationDate: string | null;
};

type CapacityChartProps = {
  scenarioA: ScenarioChartData;
  scenarioB: ScenarioChartData;
  viewMode: "single" | "compare";
};

const CHART_WIDTH = 860;
const CHART_HEIGHT = 360;
const MARGINS = { top: 16, right: 16, bottom: 40, left: 54 };

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const formatDelta = (value: number) => {
  const rounded = Math.round(value * 100);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
};

const buildLinePath = (
  points: CapacityPoint[],
  xForIndex: (index: number) => number,
  yForValue: (value: number) => number,
  key: "baseline" | "remediated",
) =>
  points
    .map((point, index) => {
      const x = xForIndex(index).toFixed(2);
      const y = yForValue(point[key]).toFixed(2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

const buildAreaPath = (
  points: CapacityPoint[],
  xForIndex: (index: number) => number,
  yForValue: (value: number) => number,
  key: "baseline" | "remediated",
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
    .join(" ");

  return `M ${firstX} ${zeroY} ${segments} L ${lastX} ${zeroY} Z`;
};

const resolveSaturationPoint = (
  data: CapacityPoint[],
  saturationIndex: number,
  saturationDate: string | null,
  xForIndex: (index: number) => number,
) => {
  const saturationLabel =
    saturationIndex >= 0 ? data[saturationIndex]?.dateLabel : saturationDate;
  const saturationX = (() => {
    if (saturationIndex >= 0 && data[saturationIndex]) {
      return xForIndex(saturationIndex);
    }

    const matchingIndex = data.findIndex(
      (point) => point.dateLabel === saturationDate,
    );
    return matchingIndex >= 0 ? xForIndex(matchingIndex) : null;
  })();

  return { saturationLabel, saturationX };
};

export function CapacityChart({
  scenarioA,
  scenarioB,
  viewMode,
}: CapacityChartProps) {
  const chartTitleId = useId();
  const chartDescriptionId = useId();
  const chartSvgDescriptionId = useId();
  const gradientId = useId();
  const baselineGradientId = `baselineArea-${gradientId}`;
  const remediatedGradientId = `remediatedArea-${gradientId}`;
  const baselineBGradientId = `baselineBArea-${gradientId}`;
  const remediatedBGradientId = `remediatedBArea-${gradientId}`;
  const isCompare = viewMode === "compare";

  if (scenarioA.data.length === 0) {
    return (
      <div className="forecaster__chart">
        <div className="forecaster__chart-header">
          <p className="eyebrow">Forecast</p>
          <h3 id={chartTitleId}>Capacity projection (24 months)</h3>
          <p id={chartDescriptionId} className="muted">
            Baseline decay versus mitigated decay with refusal runway applied.
          </p>
        </div>
        <div className="forecaster__chart-body">
          <p className="muted">No data available.</p>
        </div>
      </div>
    );
  }

  const denominator = Math.max(scenarioA.data.length - 1, 1);
  const innerWidth = CHART_WIDTH - MARGINS.left - MARGINS.right;
  const innerHeight = CHART_HEIGHT - MARGINS.top - MARGINS.bottom;
  const xForIndex = (index: number) =>
    MARGINS.left + (index / denominator) * innerWidth;
  const yForValue = (value: number) => MARGINS.top + (1 - value) * innerHeight;

  const xTicks = scenarioA.data.reduce<number[]>((indices, _, index) => {
    if (index === scenarioA.data.length - 1 || index % 3 === 0) {
      indices.push(index);
    }
    return indices;
  }, []);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const baselineLine = buildLinePath(
    scenarioA.data,
    xForIndex,
    yForValue,
    "baseline",
  );
  const remediatedLine = buildLinePath(
    scenarioA.data,
    xForIndex,
    yForValue,
    "remediated",
  );
  const baselineArea = buildAreaPath(
    scenarioA.data,
    xForIndex,
    yForValue,
    "baseline",
  );
  const remediatedArea = buildAreaPath(
    scenarioA.data,
    xForIndex,
    yForValue,
    "remediated",
  );
  const baselineLineB = buildLinePath(
    scenarioB.data,
    xForIndex,
    yForValue,
    "baseline",
  );
  const remediatedLineB = buildLinePath(
    scenarioB.data,
    xForIndex,
    yForValue,
    "remediated",
  );
  const baselineAreaB = buildAreaPath(
    scenarioB.data,
    xForIndex,
    yForValue,
    "baseline",
  );
  const remediatedAreaB = buildAreaPath(
    scenarioB.data,
    xForIndex,
    yForValue,
    "remediated",
  );

  const saturationA = resolveSaturationPoint(
    scenarioA.data,
    scenarioA.saturationIndex,
    scenarioA.saturationDate,
    xForIndex,
  );
  const saturationB = resolveSaturationPoint(
    scenarioB.data,
    scenarioB.saturationIndex,
    scenarioB.saturationDate,
    xForIndex,
  );
  const horizonA = scenarioA.data[scenarioA.data.length - 1];
  const horizonB = scenarioB.data[scenarioB.data.length - 1];
  const deltaSummary = horizonA && horizonB
    ? {
        baseline: horizonB.baseline - horizonA.baseline,
        remediated: horizonB.remediated - horizonA.remediated,
      }
    : null;

  return (
    <div className="forecaster__chart">
      <div className="forecaster__chart-header">
        <p className="eyebrow">Forecast</p>
        <h3 id={chartTitleId}>Capacity projection (24 months)</h3>
        <p id={chartDescriptionId} className="muted">
          Baseline decay versus mitigated decay with refusal runway applied.
        </p>
      </div>
      <div className="forecaster__chart-body">
        <svg
          className="forecaster__chart-svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-labelledby={chartTitleId}
          aria-describedby={`${chartDescriptionId} ${chartSvgDescriptionId}`}
        >
          <desc id={chartSvgDescriptionId}>
            {isCompare
              ? "Four area lines compare baseline and remediated capacity for scenario A and scenario B, with vertical markers indicating saturation points."
              : "Two area lines show baseline capacity declining faster than the remediated line, with a vertical marker indicating the saturation date when the baseline reaches zero."}
          </desc>
          <defs>
            <linearGradient
              id={baselineGradientId}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop
                offset="100%"
                stopColor="var(--accent)"
                stopOpacity={0.05}
              />
            </linearGradient>
            <linearGradient
              id={remediatedGradientId}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient
              id={baselineBGradientId}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient
              id={remediatedBGradientId}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <g className="forecaster__chart-grid">
            {yTicks.map((tick) => {
              const y = yForValue(tick);
              return (
                <line
                  key={tick}
                  x1={MARGINS.left}
                  x2={CHART_WIDTH - MARGINS.right}
                  y1={y}
                  y2={y}
                />
              );
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
              const label = scenarioA.data[tickIndex]?.dateLabel ?? "";

              return (
                <g
                  key={label}
                  transform={`translate(${x}, ${CHART_HEIGHT - MARGINS.bottom + 16})`}
                >
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
                <g
                  key={tick}
                  transform={`translate(${MARGINS.left - 12}, ${y})`}
                >
                  <text textAnchor="end" dominantBaseline="middle">
                    {formatPercent(tick)}
                  </text>
                </g>
              );
            })}
          </g>

          {saturationA.saturationLabel && saturationA.saturationX !== null ? (
            <g className="forecaster__saturation forecaster__saturation--a">
              <line
                x1={saturationA.saturationX}
                x2={saturationA.saturationX}
                y1={MARGINS.top}
                y2={CHART_HEIGHT - MARGINS.bottom}
              />
              <text
                x={saturationA.saturationX + 6}
                y={MARGINS.top + 12}
                className="forecaster__saturation-label"
              >
                Saturation A
              </text>
            </g>
          ) : null}

          {isCompare &&
          saturationB.saturationLabel &&
          saturationB.saturationX !== null
            ? (
                <g className="forecaster__saturation forecaster__saturation--b">
                  <line
                    x1={saturationB.saturationX}
                    x2={saturationB.saturationX}
                    y1={MARGINS.top}
                    y2={CHART_HEIGHT - MARGINS.bottom}
                  />
                  <text
                    x={saturationB.saturationX + 6}
                    y={MARGINS.top + 26}
                    className="forecaster__saturation-label"
                  >
                    Saturation B
                  </text>
                </g>
              )
            : null}

          <path
            className="forecaster__chart-area forecaster__chart-area--baseline"
            d={baselineArea}
            fill={`url(#${baselineGradientId})`}
          />
          <path
            className="forecaster__chart-line forecaster__chart-line--baseline"
            d={baselineLine}
          />

          <path
            className="forecaster__chart-area forecaster__chart-area--remediated"
            d={remediatedArea}
            fill={`url(#${remediatedGradientId})`}
          />
          <path
            className="forecaster__chart-line forecaster__chart-line--remediated"
            d={remediatedLine}
          />

          {isCompare ? (
            <>
              <path
                className="forecaster__chart-area forecaster__chart-area--baseline-b"
                d={baselineAreaB}
                fill={`url(#${baselineBGradientId})`}
              />
              <path
                className="forecaster__chart-line forecaster__chart-line--baseline-b"
                d={baselineLineB}
              />

              <path
                className="forecaster__chart-area forecaster__chart-area--remediated-b"
                d={remediatedAreaB}
                fill={`url(#${remediatedBGradientId})`}
              />
              <path
                className="forecaster__chart-line forecaster__chart-line--remediated-b"
                d={remediatedLineB}
              />
            </>
          ) : null}
        </svg>

        <div className="forecaster__chart-legend">
          <div className="forecaster__legend-item">
            <span
              className="forecaster__legend-swatch forecaster__legend-swatch--baseline"
              aria-hidden
            />
            <span>Scenario A: baseline</span>
          </div>
          <div className="forecaster__legend-item">
            <span
              className="forecaster__legend-swatch forecaster__legend-swatch--remediated"
              aria-hidden
            />
            <span>Scenario A: remediated</span>
          </div>
          {isCompare ? (
            <>
              <div className="forecaster__legend-item">
                <span
                  className="forecaster__legend-swatch forecaster__legend-swatch--baseline-b"
                  aria-hidden
                />
                <span>Scenario B: baseline</span>
              </div>
              <div className="forecaster__legend-item">
                <span
                  className="forecaster__legend-swatch forecaster__legend-swatch--remediated-b"
                  aria-hidden
                />
                <span>Scenario B: remediated</span>
              </div>
            </>
          ) : null}
        </div>
        {isCompare && deltaSummary ? (
          <div className="forecaster__delta">
            <p className="forecaster__delta-title">
              Horizon delta (Scenario B vs A)
            </p>
            <div className="forecaster__delta-values">
              <span>
                Baseline: {formatDelta(deltaSummary.baseline)}
              </span>
              <span>
                Remediated: {formatDelta(deltaSummary.remediated)}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CapacityChart;
