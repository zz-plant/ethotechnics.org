import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CapacityPoint } from './types';

type CapacityChartProps = {
  data: CapacityPoint[];
  saturationIndex: number;
  saturationDate: string | null;
};

const TICK_STYLE = {
  fill: 'var(--muted)',
  fontSize: 12,
};

const formatter = (value: number) => `${Math.round(value * 100)}%`;

export function CapacityChart({ data, saturationIndex, saturationDate }: CapacityChartProps) {
  const saturationLabel = saturationIndex >= 0 ? data[saturationIndex]?.dateLabel : saturationDate;

  return (
    <div className="forecaster__chart">
      <div className="forecaster__chart-header">
        <p className="eyebrow">Forecast</p>
        <h3>Capacity projection (24 months)</h3>
        <p className="muted">Baseline decay versus mitigated decay with refusal runway applied.</p>
      </div>
      <div className="forecaster__chart-body">
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
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
            <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
            <XAxis dataKey="dateLabel" tick={TICK_STYLE} tickMargin={10} interval={3} />
            <YAxis domain={[0, 1]} tickFormatter={formatter} tick={TICK_STYLE} allowDecimals={false} />
            <Tooltip formatter={formatter} labelStyle={{ color: 'var(--text)' }} contentStyle={{ borderRadius: 12 }} />
            <Legend wrapperStyle={{ color: 'var(--muted)' }} />
            {saturationLabel ? (
              <ReferenceLine
                x={saturationLabel}
                stroke="#f9b8b8"
                strokeDasharray="3 4"
                label={{
                  position: 'insideTop',
                  value: 'Saturation',
                  fill: '#f9b8b8',
                  fontSize: 12,
                }}
              />
            ) : null}
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#baselineArea)"
              name="Baseline"
            />
            <Area
              type="monotone"
              dataKey="remediated"
              stroke="var(--gold)"
              strokeWidth={2}
              fill="url(#remediatedArea)"
              name="Remediated"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CapacityChart;
