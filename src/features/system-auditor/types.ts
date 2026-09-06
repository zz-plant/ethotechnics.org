export type AutonomyTier = "advisory" | "semi-autonomous" | "autonomous";

export type DomainHazard = "low" | "medium" | "high" | "critical";

export type FailureRisk = {
  id: string;
  name: string;
  slug: string;
  severity: "high" | "medium" | "critical";
  confidence: number;
  trigger: string;
  remedy: string;
  standardRef: string;
};

export type QuantitativeSla = {
  timeToHaltSec: number;
  timeToRestoreHours: number;
  maxUserBurdenSteps: number;
  reversalSlaHours: number;
  humanSubstitutionCeilingPct: number;
};

export type SynthesizedGuardrails = {
  typescriptMiddleware: string;
  pythonGuard: string;
  jsonSchemaContract: string;
  legalSlaClause: string;
};

export type PolicyValidityAnswer = "yes" | "no" | "unknown";

export type ReviewRecency = "recent" | "this-year" | "stale" | "never";

export type ReversibilityEvidence = "evidenced" | "claimed" | "none";

export type GovernanceAnswers = {
  policyReviewTrigger: PolicyValidityAnswer;
  policyExpiry: PolicyValidityAnswer;
  policyLastReviewed: ReviewRecency;
  technicalReversibility: ReversibilityEvidence;
  operationalReversibility: ReversibilityEvidence;
  institutionalReversibility: ReversibilityEvidence;
  reviewerInformation: "sufficient" | "partial" | "none";
  actionsPreventable: "all" | "some" | "none";
  statesAlterable: "system" | "single-case" | "none";
  onDisagreement: "recorded-route" | "informal" | "nothing";
  costToExercise: "low" | "noticeable" | "career-cost";
};

export type AuditReport = {
  score: number; // 0 to 100 governance health score
  riskLevel: "Low Risk" | "Moderate Risk" | "Elevated Risk" | "Critical Risk";
  risksDetected: FailureRisk[];
  delegationFindings: FailureRisk[];
  slas: QuantitativeSla;
  guardrails: SynthesizedGuardrails;
  systemName: string;
  timestamp: string;
};

export type IndustryPreset = {
  id: string;
  title: string;
  description: string;
  domain: string;
  autonomyTier: AutonomyTier;
  hazardLevel: DomainHazard;
  samplePrompt: string;
};
