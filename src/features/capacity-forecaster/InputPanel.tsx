import type { OperationalMetrics, SimulationParams, SystemStability } from './types';

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
  metrics: OperationalMetrics;
  params: SimulationParams;
  onMetricsChange: (updates: Partial<OperationalMetrics>) => void;
  onParamsChange: (updates: Partial<SimulationParams>) => void;
  stabilityOptions: SystemStability[];
};

const getTrafficColor = (value: number) => {
  const hue = 120 - (value / 100) * 120;

  return `hsl(${hue}, 70%, 55%)`;
};

const SliderField = ({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderFieldProps) => (
  <div className="forecaster__control">
    <div className="forecaster__label-row">
      <div>
        <p className="muted">{label}</p>
        <p className="forecaster__description">{description}</p>
      </div>
      <span className="pill pill--ghost">{value}</span>
    </div>
    <input
      aria-label={label}
      className="forecaster__range"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      style={{
        background: `linear-gradient(90deg, ${getTrafficColor(value)} ${value}%, rgba(255, 255, 255, 0.12) ${value}%)`,
      }}
    />
    <div className="forecaster__range-scale" aria-hidden="true">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

export function InputPanel({
  metrics,
  params,
  onMetricsChange,
  onParamsChange,
  stabilityOptions,
}: InputPanelProps) {
  return (
    <div className="card forecaster__card">
      <div className="card__glow" aria-hidden="true" />
      <p className="eyebrow">Input levers</p>
      <h3>Shape the workload profile</h3>
      <p className="muted">
        Drag the sliders to reflect today&apos;s operational friction. The track uses a traffic light gradient so you can see how
        fast each input approaches risk territory.
      </p>

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
            <p className="forecaster__description">Choose how resilient the system is under load.</p>
          </div>
        </div>
        <ul className="pill-list pill-list--wrap forecaster__stability">
          {stabilityOptions.map((option) => {
            const isActive = metrics.stability === option;

            return (
              <li key={option} className={isActive ? 'pill-list__item--active' : ''}>
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
}

export default InputPanel;
