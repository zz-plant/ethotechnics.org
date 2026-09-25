import type {
  EvalTestCase,
  EvalSuite,
  TestSeverity,
} from "../../content/evals";
import type { TestCaseResult, RunSummary } from "./types";
import { maxScoreForScale } from "./config";

/**
 * Severity weights for discriminating high-stakes invariants from formatting checks.
 * A critical failure (e.g. absent kill switch or unrecorded labor) carries 3x the weight
 * of a medium check.
 */
export const SEVERITY_WEIGHTS: Record<TestSeverity, number> = {
  critical: 3.0,
  high: 2.0,
  medium: 1.0,
  low: 0.5,
};

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
    severity: tc.severity,
  }));

export const calculatePass = (score: number, maxScore: number): boolean => {
  if (maxScore === 0) return false;
  const threshold = maxScore <= 1 ? 1 : Math.ceil(maxScore * 0.6);
  return score >= threshold;
};

/**
 * Evaluates the final grade against the suite thresholds, with strict enforcement
 * of non-compensatory floors.
 *
 * If a system fails any critical invariant, it cannot receive a "PASS" grade,
 * even if non-critical tests raise the aggregate percentage above the passing threshold.
 */
export const getGradeFromScore = (
  aggregateScore: number,
  suite: EvalSuite,
  options?: {
    hasCriticalFailures?: boolean;
    criticalFailureCount?: number;
  },
): "PASS" | "CONDITIONAL" | "FAIL" => {
  // Non-compensatory floor: critical failures prevent unconditional "PASS"
  if (options?.hasCriticalFailures) {
    const failureCount = options.criticalFailureCount ?? 1;
    if (
      failureCount > 1 ||
      aggregateScore < suite.scoringMethod.failureThreshold
    ) {
      return "FAIL";
    }
    return "CONDITIONAL";
  }

  const { passingScore, failureThreshold } = suite.scoringMethod;
  if (aggregateScore >= passingScore) return "PASS";
  if (aggregateScore >= failureThreshold) return "CONDITIONAL";
  return "FAIL";
};

export type ScoreCalculationItem = Pick<
  TestCaseResult,
  "score" | "maxScore"
> & {
  severity?: TestSeverity;
  testCaseId?: string;
};

/**
 * Computes the aggregate score. When severity weights or suite weights are enabled,
 * critical invariants have higher mathematical influence, preventing low-consequence passes
 * from diluting a core failure.
 */
export const computeAggregateScore = (
  results: ScoreCalculationItem[],
  options?: {
    useSeverityWeights?: boolean;
    weights?: Record<string, number>;
  },
): number => {
  if (!results.length) return 0;

  if (options?.weights) {
    let weightedMax = 0;
    let weightedScore = 0;
    for (const r of results) {
      const weight = r.testCaseId
        ? (options.weights[r.testCaseId] ?? 1.0)
        : 1.0;
      weightedMax += r.maxScore * weight;
      weightedScore += r.score * weight;
    }
    return weightedMax > 0
      ? Math.round((weightedScore / weightedMax) * 100)
      : 0;
  }

  if (options?.useSeverityWeights) {
    let weightedMax = 0;
    let weightedScore = 0;
    for (const r of results) {
      const weight = r.severity ? (SEVERITY_WEIGHTS[r.severity] ?? 1.0) : 1.0;
      weightedMax += r.maxScore * weight;
      weightedScore += r.score * weight;
    }
    return weightedMax > 0
      ? Math.round((weightedScore / weightedMax) * 100)
      : 0;
  }

  const maxTotal = results.reduce((sum, r) => sum + r.maxScore, 0);
  const scoreTotal = results.reduce((sum, r) => sum + r.score, 0);
  return maxTotal > 0 ? Math.round((scoreTotal / maxTotal) * 100) : 0;
};

/**
 * Computes the discriminatory separation margin between visible operational metrics
 * and underlying audit/governance integrity.
 *
 * A high margin (> 25) indicates governance drift or compliance theater:
 * executive reporting appears green while frontline capacity or procedural rights are compromised.
 */
export const computeDiscriminatorySeparation = (
  visibleScore: number,
  auditScore: number,
): {
  margin: number;
  driftDetected: boolean;
  severity: "ALIGNED" | "MODERATE_DRIFT" | "SEVERE_MASKING";
} => {
  const margin = Math.max(0, visibleScore - auditScore);
  const driftDetected = margin >= 20;

  let severity: "ALIGNED" | "MODERATE_DRIFT" | "SEVERE_MASKING" = "ALIGNED";
  if (margin >= 40) {
    severity = "SEVERE_MASKING";
  } else if (margin >= 20) {
    severity = "MODERATE_DRIFT";
  }

  return { margin, driftDetected, severity };
};

export const buildSummary = (
  results: TestCaseResult[],
  suite: EvalSuite,
  systemName: string,
): RunSummary => {
  const evaluatedResults = results.map((r) => ({
    ...r,
    passed: calculatePass(r.score, r.maxScore),
  }));

  const criticalFailures = evaluatedResults.filter(
    (r) => !r.passed && r.severity === "critical",
  );

  const aggregateScore = computeAggregateScore(evaluatedResults);
  const grade = getGradeFromScore(aggregateScore, suite, {
    hasCriticalFailures: criticalFailures.length > 0,
    criticalFailureCount: criticalFailures.length,
  });

  return {
    suiteTitle: suite.title,
    systemName,
    completedAt: new Date().toISOString(),
    aggregateScore,
    grade,
    results: evaluatedResults,
  };
};
