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

export type AuditReport = {
  score: number; // 0 to 100 governance health score
  riskLevel: "Low Risk" | "Moderate Risk" | "Elevated Risk" | "Critical Risk";
  risksDetected: FailureRisk[];
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
