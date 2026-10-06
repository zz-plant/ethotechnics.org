import {
  getStandardById,
  standardClauses,
  type StandardClause,
} from "./standards";

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
  /**
   * The Ethotechnics clauses the control rests on, as registry ids
   * ("STD-08.3.1"). A contract or audit plan cites these; the framework
   * references say which external obligation they bear on.
   */
  clauseIds: string[];
  /** Part of the mapped framework obligations that no clause covers. */
  notCovered?: string;
};

export const governanceCrosswalks: GovernanceCrosswalk[] = [
  {
    controlId: "CTRL-01",
    topic: "human oversight with stop authority",
    metaDescription:
      "Human oversight with a stop authority someone can use, mapped to EU AI Act Article 14, NIST AI RMF GOVERN 3.2 and MANAGE 2.4, and ISO/IEC 42001 clause 8.1.",
    obligation:
      "Maintain human oversight with exercisable stop authority for high-risk decisions.",
    euAiAct: "Article 14 (Human oversight)",
    nistAiRmf: "GOVERN 3.2, MANAGE 2.4",
    iso42001: "Clause 8.1 (Operational planning and control)",
    clauseIds: ["STD-08.3.1", "STD-08.3.3", "STD-06.1.3", "STD-06.2.3"],
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
      "Risk management shown before deployment and at major changes, mapped to EU AI Act Article 9, NIST AI RMF MANAGE 1.1 and 1.3, and ISO/IEC 42001.",
    obligation:
      "Demonstrate risk management and controls before deployment and at major changes.",
    euAiAct: "Article 9 (Risk management system)",
    nistAiRmf: "MANAGE 1.1, MANAGE 1.3, MEASURE 2.5",
    iso42001:
      "Clauses 6.1, 8.1, and 8.2 (Actions to address risks; operational planning and control; AI risk assessment)",
    clauseIds: [
      "STD-06.2.1",
      "STD-06.2.2",
      "STD-06.4.1",
      "STD-06.4.2",
      "STD-08.1.3",
    ],
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
      "Post-market monitoring and incident reporting on response clocks, mapped to EU AI Act Articles 72 and 73, NIST AI RMF MANAGE 4.1 and 4.3, and ISO/IEC 42001.",
    obligation:
      "Operate post-market monitoring and incident reporting with response clocks.",
    euAiAct:
      "Articles 72 and 73 (Post-market monitoring and incident reporting)",
    nistAiRmf: "MANAGE 4.1, MANAGE 4.3",
    iso42001: "Clauses 9.1 and 10.1 (Monitoring and improvement)",
    clauseIds: [
      "STD-06.2.4",
      "STD-06.3.2",
      "STD-06.3.3",
      "STD-02.5.2",
      "STD-08.2.7",
    ],
    notCovered:
      "No clause names who reports a serious incident to a market surveillance authority under EU AI Act Article 73, or by when. Those deadlines come from the Act. The incident workflow on the framework map is a process outline, not a clause.",
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
      "Decision records that let an affected decision be rebuilt and challenged, mapped to EU AI Act Article 12, NIST AI RMF MEASURE 2.8, and ISO/IEC 42001 clause 7.5.",
    obligation:
      "Provide traceability so affected decisions can be reconstructed and contested.",
    euAiAct: "Article 12 (Record-keeping)",
    nistAiRmf: "MEASURE 2.8, MEASURE 3.3",
    iso42001: "Clause 7.5 (Documented information)",
    clauseIds: [
      "STD-02.1.1",
      "STD-02.5.1",
      "STD-02.5.3",
      "STD-02.6.3",
      "STD-07.1.2",
      "STD-07.5.1",
    ],
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
      "Authority grants that expire unless renewed on evidence, mapped to EU AI Act Articles 9 and 14, NIST AI RMF GOVERN 1.3 and 1.5, and ISO/IEC 42001.",
    obligation:
      "Hold authority grants as evidenced, scoped, stateful leases that expire or renew on evidence rather than on silence.",
    euAiAct: "Articles 14 and 9 (Human oversight; risk management system)",
    nistAiRmf: "GOVERN 1.3, GOVERN 1.5",
    iso42001: "Clauses 6.1 and 8 (Risk actions and operation)",
    clauseIds: [
      "STD-07.2.2",
      "STD-08.1.1",
      "STD-08.1.2",
      "STD-08.1.3",
      "STD-08.1.4",
    ],
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
      "Policy records with review triggers and an expiry date, mapped to EU AI Act Article 9(2), NIST AI RMF GOVERN 1.5 and MANAGE 4.1, and ISO/IEC 42001.",
    obligation:
      "Carry every policy a grant relies on as a record with provenance, review triggers, and an expiry that ends its authority to justify.",
    euAiAct: "Article 9(2) (Continuous iterative risk management)",
    nistAiRmf: "GOVERN 1.5, MANAGE 4.1",
    iso42001: "Clauses 9.1 and 10 (Monitoring and improvement)",
    clauseIds: ["STD-08.2.1", "STD-08.2.3", "STD-08.2.4", "STD-08.2.5"],
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
    iso42001:
      "Clauses 6.1 and 8.1 (Actions to address risks; operational planning and control)",
    clauseIds: ["STD-06.5.1", "STD-06.5.3", "STD-06.5.4", "STD-06.5.6"],
    evidenceArtifacts: [
      "Dependency ledger with exposure score inputs",
      "Withdrawal rehearsal report per reversibility level",
      "Preserved capacities list with named owners",
    ],
    operationalSurface: "Dependency ledger and withdrawal rehearsal schedule",
  },
];

export type ResolvedClause = {
  id: string;
  /** "STD-08 §3.1" */
  label: string;
  /** "STD-08 v0.3.1 §3.1", the form a contract cites. */
  citation: string;
  href: string;
  clause: StandardClause;
};

/**
 * Resolve a registry id such as "STD-08.3.1" to its clause, its standard's
 * current version, and the standard's page. Undefined when the registry has
 * no such clause; crosswalks.test.ts fails on every id that does not resolve,
 * so a renumbered clause is caught before a page cites it.
 */
export const resolveClause = (clauseId: string): ResolvedClause | undefined => {
  const standardId = clauseId.split(".")[0] ?? "";
  const clause = standardClauses[standardId]?.find(
    (entry) => entry.id === clauseId,
  );
  const standard = getStandardById(standardId);
  if (!clause || !standard) {
    return undefined;
  }
  return {
    id: clauseId,
    label: `${standardId} ${clause.displayId}`,
    citation: `${standardId} v${standard.version} ${clause.displayId}`,
    href: `/standards/${standard.slug}`,
    clause,
  };
};

export type EuAiActArticleCoverage = {
  article: string;
  title: string;
  /** Registry ids of the clauses that bear on the article. */
  clauseIds: string[];
  /** What those clauses require that the article also asks for. */
  covers: string;
  /** What the article requires that no clause covers. */
  leaves: string;
};

/**
 * The EU AI Act row of the framework map, article by article. Paragraph
 * references were checked against the consolidated text of Regulation (EU)
 * 2024/1689 as amended by Regulation (EU) 2026/1744.
 */
export const euAiActArticleCoverage: EuAiActArticleCoverage[] = [
  {
    article: "Article 9",
    title: "Risk management system",
    clauseIds: [
      "STD-06.2.1",
      "STD-06.2.2",
      "STD-06.4.1",
      "STD-06.4.2",
      "STD-08.2.3",
      "STD-08.2.4",
    ],
    covers:
      "Tests run before launch against thresholds declared before each test, which Article 9(8) also asks for. A register of do-not-deploy boundaries, where an active breach stops the launch. Policy review triggers that send dependent grants back to review.",
    leaves:
      "How risks are identified, estimated, and evaluated (9(2)). The judgment that residual risk is acceptable (9(5)). The attention to minors and other vulnerable groups (9(9)).",
  },
  {
    article: "Article 12",
    title: "Record-keeping",
    clauseIds: [
      "STD-07.1.1",
      "STD-07.1.2",
      "STD-07.5.1",
      "STD-02.5.3",
      "STD-02.6.3",
    ],
    covers:
      "Records that are never edited and carry a hash of their content, with the moment a record describes kept apart from the moment it was written. An audit trail from each contested decision to its evidence, reviewers, and outcome, kept tamper-evident through the appeal period and the limitation window.",
    leaves:
      "The logging capability built into the system (12(1)). The minimum log contents for remote biometric identification under Annex III, point 1(a) (12(3)).",
  },
  {
    article: "Article 14",
    title: "Human oversight",
    clauseIds: [
      "STD-08.3.1",
      "STD-08.3.3",
      "STD-08.3.5",
      "STD-06.1.3",
      "STD-06.2.3",
    ],
    covers:
      "Each claim that a person oversees a decision, resolved to what that person sees, can prevent, and can alter. An approval that can alter nothing is recorded as advisory review, not as a control. Near-unanimous or too-fast approvals reopen the specification, which bears on the automation bias of 14(4)(b). One owner who can halt the deployment, and time to halt measured against a clock.",
    leaves:
      "Tools that let the overseer understand and interpret the output (14(4)(a) and (c)). Verification by two people for remote biometric identification (14(5)).",
  },
  {
    article: "Article 72",
    title: "Post-market monitoring",
    clauseIds: ["STD-06.2.4", "STD-06.3.2", "STD-02.5.2", "STD-08.2.7"],
    covers:
      "Error, reversal, and remedy rates for each affected population on a declared cadence, from the operator's own records. Evidence carries the date it was refreshed and is reported as stale when it is. Appeal and reversal rates are published. Evidence held anywhere in the institution counts as a fired review trigger.",
    leaves:
      "The post-market monitoring plan and its place in the technical documentation (72(3)).",
  },
  {
    article: "Article 73",
    title: "Reporting of serious incidents",
    clauseIds: [],
    covers:
      "Nothing. No clause names who reports a serious incident to a market surveillance authority, or by when.",
    leaves: "All of it: the duty to report and its deadlines.",
  },
];

export const evidencePackMinimumSet = [
  "Policy record with approver and revision date",
  "Risk register slice for the affected workflow",
  "Latest test results, against thresholds declared before the tests ran",
  "Human-oversight and escalation logs",
  "Incident ledger entries and repair outcomes",
];

export const postMarketWorkflow = [
  {
    stage: "Intake",
    outcome:
      "Record the incident class, severity, affected parties, and owner when the incident is opened.",
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
