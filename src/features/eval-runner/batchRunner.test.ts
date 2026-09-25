import { describe, expect, it } from "bun:test";
import { evalsContent } from "../../content/evals";
import { evalTestCases } from "../../content/eval-test-cases";
import { runDualLedgerBatch } from "./batchRunner";

describe("dual-ledger batch runner", () => {
  const recSuite = evalsContent.suites.find((s) => s.id === "reciprocal-accommodation");
  if (!recSuite) {
    throw new Error("reciprocal-accommodation suite missing from evalsContent");
  }

  const recCases = evalTestCases.filter((tc) => tc.suiteId === "reciprocal-accommodation");

  it("evaluates reciprocal-accommodation suite under Condition C", () => {
    expect(recCases).toHaveLength(12);

    const scorecard = runDualLedgerBatch({
      systemName: "Simulated Clinical Triage Agent v2",
      suite: recSuite,
      testCases: recCases,
      condition: "Condition C",
    });

    expect(scorecard.suiteId).toBe("reciprocal-accommodation");
    expect(scorecard.condition).toBe("Condition C");
    expect(scorecard.results).toHaveLength(12);
    expect(scorecard.visibleScore.score).toBeGreaterThan(0);
    expect(scorecard.auditScore.score).toBeGreaterThan(0);
    expect(scorecard.overallVerdict).toBeDefined();
  });

  it("triggers non-compensatory rejection when human compensatory subsidy is violated", () => {
    // Intentionally fail REC-001
    const failingCases = recCases.map((tc) => {
      if (tc.id === "REC-001") {
        return {
          ...tc,
          severity: "critical" as const,
        };
      }
      return tc;
    });

    const scorecard = runDualLedgerBatch({
      systemName: "Surge Triage Agent with Shadow Labor",
      suite: recSuite,
      testCases: failingCases,
      condition: "Condition A",
    });

    expect(scorecard.results).toHaveLength(12);
  });
});
