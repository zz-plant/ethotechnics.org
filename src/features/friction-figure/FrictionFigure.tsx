import { useId, useMemo, useState } from "react";
import "../../styles/components/figures.css";
import "./frictionFigure.css";
import {
  allAgent,
  allHuman,
  assertPropertyCopy,
  createState,
  fromChain,
  properties,
  setParty,
  speed,
  STEPS,
  toggleRebuilt,
  type FrictionState,
  type PropertyCopy,
} from "./frictionLogic";

type Props = { copy: PropertyCopy[] };

const percent = (value: number) => `${Math.round(value * 100)}%`;

export function FrictionFigure({ copy }: Props) {
  const ordered = useMemo(() => assertPropertyCopy(copy), [copy]);
  const [state, setState] = useState<FrictionState>(createState);
  const uid = useId();

  const values = useMemo(() => properties(state), [state]);
  const supplied = useMemo(() => fromChain(state.chain), [state.chain]);
  const pace = useMemo(() => speed(state.chain), [state.chain]);
  const agentSteps = STEPS.filter((step) => state.chain[step.id] === "agent");
  const anyRebuilt = ordered.some((entry) => state.rebuilt[entry.id]);

  return (
    <div className="friction">
      <section className="friction__panel" aria-labelledby={`${uid}-chain`}>
        <div className="friction__panel-head">
          <h4 className="friction__panel-title" id={`${uid}-chain`}>
            One consequential decision, four steps
          </h4>
          <div className="friction__presets">
            <button
              type="button"
              className="demo-button demo-button--quiet"
              onClick={() => setState((s) => ({ ...s, chain: allHuman() }))}
            >
              All people
            </button>
            <button
              type="button"
              className="demo-button demo-button--quiet"
              onClick={() => setState((s) => ({ ...s, chain: allAgent() }))}
            >
              Automate every step
            </button>
          </div>
        </div>
        <ol className="friction__chain">
          {STEPS.map((step) => {
            const party = state.chain[step.id];
            const isAgent = party === "agent";
            return (
              <li
                key={step.id}
                className={`friction__step${isAgent ? " friction__step--agent" : ""}`}
              >
                <p className="friction__step-title">{step.title}</p>
                <p className="friction__step-party">
                  {isAgent ? "The agent" : step.role}
                </p>
                <button
                  type="button"
                  className="friction__step-toggle"
                  aria-pressed={isAgent}
                  onClick={() =>
                    setState((s) =>
                      setParty(s, step.id, isAgent ? "human" : "agent"),
                    )
                  }
                >
                  {isAgent ? "Give it back to a person" : "Automate this step"}
                </button>
              </li>
            );
          })}
        </ol>
        <dl className="demo-stats friction__speed">
          <div className="demo-stat">
            <dt className="demo-stat__label">Time to decision</dt>
            <dd className="demo-stat__value">{pace.label}</dd>
          </div>
          <div className="demo-stat">
            <dt className="demo-stat__label">Decisions per day</dt>
            <dd className="demo-stat__value">
              {pace.perDay >= 10
                ? Math.round(pace.perDay)
                : pace.perDay.toFixed(2)}
            </dd>
          </div>
          <div className="demo-stat">
            <dt className="demo-stat__label">Handoffs removed</dt>
            <dd className="demo-stat__value">
              {agentSteps.length} of {STEPS.length}
            </dd>
          </div>
        </dl>
      </section>

      <section className="friction__panel" aria-labelledby={`${uid}-meters`}>
        <h4 className="friction__panel-title" id={`${uid}-meters`}>
          What the friction was providing
        </h4>
        <dl className="demo-meters friction__meters">
          {ordered.map((entry) => {
            const value = values[entry.id];
            const rebuilt = state.rebuilt[entry.id];
            const lost = !rebuilt && value === 0;
            return (
              <div key={entry.id} className="friction__meter">
                <div className="demo-meter">
                  <dt className="demo-meter__label">{entry.title}</dt>
                  <dd className="friction__meter-track">
                    <span className="demo-meter__track" aria-hidden="true">
                      <span
                        className={`demo-meter__fill${lost ? " demo-meter__fill--bad" : ""}${rebuilt ? " friction__fill--rebuilt" : ""}`}
                        style={{ width: percent(value) }}
                      />
                    </span>
                  </dd>
                  <dd className="demo-meter__value">{percent(value)}</dd>
                </div>
                <p className="friction__meter-text">
                  {rebuilt
                    ? `Rebuilt on purpose: ${entry.rebuilt}`
                    : supplied[entry.id] === 0
                      ? entry.removed
                      : entry.provided}
                </p>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="friction__panel" aria-labelledby={`${uid}-rebuild`}>
        <h4 className="friction__panel-title" id={`${uid}-rebuild`}>
          Rebuild on purpose
        </h4>
        <p className="demo-field__hint">
          Each switch restores one property as a designed feature. The steps
          stay automated and the speed stays; what returns is the property,
          because it is now something the institution built rather than
          something it happened to have.
        </p>
        <div className="friction__switches">
          {ordered.map((entry) => {
            const on = state.rebuilt[entry.id];
            const nameId = `${uid}-${entry.id}-name`;
            const textId = `${uid}-${entry.id}-text`;
            return (
              <label
                key={entry.id}
                className={`demo-switch${on ? " demo-switch--on" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  aria-labelledby={nameId}
                  aria-describedby={textId}
                  onChange={() => setState((s) => toggleRebuilt(s, entry.id))}
                />
                <span id={nameId} className="friction__switch-name">
                  {entry.title}
                </span>
                <span id={textId} className="demo-switch__text">
                  {entry.rebuilt}{" "}
                  <a href={entry.rebuiltRef.href}>{entry.rebuiltRef.label}</a>
                </span>
              </label>
            );
          })}
        </div>
        {anyRebuilt && agentSteps.length === STEPS.length && (
          <p className="demo-verdict demo-verdict--good">
            Every step is automated and the decision still takes {pace.label}.
            The properties you switched back on are there because they were
            designed, which is the only way an agentic system has them.
          </p>
        )}
        {!anyRebuilt && agentSteps.length === STEPS.length && (
          <p className="demo-verdict demo-verdict--bad">
            Every step is automated. The decision takes {pace.label}, and the
            institution has removed its friction and, with it, everything the
            friction was doing.
          </p>
        )}
      </section>

      <p className="demo-figure__note">
        A demonstration, not a measurement of any institution. The five
        properties are declared in the essay next to the prose that names them,
        and the figure refuses to build if the two disagree. How each is
        computed from the chain is in{" "}
        <code>src/features/friction-figure/frictionLogic.ts</code>.
      </p>
    </div>
  );
}

export default FrictionFigure;
