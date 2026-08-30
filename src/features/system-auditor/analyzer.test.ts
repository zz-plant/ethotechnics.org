import { describe, expect, it } from "bun:test";
import { auditSystemSpec, calculateSlas, synthesizeCode } from "./analyzer";
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

    expect(synthesized.typescriptMiddleware).toContain(
      "DecisionObjectSchema",
    );
    expect(synthesized.pythonGuard).toContain("DecisionObject");
    expect(synthesized.legalSlaClause).toContain("OPERATIONAL ACCOUNTABILITY");
    expect(synthesized.jsonSchemaContract).toContain("UnderwritingBot");
  });
});
