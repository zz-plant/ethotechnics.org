import type { EvalTestCase, EvalSuite } from "../../content/evals";
import type { TestCaseResult, RunSummary } from "./types";
import { maxScoreForScale } from "./config";

export const buildEmptyResults = (
  testCases: EvalTestCase[],
): TestCaseResult[] =>
  testCases.map((tc) => ({
    testCaseId: tc.id,
    score: 0,
    maxScore: maxScoreForScale(tc.scoringRubric.scale),
    passed: false,
    evidence: "",
    notes: "",
  }));

export const calculatePass = (score: number, maxScore: number): boolean => {
  if (maxScore === 0) return false;
  const threshold = maxScore <= 1 ? 1 : Math.ceil(maxScore * 0.6);
  return score >= threshold;
};

export const getGradeFromScore = (
  aggregateScore: number,
  suite: EvalSuite,
): "PASS" | "CONDITIONAL" | "FAIL" => {
  const { passingScore, failureThreshold } = suite.scoringMethod;
  if (aggregateScore >= passingScore) return "PASS";
  if (aggregateScore >= failureThreshold) return "CONDITIONAL";
  return "FAIL";
};

export const computeAggregateScore = (
  results: Pick<TestCaseResult, "score" | "maxScore">[],
): number => {
  const maxTotal = results.reduce((sum, r) => sum + r.maxScore, 0);
  const scoreTotal = results.reduce((sum, r) => sum + r.score, 0);
  return maxTotal > 0 ? Math.round((scoreTotal / maxTotal) * 100) : 0;
};

export const buildSummary = (
  results: TestCaseResult[],
  suite: EvalSuite,
  systemName: string,
): RunSummary => {
  const aggregateScore = computeAggregateScore(results);
  const grade = getGradeFromScore(aggregateScore, suite);

  return {
    suiteTitle: suite.title,
    systemName,
    completedAt: new Date().toISOString(),
    aggregateScore,
    grade,
    results: results.map((r) => ({
      ...r,
      passed: calculatePass(r.score, r.maxScore),
    })),
  };
};
