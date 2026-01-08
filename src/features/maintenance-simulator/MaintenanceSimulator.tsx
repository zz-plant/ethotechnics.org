import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import "./maintenanceSimulator.css";
import {
  buildSimulationPlan,
  coverageItems,
  evaluateReadiness,
  scenarioTemplates,
  type CoverageChecklist,
  type RiskLevel,
  type ScenarioTemplate,
} from "./simulatorLogic";

const initialCoverage: CoverageChecklist = {
  escalationOwner: true,
  rollbackPlan: true,
  communicationsReady: false,
  appealPath: false,
  handoffPlan: true,
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
  template,
  coverage,
  riskLevel,
}: {
  template: ScenarioTemplate;
  coverage: CoverageChecklist;
  riskLevel: RiskLevel;
}) => {
  const readiness = useMemo(
    () => evaluateReadiness(coverage, riskLevel, template),
    [coverage, riskLevel, template],
  );

  return (
    <div
      className="simulator__card simulator__card--inline"
      aria-labelledby="readiness-title"
    >
      <div className="simulator__card-header">
        <div>
          <p className="eyebrow">Coverage score</p>
          <h3 id="readiness-title">{readiness.score}% ready to run</h3>
          <p className="muted">
            Score drops when required owners, halt lanes, or communication
            templates are missing. Use the toggles to calibrate readiness before
            you schedule a simulation.
          </p>
        </div>
      </div>
      <div className="simulator__grid">
        <div>
          <p className="muted simulator__label">Gaps to close</p>
          {readiness.gaps.length > 0 ? (
            <ul className="simulator__list">
              {readiness.gaps.map((gap) => (
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

const CommunicationTable = ({ template }: { template: ScenarioTemplate }) => (
  <div className="simulator__card" aria-labelledby="communications-title">
    <div className="simulator__card-header">
      <div>
        <p className="eyebrow">Communications</p>
        <h3 id="communications-title">Keep communications on cadence</h3>
        <p className="muted">
          Pair each status update with the owner roster and how to appeal. Reuse
          these templates to keep teams aligned during the run.
        </p>
      </div>
    </div>
    <div
      className="simulator__table"
      role="table"
      aria-label="Communication templates"
    >
      <div
        className="simulator__table-row simulator__table-row--header"
        role="row"
      >
        <div role="columnheader">Audience</div>
        <div role="columnheader">Trigger</div>
        <div role="columnheader">Message</div>
      </div>
      {template.communications.map((communication) => (
        <div
          key={communication.trigger + communication.audience}
          className="simulator__table-row"
          role="row"
        >
          <div role="cell">{communication.audience}</div>
          <div role="cell">{communication.trigger}</div>
          <div role="cell">{communication.message}</div>
        </div>
      ))}
    </div>
  </div>
);

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
  const [templateId, setTemplateId] = useState("scheduled-maintenance");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("elevated");
  const [coverage, setCoverage] = useState<CoverageChecklist>(initialCoverage);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scenarioParam = params.get("scenario");
    const riskParam = params.get("risk");

    if (
      scenarioParam &&
      scenarioTemplates.some((scenario) => scenario.id === scenarioParam)
    ) {
      setTemplateId(scenarioParam);
    }

    if (riskParam && ["steady", "elevated", "critical"].includes(riskParam)) {
      setRiskLevel(riskParam as RiskLevel);
    }
  }, []);

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

  const handleTemplateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setTemplateId(value);
  };

  const handleRiskChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setRiskLevel(value as RiskLevel);
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
          <div className="simulator__actions">
            <button 
              className="button ghost button--compact" 
              onClick={() => {
                const data = {
                  template,
                  riskLevel,
                  coverage,
                  plan: simulationPlan
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `maintenance-simulation-${templateId}.json`;
                a.click();
              }}
            >
              Export JSON
            </button>
            <button 
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
        template={template}
        coverage={coverage}
        riskLevel={riskLevel}
      />

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
