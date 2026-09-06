import { useMemo, useState } from "react";
import {
  buildDefaultInput,
  createActionClass,
  createDependent,
  CRITICALITY_OPTIONS,
  DEPENDENT_KIND_OPTIONS,
  EXPIRY_OPTIONS,
  EXPOSURE_UNITS,
  RECENCY_OPTIONS,
  STATE_VARIABLE_QUESTIONS,
} from "./config";
import { buildReadout, buildSnapshot, runDelegationAudit } from "./auditLogic";
import type {
  ActionClass,
  AuditInput,
  Dependent,
  ReversibilityStatus,
} from "./types";
import "./delegationAudit.css";

const STATUS_LABEL: Record<ReversibilityStatus, string> = {
  evidenced: "Evidenced",
  "not-evidenced": "Not evidenced",
  "not-feasible": "Not feasible",
};

let idCounter = 0;
const nextId = (prefix: string) => {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
};

export function DelegationAudit() {
  const [input, setInput] = useState<AuditInput>(buildDefaultInput());
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => runDelegationAudit(input), [input]);

  const update = <Key extends keyof AuditInput>(
    key: Key,
    value: AuditInput[Key],
  ) => {
    setInput((previous) => ({ ...previous, [key]: value }));
  };

  const updateActionClass = <Key extends keyof ActionClass>(
    id: string,
    key: Key,
    value: ActionClass[Key],
  ) => {
    setInput((previous) => ({
      ...previous,
      actionClasses: previous.actionClasses.map((entry) =>
        entry.id === id ? { ...entry, [key]: value } : entry,
      ),
    }));
  };

  const updateDependent = <Key extends keyof Dependent>(
    id: string,
    key: Key,
    value: Dependent[Key],
  ) => {
    setInput((previous) => ({
      ...previous,
      dependents: previous.dependents.map((entry) =>
        entry.id === id ? { ...entry, [key]: value } : entry,
      ),
    }));
  };

  const addActionClass = () => {
    setInput((previous) => ({
      ...previous,
      actionClasses: [
        ...previous.actionClasses,
        createActionClass(nextId("ac")),
      ],
    }));
  };

  const removeActionClass = (id: string) => {
    setInput((previous) => ({
      ...previous,
      actionClasses: previous.actionClasses.filter((entry) => entry.id !== id),
    }));
  };

  const addDependent = () => {
    setInput((previous) => ({
      ...previous,
      dependents: [...previous.dependents, createDependent(nextId("dep"))],
    }));
  };

  const removeDependent = (id: string) => {
    setInput((previous) => ({
      ...previous,
      dependents: previous.dependents.filter((entry) => entry.id !== id),
    }));
  };

  const copyReadout = () => {
    const readout = buildReadout(result, new Date().toISOString());
    void navigator.clipboard.writeText(readout).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportSnapshot = () => {
    const capturedAt = new Date().toISOString();
    const snapshot = buildSnapshot(input, result, capturedAt);
    const fileSafe = result.workflow
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `delegation-audit-${fileSafe || "workflow"}-${capturedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="delegation-audit" data-delegation-audit>
      <div className="delegation-audit__grid">
        <div className="delegation-audit__panel">
          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">
              The workflow you are auditing
            </h3>
            <p className="delegation-audit__step-question">
              Audit one workflow at a time. Name the piece of work the system
              takes part in, not the system.
            </p>
            <div className="delegation-audit__field">
              <label className="delegation-audit__label" htmlFor="da-workflow">
                Workflow
              </label>
              <input
                id="da-workflow"
                className="delegation-audit__input"
                type="text"
                value={input.workflow}
                onChange={(event) => update("workflow", event.target.value)}
                placeholder="e.g. Refund decisions in the support queue"
              />
            </div>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">1. Capability</h3>
            <p className="delegation-audit__step-question">
              {STATE_VARIABLE_QUESTIONS.capability}
            </p>
            <div className="delegation-audit__field">
              <label
                className="delegation-audit__label"
                htmlFor="da-capability-list"
              >
                Is there a list of what it could do, kept separate from what it
                may do?
              </label>
              <select
                id="da-capability-list"
                className="delegation-audit__select"
                value={input.capabilityListSeparate}
                onChange={(event) =>
                  update(
                    "capabilityListSeparate",
                    event.target.value as AuditInput["capabilityListSeparate"],
                  )
                }
              >
                <option value="yes">Yes, two separate lists</option>
                <option value="partial">Partly, they overlap</option>
                <option value="no">No, only a permission list</option>
              </select>
            </div>

            <p className="delegation-audit__note">
              List each action class: one kind of thing the system does in this
              workflow.
            </p>
            {input.actionClasses.map((entry, index) => (
              <div className="delegation-audit__card" key={entry.id}>
                <div className="delegation-audit__card-header">
                  <h4 className="delegation-audit__card-title">
                    Action class {index + 1}
                  </h4>
                  <button
                    type="button"
                    className="button ghost button--compact"
                    onClick={() => removeActionClass(entry.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="delegation-audit__field">
                  <label
                    className="delegation-audit__label"
                    htmlFor={`${entry.id}-name`}
                  >
                    What it does
                  </label>
                  <input
                    id={`${entry.id}-name`}
                    className="delegation-audit__input"
                    type="text"
                    value={entry.name}
                    onChange={(event) =>
                      updateActionClass(entry.id, "name", event.target.value)
                    }
                    placeholder="e.g. Approve a refund up to 200"
                  />
                </div>
                <div className="delegation-audit__row">
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-authorizer`}
                    >
                      Who authorized it
                    </label>
                    <input
                      id={`${entry.id}-authorizer`}
                      className="delegation-audit__input"
                      type="text"
                      value={entry.authorizer}
                      onChange={(event) =>
                        updateActionClass(
                          entry.id,
                          "authorizer",
                          event.target.value,
                        )
                      }
                      placeholder="Leave blank if nobody can be named"
                    />
                  </div>
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-evidence`}
                    >
                      On what evidence
                    </label>
                    <input
                      id={`${entry.id}-evidence`}
                      className="delegation-audit__input"
                      type="text"
                      value={entry.evidenceBasis}
                      onChange={(event) =>
                        updateActionClass(
                          entry.id,
                          "evidenceBasis",
                          event.target.value,
                        )
                      }
                      placeholder="What had to be true for this to be allowed"
                    />
                  </div>
                </div>
                <div className="delegation-audit__row">
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-for-whom`}
                    >
                      For which affected people
                    </label>
                    <input
                      id={`${entry.id}-for-whom`}
                      className="delegation-audit__input"
                      type="text"
                      value={entry.forWhom}
                      onChange={(event) =>
                        updateActionClass(
                          entry.id,
                          "forWhom",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Retail customers in the EU"
                    />
                  </div>
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-expiry`}
                    >
                      Until when, or until what changes
                    </label>
                    <select
                      id={`${entry.id}-expiry`}
                      className="delegation-audit__select"
                      value={entry.expiry}
                      onChange={(event) =>
                        updateActionClass(
                          entry.id,
                          "expiry",
                          event.target.value as ActionClass["expiry"],
                        )
                      }
                    >
                      {EXPIRY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="delegation-audit__field">
                  <label
                    className="delegation-audit__label"
                    htmlFor={`${entry.id}-checked`}
                  >
                    When was that evidence last checked
                  </label>
                  <select
                    id={`${entry.id}-checked`}
                    className="delegation-audit__select"
                    value={entry.lastChecked}
                    onChange={(event) =>
                      updateActionClass(
                        entry.id,
                        "lastChecked",
                        event.target.value as ActionClass["lastChecked"],
                      )
                    }
                  >
                    {RECENCY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <div className="delegation-audit__actions">
              <button
                type="button"
                className="button ghost button--compact"
                onClick={addActionClass}
              >
                Add an action class
              </button>
            </div>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">2. Evidence</h3>
            <p className="delegation-audit__step-question">
              {STATE_VARIABLE_QUESTIONS.evidence}
            </p>
            <div className="delegation-audit__row">
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-policy-trigger"
                >
                  Does the policy it applies have a review trigger?
                </label>
                <select
                  id="da-policy-trigger"
                  className="delegation-audit__select"
                  value={input.policyReviewTrigger}
                  onChange={(event) =>
                    update(
                      "policyReviewTrigger",
                      event.target.value as AuditInput["policyReviewTrigger"],
                    )
                  }
                >
                  <option value="yes">Yes, written down</option>
                  <option value="no">No</option>
                  <option value="unknown">Nobody knows</option>
                </select>
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-policy-expiry"
                >
                  Does that policy have an expiry?
                </label>
                <select
                  id="da-policy-expiry"
                  className="delegation-audit__select"
                  value={input.policyExpiry}
                  onChange={(event) =>
                    update(
                      "policyExpiry",
                      event.target.value as AuditInput["policyExpiry"],
                    )
                  }
                >
                  <option value="yes">Yes, a date</option>
                  <option value="no">No</option>
                  <option value="unknown">Nobody knows</option>
                </select>
              </div>
            </div>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">3. Dependency</h3>
            <p className="delegation-audit__step-question">
              {STATE_VARIABLE_QUESTIONS.dependency}
            </p>
            {input.dependents.map((entry, index) => (
              <div className="delegation-audit__card" key={entry.id}>
                <div className="delegation-audit__card-header">
                  <h4 className="delegation-audit__card-title">
                    Dependent {index + 1}
                  </h4>
                  <button
                    type="button"
                    className="button ghost button--compact"
                    onClick={() => removeDependent(entry.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="delegation-audit__row">
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-kind`}
                    >
                      Kind
                    </label>
                    <select
                      id={`${entry.id}-kind`}
                      className="delegation-audit__select"
                      value={entry.kind}
                      onChange={(event) =>
                        updateDependent(
                          entry.id,
                          "kind",
                          event.target.value as Dependent["kind"],
                        )
                      }
                    >
                      {DEPENDENT_KIND_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-dep-name`}
                    >
                      Name
                    </label>
                    <input
                      id={`${entry.id}-dep-name`}
                      className="delegation-audit__input"
                      type="text"
                      value={entry.name}
                      onChange={(event) =>
                        updateDependent(entry.id, "name", event.target.value)
                      }
                      placeholder="e.g. Tier 1 support queue"
                    />
                  </div>
                  <div className="delegation-audit__field">
                    <label
                      className="delegation-audit__label"
                      htmlFor={`${entry.id}-criticality`}
                    >
                      What happens to it without the system
                    </label>
                    <select
                      id={`${entry.id}-criticality`}
                      className="delegation-audit__select"
                      value={entry.criticality}
                      onChange={(event) =>
                        updateDependent(
                          entry.id,
                          "criticality",
                          event.target.value as Dependent["criticality"],
                        )
                      }
                    >
                      {CRITICALITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <div className="delegation-audit__actions">
              <button
                type="button"
                className="button ghost button--compact"
                onClick={addDependent}
              >
                Add a dependent
              </button>
            </div>

            <div className="delegation-audit__row">
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-substitution"
                >
                  Staff-weeks to run this workflow without it
                </label>
                <input
                  id="da-substitution"
                  className="delegation-audit__input"
                  type="number"
                  min={0}
                  step={1}
                  value={input.substitutionCostStaffWeeks}
                  onChange={(event) =>
                    update(
                      "substitutionCostStaffWeeks",
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
              </div>
              <div className="delegation-audit__field">
                <label className="delegation-audit__label" htmlFor="da-latency">
                  Hours from deciding to intervene to the intervention taking
                  effect
                </label>
                <input
                  id="da-latency"
                  className="delegation-audit__input"
                  type="number"
                  min={0}
                  step={1}
                  value={input.correctionLatencyHours}
                  onChange={(event) =>
                    update(
                      "correctionLatencyHours",
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-alternative"
                >
                  When was the alternative last actually run
                </label>
                <select
                  id="da-alternative"
                  className="delegation-audit__select"
                  value={input.alternativeExercised}
                  onChange={(event) =>
                    update(
                      "alternativeExercised",
                      event.target.value as AuditInput["alternativeExercised"],
                    )
                  }
                >
                  {RECENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="delegation-audit__note">{EXPOSURE_UNITS}</p>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">4. Standing</h3>
            <p className="delegation-audit__step-question">
              {STATE_VARIABLE_QUESTIONS.standing}
            </p>
            <div className="delegation-audit__field">
              <label className="delegation-audit__label" htmlFor="da-bearers">
                Who bears the errors
              </label>
              <textarea
                id="da-bearers"
                className="delegation-audit__textarea"
                value={input.errorBearingParties}
                onChange={(event) =>
                  update("errorBearingParties", event.target.value)
                }
                placeholder="The people the decisions fall on, and the staff who clean up after them"
              />
            </div>
            <div className="delegation-audit__row">
              <div className="delegation-audit__field">
                <label className="delegation-audit__label" htmlFor="da-raise">
                  Can they raise an error themselves?
                </label>
                <select
                  id="da-raise"
                  className="delegation-audit__select"
                  value={input.canRaise}
                  onChange={(event) =>
                    update(
                      "canRaise",
                      event.target.value as AuditInput["canRaise"],
                    )
                  }
                >
                  <option value="direct">Yes, directly</option>
                  <option value="via-staff">Only if a staff member does</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-responder"
                >
                  Is there a named party who must answer?
                </label>
                <select
                  id="da-responder"
                  className="delegation-audit__select"
                  value={input.namedResponder}
                  onChange={(event) =>
                    update(
                      "namedResponder",
                      event.target.value as AuditInput["namedResponder"],
                    )
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-deadline"
                >
                  Is there a deadline for that answer?
                </label>
                <select
                  id="da-deadline"
                  className="delegation-audit__select"
                  value={input.responseDeadline}
                  onChange={(event) =>
                    update(
                      "responseDeadline",
                      event.target.value as AuditInput["responseDeadline"],
                    )
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-challenge"
                >
                  What can a successful challenge change?
                </label>
                <select
                  id="da-challenge"
                  className="delegation-audit__select"
                  value={input.challengeEffect}
                  onChange={(event) =>
                    update(
                      "challengeEffect",
                      event.target.value as AuditInput["challengeEffect"],
                    )
                  }
                >
                  <option value="system-state">
                    The system: a rule, a threshold, or a permission
                  </option>
                  <option value="own-case">Only their own case</option>
                  <option value="none">Nothing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">5. Correction</h3>
            <p className="delegation-audit__step-question">
              {STATE_VARIABLE_QUESTIONS.correction}
            </p>
            <div className="delegation-audit__row">
              <div className="delegation-audit__field">
                <label className="delegation-audit__label" htmlFor="da-stop">
                  Can you stop it?
                </label>
                <select
                  id="da-stop"
                  className="delegation-audit__select"
                  value={input.canStop}
                  onChange={(event) =>
                    update(
                      "canStop",
                      event.target.value as AuditInput["canStop"],
                    )
                  }
                >
                  <option value="tested">
                    Yes, and it has been tested on this version
                  </option>
                  <option value="untested">
                    Yes, but it has not been tested
                  </option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-functioning"
                >
                  Can the institution keep functioning if you do?
                </label>
                <select
                  id="da-functioning"
                  className="delegation-audit__select"
                  value={input.institutionKeepsFunctioning}
                  onChange={(event) =>
                    update(
                      "institutionKeepsFunctioning",
                      event.target
                        .value as AuditInput["institutionKeepsFunctioning"],
                    )
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="degraded">Yes, but degraded</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="delegation-audit__field">
                <label
                  className="delegation-audit__label"
                  htmlFor="da-expertise"
                >
                  Does anyone still hold the expertise to run the alternative?
                </label>
                <select
                  id="da-expertise"
                  className="delegation-audit__select"
                  value={input.expertiseRetained}
                  onChange={(event) =>
                    update(
                      "expertiseRetained",
                      event.target.value as AuditInput["expertiseRetained"],
                    )
                  }
                >
                  <option value="exercised">
                    Yes, and they still practise it
                  </option>
                  <option value="held">
                    Yes, but they have not used it lately
                  </option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="delegation-audit__panel">
          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">
              Readout: {result.workflow}
            </h3>
            <div
              className="delegation-audit__score"
              role="status"
              aria-live="polite"
            >
              <span className="delegation-audit__score-value">
                {result.exposure.score}
              </span>
              <span className="delegation-audit__score-unit">
                workflow staff-week hours. {result.exposure.bandLabel}.
              </span>
            </div>
            <div className="delegation-audit__factors">
              <div className="delegation-audit__factor">
                <span className="delegation-audit__factor-value">
                  {result.exposure.dependencyDepth}
                </span>
                <p className="delegation-audit__factor-label">
                  Dependency depth: high and critical dependents
                </p>
              </div>
              <div className="delegation-audit__factor">
                <span className="delegation-audit__factor-value">
                  {result.exposure.substitutionCostStaffWeeks}
                </span>
                <p className="delegation-audit__factor-label">
                  Substitution cost in staff-weeks
                </p>
              </div>
              <div className="delegation-audit__factor">
                <span className="delegation-audit__factor-value">
                  {result.exposure.correctionLatencyHours}
                </span>
                <p className="delegation-audit__factor-label">
                  Correction latency in hours
                </p>
              </div>
            </div>
            <p className="delegation-audit__note">{result.exposure.reading}</p>
            <p className="delegation-audit__note">{EXPOSURE_UNITS}</p>
            <div className="delegation-audit__actions">
              <button
                type="button"
                className="button ghost button--compact"
                onClick={copyReadout}
              >
                {copied ? "Copied" : "Copy readout"}
              </button>
              <button
                type="button"
                className="button ghost button--compact"
                onClick={exportSnapshot}
              >
                Export JSON
              </button>
            </div>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">State variables</h3>
            <ul className="delegation-audit__variables">
              {result.variables.map((variable) => (
                <li
                  key={variable.id}
                  className={`delegation-audit__variable delegation-audit__variable--${variable.rating}`}
                >
                  <div className="delegation-audit__variable-header">
                    <h4 className="delegation-audit__variable-name">
                      {variable.label}
                    </h4>
                    <span className="delegation-audit__pill">
                      {variable.rating} · {variable.score}/100
                    </span>
                  </div>
                  <ul className="delegation-audit__list">
                    {variable.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">Ungrounded grants</h3>
            <p className="delegation-audit__step-question">
              Action classes with no authorizer, no evidence basis, or nobody
              named as affected.
            </p>
            {result.ungroundedGrants.length === 0 ? (
              <p className="delegation-audit__note">
                None recorded. Every named action class has an authorizer, an
                evidence basis, and an affected group.
              </p>
            ) : (
              <ul className="delegation-audit__list">
                {result.ungroundedGrants.map((grant) => (
                  <li key={grant.actionClassId}>
                    <strong>{grant.actionClass}</strong>:{" "}
                    {grant.reasons.join(" ")}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">
              Reversibility verdict
            </h3>
            <ul className="delegation-audit__ladder">
              {result.reversibility.levels.map((level) => (
                <li
                  key={level.id}
                  className={`delegation-audit__rung ${
                    level.id === result.reversibility.weakest.id
                      ? "delegation-audit__rung--weakest"
                      : ""
                  }`}
                >
                  <span className="delegation-audit__status">
                    {level.label}: {STATUS_LABEL[level.status]}
                    {level.id === result.reversibility.weakest.id
                      ? " (weakest level)"
                      : ""}
                  </span>
                  <p className="delegation-audit__note">{level.reason}</p>
                </li>
              ))}
            </ul>
            <p className="delegation-audit__note">
              {result.reversibility.summary}
            </p>
          </div>

          <div className="delegation-audit__step">
            <h3 className="delegation-audit__step-title">Findings</h3>
            {result.findings.length === 0 ? (
              <p className="delegation-audit__note">
                Nothing flagged from the answers given.
              </p>
            ) : (
              <ul className="delegation-audit__variables">
                {result.findings.map((finding) => (
                  <li key={finding.id} className="delegation-audit__variable">
                    <h4 className="delegation-audit__variable-name">
                      {finding.title}
                    </h4>
                    <p className="delegation-audit__note">{finding.detail}</p>
                    <div className="delegation-audit__refs">
                      <a href={finding.clause.href}>{finding.clause.label}</a>
                      <span aria-hidden="true">·</span>
                      <a href={finding.mechanism.href}>
                        {finding.mechanism.label}
                      </a>
                      <span aria-hidden="true">·</span>
                      <a href={finding.evalSuite.href}>
                        {finding.evalSuite.label}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelegationAudit;
