import { useId, useMemo, useReducer, useState } from "react";
import "../../styles/components/figures.css";
import {
  ACTION_CLASS_LABELS,
  CLAUSE_REFS,
  DECISIONS,
  JUSTIFICATION_MIN_LENGTH,
  SPEC_FIELDS,
  TARGET_BEATS,
} from "./config";
import {
  createState,
  currentItem,
  findings,
  justificationAccepted,
  measure,
  reduce,
  rejectionNeedsJustification,
  verdict,
} from "./loopLogic";
import type { QueueItem, Spec } from "./types";

const percent = (value: number | null) =>
  value === null ? "—" : `${Math.round(value * 100)}%`;

const beats = (value: number | null) =>
  value === null ? "—" : `${value} beat${value === 1 ? "" : "s"}`;

/** The specification as it would be recorded, from the six switches. */
function recordedSpec(spec: Spec): Record<string, unknown> {
  return Object.fromEntries(
    SPEC_FIELDS.map((field) => [
      field.id,
      spec[field.id] ? field.recorded.on : field.recorded.off,
    ]),
  );
}

function ItemStatus({ item }: { item: QueueItem }) {
  if (item.executedOnArrival) {
    return (
      <p className="loop__status loop__status--executed">
        Executed on arrival. Your approval records concurrence.
      </p>
    );
  }
  return <p className="loop__status">Held for your decision.</p>;
}

export function BesideTheLoop() {
  const [state, dispatch] = useReducer(reduce, undefined, () => createState());
  const [justification, setJustification] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const uid = useId();

  const item = currentItem(state);
  const measures = useMemo(() => measure(state), [state]);
  const found = useMemo(() => findings(state, measures), [state, measures]);
  const result = useMemo(() => verdict(state, measures), [state, measures]);
  const recorded = useMemo(() => recordedSpec(state.spec), [state.spec]);

  const needsJustification = rejectionNeedsJustification(state.spec);
  const canOpen = state.spec.information_available && item && !item.opened;
  const canPause =
    state.spec.states_alterable &&
    item &&
    !state.pausedClasses.includes(item.decision.actionClass);

  const startReject = () => {
    if (!item) return;
    if (needsJustification) {
      setRejecting(true);
      return;
    }
    dispatch({ type: "reject" });
  };

  const sendRejection = () => {
    if (!justificationAccepted(justification)) return;
    dispatch({ type: "reject", justification });
    setJustification("");
    setRejecting(false);
  };

  const cancelRejection = () => {
    setJustification("");
    setRejecting(false);
  };

  const reset = () => {
    cancelRejection();
    dispatch({ type: "reset" });
  };

  return (
    <div className="loop">
      <div className="loop__grid">
        <section className="loop__panel" aria-labelledby="loop-spec-title">
          <h4 className="loop__panel-title" id="loop-spec-title">
            The intervention specification
          </h4>
          <p className="demo-field__hint">
            Six switches, one per field. Off is how "a human reviews" is usually
            built. Each applies from the next beat.
          </p>
          <div className="loop__switches">
            {SPEC_FIELDS.map((field) => {
              const on = state.spec[field.id];
              const nameId = `${uid}-${field.id}-name`;
              const questionId = `${uid}-${field.id}-question`;
              const textId = `${uid}-${field.id}-text`;
              return (
                <label
                  key={field.id}
                  className={`demo-switch${on ? " demo-switch--on" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    aria-labelledby={`${nameId} ${questionId}`}
                    aria-describedby={textId}
                    onChange={() =>
                      dispatch({ type: "toggle", field: field.id })
                    }
                  />
                  <span id={nameId} className="demo-switch__field">
                    {field.id}
                  </span>
                  <span id={questionId} className="loop__switch-question">
                    {field.question}
                  </span>
                  <span id={textId} className="demo-switch__text">
                    {on ? field.on : field.off}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="loop__panel" aria-labelledby="loop-queue-title">
          <h4 className="loop__panel-title" id="loop-queue-title">
            Your queue
          </h4>
          <p className="loop__pace" aria-live="polite">
            Beat {state.beat} · {measures.backlog} waiting ·{" "}
            {measures.remaining} of {DECISIONS.length} not yet arrived
            {state.pausedClasses.length > 0 && (
              <>
                {" "}
                · paused:{" "}
                {state.pausedClasses
                  .map((cls) => ACTION_CLASS_LABELS[cls])
                  .join(", ")}
              </>
            )}
          </p>

          {item ? (
            <div className="loop__item">
              <p className="loop__item-head">
                <span className="loop__item-id">#{item.decision.id}</span>
                <span
                  className={`loop__chip loop__chip--${item.decision.actionClass}`}
                >
                  {ACTION_CLASS_LABELS[item.decision.actionClass]}
                </span>
              </p>
              <p className="loop__item-summary">{item.decision.summary}</p>
              <ItemStatus item={item} />
              {item.opened ? (
                <div className="loop__record">
                  <p className="loop__record-label">Decision record</p>
                  <p className="loop__record-text">{item.decision.record}</p>
                  {item.decision.wrong && (
                    <p className="loop__record-flag">
                      The record does not support the summary.
                    </p>
                  )}
                </div>
              ) : (
                <p className="loop__record-hint">
                  {state.spec.information_available
                    ? "The record is available. Reading it costs a beat."
                    : "The record is not available to the reviewer."}
                </p>
              )}

              {rejecting ? (
                <div className="loop__justify">
                  <label className="demo-field">
                    <span className="demo-field__label">
                      Justification for the manager (at least{" "}
                      {JUSTIFICATION_MIN_LENGTH} characters)
                    </span>
                    <textarea
                      className="demo-input loop__textarea"
                      rows={3}
                      value={justification}
                      onChange={(event) => setJustification(event.target.value)}
                    />
                  </label>
                  <p className="demo-field__hint">
                    The decision stands while this is read. A rejection with no
                    defined response is dissent on the record.
                  </p>
                  <div className="loop__actions">
                    <button
                      type="button"
                      className="demo-button"
                      onClick={sendRejection}
                      disabled={!justificationAccepted(justification)}
                    >
                      Send and reject
                    </button>
                    <button
                      type="button"
                      className="demo-button demo-button--quiet"
                      onClick={cancelRejection}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="loop__actions">
                  <button
                    type="button"
                    className="demo-button demo-button--quiet"
                    onClick={() => dispatch({ type: "open" })}
                    disabled={!canOpen}
                  >
                    Open record
                  </button>
                  <button
                    type="button"
                    className="demo-button"
                    onClick={() => dispatch({ type: "approve" })}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="demo-button demo-button--quiet"
                    onClick={startReject}
                  >
                    Reject
                  </button>
                  {state.spec.states_alterable && (
                    <button
                      type="button"
                      className="demo-button demo-button--quiet"
                      onClick={() =>
                        dispatch({
                          type: "pause",
                          actionClass: item.decision.actionClass,
                        })
                      }
                      disabled={!canPause}
                    >
                      Pause {ACTION_CLASS_LABELS[item.decision.actionClass]}{" "}
                      class
                    </button>
                  )}
                  <button
                    type="button"
                    className="demo-button demo-button--quiet loop__approve-rest"
                    onClick={() => dispatch({ type: "approveRest" })}
                  >
                    Approve the rest
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="loop__item loop__item--done">
              <p className="loop__item-summary">
                {state.finished
                  ? "The queue is clear."
                  : "Nothing waiting. The next beat brings more."}
              </p>
              <div className="loop__actions">
                <button type="button" className="demo-button" onClick={reset}>
                  Run again with this specification
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="loop__measures" aria-labelledby="loop-measures-title">
        <h4 className="loop__panel-title" id="loop-measures-title">
          What §3.4 measures
        </h4>
        <dl className="demo-stats">
          <div className="demo-stat">
            <dt className="demo-stat__label">Approval rate</dt>
            <dd className="demo-stat__value">
              {percent(measures.approvalRate)}
            </dd>
          </div>
          <div className="demo-stat">
            <dt className="demo-stat__label">Median per approval</dt>
            <dd className="demo-stat__value">
              {beats(measures.medianBeatsPerApproval)}
            </dd>
          </div>
          <div className="demo-stat">
            <dt className="demo-stat__label">Inside reach target</dt>
            <dd className="demo-stat__value">
              {state.spec.reach_time_target
                ? percent(measures.insideTarget)
                : "no target"}
            </dd>
          </div>
          <div className="demo-stat">
            <dt className="demo-stat__label">Wrong, took effect</dt>
            <dd className="demo-stat__value">{measures.wrongTookEffect}</dd>
          </div>
        </dl>
        <div className="demo-meters">
          <div className="demo-meter">
            <span className="demo-meter__label">Wrong decisions prevented</span>
            <span className="demo-meter__track" aria-hidden="true">
              <span
                className={`demo-meter__fill${
                  measures.control !== null && measures.control < 0.5
                    ? " demo-meter__fill--bad"
                    : ""
                }`}
                style={{
                  width: `${Math.round((measures.control ?? 0) * 100)}%`,
                }}
              />
            </span>
            <span className="demo-meter__value">
              {measures.wrongPrevented} of {measures.wrongArrived}
            </span>
          </div>
        </div>
        {found.length > 0 && (
          <ul className="loop__findings">
            {found.map((finding) => (
              <li key={finding.text}>
                <strong>{finding.clause}</strong> {finding.text}
              </li>
            ))}
          </ul>
        )}
        <p
          className={`demo-verdict demo-verdict--${result.tone}`}
          aria-live="polite"
        >
          {result.text}
        </p>
        <details className="loop__recorded">
          <summary>The specification as it would be recorded</summary>
          {/* The site attaches a copy button to every pre before this island
              hydrates; opting out keeps the server and client markup equal. */}
          <pre className="demo-pre" data-copy-attached="true">
            <code>{JSON.stringify(recorded, null, 2)}</code>
          </pre>
        </details>
      </section>

      <p className="demo-figure__note">
        A demonstration, not a measurement of any deployment. The six switches
        are the fields{" "}
        <a href={CLAUSE_REFS.schema.href}>{CLAUSE_REFS.schema.label}</a>{" "}
        requires, and a test holds them there; the reach target is{" "}
        {TARGET_BEATS} beats. To score a real arrangement, run the{" "}
        <a href={CLAUSE_REFS.audit.href}>{CLAUSE_REFS.audit.label}</a>.
      </p>
    </div>
  );
}

export default BesideTheLoop;
