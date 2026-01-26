import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import "./maintenanceSimulator.css";
import {
  buildSimulationPlan,
  coverageItems,
  getThresholdPreset,
  getThresholdStatus,
  scenarioTemplates,
  thresholdPresets,
  type CoverageChecklist,
  type RiskLevel,
  type ScenarioTemplate,
  type ThresholdPreset,
  type ThresholdStatus,
} from "./simulatorLogic";

const initialCoverage: CoverageChecklist = {
  escalationOwner: true,
  rollbackPlan: true,
  communicationsReady: false,
  appealPath: false,
  handoffPlan: true,
};

const STORAGE_KEY = "maintenance-simulator-state";
const QUERY_KEYS = {
  scenario: "scenario",
  risk: "risk",
  coverage: "coverage",
  preset: "preset",
} as const;
const VALID_RISKS: RiskLevel[] = ["steady", "elevated", "critical"];
const VALID_PRESETS = thresholdPresets.map((preset) => preset.id);

const parseCoverageParam = (value: string | null) => {
  if (!value) return null;
  const enabled = value.split(",").map((item) => item.trim());
  if (!enabled.length) return null;

  const nextCoverage = { ...initialCoverage };
  coverageItems.forEach((item) => {
    nextCoverage[item.key] = enabled.includes(item.key);
  });
  return nextCoverage;
};

const readStoredState = () => {
  if (typeof window === "undefined") return null;
  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (!storedValue) return null;
    return JSON.parse(storedValue) as {
      templateId?: string;
      riskLevel?: RiskLevel;
      coverage?: CoverageChecklist;
      thresholdPresetId?: string;
    };
  } catch {
    return null;
  }
};

const resolveInitialState = () => {
  if (typeof window === "undefined") {
    return {
      templateId: "scheduled-maintenance",
      riskLevel: "elevated" as RiskLevel,
      coverage: initialCoverage,
      thresholdPresetId: "balanced",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const storedState = readStoredState();
  const scenarioParam = params.get(QUERY_KEYS.scenario);
  const riskParam = params.get(QUERY_KEYS.risk);
  const coverageParam = parseCoverageParam(params.get(QUERY_KEYS.coverage));
  const presetParam = params.get(QUERY_KEYS.preset);

  const templateId =
    (scenarioParam &&
      scenarioTemplates.some((scenario) => scenario.id === scenarioParam) &&
      scenarioParam) ||
    storedState?.templateId ||
    "scheduled-maintenance";
  const riskLevel =
    (riskParam && VALID_RISKS.includes(riskParam as RiskLevel)
      ? (riskParam as RiskLevel)
      : storedState?.riskLevel) || "elevated";
  const coverage = coverageParam || storedState?.coverage || initialCoverage;
  const thresholdPresetId =
    (presetParam && VALID_PRESETS.includes(presetParam)
      ? presetParam
      : storedState?.thresholdPresetId) || "balanced";

  return { templateId, riskLevel, coverage, thresholdPresetId };
};

const riskLabels: Record<RiskLevel, string> = {
  steady: "Steady",
  elevated: "Elevated",
  critical: "Critical",
};

const riskDescriptions: Record<RiskLevel, string> = {
  steady: "Light rehearsal with minimal load—use for routine windows.",
  elevated:
    "Extra scrutiny on coverage—use when signals are noisy or timelines are tight.",
  critical:
    "High-stress branch—use when the team is thinly staffed or outages are likely.",
};

const TemplateSummary = ({ template }: { template: ScenarioTemplate }) => (
  <div className="simulator__template">
    <div>
      <p className="eyebrow">Scenario</p>
      <h2>{template.name}</h2>
      <p className="muted">{template.summary}</p>
    </div>
    <div
      className="simulator__template-meta"
      aria-label="Simulation highlights"
    >
      <div>
        <p className="muted">Time to halt expectation</p>
        <p className="simulator__pill">{template.timeToHalt}</p>
      </div>
      <div>
        <p className="muted">Stress signals to watch</p>
        <ul className="pill-list pill-list--wrap">
          {template.stressSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const ReadinessPanel = ({
  readinessScore,
  gaps,
  coverage,
  thresholdStatus,
}: {
  readinessScore: number;
  gaps: string[];
  coverage: CoverageChecklist;
  thresholdStatus: ThresholdStatus;
}) => {
  return (
    <div
      className="simulator__card simulator__card--inline"
      aria-labelledby="readiness-title"
    >
      <div className="simulator__card-header">
        <div>
          <p className="eyebrow">Coverage score</p>
          <h3 id="readiness-title">{readinessScore}% ready to run</h3>
          <p className="muted">
            Score drops when required owners, halt lanes, or communication
            templates are missing. Use the toggles to calibrate readiness before
            you schedule a simulation.
          </p>
        </div>
      </div>
      {thresholdStatus.actNow ? (
        <div className="simulator__alert simulator__alert--act" role="alert">
          <strong>Act now:</strong> Readiness is below the {thresholdStatus.band.label}{" "}
          threshold. Pause the window and close critical gaps before proceeding.
        </div>
      ) : null}
      <div className="simulator__grid">
        <div>
          <p className="muted simulator__label">Gaps to close</p>
          {gaps.length > 0 ? (
            <ul className="simulator__list">
              {gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              No gaps detected. Keep the halt timer visible during the run.
            </p>
          )}
        </div>
        <div>
          <p className="muted simulator__label">Coverage toggles</p>
          <div
            className="simulator__toggles"
            role="group"
            aria-label="Coverage checklist"
          >
            {coverageItems.map((item) => (
              <label key={item.key} className="simulator__toggle">
                <input
                  type="checkbox"
                  checked={coverage[item.key]}
                  aria-label={item.label}
                  readOnly
                />
                <div>
                  <p className="simulator__toggle-label">{item.label}</p>
                  <p className="muted simulator__toggle-detail">
                    {item.detail}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThresholdPanel = ({
  preset,
  status,
}: {
  preset: ThresholdPreset;
  status: ThresholdStatus;
}) => (
  <div className="simulator__card" aria-labelledby="thresholds-title">
    <div className="simulator__card-header">
      <div>
        <p className="eyebrow">Readiness thresholds</p>
        <h3 id="thresholds-title">Bands and recommended interventions</h3>
        <p className="muted">{preset.description}</p>
      </div>
      <div className="simulator__badge">{preset.name}</div>
    </div>
    <div className="simulator__grid">
      <div>
        <p className="muted simulator__label">Threshold bands</p>
        <ul className="simulator__threshold-list">
          {preset.bands.map((band) => {
            const isActive = band.id === status.band.id;
            return (
              <li
                key={band.id}
                className={`simulator__threshold-band${
                  isActive ? " simulator__threshold-band--active" : ""
                }${band.actNow ? " simulator__threshold-band--act" : ""}`}
              >
                <div>
                  <p className="simulator__threshold-label">{band.label}</p>
                  <p className="muted simulator__threshold-range">
                    {band.rangeLabel}
                  </p>
                </div>
                <p className="muted simulator__threshold-description">
                  {band.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="muted simulator__label">
          Recommended interventions
        </p>
        <ul className="simulator__list">
          {status.recommendedInterventions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const StageCard = ({
  name,
  phase,
  focus,
  expectedOwner,
  tasks,
  blockers,
  severity,
}: {
  name: string;
  phase: string;
  focus: string;
  expectedOwner: string;
  tasks: string[];
  blockers: string[];
  severity: "ready" | "watch" | "at-risk";
}) => (
  <article
    className={`simulator__card simulator__card--stage simulator__card--${severity}`}
  >
    <header className="simulator__card-header">
      <div>
        <p className="eyebrow">{phase}</p>
        <h3>{name}</h3>
        <p className="muted">{focus}</p>
      </div>
      <div className="simulator__badge">{expectedOwner}</div>
    </header>
    <div className="simulator__grid">
      <div>
        <p className="muted simulator__label">Actions</p>
        <ul className="simulator__list">
          {tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="muted simulator__label">Blockers</p>
        {blockers.length > 0 ? (
          <ul className="simulator__list simulator__list--warning">
            {blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No blockers for this stage.</p>
        )}
      </div>
    </div>
  </article>
);

const CommunicationTable = ({ template }: { template: ScenarioTemplate }) => {
  const handleCopyMessage = (message: string) => {
    if (typeof navigator === "undefined") return;
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(message);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = message;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  return (
    <div className="simulator__card" aria-labelledby="communications-title">
      <div className="simulator__card-header">
        <div>
          <p className="eyebrow">Communications</p>
          <h3 id="communications-title">Keep communications on cadence</h3>
          <p className="muted">
            Pair each status update with the owner roster and how to appeal.
            Reuse these templates to keep teams aligned during the run.
          </p>
        </div>
      </div>
      <table className="simulator__table" aria-label="Communication templates">
        <thead>
          <tr>
            <th scope="col">Audience</th>
            <th scope="col">Trigger</th>
            <th scope="col">Message</th>
            <th scope="col">Copy</th>
          </tr>
        </thead>
        <tbody>
          {template.communications.map((communication) => (
            <tr key={communication.trigger + communication.audience}>
              <td>
                <div className="simulator__table-cell">
                  <span className="simulator__table-label">Audience</span>
                  <span className="simulator__table-value">
                    {communication.audience}
                  </span>
                </div>
              </td>
              <td>
                <div className="simulator__table-cell">
                  <span className="simulator__table-label">Trigger</span>
                  <span className="simulator__table-value">
                    {communication.trigger}
                  </span>
                </div>
              </td>
              <td>
                <div className="simulator__table-cell">
                  <span className="simulator__table-label">Message</span>
                  <span className="simulator__table-message">
                    {communication.message}
                  </span>
                </div>
              </td>
              <td>
                <button
                  type="button"
                  className="simulator__copy-button"
                  onClick={() => handleCopyMessage(communication.message)}
                  aria-label={`Copy message for ${communication.audience}`}
                >
                  Copy message
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CoverageControls = ({
  coverage,
  setCoverage,
}: {
  coverage: CoverageChecklist;
  setCoverage: (value: CoverageChecklist) => void;
}) => {
  const toggleCoverage = (key: keyof CoverageChecklist) => {
    setCoverage({ ...coverage, [key]: !coverage[key] });
  };

  return (
    <div className="simulator__controls" aria-label="Simulation controls">
      <div
        className="simulator__control-group"
        role="group"
        aria-label="Coverage items to include"
      >
        {coverageItems.map((item) => (
          <label key={item.key} className="simulator__control">
            <input
              type="checkbox"
              checked={coverage[item.key]}
              onChange={() => toggleCoverage(item.key)}
              aria-label={`Toggle ${item.label}`}
            />
            <div>
              <p className="simulator__control-label">{item.label}</p>
              <p className="muted simulator__control-detail">{item.detail}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

const MaintenanceSimulator = () => {
  const initialState = useMemo(() => resolveInitialState(), []);
  const [templateId, setTemplateId] = useState(initialState.templateId);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(
    initialState.riskLevel,
  );
  const [coverage, setCoverage] = useState<CoverageChecklist>(
    initialState.coverage,
  );
  const [thresholdPresetId, setThresholdPresetId] = useState(
    initialState.thresholdPresetId,
  );
  const hasSyncedUrl = useRef(false);

  const template = useMemo(
    () =>
      scenarioTemplates.find((item) => item.id === templateId) ??
      scenarioTemplates[0],
    [templateId],
  );

  const simulationPlan = useMemo(
    () => buildSimulationPlan(template, coverage, riskLevel),
    [template, coverage, riskLevel],
  );
  const thresholdPreset = useMemo(
    () => getThresholdPreset(thresholdPresetId),
    [thresholdPresetId],
  );
  const thresholdStatus = useMemo(
    () => getThresholdStatus(simulationPlan.readinessScore, thresholdPreset),
    [simulationPlan.readinessScore, thresholdPreset],
  );

  const handleTemplateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setTemplateId(value);
  };

  const handleRiskChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setRiskLevel(value as RiskLevel);
  };

  const handleThresholdPresetChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const { value } = event.target;
    setThresholdPresetId(value);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.set(QUERY_KEYS.scenario, templateId);
    params.set(QUERY_KEYS.risk, riskLevel);
    params.set(QUERY_KEYS.preset, thresholdPresetId);
    const enabledCoverage = coverageItems
      .filter((item) => coverage[item.key])
      .map((item) => item.key)
      .join(",");
    params.set(QUERY_KEYS.coverage, enabledCoverage);

    const nextSearch = params.toString();
    const nextSearchWithPrefix = nextSearch ? `?${nextSearch}` : "";
    const nextUrl = `${window.location.pathname}${nextSearchWithPrefix}${window.location.hash}`;

    if (window.location.search !== nextSearchWithPrefix) {
      if (hasSyncedUrl.current) {
        window.history.pushState({}, "", nextUrl);
      } else {
        window.history.replaceState({}, "", nextUrl);
        hasSyncedUrl.current = true;
      }
    } else if (!hasSyncedUrl.current) {
      hasSyncedUrl.current = true;
    }

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ templateId, riskLevel, coverage, thresholdPresetId }),
    );
  }, [templateId, riskLevel, coverage, thresholdPresetId]);

  const handleExportJson = () => {
    const data = {
      template,
      riskLevel,
      coverage,
      thresholdPreset,
      thresholdStatus,
      plan: simulationPlan,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `maintenance-simulation-${templateId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="simulator">
      <div className="simulator__intro">
        <p className="eyebrow">Maintenance simulator</p>
        <h1>Tabletop the outage, maintenance window, and handoff</h1>
        <p className="muted">
          Use this simulator to rehearse coverage, communication, and halt
          decisions before you schedule a live window. Pick a scenario, set the
          stress level, and close the gaps before you run.
        </p>
        <div className="simulator__selectors">
          <label className="simulator__selector">
            <span className="simulator__selector-label">Scenario</span>
            <select
              value={templateId}
              onChange={handleTemplateChange}
              aria-label="Select simulation scenario"
            >
              {scenarioTemplates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="simulator__selector">
            <span className="simulator__selector-label">Stress level</span>
            <select
              value={riskLevel}
              onChange={handleRiskChange}
              aria-label="Set simulation stress level"
            >
              {Object.entries(riskLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="simulator__selector">
            <span className="simulator__selector-label">
              Threshold preset
              <span className="simulator__tooltip">
                <button
                  type="button"
                  className="simulator__tooltip-trigger"
                  aria-label="Explain threshold presets"
                  aria-describedby="threshold-preset-tooltip"
                >
                  ?
                </button>
                <span
                  id="threshold-preset-tooltip"
                  role="tooltip"
                  className="simulator__tooltip-content"
                >
                  Presets define the score bands that trigger watch or act-now
                  actions. Choose the profile that matches your risk appetite.
                </span>
              </span>
            </span>
            <select
              value={thresholdPresetId}
              onChange={handleThresholdPresetChange}
              aria-label="Select readiness threshold preset"
            >
              {thresholdPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <p className="muted simulator__selector-detail">
              {thresholdPreset.description}
            </p>
          </label>
          <div className="simulator__actions">
            <button
              type="button"
              className="button ghost button--compact"
              onClick={handleExportJson}
            >
              Export JSON
            </button>
            <button
              type="button"
              className="button primary button--compact"
              onClick={() => window.print()}
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="simulator__risk-description">
          <p className="muted">{riskDescriptions[riskLevel]}</p>
        </div>
      </div>

      <TemplateSummary template={template} />

      <CoverageControls coverage={coverage} setCoverage={setCoverage} />

      <ReadinessPanel
        readinessScore={simulationPlan.readinessScore}
        gaps={simulationPlan.gaps}
        coverage={coverage}
        thresholdStatus={thresholdStatus}
      />

      <ThresholdPanel preset={thresholdPreset} status={thresholdStatus} />

      <div className="simulator__card" aria-labelledby="stages-title">
        <div className="simulator__card-header">
          <div>
            <p className="eyebrow">Runbook</p>
            <h3 id="stages-title">Play through the stages</h3>
            <p className="muted">
              Each stage lists the owner, actions, and blockers to close before
              you schedule the run. Severity shifts when stress increases or
              required coverage is missing.
            </p>
          </div>
        </div>
        <div className="simulator__stage-grid">
          {simulationPlan.stagePlan.map((stage) => (
            <StageCard key={stage.id} {...stage} />
          ))}
        </div>
      </div>

      <CommunicationTable template={template} />
    </div>
  );
};

export default MaintenanceSimulator;
