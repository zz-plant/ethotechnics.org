import { describe, expect, test } from "bun:test";
import { cases } from "../content/casebook";
import {
  caseForEachQuestion,
  decodeAnswers,
  encodeAnswers,
  scoreAnswers,
  selfTestQuestions,
  verdictLine,
} from "./self-test";

describe("self-test", () => {
  test("asks one question per state variable", () => {
    const variables = selfTestQuestions.map((q) => q.variable).sort();
    expect(variables).toEqual([
      "authority",
      "capability",
      "correction",
      "dependency",
      "evidence",
      "standing",
    ]);
  });

  test("round-trips answers through the hash", () => {
    const answers = ["y", "n", "u", undefined, "y", "n"] as const;
    const encoded = encodeAnswers([...answers]);
    expect(encoded).toBe("ynu-yn");
    expect(decodeAnswers(encoded)).toEqual([...answers]);
  });

  test("rejects malformed hashes", () => {
    expect(decodeAnswers("")).toBeUndefined();
    expect(decodeAnswers("yyyyyyy")).toBeUndefined();
    expect(decodeAnswers("yx")).toBeUndefined();
  });

  test("counts 'not sure' as drift", () => {
    const result = scoreAnswers(["y", "u", "n", "y", "y", "y"]);
    expect(result.complete).toBe(true);
    expect(result.holding).toBe(4);
    expect(result.drifting.map((q) => q.variable)).toEqual([
      "standing",
      "authority",
    ]);
  });

  test("verdict lines stay true to the casebook", () => {
    const robodebt = cases.find((entry) => entry.slug === "robodebt");
    const failed = robodebt?.findings.filter((f) => f.verdict === "failed");
    expect(failed?.length).toBe(4);
    expect(verdictLine(scoreAnswers(Array(6).fill("n")))).toContain(
      "Robodebt failed on four",
    );

    const driftedOnFourPlus = cases.filter(
      (entry) =>
        entry.findings.filter((f) => f.verdict !== "held").length >= 4,
    );
    expect(cases.length).toBe(5);
    expect(driftedOnFourPlus.length).toBe(4);
  });

  test("points each question at a real case, spread across the casebook", () => {
    const picks = caseForEachQuestion(cases);
    for (const question of selfTestQuestions) {
      const pick = picks.get(question.variable);
      expect(pick).toBeDefined();
      const finding = pick?.findings.find(
        (f) => f.variable === question.variable,
      );
      expect(finding?.verdict).not.toBe("held");
    }
    const distinct = new Set([...picks.values()].map((c) => c?.slug));
    expect(distinct.size).toBeGreaterThanOrEqual(4);
  });
});
