import { describe, expect, it } from "bun:test";
import {
  assessDelegationPosture,
  auditSystemSpec,
  calculateSlas,
  defaultGovernanceAnswers,
  synthesizeCode,
} from "./analyzer";
import { industryPresets } from "./presets";

describe("System Auditor Analyzer", () => {
  it("detects failure risks in customer support preset", () => {
    const preset = industryPresets.find(
      (p) => p.id === "customer-support-refunds",
    )!;
    const report = auditSystemSpec(
      preset.samplePrompt,
      preset.autonomyTier,
      preset.hazardLevel,
      preset.title,
    );

    expect(report.risksDetected.length).toBeGreaterThan(0);
    const riskSlugs = report.risksDetected.map((r) => r.slug);
    expect(riskSlugs).toContain("unearned-closure");
    expect(report.slas.timeToHaltSec).toBeGreaterThan(0);
    expect(report.slas.reversalSlaHours).toBeGreaterThan(0);
  });

  it("calculates tighter SLAs for critical healthcare hazard", () => {
    const criticalSla = calculateSlas("critical", "autonomous");
    const lowSla = calculateSlas("low", "advisory");

    expect(criticalSla.timeToHaltSec).toBeLessThan(lowSla.timeToHaltSec);
    expect(criticalSla.reversalSlaHours).toBeLessThan(lowSla.reversalSlaHours);
    expect(criticalSla.maxUserBurdenSteps).toBeLessThanOrEqual(
      lowSla.maxUserBurdenSteps,
    );
  });

  it("synthesizes valid code guardrails and legal clauses", () => {
    const slas = calculateSlas("high", "semi-autonomous");
    const synthesized = synthesizeCode("UnderwritingBot", slas, []);

    expect(synthesized.typescriptMiddleware).toContain("DecisionObjectSchema");
    expect(synthesized.pythonGuard).toContain("DecisionObject");
    expect(synthesized.legalSlaClause).toContain("OPERATIONAL ACCOUNTABILITY");
    expect(synthesized.jsonSchemaContract).toContain("UnderwritingBot");
  });

  it("reports delegation findings without moving the health score", () => {
    const baseline = auditSystemSpec("A short policy.", "advisory", "low");
    const withAnswers = auditSystemSpec(
      "A short policy.",
      "advisory",
      "low",
      "AI Decision Pipeline",
      defaultGovernanceAnswers,
    );

    expect(baseline.delegationFindings).toHaveLength(0);
    expect(withAnswers.delegationFindings.length).toBeGreaterThan(0);
    expect(withAnswers.score).toBe(baseline.score);
  });
});

describe("assessDelegationPosture", () => {
  it("clears every finding when policy, reversibility, and intervention hold", () => {
    const findings = assessDelegationPosture({
      policyReviewTrigger: "yes",
      policyExpiry: "yes",
      policyLastReviewed: "recent",
      technicalReversibility: "evidenced",
      operationalReversibility: "evidenced",
      institutionalReversibility: "evidenced",
      reviewerInformation: "sufficient",
      actionsPreventable: "all",
      statesAlterable: "system",
      onDisagreement: "recorded-route",
      costToExercise: "low",
    });

    expect(findings).toHaveLength(0);
  });

  it("flags an unevidenced reversibility level and an approval-only reviewer", () => {
    const findings = assessDelegationPosture({
      ...defaultGovernanceAnswers,
      policyReviewTrigger: "yes",
      policyExpiry: "yes",
      policyLastReviewed: "recent",
      technicalReversibility: "evidenced",
      operationalReversibility: "claimed",
      institutionalReversibility: "evidenced",
      reviewerInformation: "sufficient",
      actionsPreventable: "all",
      statesAlterable: "none",
      onDisagreement: "recorded-route",
      costToExercise: "low",
    });

    const ids = findings.map((entry) => entry.id);
    expect(ids).toContain("reversibility-operationalReversibility");
    expect(ids).toContain("intervention-state");
    expect(findings).toHaveLength(2);
  });
});
