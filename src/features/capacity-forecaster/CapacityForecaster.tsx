import CapacityChart from './CapacityChart';
import InputPanel from './InputPanel';
import { useCapacityForecast } from './useCapacityForecast';
import type { CapacityPoint } from './types';
import './capacityForecaster.css';

const buildDeltaSummary = (
  scenarioAData: CapacityPoint[],
  scenarioBData: CapacityPoint[],
) => {
  if (scenarioAData.length === 0 || scenarioBData.length === 0) {
    return null;
  }

  const horizonA = scenarioAData[scenarioAData.length - 1];
  const horizonB = scenarioBData[scenarioBData.length - 1];

  return {
    baselineDelta: horizonB.baseline - horizonA.baseline,
    remediatedDelta: horizonB.remediated - horizonA.remediated,
  };
};

export function CapacityForecaster() {
  const {
    scenarioA,
    scenarioB,
    forecastA,
    forecastB,
    viewMode,
    setViewMode,
    updateMetrics,
    updateParams,
    resetToSingleScenario,
    stabilityOptions,
  } = useCapacityForecast();
  const finalPointA = forecastA.data[forecastA.data.length - 1];
  const finalPointB = forecastB.data[forecastB.data.length - 1];
  const isCompare = viewMode === 'compare';

  const handleExport = (variant: 'scenario-a' | 'scenario-b' | 'comparison') => {
    const deltaSummary = buildDeltaSummary(forecastA.data, forecastB.data);
    const payload = (() => {
      switch (variant) {
        case 'scenario-a':
          return {
            label: 'Scenario A',
            metrics: scenarioA.metrics,
            params: scenarioA.params,
            forecast: forecastA,
          };
        case 'scenario-b':
          return {
            label: 'Scenario B',
            metrics: scenarioB.metrics,
            params: scenarioB.params,
            forecast: forecastB,
          };
        case 'comparison':
        default:
          return {
            label: 'Scenario comparison',
            scenarioA: {
              metrics: scenarioA.metrics,
              params: scenarioA.params,
              forecast: forecastA,
            },
            scenarioB: {
              metrics: scenarioB.metrics,
              params: scenarioB.params,
              forecast: forecastB,
            },
            deltaSummary,
          };
      }
    })();

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `capacity-forecast-${variant}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`panel panel--glass forecaster ${
        isCompare ? 'forecaster--compare' : ''
      }`}
    >
      <div className="forecaster__header">
        <p className="eyebrow">Technical Capacity Forecaster</p>
        <h2>Simulate decay, remediation, and refusal windows.</h2>
        <p className="muted">
          Blend operational metrics with a refusal runway to see where delivery capacity saturates. The model applies compound
          decay to a 24-month horizon and highlights the first saturation point on the chart. Use compare mode to visualize two
          scenarios side-by-side and export JSON snapshots for stakeholder review.
        </p>
        <div className="forecaster__actions">
          <button
            type="button"
            className="button ghost button--compact"
            onClick={() => handleExport('scenario-a')}
          >
            Export scenario A
          </button>
          <button
            type="button"
            className="button ghost button--compact"
            onClick={() => handleExport('scenario-b')}
          >
            Export scenario B
          </button>
          <button
            type="button"
            className="button primary button--compact"
            onClick={() => handleExport('comparison')}
            disabled={!isCompare}
          >
            Export comparison
          </button>
        </div>
      </div>

      <div className="forecaster__grid">
        <InputPanel
          scenarioA={scenarioA}
          scenarioB={scenarioB}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetToSingleScenario={resetToSingleScenario}
          stabilityOptions={stabilityOptions}
          onMetricsChange={updateMetrics}
          onParamsChange={updateParams}
        />

        <div className="forecaster__chart-card">
          <CapacityChart
            scenarioA={{
              data: forecastA.data,
              saturationDate: forecastA.saturationDate,
              saturationIndex: forecastA.saturationIndex,
            }}
            scenarioB={{
              data: forecastB.data,
              saturationDate: forecastB.saturationDate,
              saturationIndex: forecastB.saturationIndex,
            }}
            viewMode={viewMode}
          />

          <div className="forecaster__meta">
            <div className="forecaster__meta-group">
              <p className="forecaster__meta-title">Scenario A</p>
              <div className="forecaster__meta-item">
                <p className="forecaster__meta-label">Saturation point</p>
                <p className="forecaster__meta-value">
                  {forecastA.saturationDate ?? 'No saturation within 24 months'}
                </p>
              </div>
              <div className="forecaster__meta-item">
                <p className="forecaster__meta-label">Baseline capacity at horizon</p>
                <p className="forecaster__meta-value">
                  {finalPointA ? Math.round(finalPointA.baseline * 100) : 0}%
                </p>
              </div>
              <div className="forecaster__meta-item">
                <p className="forecaster__meta-label">Remediated capacity at horizon</p>
                <p className="forecaster__meta-value">
                  {finalPointA ? Math.round(finalPointA.remediated * 100) : 0}%
                </p>
              </div>
            </div>
            {isCompare ? (
              <div className="forecaster__meta-group">
                <p className="forecaster__meta-title">Scenario B</p>
                <div className="forecaster__meta-item">
                  <p className="forecaster__meta-label">Saturation point</p>
                  <p className="forecaster__meta-value">
                    {forecastB.saturationDate ?? 'No saturation within 24 months'}
                  </p>
                </div>
                <div className="forecaster__meta-item">
                  <p className="forecaster__meta-label">Baseline capacity at horizon</p>
                  <p className="forecaster__meta-value">
                    {finalPointB ? Math.round(finalPointB.baseline * 100) : 0}%
                  </p>
                </div>
                <div className="forecaster__meta-item">
                  <p className="forecaster__meta-label">Remediated capacity at horizon</p>
                  <p className="forecaster__meta-value">
                    {finalPointB ? Math.round(finalPointB.remediated * 100) : 0}%
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapacityForecaster;
