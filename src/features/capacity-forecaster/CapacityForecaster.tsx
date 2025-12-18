import CapacityChart from './CapacityChart';
import InputPanel from './InputPanel';
import { useCapacityForecast } from './useCapacityForecast';
import './capacityForecaster.css';

export function CapacityForecaster() {
  const { metrics, params, forecast, updateMetrics, updateParams, stabilityOptions } =
    useCapacityForecast();
  const finalPoint = forecast.data[forecast.data.length - 1];

  return (
    <div className="panel panel--glass forecaster">
      <div className="forecaster__header">
        <p className="eyebrow">Technical Capacity Forecaster</p>
        <h2>Simulate decay, remediation, and refusal windows.</h2>
        <p className="muted">
          Blend operational metrics with a refusal runway to see where delivery capacity saturates. The model applies compound
          decay to a 24-month horizon and highlights the first saturation point on the chart. Use your browser&apos;s print or
          save-as-PDF options if you need to share a snapshot.
        </p>
      </div>

      <div className="forecaster__grid">
        <InputPanel
          metrics={metrics}
          params={params}
          stabilityOptions={stabilityOptions}
          onMetricsChange={updateMetrics}
          onParamsChange={updateParams}
        />

        <div className="forecaster__chart-card">
          <CapacityChart
            data={forecast.data}
            saturationDate={forecast.saturationDate}
            saturationIndex={forecast.saturationIndex}
          />

          <div className="forecaster__meta">
            <div className="forecaster__meta-item">
              <p className="forecaster__meta-label">Saturation point</p>
              <p className="forecaster__meta-value">
                {forecast.saturationDate ?? 'No saturation within 24 months'}
              </p>
            </div>
            <div className="forecaster__meta-item">
              <p className="forecaster__meta-label">Baseline capacity at horizon</p>
              <p className="forecaster__meta-value">{Math.round(finalPoint.baseline * 100)}%</p>
            </div>
            <div className="forecaster__meta-item">
              <p className="forecaster__meta-label">Remediated capacity at horizon</p>
              <p className="forecaster__meta-value">{Math.round(finalPoint.remediated * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapacityForecaster;
