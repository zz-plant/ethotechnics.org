export type GovernanceCrosswalk = {
  controlId: string;
  obligation: string;
  euAiAct: string;
  nistAiRmf: string;
  iso42001: string;
  evidenceArtifacts: string[];
  operationalSurface: string;
};

export const governanceCrosswalks: GovernanceCrosswalk[] = [
  {
    controlId: "CTRL-01",
    obligation:
      "Maintain human oversight with real stop authority for high-risk decisions.",
    euAiAct: "Article 14 (Human oversight)",
    nistAiRmf: "GOV 3.2, MAP 4.1",
    iso42001: "Clause 8.2 (Operational planning and control)",
    evidenceArtifacts: [
      "Named on-call oversight roster",
      "Stop-action drill records",
      "Override event log with timestamps",
    ],
    operationalSurface: "Halt and escalation control panel",
  },
  {
    controlId: "CTRL-02",
    obligation:
      "Demonstrate risk management and controls before deployment and at major changes.",
    euAiAct: "Article 9 (Risk management system)",
    nistAiRmf: "MAP 1.4, MEASURE 2.2",
    iso42001: "Clause 6.1 and 8.1 (Risk and operation planning)",
    evidenceArtifacts: [
      "Current risk register slice",
      "Pre-release validation results",
      "Mitigation owner assignment with due dates",
    ],
    operationalSurface: "Release gate evidence checklist",
  },
  {
    controlId: "CTRL-03",
    obligation:
      "Operate post-market monitoring and incident reporting with response clocks.",
    euAiAct:
      "Articles 72 and 73 (Post-market monitoring and incident reporting)",
    nistAiRmf: "MANAGE 3.3, MANAGE 4.1",
    iso42001: "Clause 9.1 and 10.1 (Monitoring and improvement)",
    evidenceArtifacts: [
      "Post-market monitoring dashboard export",
      "Incident intake record with severity and deadline",
      "Remediation and closure log",
    ],
    operationalSurface:
      "Incident intake, triage, and regulator export workflow",
  },
  {
    controlId: "CTRL-04",
    obligation:
      "Provide traceability so affected decisions can be reconstructed and contested.",
    euAiAct: "Article 12 (Record keeping)",
    nistAiRmf: "MEASURE 2.11, GOVERN 6.1",
    iso42001: "Clause 7.5 (Documented information)",
    evidenceArtifacts: [
      "Decision record with model/version context",
      "Appeal-event timeline",
      "Retention and retrieval policy",
    ],
    operationalSurface: "Decision ledger and appeal history view",
  },
];

export const evidencePackMinimumSet = [
  "Policy record with approver and revision date",
  "Risk register slice for the affected workflow",
  "Latest validator/test run with pass-fail thresholds",
  "Human-oversight and escalation logs",
  "Incident ledger entries and repair outcomes",
];

export const postMarketWorkflow = [
  {
    stage: "Intake",
    outcome:
      "Capture incident class, severity, impacted parties, and owner within one clock tick.",
  },
  {
    stage: "Triage",
    outcome:
      "Apply stop/degrade decisions and publish expected next update time.",
  },
  {
    stage: "Remediation",
    outcome: "Link fix actions to evidence artifacts and restoration targets.",
  },
  {
    stage: "Regulatory reporting",
    outcome:
      "Export regulator-ready summary with timeline, controls, and attachments.",
  },
  {
    stage: "Closure and learning",
    outcome:
      "Record closure decision, residual risk, and prevention commitments.",
  },
];
