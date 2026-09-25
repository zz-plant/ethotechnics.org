import { describe, expect, it } from "bun:test";
import {
  computeCohensKappa,
  evaluateJudgeCalibration,
  GOLDEN_CALIBRATION_DATASET,
  type CalibrationEvaluation,
} from "./calibration";

describe("Evaluation Calibration & Inter-Rater Reliability (Cohen's Kappa)", () => {
  it("calculates perfect agreement (kappa = 1.0)", () => {
    const raterA = ["PASS", "FAIL", "PASS", "FAIL", "PARTIAL"];
    const raterB = ["PASS", "FAIL", "PASS", "FAIL", "PARTIAL"];

    const result = computeCohensKappa(raterA, raterB);
    expect(result.kappa).toBe(1.0);
    expect(result.observedAgreement).toBe(100);
    expect(result.interpretation).toBe("almost_perfect");
  });

  it("calculates chance / poor agreement correctly", () => {
    const raterA = ["PASS", "PASS", "FAIL", "FAIL"];
    const raterB = ["FAIL", "FAIL", "PASS", "PASS"];

    const result = computeCohensKappa(raterA, raterB);
    expect(result.kappa).toBeLessThan(0);
    expect(result.interpretation).toBe("slight_or_poor");
  });

  it("validates a well-calibrated judge against the golden dataset", () => {
    // Simulate a judge that matches all gold human verdicts
    const alignedEvaluations: CalibrationEvaluation[] =
      GOLDEN_CALIBRATION_DATASET.map((gold) => ({
        id: gold.id,
        score: gold.goldHumanScore,
        verdict: gold.goldHumanVerdict,
      }));

    const report = evaluateJudgeCalibration(alignedEvaluations);
    expect(report.totalItems).toBe(12);
    expect(report.cohensKappa).toBe(1.0);
    expect(report.criticalFalsePassCount).toBe(0);
    expect(report.passedCalibration).toBe(true);
  });

  it("fails calibration when a judge commits a critical false pass", () => {
    // Judge gets 11 right, but marks CALIB-001 (critical off-the-clock labor) as PASS
    const unsafeEvaluations: CalibrationEvaluation[] =
      GOLDEN_CALIBRATION_DATASET.map((gold) => ({
        id: gold.id,
        score: gold.id === "CALIB-001" ? 3 : gold.goldHumanScore,
        verdict: gold.id === "CALIB-001" ? "PASS" : gold.goldHumanVerdict,
      }));

    const report = evaluateJudgeCalibration(unsafeEvaluations);
    expect(report.criticalFalsePassCount).toBe(1);
    expect(report.passedCalibration).toBe(false);
  });

  it("fails calibration when kappa is below the substantial agreement threshold (0.60)", () => {
    // Judge answers PASS to everything (indiscriminate bias)
    const indiscriminateEvaluations: CalibrationEvaluation[] =
      GOLDEN_CALIBRATION_DATASET.map((gold) => ({
        id: gold.id,
        score: 3,
        verdict: "PASS",
      }));

    const report = evaluateJudgeCalibration(indiscriminateEvaluations);
    expect(report.cohensKappa).toBeLessThan(0.6);
    expect(report.passedCalibration).toBe(false);
  });
});
