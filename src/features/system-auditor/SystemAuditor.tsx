import React, { useMemo, useState } from "react";
import { auditSystemSpec } from "./analyzer";
import { industryPresets } from "./presets";
import type { AutonomyTier, DomainHazard } from "./types";
import "./systemAuditor.css";

type CodeTab = "ts" | "py" | "json" | "legal";

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
  const [activeTab, setActiveTab] = useState<CodeTab>("ts");
  const [copied, setCopied] = useState<boolean>(false);

  const report = useMemo(() => {
    return auditSystemSpec(promptText, autonomyTier, hazardLevel, systemName);
  }, [promptText, autonomyTier, hazardLevel, systemName]);

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
                  {preset.title.split(" ")[0]} ({preset.domain.split("/")[0].trim()})
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
            <label htmlFor="system-name-input" className="system-auditor__label">
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
              <label htmlFor="autonomy-tier-select" className="system-auditor__label">
                Autonomy Tier
              </label>
              <select
                id="autonomy-tier-select"
                className="system-auditor__select"
                value={autonomyTier}
                onChange={(e) => setAutonomyTier(e.target.value as AutonomyTier)}
              >
                <option value="advisory">Advisory (Human Decides)</option>
                <option value="semi-autonomous">Semi-Autonomous (HITL)</option>
                <option value="autonomous">Fully Autonomous (Direct)</option>
              </select>
            </div>

            <div className="system-auditor__field">
              <label htmlFor="hazard-level-select" className="system-auditor__label">
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
                <option value="critical">Critical (Health/Safety/Benefits)</option>
              </select>
            </div>
          </div>

          <div className="system-auditor__field">
            <label htmlFor="system-prompt-textarea" className="system-auditor__label">
              System Prompt, Architecture Rules, or Decision Policy
            </label>
            <textarea
              id="system-prompt-textarea"
              className="system-auditor__textarea"
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                if (selectedPresetId !== "custom") setSelectedPresetId("custom");
              }}
              placeholder="Paste system prompt, agent tool definitions, or automated decision logic..."
            />
          </div>
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
                <span className="system-auditor__sla-label">Time-to-Halt (TTH)</span>
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
                <span className="system-auditor__sla-label">User Burden Cap</span>
                <span className="system-auditor__sla-val">
                  &le; {report.slas.maxUserBurdenSteps} steps
                </span>
                <span className="system-auditor__sla-desc">
                  Max proof steps before inversion
                </span>
              </div>
              <div className="system-auditor__sla-card">
                <span className="system-auditor__sla-label">Human Saturation Ceiling</span>
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
                    System specification incorporates contestability boundaries and
                    fallback paths.
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
