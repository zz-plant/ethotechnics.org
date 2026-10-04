export type GovernanceCrosswalk = {
  controlId: string;
  /** Short topic for the page title, in sentence case. */
  topic: string;
  /** Meta description for the control's brief page. */
  metaDescription: string;
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
    topic: "human oversight with stop authority",
    metaDescription:
      "Human oversight with a stop authority someone can use, mapped to EU AI Act Article 14, NIST AI RMF GOV 3.2 and MAP 4.1, and ISO/IEC 42001 clause 8.2.",
    obligation:
      "Maintain human oversight with exercisable stop authority for high-risk decisions.",
    euAiAct: "Article 14 (Human oversight)",
    nistAiRmf: "GOV 3.2, MAP 4.1",
    iso42001: "Clause 8.2 (Operational planning and control)",
    evidenceArtifacts: [
      "Intervention specification per oversight claim, naming states alterable and what happens on disagreement",
      "Named on-call oversight roster",
      "Stop-action drill records",
      "Override event log with timestamps",
    ],
    operationalSurface:
      "Halt and escalation control panel, specified by the intervention specification behind each oversight claim",
  },
  {
    controlId: "CTRL-02",
    topic: "risk controls before deployment",
    metaDescription:
      "Risk management shown before deployment and at major changes, mapped to EU AI Act Article 9, NIST AI RMF MAP 1.4 and MEASURE 2.2, and ISO/IEC 42001.",
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
    topic: "post-market monitoring and incidents",
    metaDescription:
      "Post-market monitoring and incident reporting on response clocks, mapped to EU AI Act Articles 72 and 73, NIST AI RMF MANAGE 3.3 and 4.1, and ISO/IEC 42001.",
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
    topic: "decision records for appeals",
    metaDescription:
      "Decision records that let an affected decision be rebuilt and challenged, mapped to EU AI Act Article 12, NIST AI RMF MEASURE 2.11, and ISO/IEC 42001 clause 7.5.",
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
  {
    controlId: "CTRL-05",
    topic: "authority grants that expire",
    metaDescription:
      "Authority grants that expire unless renewed on evidence, mapped to EU AI Act Articles 9 and 14, NIST AI RMF GOVERN 1.1 to 1.3 and MANAGE 2.2, and ISO/IEC 42001.",
    obligation:
      "Hold authority grants as evidenced, scoped, stateful leases that expire or renew on evidence rather than on silence.",
    euAiAct: "Articles 14 and 9 (Human oversight; risk management system)",
    nistAiRmf: "GOVERN 1.1 to 1.3, MANAGE 2.2",
    iso42001: "Clause 6.1 and 8 (Risk actions and operation)",
    evidenceArtifacts: [
      "Grant register export with state and full state history",
      "Renewal records naming what was examined and who looked",
      "Expansion transitions with their own evidence basis",
    ],
    operationalSurface: "Authority grant register and renewal review queue",
  },
  {
    controlId: "CTRL-06",
    topic: "policy records with review triggers",
    metaDescription:
      "Policy records with review triggers and an expiry date, mapped to EU AI Act Article 9(2), NIST AI RMF MANAGE 4.1 to 4.3, and ISO/IEC 42001 clauses 9.1 and 10.",
    obligation:
      "Carry every policy a grant relies on as a record with provenance, review triggers, and an expiry that ends its authority to justify.",
    euAiAct: "Article 9(2) (Continuous iterative risk management)",
    nistAiRmf: "MANAGE 4.1 to 4.3",
    iso42001: "Clause 9.1 and 10 (Monitoring and improvement)",
    evidenceArtifacts: [
      "Policy register export with review triggers and expiry dates",
      "Trigger-fire log with the resulting status change and elapsed time",
      "Dependent-grant transitions opened by a policy moving to review",
    ],
    operationalSurface:
      "Policy register with trigger monitoring and expiry alerts",
  },
  {
    controlId: "CTRL-07",
    topic: "dependence and withdrawal rehearsal",
    metaDescription:
      "Measured dependence and rehearsed withdrawal before scope grows, mapped to EU AI Act Articles 9 and 72, NIST AI RMF GOVERN 1.7 and MANAGE 2.4, and ISO/IEC 42001.",
    obligation:
      "Measure dependence and reversibility, rehearse withdrawal, and preserve the capacities to replace the system before scope expands.",
    euAiAct: "Articles 9 and 72 (Risk management; post-market monitoring)",
    nistAiRmf: "GOVERN 1.7, MANAGE 2.4",
    iso42001: "Clause 6.1 and 8.4 (Risk actions and third-party provision)",
    evidenceArtifacts: [
      "Dependency ledger with exposure score inputs",
      "Withdrawal rehearsal report per reversibility level",
      "Preserved capacities list with named owners",
    ],
    operationalSurface: "Dependency ledger and withdrawal rehearsal schedule",
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
