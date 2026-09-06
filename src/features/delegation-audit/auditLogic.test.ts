import { describe, expect, it } from "bun:test";
import { buildDefaultInput } from "./config";
import {
  assessReversibility,
  buildReadout,
  calculateExposureScore,
  countDependencyDepth,
  findUngroundedGrants,
  runDelegationAudit,
} from "./auditLogic";
import type { AuditInput } from "./types";

const withInput = (overrides: Partial<AuditInput>): AuditInput => ({
  ...buildDefaultInput(),
  ...overrides,
});

describe("calculateExposureScore", () => {
  it("multiplies depth, substitution cost, and correction latency", () => {
    const exposure = calculateExposureScore(
      withInput({
        dependents: [
          { id: "a", kind: "workflow", name: "A", criticality: "critical" },
          { id: "b", kind: "role", name: "B", criticality: "high" },
          { id: "c", kind: "customer", name: "C", criticality: "low" },
        ],
        substitutionCostStaffWeeks: 4,
        correctionLatencyHours: 12,
      }),
    );

    expect(exposure.dependencyDepth).toBe(2);
    expect(exposure.score).toBe(96);
    expect(exposure.band).toBe("contained");
  });

  it("counts only high and critical dependents as depth", () => {
    const depth = countDependencyDepth(
      withInput({
        dependents: [
          { id: "a", kind: "workflow", name: "A", criticality: "medium" },
          { id: "b", kind: "role", name: "B", criticality: "low" },
        ],
      }),
    );

    expect(depth).toBe(0);
  });

  it("returns zero and the no-exposure band when nothing is critical", () => {
    const exposure = calculateExposureScore(
      withInput({
        dependents: [],
        substitutionCostStaffWeeks: 40,
        correctionLatencyHours: 100,
      }),
    );

    expect(exposure.score).toBe(0);
    expect(exposure.band).toBe("none");
  });

  it("bands a large product as heavy", () => {
    const exposure = calculateExposureScore(
      withInput({
        dependents: [
          { id: "a", kind: "workflow", name: "A", criticality: "critical" },
          { id: "b", kind: "workflow", name: "B", criticality: "critical" },
        ],
        substitutionCostStaffWeeks: 20,
        correctionLatencyHours: 72,
      }),
    );

    expect(exposure.score).toBe(2880);
    expect(exposure.band).toBe("heavy");
  });
});

describe("assessReversibility", () => {
  const exposureFor = (input: AuditInput) => calculateExposureScore(input);

  it("evidences all three levels when each has been exercised", () => {
    const input = withInput({
      canStop: "tested",
      alternativeExercised: "recent",
      expertiseRetained: "exercised",
      institutionKeepsFunctioning: "yes",
      dependents: [],
    });
    const verdict = assessReversibility(input, exposureFor(input));

    expect(verdict.levels.map((level) => level.status)).toEqual([
      "evidenced",
      "evidenced",
      "evidenced",
    ]);
    expect(verdict.weakest.id).toBe("institutional");
    expect(verdict.summary).toContain("All three levels are evidenced");
  });

  it("records an untested stop as not evidenced rather than feasible", () => {
    const input = withInput({
      canStop: "untested",
      alternativeExercised: "recent",
      expertiseRetained: "exercised",
      institutionKeepsFunctioning: "yes",
      dependents: [],
    });
    const verdict = assessReversibility(input, exposureFor(input));

    expect(verdict.levels[0].status).toBe("not-evidenced");
    expect(verdict.weakest.id).toBe("technical");
  });

  it("calls out the institutional level as weakest when withdrawal is unsurvivable", () => {
    const input = withInput({
      canStop: "tested",
      alternativeExercised: "recent",
      expertiseRetained: "exercised",
      institutionKeepsFunctioning: "no",
    });
    const verdict = assessReversibility(input, exposureFor(input));

    expect(verdict.weakest.id).toBe("institutional");
    expect(verdict.weakest.status).toBe("not-feasible");
    expect(verdict.summary).toContain("not feasible");
  });

  it("marks operational reversibility not feasible when nobody can run the alternative", () => {
    const input = withInput({
      canStop: "tested",
      alternativeExercised: "recent",
      expertiseRetained: "no",
      institutionKeepsFunctioning: "yes",
      dependents: [],
    });
    const verdict = assessReversibility(input, exposureFor(input));

    expect(verdict.weakest.id).toBe("operational");
    expect(verdict.weakest.status).toBe("not-feasible");
  });

  it("withholds institutional evidence while exposure is heavy", () => {
    const input = withInput({
      canStop: "tested",
      alternativeExercised: "recent",
      expertiseRetained: "exercised",
      institutionKeepsFunctioning: "yes",
      dependents: [
        { id: "a", kind: "workflow", name: "A", criticality: "critical" },
      ],
      substitutionCostStaffWeeks: 30,
      correctionLatencyHours: 60,
    });
    const verdict = assessReversibility(input, exposureFor(input));

    expect(verdict.weakest.id).toBe("institutional");
    expect(verdict.weakest.status).toBe("not-evidenced");
  });
});

describe("findUngroundedGrants", () => {
  it("flags action classes with no authorizer or no evidence basis", () => {
    const ungrounded = findUngroundedGrants(buildDefaultInput());

    expect(ungrounded).toHaveLength(1);
    expect(ungrounded[0].actionClass).toBe(
      "Close a dispute without a human reading it",
    );
    expect(ungrounded[0].reasons).toContain("No authorizer is named.");
    expect(ungrounded[0].reasons).toContain("No evidence basis is recorded.");
  });

  it("ignores action classes that have not been named", () => {
    const ungrounded = findUngroundedGrants(
      withInput({
        actionClasses: [
          {
            id: "blank",
            name: "  ",
            authorizer: "",
            evidenceBasis: "",
            forWhom: "",
            expiry: "none",
            lastChecked: "never",
          },
        ],
      }),
    );

    expect(ungrounded).toHaveLength(0);
  });
});

describe("runDelegationAudit", () => {
  it("rates all six state variables and produces linked findings", () => {
    const result = runDelegationAudit(buildDefaultInput());

    expect(result.variables.map((variable) => variable.id)).toEqual([
      "capability",
      "authority",
      "evidence",
      "dependency",
      "standing",
      "correction",
    ]);
    expect(result.findings.length).toBeGreaterThan(0);
    for (const finding of result.findings) {
      expect(finding.clause.href).toStartWith("/standards/");
      expect(finding.mechanism.href).toStartWith("/mechanisms/patterns/");
      expect(finding.evalSuite.href).toStartWith("/evals/");
    }
  });

  it("rates a fully grounded delegation higher than a bare one", () => {
    const bare = runDelegationAudit(
      withInput({
        capabilityListSeparate: "no",
        actionClasses: [
          {
            id: "ac-1",
            name: "Decide",
            authorizer: "",
            evidenceBasis: "",
            forWhom: "",
            expiry: "none",
            lastChecked: "never",
          },
        ],
      }),
    );
    const grounded = runDelegationAudit(
      withInput({
        capabilityListSeparate: "yes",
        actionClasses: [
          {
            id: "ac-1",
            name: "Decide",
            authorizer: "Head of operations",
            evidenceBasis: "Accuracy review",
            forWhom: "EU customers",
            expiry: "stated",
            lastChecked: "recent",
          },
        ],
        policyReviewTrigger: "yes",
        policyExpiry: "yes",
      }),
    );

    const scoreOf = (
      result: ReturnType<typeof runDelegationAudit>,
      id: string,
    ) => result.variables.find((variable) => variable.id === id)?.score ?? 0;

    expect(scoreOf(grounded, "authority")).toBeGreaterThan(
      scoreOf(bare, "authority"),
    );
    expect(scoreOf(grounded, "evidence")).toBeGreaterThan(
      scoreOf(bare, "evidence"),
    );
    expect(scoreOf(grounded, "capability")).toBeGreaterThan(
      scoreOf(bare, "capability"),
    );
  });

  it("writes a readout that names the score, the weakest level, and the caveat", () => {
    const result = runDelegationAudit(buildDefaultInput());
    const readout = buildReadout(result, "2026-09-06T00:00:00.000Z");

    expect(readout).toContain("Delegation audit:");
    expect(readout).toContain("Exposure score:");
    expect(readout).toContain("Weakest level:");
    expect(readout).toContain("It is not an audit");
  });
});
