import { describe, expect, it } from "bun:test";

import { evalTestCases } from "./eval-test-cases";
import { evalsContent } from "./evals";
import type { EvalLayer, EvalSuiteId, ScoringScale, TestStatus } from "./evals";
import { tier1Checks } from "../harness/checks";

/**
 * The eval content is published prose with numbers in it, and nothing used to
 * assert the numbers. The runners compute counts from the cases at render time,
 * so a suite that silently lost its cases would still list, would still build,
 * and would only be wrong on the page and in the JSON API. These tests hold the
 * content to the claims it publishes: case ids, suite wiring, and the totals in
 * the changelog.
 */

const STACK_LAYERS = evalsContent.evaluationStack.layers.map((l) => l.id);

const ID = /^[A-Z]+-\d+$/;

const SUITE_ID_PREFIX: Record<EvalSuiteId, string> = {
  "burden-distribution": "BUR",
  contestability: "CON",
  stoppability: "STP",
  "temporal-rights": "TEM",
  reversibility: "REV",
  explainability: "EXP",
  "agent-governance": "AGT",
  "cross-domain-burden": "XDB",
  "burden-concealment": "BCN",
  "delegation-validity": "DEL",
  "agent-chains": "CHN",
  "dependence-reversibility": "DEP",
  standing: "STA",
  "meaningful-control": "CTL",
};

const VALID_SCALES: ScoringScale[] = ["binary", "0-3", "0-5", "0-10"];
const VALID_STATUSES: TestStatus[] = ["draft", "stable", "deprecated"];

/** The published totals, held here so a case added or dropped is visible. */
const PUBLISHED_TOTALS = {
  "1.0.0": { suites: 8, cases: 89 },
  "1.1.0": { suites: 9, cases: 95 },
  "1.2.0": { suites: 13, cases: 139 },
  "1.3.0": { suites: 13, cases: 140 },
  "1.4.0": { suites: 14, cases: 142 },
};

const casesFor = (suiteId: EvalSuiteId) =>
  evalTestCases.filter((tc) => tc.suiteId === suiteId);

describe("eval suite catalogue", () => {
  it("has exactly the suites and cases the changelog publishes", () => {
    expect(evalsContent.suites).toHaveLength(PUBLISHED_TOTALS["1.4.0"].suites);
    expect(evalTestCases).toHaveLength(PUBLISHED_TOTALS["1.4.0"].cases);
  });

  it("has the published stable/draft split", () => {
    expect(
      evalsContent.suites.filter((s) => s.status === "stable"),
    ).toHaveLength(8);
    expect(
      evalsContent.suites.filter((s) => s.status === "draft"),
    ).toHaveLength(6);
  });

  it("gives every suite and case a unique id", () => {
    const suiteIds = evalsContent.suites.map((s) => s.id);
    expect(new Set(suiteIds).size).toBe(suiteIds.length);

    const caseIds = evalTestCases.map((tc) => tc.id);
    expect(new Set(caseIds).size).toBe(caseIds.length);
  });

  it("wires every case to a suite and leaves no suite empty", () => {
    const suiteIds = new Set(evalsContent.suites.map((s) => s.id));
    for (const tc of evalTestCases) {
      expect(suiteIds, `case ${tc.id} references an unknown suite`).toContain(
        tc.suiteId,
      );
    }
    for (const suite of evalsContent.suites) {
      expect(
        casesFor(suite.id).length,
        `suite ${suite.id} has no test cases`,
      ).toBeGreaterThan(0);
    }
  });

  it("numbers cases consecutively under the suite's prefix", () => {
    for (const suite of evalsContent.suites) {
      const prefix = SUITE_ID_PREFIX[suite.id];
      const cases = casesFor(suite.id)
        .map((tc) => {
          expect(tc.id, `case in ${suite.id} has a malformed id`).toMatch(ID);
          return tc.id;
        })
        .sort(
          (a, b) =>
            Number(a.slice(prefix.length + 1)) -
            Number(b.slice(prefix.length + 1)),
        );
      expect(cases[0], `suite ${suite.id} must start at -001`).toBe(
        `${prefix}-001`,
      );
      for (let index = 1; index < cases.length; index += 1) {
        const expected = `${prefix}-${String(index + 1).padStart(3, "0")}`;
        expect(cases[index], `suite ${suite.id} has a gap or duplicate`).toBe(
          expected,
        );
      }
    }
  });

  it("tags every suite and case with a real layer, and the stack's model layer stays empty by design", () => {
    for (const suite of evalsContent.suites) {
      expect(
        STACK_LAYERS,
        `suite ${suite.id} names an unknown layer`,
      ).toContain(suite.layer);
    }
    for (const tc of evalTestCases) {
      expect(STACK_LAYERS, `case ${tc.id} names an unknown layer`).toContain(
        tc.layer,
      );
      expect(
        tc.layer,
        `case ${tc.id} claims the unoccupied model layer`,
      ).not.toBe("model");
    }
    expect(evalsContent.suites.filter((s) => s.layer === "model")).toHaveLength(
      0,
    );
  });

  it("gives every case a valid status, severity and rubric", () => {
    for (const tc of evalTestCases) {
      expect(VALID_STATUSES, `case ${tc.id} has a bad status`).toContain(
        tc.status,
      );
      expect(
        ["critical", "high", "medium", "low"],
        `case ${tc.id} has a bad severity`,
      ).toContain(tc.severity);
      expect(VALID_SCALES, `case ${tc.id} has a bad scoring scale`).toContain(
        tc.scoringRubric.scale,
      );
      expect(tc.scoringRubric.anchors.length).toBeGreaterThan(1);
    }
  });

  it("keeps scoring methods coherent", () => {
    for (const suite of evalsContent.suites) {
      expect(
        ["weighted-average", "min-threshold", "all-must-pass"],
        `suite ${suite.id} has an unknown scoring method`,
      ).toContain(suite.scoringMethod.type);
      expect(
        suite.scoringMethod.passingScore,
        `suite ${suite.id} must pass before it fails`,
      ).toBeGreaterThanOrEqual(suite.scoringMethod.failureThreshold);
    }
  });
});

describe("machine-answerable coverage", () => {
  it("implements every Tier 1 check as a real case in the suite it names", () => {
    for (const check of tier1Checks) {
      const tc = evalTestCases.find((c) => c.id === check.id);
      expect(
        tc,
        `Tier 1 check ${check.id} is not a published test case`,
      ).toBeDefined();
      expect(
        tc?.suiteId,
        `Tier 1 check ${check.id} sits in the wrong suite`,
      ).toBe(check.suiteId);
    }
  });

  it("counts the machine-answerable cases the register page shows", () => {
    const perSuite = new Map<EvalSuiteId, number>();
    for (const check of tier1Checks) {
      perSuite.set(check.suiteId, (perSuite.get(check.suiteId) ?? 0) + 1);
    }
    expect(perSuite.get("stoppability")).toBe(1);
    expect(perSuite.get("agent-governance")).toBe(2);
    expect(perSuite.get("temporal-rights")).toBe(2);
    expect(perSuite.get("reversibility")).toBe(1);
    expect(perSuite.get("delegation-validity")).toBe(4);
    expect(perSuite.get("agent-chains")).toBe(2);
    expect(tier1Checks).toHaveLength(12);
  });
});
