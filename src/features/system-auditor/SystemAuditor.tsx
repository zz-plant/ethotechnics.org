import React, { useMemo, useState } from "react";
import { auditSystemSpec, defaultGovernanceAnswers } from "./analyzer";
import { industryPresets } from "./presets";
import type { AutonomyTier, DomainHazard, GovernanceAnswers } from "./types";
import "./systemAuditor.css";

type CodeTab = "ts" | "py" | "json" | "legal";

type GovernanceQuestion = {
  key: keyof GovernanceAnswers;
  label: string;
  hint: string;
  options: { value: string; label: string }[];
};

const POLICY_QUESTIONS: GovernanceQuestion[] = [
  {
    key: "policyReviewTrigger",
    label: "Does the policy this system applies have a review trigger?",
    hint: "A condition that reopens the policy when the world changes.",
    options: [
      { value: "yes", label: "Yes, written down" },
      { value: "no", label: "No" },
      { value: "unknown", label: "Nobody knows" },
    ],
  },
  {
    key: "policyExpiry",
    label: "Does that policy have an expiry?",
    hint: "A date after which it stops justifying anything.",
    options: [
      { value: "yes", label: "Yes, a date" },
      { value: "no", label: "No" },
      { value: "unknown", label: "Nobody knows" },
    ],
  },
  {
    key: "policyLastReviewed",
    label: "When was it last reviewed?",
    hint: "Reviewed means somebody looked and recorded what they found.",
    options: [
      { value: "recent", label: "Within the last 3 months" },
      { value: "this-year", label: "Within the last 12 months" },
      { value: "stale", label: "More than 12 months ago" },
      { value: "never", label: "Never, or nobody knows" },
    ],
  },
];

const REVERSIBILITY_OPTIONS = [
  { value: "evidenced", label: "Evidenced by a test or a rehearsal" },
  { value: "claimed", label: "Claimed but never exercised" },
  { value: "none", label: "Not feasible" },
];

const REVERSIBILITY_QUESTIONS: GovernanceQuestion[] = [
  {
    key: "technicalReversibility",
    label: "Technical: can the change be undone in the system?",
    hint: "The switch throws, the rollback completes, the state restores.",
    options: REVERSIBILITY_OPTIONS,
  },
  {
    key: "operationalReversibility",
    label: "Operational: can the people on shift absorb it being undone?",
    hint: "Staff know the fallback and the queues can hold the load.",
    options: REVERSIBILITY_OPTIONS,
  },
  {
    key: "institutionalReversibility",
    label: "Institutional: can the organization survive having undone it?",
    hint: "Commitments, contracts, and budgets remain serviceable afterwards.",
    options: REVERSIBILITY_OPTIONS,
  },
];

const INTERVENTION_QUESTIONS: GovernanceQuestion[] = [
  {
    key: "reviewerInformation",
    label: "What information does the reviewer have?",
    hint: "What reaches them before the action commits.",
    options: [
      { value: "sufficient", label: "Everything the decision rested on" },
      { value: "partial", label: "A summary or a score" },
      { value: "none", label: "Almost nothing" },
    ],
  },
  {
    key: "actionsPreventable",
    label: "What can they prevent?",
    hint: "Compare it against what the system actually does.",
    options: [
      { value: "all", label: "Every action the system takes here" },
      { value: "some", label: "Some of them" },
      { value: "none", label: "None, they are told afterwards" },
    ],
  },
  {
    key: "statesAlterable",
    label: "What state can they alter?",
    hint: "A control changes the system, not only one outcome.",
    options: [
      { value: "system", label: "A rule, a threshold, or a permission" },
      { value: "single-case", label: "Only the case in front of them" },
      { value: "none", label: "Nothing" },
    ],
  },
  {
    key: "onDisagreement",
    label: "What happens if they disagree?",
    hint: "Disagreement should be an outcome with a route, not an unlogged override.",
    options: [
      {
        value: "recorded-route",
        label: "A recorded route with a named decider",
      },
      { value: "informal", label: "It escalates informally" },
      { value: "nothing", label: "Nothing defined" },
    ],
  },
  {
    key: "costToExercise",
    label: "What does it cost them to intervene?",
    hint: "Time, friction, and standing with their manager.",
    options: [
      { value: "low", label: "Little, it is part of the job" },
      { value: "noticeable", label: "Noticeable time or friction" },
      { value: "career-cost", label: "It counts against them" },
    ],
  },
];

export default function SystemAuditor() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    industryPresets[0].id,
  );
  const [systemName, setSystemName] = useState<string>(
    industryPresets[0].title,
  );
  const [promptText, setPromptText] = useState<string>(
    industryPresets[0].samplePrompt,
  );
  const [autonomyTier, setAutonomyTier] = useState<AutonomyTier>(
    industryPresets[0].autonomyTier,
  );
  const [hazardLevel, setHazardLevel] = useState<DomainHazard>(
    industryPresets[0].hazardLevel,
  );
  const [governance, setGovernance] = useState<GovernanceAnswers>(
    defaultGovernanceAnswers,
  );
  const [activeTab, setActiveTab] = useState<CodeTab>("ts");
  const [copied, setCopied] = useState<boolean>(false);

  const report = useMemo(() => {
    return auditSystemSpec(
      promptText,
      autonomyTier,
      hazardLevel,
      systemName,
      governance,
    );
  }, [promptText, autonomyTier, hazardLevel, systemName, governance]);

  const updateGovernance = (key: keyof GovernanceAnswers, value: string) => {
    setGovernance((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const renderGovernanceQuestions = (questions: GovernanceQuestion[]) =>
    questions.map((question) => (
      <div className="system-auditor__field" key={question.key}>
        <label
          className="system-auditor__label"
          htmlFor={`governance-${question.key}`}
        >
          {question.label}
        </label>
        <select
          id={`governance-${question.key}`}
          className="system-auditor__select"
          value={governance[question.key]}
          onChange={(e) => updateGovernance(question.key, e.target.value)}
        >
          {question.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="system-auditor__sla-desc">{question.hint}</span>
      </div>
    ));

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = industryPresets.find((p) => p.id === presetId);
    if (preset) {
      setSystemName(preset.title);
      setPromptText(preset.samplePrompt);
      setAutonomyTier(preset.autonomyTier);
      setHazardLevel(preset.hazardLevel);
    }
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case "ts":
        return report.guardrails.typescriptMiddleware;
      case "py":
        return report.guardrails.pythonGuard;
      case "json":
        return report.guardrails.jsonSchemaContract;
      case "legal":
        return report.guardrails.legalSlaClause;
      default:
        return "";
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(getActiveCode()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadReceipt = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ethotechnics-audit-receipt.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const scoreClass =
    report.score >= 80
      ? "system-auditor__score-circle--low"
      : report.score >= 60
        ? "system-auditor__score-circle--moderate"
        : report.score >= 40
          ? "system-auditor__score-circle--elevated"
          : "system-auditor__score-circle--critical";

  return (
    <div className="system-auditor">
      <div className="system-auditor__grid">
        {/* Left Column: Configuration & Prompt Spec */}
        <div className="system-auditor__panel">
          <div className="system-auditor__section-title">
            <span>1. System Architecture & Prompt Spec</span>
          </div>

          <div className="system-auditor__field">
            <span className="system-auditor__label">Load Industry Preset</span>
            <div className="system-auditor__preset-pills">
              {industryPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`system-auditor__preset-btn ${
                    selectedPresetId === preset.id
                      ? "system-auditor__preset-btn--active"
                      : ""
                  }`}
                >
                  {preset.title.split(" ")[0]} (
                  {preset.domain.split("/")[0].trim()})
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedPresetId("custom")}
                className={`system-auditor__preset-btn ${
                  selectedPresetId === "custom"
                    ? "system-auditor__preset-btn--active"
                    : ""
                }`}
              >
                Custom Spec
              </button>
            </div>
          </div>

          <div className="system-auditor__field">
            <label
              htmlFor="system-name-input"
              className="system-auditor__label"
            >
              System Name / Identifier
            </label>
            <input
              id="system-name-input"
              type="text"
              className="system-auditor__input"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="e.g. Automated Claims Evaluator"
            />
          </div>

          <div className="system-auditor__controls-row">
            <div className="system-auditor__field">
              <label
                htmlFor="autonomy-tier-select"
                className="system-auditor__label"
              >
                Autonomy Tier
              </label>
              <select
                id="autonomy-tier-select"
                className="system-auditor__select"
                value={autonomyTier}
                onChange={(e) =>
                  setAutonomyTier(e.target.value as AutonomyTier)
                }
              >
                <option value="advisory">Advisory (Human Decides)</option>
                <option value="semi-autonomous">Semi-Autonomous (HITL)</option>
                <option value="autonomous">Fully Autonomous (Direct)</option>
              </select>
            </div>

            <div className="system-auditor__field">
              <label
                htmlFor="hazard-level-select"
                className="system-auditor__label"
              >
                Domain Hazard Level
              </label>
              <select
                id="hazard-level-select"
                className="system-auditor__select"
                value={hazardLevel}
                onChange={(e) => setHazardLevel(e.target.value as DomainHazard)}
              >
                <option value="low">Low (Content/General)</option>
                <option value="medium">Medium (Commerce/Support)</option>
                <option value="high">High (Credit/Access/Legal)</option>
                <option value="critical">
                  Critical (Health/Safety/Benefits)
                </option>
              </select>
            </div>
          </div>

          <div className="system-auditor__field">
            <label
              htmlFor="system-prompt-textarea"
              className="system-auditor__label"
            >
              System Prompt, Architecture Rules, or Decision Policy
            </label>
            <textarea
              id="system-prompt-textarea"
              className="system-auditor__textarea"
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                if (selectedPresetId !== "custom")
                  setSelectedPresetId("custom");
              }}
              placeholder="Paste system prompt, agent tool definitions, or automated decision logic..."
            />
          </div>

          <div className="system-auditor__section-title">
            <span>2. Policy validity</span>
          </div>
          {renderGovernanceQuestions(POLICY_QUESTIONS)}

          <div className="system-auditor__section-title">
            <span>3. Reversibility at three levels</span>
          </div>
          {renderGovernanceQuestions(REVERSIBILITY_QUESTIONS)}

          <div className="system-auditor__section-title">
            <span>4. The human named as oversight</span>
          </div>
          {renderGovernanceQuestions(INTERVENTION_QUESTIONS)}
        </div>

        {/* Right Column: Real-Time Audit Findings & Synthesis */}
        <div className="system-auditor__panel">
          <div className="system-auditor__score-banner">
            <div className="system-auditor__score-group">
              <div className={`system-auditor__score-circle ${scoreClass}`}>
                {report.score}
              </div>
              <div className="system-auditor__score-info">
                <h3>{report.riskLevel}</h3>
                <p>
                  {report.risksDetected.length} potential governance breach
                  vectors detected
                </p>
              </div>
            </div>
            <button
              type="button"
              className="button button--compact"
              onClick={handleDownloadReceipt}
            >
              Export JSON Receipt
            </button>
          </div>

          {/* Quantitative SLAs */}
          <div className="system-auditor__field">
            <span className="system-auditor__label">
              Recommended Quantitative SLA Thresholds
            </span>
            <div className="system-auditor__slas-grid">
              <div className="system-auditor__sla-card">
                <span className="system-auditor__sla-label">
                  Time-to-Halt (TTH)
                </span>
                <span className="system-auditor__sla-val">
                  &le; {report.slas.timeToHaltSec}s
                </span>
                <span className="system-auditor__sla-desc">
                  Max automated execution before brake
                </span>
              </div>
              <div className="system-auditor__sla-card">
                <span className="system-auditor__sla-label">Reversal SLA</span>
                <span className="system-auditor__sla-val">
                  &le; {report.slas.reversalSlaHours}h
                </span>
                <span className="system-auditor__sla-desc">
                  Human contestability turnaround
                </span>
              </div>
              <div className="system-auditor__sla-card">
                <span className="system-auditor__sla-label">
                  User Burden Cap
                </span>
                <span className="system-auditor__sla-val">
                  &le; {report.slas.maxUserBurdenSteps} steps
                </span>
                <span className="system-auditor__sla-desc">
                  Max proof steps before inversion
                </span>
              </div>
              <div className="system-auditor__sla-card">
                <span className="system-auditor__sla-label">
                  Human Saturation Ceiling
                </span>
                <span className="system-auditor__sla-val">
                  &le; {report.slas.humanSubstitutionCeilingPct}%
                </span>
                <span className="system-auditor__sla-desc">
                  Max allowable review fallback rate
                </span>
              </div>
            </div>
          </div>

          {/* Detected Failure Modes */}
          <div className="system-auditor__field">
            <span className="system-auditor__label">
              Detected Failure Modes & Required Remediations
            </span>
            <div className="system-auditor__risks">
              {report.risksDetected.length === 0 ? (
                <div className="system-auditor__risk-card">
                  <div className="system-auditor__risk-title">
                    No critical pattern violations detected
                  </div>
                  <p className="system-auditor__risk-body">
                    System specification incorporates contestability boundaries
                    and fallback paths.
                  </p>
                </div>
              ) : (
                report.risksDetected.map((risk) => (
                  <div
                    key={risk.id}
                    className={`system-auditor__risk-card ${
                      risk.severity === "critical"
                        ? "system-auditor__risk-card--critical"
                        : risk.severity === "high"
                          ? "system-auditor__risk-card--high"
                          : ""
                    }`}
                  >
                    <div className="system-auditor__risk-header">
                      <span className="system-auditor__risk-title">
                        {risk.name}
                      </span>
                      <span className="system-auditor__risk-badge">
                        {risk.severity} risk
                      </span>
                    </div>
                    <p className="system-auditor__risk-body">{risk.trigger}</p>
                    <div className="system-auditor__risk-remedy">
                      <strong>Remedy:</strong> {risk.remedy}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Delegation findings from the policy, reversibility, and intervention answers */}
          <div className="system-auditor__field">
            <span className="system-auditor__label">
              Delegation Findings (Policy, Reversibility, Intervention)
            </span>
            <span className="system-auditor__sla-desc">
              These come from your answers, not from the text. They are reported
              separately and do not move the governance health score.
            </span>
            <div className="system-auditor__risks">
              {report.delegationFindings.length === 0 ? (
                <div className="system-auditor__risk-card">
                  <div className="system-auditor__risk-title">
                    Policy, reversibility, and intervention all hold
                  </div>
                  <p className="system-auditor__risk-body">
                    The policy has a trigger and an expiry, all three levels of
                    reversibility are evidenced, and the reviewer can alter
                    system state.
                  </p>
                </div>
              ) : (
                report.delegationFindings.map((item) => (
                  <div
                    key={item.id}
                    className={`system-auditor__risk-card ${
                      item.severity === "critical"
                        ? "system-auditor__risk-card--critical"
                        : item.severity === "high"
                          ? "system-auditor__risk-card--high"
                          : ""
                    }`}
                  >
                    <div className="system-auditor__risk-header">
                      <span className="system-auditor__risk-title">
                        {item.name}
                      </span>
                      <span className="system-auditor__risk-badge">
                        {item.severity} risk
                      </span>
                    </div>
                    <p className="system-auditor__risk-body">{item.trigger}</p>
                    <div className="system-auditor__risk-remedy">
                      <strong>Remedy:</strong> {item.remedy}
                    </div>
                    <div className="system-auditor__risk-remedy">
                      <strong>Reference:</strong> {item.standardRef}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Synthesized Guardrails & Contracts */}
          <div className="system-auditor__field">
            <div className="system-auditor__section-title">
              <span>Synthesized Guardrail Code & Contract Clauses</span>
            </div>

            <div className="system-auditor__tabs">
              <button
                type="button"
                className={`system-auditor__tab-btn ${
                  activeTab === "ts" ? "system-auditor__tab-btn--active" : ""
                }`}
                onClick={() => setActiveTab("ts")}
              >
                TypeScript Middleware
              </button>
              <button
                type="button"
                className={`system-auditor__tab-btn ${
                  activeTab === "py" ? "system-auditor__tab-btn--active" : ""
                }`}
                onClick={() => setActiveTab("py")}
              >
                Python Guard
              </button>
              <button
                type="button"
                className={`system-auditor__tab-btn ${
                  activeTab === "json" ? "system-auditor__tab-btn--active" : ""
                }`}
                onClick={() => setActiveTab("json")}
              >
                JSON Schema
              </button>
              <button
                type="button"
                className={`system-auditor__tab-btn ${
                  activeTab === "legal" ? "system-auditor__tab-btn--active" : ""
                }`}
                onClick={() => setActiveTab("legal")}
              >
                Legal SLA Clause
              </button>
            </div>

            <div className="system-auditor__code-wrapper">
              <button
                type="button"
                className="system-auditor__code-copy"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
              <pre className="system-auditor__code-block">
                <code>{getActiveCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
