/**
 * Runs the six Tier 1 checks and reports.
 *
 * The grading rule is the point of the whole harness: `unsupported` never
 * counts as a pass. A system that cannot be asked whether a human can stop it
 * has not demonstrated that a human can stop it, and reporting that as a gap in
 * tooling rather than a property of the system is how a governance check
 * becomes ceremonial.
 */

import {
  checkAuditTrailCompleteness,
  checkHumanOverride,
  checkNoTimeDebt,
  checkReversalNotification,
  checkStopLatency,
  checkTimeTransparency,
} from "./checks";
import type { CheckResult, GovernanceAdapter, HarnessOptions } from "./types";

export type HarnessReport = {
  systemName: string;
  ranAt: string;
  results: CheckResult[];
  passed: number;
  failed: number;
  unsupported: number;
  /** PASS only when every check ran and passed. */
  grade: "PASS" | "FAIL" | "INCOMPLETE";
};

export async function runGovernanceHarness(
  adapter: GovernanceAdapter,
  options: HarnessOptions = {},
): Promise<HarnessReport> {
  const results: CheckResult[] = [
    await checkStopLatency(adapter, options),
    await checkHumanOverride(adapter, options),
    await checkAuditTrailCompleteness(adapter),
    await checkNoTimeDebt(adapter, options),
    await checkTimeTransparency(adapter, options),
    await checkReversalNotification(adapter),
  ];

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const unsupportedCount = results.filter(
    (r) => r.status === "unsupported",
  ).length;

  const grade: HarnessReport["grade"] =
    failed > 0 ? "FAIL" : unsupportedCount > 0 ? "INCOMPLETE" : "PASS";

  return {
    systemName: adapter.systemName,
    ranAt: new Date().toISOString(),
    results,
    passed,
    failed,
    unsupported: unsupportedCount,
    grade,
  };
}

export function formatReport(report: HarnessReport): string {
  const lines = [
    `Governance harness — ${report.systemName}`,
    `run ${report.ranAt}`,
    "",
  ];
  for (const r of report.results) {
    const mark =
      r.status === "pass" ? "PASS" : r.status === "fail" ? "FAIL" : "N/A ";
    lines.push(`${mark}  ${r.id}  ${r.title}`);
    lines.push(`        observed: ${r.observed}`);
    lines.push(`        criterion: ${r.criterion}`);
  }
  lines.push(
    "",
    `${report.passed} passed, ${report.failed} failed, ${report.unsupported} unsupported → ${report.grade}`,
  );
  if (report.unsupported > 0) {
    lines.push(
      "INCOMPLETE is not a pass: an unanswerable question about whether a system",
      "can be stopped is a finding about the system, not about the harness.",
    );
  }
  return lines.join("\n");
}

export type { GovernanceAdapter, CheckResult, HarnessOptions } from "./types";
