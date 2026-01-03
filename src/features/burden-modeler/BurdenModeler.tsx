import { useMemo, useState } from 'react';
import { burdenCategories, burdenDrivers, MAX_DRIVER_SCORE } from './config';
import { buildDefaultRatings, calculateBurdenModel, categoryDescription } from './modelUtils';
import type { BurdenRatings } from './types';
import './burdenModeler.css';

const burdenLevelCopy = {
  Healthy: {
    label: 'Healthy',
    description: 'Burden is manageable. Keep guardrails and playbooks fresh to avoid drift.',
  },
  Watch: {
    label: 'Watch',
    description: 'Burden is rising. Pick one hotspot to mitigate before the next release cycle.',
  },
  Overloaded: {
    label: 'Overloaded',
    description: 'Burden is compounding. Redirect work, add buffers, and pair with operations partners.',
  },
} as const;

const ratingDescriptors = ['Resting', 'Light', 'Manageable', 'Heavy', 'Unsustainable'];

const descriptorForRating = (rating: number) => {
  const bucket = Math.min(ratingDescriptors.length - 1, Math.floor((rating / MAX_DRIVER_SCORE) * 4));
  return ratingDescriptors[bucket];
};

export function BurdenModeler() {
  const [scenario, setScenario] = useState('Baseline');
  const [ratings, setRatings] = useState<BurdenRatings>(buildDefaultRatings());

  const results = useMemo(() => calculateBurdenModel(ratings), [ratings]);

  const updateRating = (driverId: keyof BurdenRatings, value: number) => {
    setRatings((prev) => ({ ...prev, [driverId]: value }));
  };

  return (
    <div className="panel panel--glass burden-modeler" data-burden-modeler>
      <div className="burden-modeler__header">
        <p className="eyebrow">Burden Modeler</p>
        <h2>Quantify where toil piles up and how to offload it.</h2>
        <p className="muted">
          Rate how much operational and cognitive load each factor adds to your scenario. The model computes a burden index,
          highlights hotspots, and suggests mitigations with expected relief. Use it to make the hidden load legible before
          it burns people out.
        </p>
      </div>

      <div className="burden-modeler__grid">
        <div className="burden-modeler__inputs">
          <div className="input-card">
            <label className="input-card__label" htmlFor="scenario-name">
              Scenario name
            </label>
            <p className="muted small">
              Reference a release, queue, or incident stream so the results stay linkable.
            </p>
            <input
              id="scenario-name"
              className="input"
              name="scenario"
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
              placeholder="e.g., Q3 release train or support queue"
            />
          </div>

          {burdenCategories.map((category) => (
            <div key={category.id} className="input-card">
              <div className="input-card__header">
                <div>
                  <p className="eyebrow">{category.label}</p>
                  <p className="muted small">{category.description}</p>
                </div>
                <div className="badge">{results.categoryScores.find((score) => score.id === category.id)?.value}%</div>
              </div>

              <div className="input-card__body">
                {burdenDrivers
                  .filter((driver) => driver.category === category.id)
                  .map((driver) => (
                    <div key={driver.id} className="slider">
                      <div className="slider__header">
                        <div>
                          <p className="slider__label">{driver.label}</p>
                          <p className="muted small">{driver.prompt}</p>
                        </div>
                        <div className="slider__value" aria-live="polite">
                          <span>{ratings[driver.id]}</span>
                          <span className="muted">{descriptorForRating(ratings[driver.id])}</span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={MAX_DRIVER_SCORE}
                        step={1}
                        value={ratings[driver.id]}
                        onChange={(event) => updateRating(driver.id, Number(event.target.value))}
                        aria-label={`Rate ${driver.label}`}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="burden-modeler__results">
          <div className="result-card">
            <div className="result-card__header">
              <p className="eyebrow">{scenario || 'Scenario'}</p>
              <h3>Burden index</h3>
              <p className="muted small">Composite score across task load, cognitive friction, and risk exposure.</p>
            </div>
            <div className="burden-meter" role="status" aria-live="polite">
              <div className="burden-meter__value">{results.burdenIndex}</div>
              <div className={`burden-meter__badge burden-meter__badge--${results.burdenLevel.toLowerCase()}`}>
                {burdenLevelCopy[results.burdenLevel].label}
              </div>
            </div>
            <p className="muted">{burdenLevelCopy[results.burdenLevel].description}</p>

            <div className="result-card__grid">
              {results.categoryScores.map((category) => (
                <div key={category.id} className="result-card__stat">
                  <p className="muted small">{category.label}</p>
                  <p className="result-card__stat-value">{category.value}%</p>
                  <p className="muted small">{categoryDescription(category.id)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="result-card">
            <div className="result-card__header">
              <p className="eyebrow">Hotspots</p>
              <h3>Where burden is peaking</h3>
              <p className="muted small">Top factors sorted by weighted score with suggested mitigation paths.</p>
            </div>

            <ol className="hotspot-list">
              {results.hotspots.map((hotspot) => (
                <li key={hotspot.id} className="hotspot">
                  <div className="hotspot__meta">
                    <p className="hotspot__label">{hotspot.label}</p>
                    <p className="muted small">{descriptorForRating(hotspot.rating)} load</p>
                  </div>
                  <div className="hotspot__bar" aria-hidden="true">
                    <div
                      className="hotspot__bar-fill"
                      style={{ width: `${Math.min(100, Math.round((hotspot.rating / MAX_DRIVER_SCORE) * 100))}%` }}
                    />
                  </div>
                  <div className="hotspot__relief">
                    <span className="badge badge--ghost">{hotspot.reliefEstimate}% expected relief</span>
                    <span className="muted small">{categoryDescription(hotspot.category)}</span>
                  </div>
                  <ul className="muted small hotspot__mitigations">
                    {hotspot.mitigations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div className="result-card result-card--cta">
            <div>
              <p className="eyebrow">Off-ramp</p>
              <h3>Need facilitation?</h3>
              <p className="muted">
                If the burden index is trending overloaded, route to the Studio for a facilitated session. We help weight
                inputs with your support partners, validate relief estimates, and shape an escalation-ready plan.
              </p>
            </div>
            <a className="button primary" href="https://ethotechnics.com/studio">
              Book a facilitated burden modeling session
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BurdenModeler;
