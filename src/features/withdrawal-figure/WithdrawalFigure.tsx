import { useId, useMemo, useState } from "react";
import "../../styles/components/figures.css";
import {
  ALTERNATIVE_STATUSES,
  CORRECTION_WINDOW_HOURS,
  EXPOSURE_TOLERANCE,
  exposureScore,
  LEVELS,
  recordExcerpt,
  rehearse,
  replenishAlternative,
  report,
  retainExpertise,
  verdict,
  YEAR_ONE,
  YEAR_THREE,
  type Inputs,
  type Level,
} from "./withdrawalLogic";

const LEVEL_QUESTION: Record<Level, string> = {
  technical: "Can the effects be undone in the system itself?",
  operational: "Can the people on shift exercise the reversal in time?",
  institutional: "Can the institution survive exercising it?",
};

const LEVEL_FIELD: Record<Level, string> = {
  technical: "reversibility.technical",
  operational: "reversibility.operational",
  institutional: "reversibility.institutional",
};

export function WithdrawalFigure() {
  const [inputs, setInputs] = useState<Inputs>(YEAR_ONE);
  const [thrown, setThrown] = useState(false);
  const uid = useId();

  const levels = useMemo(() => report(inputs), [inputs]);
  const result = useMemo(() => verdict(levels), [levels]);
  const exposure = useMemo(() => exposureScore(inputs), [inputs]);
  const excerpt = useMemo(() => recordExcerpt(inputs), [inputs]);

  const set = (patch: Partial<Inputs>) =>
    setInputs((previous) => ({ ...previous, ...patch }));

  const range = (
    key: keyof Inputs,
    label: string,
    min: number,
    max: number,
    format: (value: number) => string,
  ) => {
    const value = inputs[key] as number;
    const id = `${uid}-${key}`;
    return (
      <div className="demo-field">
        <label className="demo-field__label" htmlFor={id}>
          {label}: {format(value)}
        </label>
        <input
          id={id}
          className="demo-range"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => set({ [key]: Number(event.target.value) })}
        />
      </div>
    );
  };

  return (
    <div className="withdraw">
      <div className="withdraw__grid">
        <section className="withdraw__panel" aria-labelledby={`${uid}-record`}>
          <div className="withdraw__head">
            <h4 className="withdraw__title" id={`${uid}-record`}>
              The dependency record
            </h4>
            <div className="withdraw__presets">
              <button
                type="button"
                className="demo-button demo-button--quiet"
                onClick={() => set(YEAR_ONE)}
              >
                Year one
              </button>
              <button
                type="button"
                className="demo-button demo-button--quiet"
                onClick={() => set(YEAR_THREE)}
              >
                Year three
              </button>
            </div>
          </div>
          {range("dependents", "dependents, critical", 0, 12, (v) => `${v}`)}
          {range(
            "substitutionWeeks",
            "substitution_cost, person-weeks",
            0,
            52,
            (v) => `${v}`,
          )}
          {range(
            "expertiseRoles",
            "expertise_retained.roles",
            0,
            4,
            (v) => `${v}`,
          )}
          {range(
            "expertiseMonthsSince",
            "expertise_retained.last_exercised",
            0,
            24,
            (v) => `${v} months ago`,
          )}
          {range(
            "correctionLatencyHours",
            "correction_latency.estimate_hours",
            1,
            168,
            (v) => `${v} h`,
          )}
          <div className="demo-field">
            <label className="demo-field__label" htmlFor={`${uid}-alternative`}>
              alternatives[0].status
            </label>
            <select
              id={`${uid}-alternative`}
              className="demo-select"
              value={inputs.alternative}
              onChange={(event) =>
                set({
                  alternative: event.target.value as Inputs["alternative"],
                })
              }
            >
              {ALTERNATIVE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <p className="withdraw__rehearsal">
            <span className="demo-field__label">last_withdrawal_rehearsal</span>
            <br />
            {inputs.rehearsal === "not_rehearsed"
              ? "never rehearsed"
              : `${inputs.rehearsal}, ${inputs.rehearsalMonthsSince} months ago`}
          </p>
          <div className="withdraw__actions">
            <button
              type="button"
              className="demo-button"
              onClick={() => set(rehearse(inputs))}
            >
              Rehearse withdrawal
            </button>
            <button
              type="button"
              className="demo-button demo-button--quiet"
              onClick={() => set(retainExpertise(inputs))}
            >
              Exercise the expertise
            </button>
            <button
              type="button"
              className="demo-button demo-button--quiet"
              onClick={() => set(replenishAlternative(inputs))}
            >
              Keep the alternative warm
            </button>
          </div>
        </section>

        <section className="withdraw__panel" aria-labelledby={`${uid}-switch`}>
          <h4 className="withdraw__title" id={`${uid}-switch`}>
            The stop control
          </h4>
          <div className="withdraw__switch-row">
            <button
              type="button"
              className="withdraw__switch"
              aria-pressed={thrown}
              onClick={() => setThrown(true)}
            >
              STOP
            </button>
            <p className="withdraw__switch-text">
              {thrown
                ? "Pressed. What happened at each level:"
                : "Press it. The technical level answers in 200 ms. The other two take longer to find out."}
            </p>
          </div>
          {thrown && (
            <ol className="withdraw__levels">
              {LEVELS.map((level) => {
                const entry = levels[level];
                return (
                  <li
                    key={level}
                    className={`withdraw__level${entry.feasible ? " withdraw__level--ok" : " withdraw__level--fail"}`}
                  >
                    <p className="withdraw__level-head">
                      <span
                        className={`demo-status${entry.feasible ? "" : " demo-status--bad"}`}
                        aria-hidden="true"
                      />
                      <span className="withdraw__level-name">{level}</span>
                      <code className="withdraw__level-field">
                        {LEVEL_FIELD[level]}: {String(entry.feasible)}
                      </code>
                    </p>
                    <p className="withdraw__level-question">
                      {LEVEL_QUESTION[level]}
                    </p>
                    <ul className="withdraw__conditions">
                      {entry.conditions.map((condition) => (
                        <li
                          key={condition.text}
                          className={
                            condition.holds ? "" : "withdraw__condition--fail"
                          }
                        >
                          {condition.text}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          )}
          {thrown && (
            <p
              className={`demo-verdict demo-verdict--${result.tone}`}
              aria-live="polite"
            >
              <strong>Would this be thrown? </strong>
              {result.text}
            </p>
          )}
          <dl className="demo-stats">
            <div className="demo-stat">
              <dt className="demo-stat__label">exposure_score</dt>
              <dd className="demo-stat__value">
                {Math.round(exposure.score).toLocaleString("en-US")}
              </dd>
            </div>
            <div className="demo-stat">
              <dt className="demo-stat__label">tolerance</dt>
              <dd className="demo-stat__value">
                {EXPOSURE_TOLERANCE.toLocaleString("en-US")}
              </dd>
            </div>
            <div className="demo-stat">
              <dt className="demo-stat__label">correction window</dt>
              <dd className="demo-stat__value">{CORRECTION_WINDOW_HOURS} h</dd>
            </div>
          </dl>
        </section>
      </div>

      <details className="withdraw__excerpt">
        <summary>The record excerpt this state produces</summary>
        {/* The site attaches a copy button to every pre before this island
            hydrates; opting out keeps the server and client markup equal. */}
        <pre className="demo-pre" data-copy-attached="true">
          <code>{JSON.stringify(excerpt, null, 2)}</code>
        </pre>
      </details>

      <p className="demo-figure__note">
        A demonstration, not a measurement of any deployment. The sliders are
        fields of{" "}
        <a href="/standards/dependency-record.schema.json">
          dependency-record.schema.json
        </a>
        , the exposure score is the record's own formula, and a test holds the
        levels and enums to the schema. To get a reversibility verdict on a real
        workflow, run the{" "}
        <a href="/diagnostics/delegation-audit">Delegation Audit</a>.
      </p>
    </div>
  );
}

export default WithdrawalFigure;
