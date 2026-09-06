export type Answer3 = "yes" | "partial" | "no";

export type ExpiryAnswer = "stated" | "automatic" | "none";

export type RecencyAnswer = "recent" | "this-year" | "stale" | "never";

export type ActionClass = {
  id: string;
  name: string;
  authorizer: string;
  evidenceBasis: string;
  forWhom: string;
  expiry: ExpiryAnswer;
  lastChecked: RecencyAnswer;
};

export type DependentKind =
  "workflow" | "role" | "customer" | "downstream_software";

export type Criticality = "low" | "medium" | "high" | "critical";

export type Dependent = {
  id: string;
  kind: DependentKind;
  name: string;
  criticality: Criticality;
};

export type AuditInput = {
  workflow: string;
  capabilityListSeparate: Answer3;
  actionClasses: ActionClass[];
  policyReviewTrigger: "yes" | "no" | "unknown";
  policyExpiry: "yes" | "no" | "unknown";
  dependents: Dependent[];
  substitutionCostStaffWeeks: number;
  correctionLatencyHours: number;
  alternativeExercised: RecencyAnswer;
  errorBearingParties: string;
  canRaise: "direct" | "via-staff" | "no";
  namedResponder: "yes" | "no";
  responseDeadline: "yes" | "no";
  challengeEffect: "system-state" | "own-case" | "none";
  canStop: "tested" | "untested" | "no";
  institutionKeepsFunctioning: "yes" | "degraded" | "no";
  expertiseRetained: "exercised" | "held" | "no";
};

export type StateVariableId =
  | "capability"
  | "authority"
  | "evidence"
  | "dependency"
  | "standing"
  | "correction";

export type Rating = "grounded" | "partial" | "weak";

export type VariableRating = {
  id: StateVariableId;
  label: string;
  score: number;
  rating: Rating;
  notes: string[];
};

export type ExposureBand = "none" | "contained" | "material" | "heavy";

export type ExposureScore = {
  dependencyDepth: number;
  substitutionCostStaffWeeks: number;
  correctionLatencyHours: number;
  score: number;
  band: ExposureBand;
  bandLabel: string;
  reading: string;
};

export type ReversibilityStatus =
  "evidenced" | "not-evidenced" | "not-feasible";

export type ReversibilityLevelId =
  "technical" | "operational" | "institutional";

export type ReversibilityLevel = {
  id: ReversibilityLevelId;
  label: string;
  status: ReversibilityStatus;
  reason: string;
};

export type ReversibilityVerdict = {
  levels: ReversibilityLevel[];
  weakest: ReversibilityLevel;
  summary: string;
};

export type UngroundedGrant = {
  actionClassId: string;
  actionClass: string;
  reasons: string[];
};

export type Reference = {
  label: string;
  href: string;
};

export type Finding = {
  id: string;
  variable: StateVariableId;
  title: string;
  detail: string;
  clause: Reference;
  mechanism: Reference;
  evalSuite: Reference;
};

export type AuditResult = {
  workflow: string;
  exposure: ExposureScore;
  variables: VariableRating[];
  ungroundedGrants: UngroundedGrant[];
  reversibility: ReversibilityVerdict;
  findings: Finding[];
};
