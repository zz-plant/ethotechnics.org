import { useId } from "react";
import type { CSSProperties } from "react";

import type {
  OperationalMetrics,
  SimulationParams,
  SystemStability,
} from "./types";

type SliderFieldProps = {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

type InputPanelProps = {
  scenarioA: {
    metrics: OperationalMetrics;
    params: SimulationParams;
  };
  scenarioB: {
    metrics: OperationalMetrics;
    params: SimulationParams;
  };
  viewMode: "single" | "compare";
  onViewModeChange: (mode: "single" | "compare") => void;
  onResetToSingleScenario: () => void;
  onMetricsChange: (
    scenarioId: "A" | "B",
    updates: Partial<OperationalMetrics>,
  ) => void;
  onParamsChange: (
    scenarioId: "A" | "B",
    updates: Partial<SimulationParams>,
  ) => void;
  stabilityOptions: SystemStability[];
};

const getTrafficColor = (percent: number) => {
  const hue = 120 - (percent / 100) * 120;

  return `hsl(${hue}, 70%, 55%)`;
};

const getSliderFill = (value: number, min: number, max: number) => {
  if (max === min) {
    return 0;
  }

  const fillPercent = ((value - min) / (max - min)) * 100;

  return Math.min(Math.max(fillPercent, 0), 100);
};

const getSliderStyles = (value: number, min: number, max: number) => {
  const fillPercent = getSliderFill(value, min, max);

  return {
    "--range-fill-color": getTrafficColor(fillPercent),
    "--range-fill-percent": `${fillPercent}%`,
  } as CSSProperties;
};

const SliderField = ({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderFieldProps) => {
  const inputId = useId();
  const descriptionId = useId();

  return (
    <div className="forecaster__control">
      <div className="forecaster__label-row">
        <label className="forecaster__label" htmlFor={inputId}>
          <span className="muted">{label}</span>
          <p id={descriptionId} className="forecaster__description">
            {description}
          </p>
        </label>
        <span className="pill pill--ghost">{value}</span>
      </div>
      <input
        id={inputId}
        aria-describedby={descriptionId}
        className="forecaster__range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={getSliderStyles(value, min, max)}
        aria-valuetext={`${label} set to ${value} on a scale from ${min} to ${max}`}
      />
      <div className="forecaster__range-scale" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

type ScenarioPanelProps = {
  label: string;
  summary: string;
  metrics: OperationalMetrics;
  params: SimulationParams;
  stabilityOptions: SystemStability[];
  onMetricsChange: (updates: Partial<OperationalMetrics>) => void;
  onParamsChange: (updates: Partial<SimulationParams>) => void;
};

const ScenarioPanel = ({
  label,
  summary,
  metrics,
  params,
  stabilityOptions,
  onMetricsChange,
  onParamsChange,
}: ScenarioPanelProps) => (
  <div className="forecaster__scenario">
    <div className="forecaster__scenario-header">
      <div>
        <p className="eyebrow">{label}</p>
        <p className="muted">{summary}</p>
      </div>
      <span className="pill pill--ghost">{label}</span>
    </div>

    <SliderField
      label="Velocity index"
      description="Higher values increase the decay rate as the team is stretched thin."
      value={metrics.velocityIndex}
      min={0}
      max={100}
      onChange={(value) => onMetricsChange({ velocityIndex: value })}
    />

    <SliderField
      label="Interruption rate"
      description="Context-switching and support load erode capacity in parallel."
      value={metrics.interruptionRate}
      min={0}
      max={100}
      onChange={(value) => onMetricsChange({ interruptionRate: value })}
    />

    <div className="forecaster__control">
      <div className="forecaster__label-row">
        <div>
          <p className="muted">Stability profile</p>
          <p className="forecaster__description">
            Choose how resilient the system is under load.
          </p>
        </div>
      </div>
      <ul className="pill-list pill-list--wrap forecaster__stability">
        {stabilityOptions.map((option) => {
          const isActive = metrics.stability === option;

          return (
            <li
              key={option}
              className={isActive ? "pill-list__item--active" : ""}
            >
              <button
                type="button"
                className="pill-list__button"
                aria-pressed={isActive}
                onClick={() => onMetricsChange({ stability: option })}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </div>

    <SliderField
      label="Refusal runway (weeks)"
      description="Pause decay while teams push back on unsustainable requests."
      value={params.refusalWeeks}
      min={0}
      max={12}
      step={1}
      onChange={(value) => onParamsChange({ refusalWeeks: value })}
    />
  </div>
);

export function InputPanel({
  scenarioA,
  scenarioB,
  viewMode,
  onViewModeChange,
  onResetToSingleScenario,
  onMetricsChange,
  onParamsChange,
  stabilityOptions,
}: InputPanelProps) {
  const viewModes = [
    { id: "single", label: "Single" },
    { id: "compare", label: "Compare" },
  ] as const;

  return (
    <div className="card forecaster__card">
      <div className="card__glow" aria-hidden="true" />
      <p className="eyebrow">Input levers</p>
      <h3>Shape the workload profile</h3>
      <p className="muted">
        Drag the sliders to reflect today&apos;s operational friction. The track
        uses a traffic light gradient so you can see how fast each input
        approaches risk territory.
      </p>

      <div className="forecaster__mode">
        <div>
          <p className="muted">Scenario view</p>
          <p className="forecaster__description">
            Toggle between a single forecast and side-by-side comparison inputs.
          </p>
        </div>
        <div className="forecaster__mode-actions">
          <ul className="pill-list forecaster__mode-toggle">
            {viewModes.map((mode) => {
              const isActive = viewMode === mode.id;

              return (
                <li
                  key={mode.id}
                  className={isActive ? "pill-list__item--active" : ""}
                >
                  <button
                    type="button"
                    className="pill-list__button"
                    aria-pressed={isActive}
                    onClick={() => onViewModeChange(mode.id)}
                  >
                    {mode.label}
                  </button>
                </li>
              );
            })}
          </ul>
          {viewMode === "compare" ? (
            <button
              type="button"
              className="button ghost button--compact"
              onClick={onResetToSingleScenario}
            >
              Reset to single scenario
            </button>
          ) : null}
        </div>
      </div>

      <div className="forecaster__scenario-grid">
        <ScenarioPanel
          label="Scenario A"
          summary="Primary forecast inputs for the baseline plan."
          metrics={scenarioA.metrics}
          params={scenarioA.params}
          stabilityOptions={stabilityOptions}
          onMetricsChange={(updates) => onMetricsChange("A", updates)}
          onParamsChange={(updates) => onParamsChange("A", updates)}
        />
        {viewMode === "compare" ? (
          <ScenarioPanel
            label="Scenario B"
            summary="Alternate inputs to compare assumptions or trade-offs."
            metrics={scenarioB.metrics}
            params={scenarioB.params}
            stabilityOptions={stabilityOptions}
            onMetricsChange={(updates) => onMetricsChange("B", updates)}
            onParamsChange={(updates) => onParamsChange("B", updates)}
          />
        ) : null}
      </div>
    </div>
  );
}

export default InputPanel;
