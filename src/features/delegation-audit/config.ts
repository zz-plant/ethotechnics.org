import type {
  ActionClass,
  AuditInput,
  Dependent,
  Reference,
  StateVariableId,
} from "./types";

export const STATE_VARIABLE_LABELS: Record<StateVariableId, string> = {
  capability: "Capability",
  authority: "Authority",
  evidence: "Evidence",
  dependency: "Dependency",
  standing: "Standing",
  correction: "Correction",
};

export const STATE_VARIABLE_QUESTIONS: Record<StateVariableId, string> = {
  capability: "What can this system actually do in this workflow?",
  authority:
    "Which of those actions is it currently permitted to take, for whom, and until when?",
  evidence:
    "What has to be true for that permission to make sense, and when was it last checked?",
  dependency:
    "What now depends on this system, and how hard would it be to stop using it?",
  standing: "Who bears the errors, and can they make the system answer?",
  correction: "Can you stop it, and can the institution carry on if you do?",
};

export const CLAUSE_REFS = {
  capabilityCatalog: {
    label: "STD-08 §1.3 expansion is a new authorization",
    href: "/standards/std-08-delegation",
  },
  renewalBurden: {
    label: "STD-08 §1.1 renewal burden scales",
    href: "/standards/std-08-delegation",
  },
  silenceNotRenewal: {
    label: "STD-08 §1.2 silence is not renewal",
    href: "/standards/std-08-delegation",
  },
  policyIsRecord: {
    label: "STD-08 §2.1 policy is a record",
    href: "/standards/std-08-delegation",
  },
  expiryEndsJustification: {
    label: "STD-08 §2.5 expiry ends justification",
    href: "/standards/std-08-delegation",
  },
  interventionSpec: {
    label: "STD-08 §3.1 every oversight claim resolves to a specification",
    href: "/standards/std-08-delegation",
  },
  correctionCapacity: {
    label: "STD-08 §4.1 correction capacity is stated",
    href: "/standards/std-08-delegation",
  },
  practicalAbility: {
    label: "STD-08 §4.4 practical ability is evidenced",
    href: "/standards/std-08-delegation",
  },
  dependencyRecord: {
    label: "STD-06 §5.1 the dependency record",
    href: "/standards/std-06-human-impact-safety-case",
  },
  exposureScore: {
    label: "STD-06 §5.2 the exposure score",
    href: "/standards/std-06-human-impact-safety-case",
  },
  reversibilityLevels: {
    label: "STD-06 §5.3 reversibility at three levels",
    href: "/standards/std-06-human-impact-safety-case",
  },
  preservedCapacities: {
    label: "STD-06 §5.4 preserved capacities",
    href: "/standards/std-06-human-impact-safety-case",
  },
} as const satisfies Record<string, Reference>;

export const MECHANISM_REFS = {
  grantRegister: {
    label: "MEC-13 Authority grant register",
    href: "/mechanisms/patterns/authority-grant-register",
  },
  policyTriggers: {
    label: "MEC-14 Policy review triggers",
    href: "/mechanisms/patterns/policy-review-triggers",
  },
  withdrawalRehearsal: {
    label: "MEC-15 Withdrawal rehearsal",
    href: "/mechanisms/patterns/withdrawal-rehearsal",
  },
  interventionSpec: {
    label: "MEC-16 Intervention specification",
    href: "/mechanisms/patterns/intervention-specification",
  },
  capabilityCatalog: {
    label: "MEC-17 Capability catalog",
    href: "/mechanisms/patterns/capability-catalog",
  },
  dependencyLedger: {
    label: "MEC-18 Dependency ledger",
    href: "/mechanisms/patterns/dependency-ledger",
  },
  expansionReview: {
    label: "MEC-19 Expansion review",
    href: "/mechanisms/patterns/expansion-review",
  },
} as const satisfies Record<string, Reference>;

export const EVAL_REFS = {
  delegationValidity: {
    label: "Delegation Validity Evals",
    href: "/evals/delegation-validity",
  },
  dependenceReversibility: {
    label: "Dependence and Reversibility Evals",
    href: "/evals/dependence-reversibility",
  },
  standing: {
    label: "Standing Evals",
    href: "/evals/standing",
  },
  meaningfulControl: {
    label: "Meaningful Control Evals",
    href: "/evals/meaningful-control",
  },
} as const satisfies Record<string, Reference>;

export const EXPIRY_OPTIONS: { value: ActionClass["expiry"]; label: string }[] =
  [
    { value: "stated", label: "It ends on a stated date or condition" },
    { value: "automatic", label: "It carries on unless someone stops it" },
    { value: "none", label: "No end and no condition was ever written down" },
  ];

export const RECENCY_OPTIONS: {
  value: ActionClass["lastChecked"];
  label: string;
}[] = [
  { value: "recent", label: "Within the last 3 months" },
  { value: "this-year", label: "Within the last 12 months" },
  { value: "stale", label: "More than 12 months ago" },
  { value: "never", label: "Never, or nobody knows" },
];

export const DEPENDENT_KIND_OPTIONS: {
  value: Dependent["kind"];
  label: string;
}[] = [
  { value: "workflow", label: "Workflow" },
  { value: "role", label: "Role" },
  { value: "customer", label: "Customer" },
  { value: "downstream_software", label: "Downstream software" },
];

export const CRITICALITY_OPTIONS: {
  value: Dependent["criticality"];
  label: string;
}[] = [
  { value: "low", label: "Low: it would barely notice" },
  { value: "medium", label: "Medium: it would slow down" },
  { value: "high", label: "High: it would need a workaround the same week" },
  { value: "critical", label: "Critical: it would stop" },
];

export const EXPOSURE_UNITS =
  "Exposure score = dependency depth (count of high and critical dependents) × substitution cost (staff-weeks) × correction latency (hours). The product is read as workflow staff-week hours.";

const buildActionClass = (
  id: string,
  fields: Partial<ActionClass> = {},
): ActionClass => ({
  id,
  name: "",
  authorizer: "",
  evidenceBasis: "",
  forWhom: "",
  expiry: "automatic",
  lastChecked: "never",
  ...fields,
});

export const createActionClass = (id: string): ActionClass =>
  buildActionClass(id);

export const createDependent = (id: string): Dependent => ({
  id,
  kind: "workflow",
  name: "",
  criticality: "medium",
});

export const buildDefaultInput = (): AuditInput => ({
  workflow: "Refund decisions in the support queue",
  capabilityListSeparate: "no",
  actionClasses: [
    buildActionClass("ac-1", {
      name: "Approve a refund up to 200",
      authorizer: "Support operations lead",
      evidenceBasis: "Pilot accuracy review, March",
      forWhom: "Retail customers in the EU",
      expiry: "automatic",
      lastChecked: "stale",
    }),
    buildActionClass("ac-2", {
      name: "Close a dispute without a human reading it",
      authorizer: "",
      evidenceBasis: "",
      forWhom: "Retail customers in the EU",
      expiry: "none",
      lastChecked: "never",
    }),
  ],
  policyReviewTrigger: "no",
  policyExpiry: "no",
  dependents: [
    {
      id: "dep-1",
      kind: "workflow",
      name: "Tier 1 support queue",
      criticality: "critical",
    },
    {
      id: "dep-2",
      kind: "role",
      name: "Dispute handlers",
      criticality: "high",
    },
  ],
  substitutionCostStaffWeeks: 6,
  correctionLatencyHours: 48,
  alternativeExercised: "stale",
  errorBearingParties:
    "Customers whose refund is refused, and the two handlers who fix the mistakes",
  canRaise: "via-staff",
  namedResponder: "no",
  responseDeadline: "no",
  challengeEffect: "own-case",
  canStop: "untested",
  institutionKeepsFunctioning: "degraded",
  expertiseRetained: "held",
});
