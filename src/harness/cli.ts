#!/usr/bin/env bun
/**
 * Runs the Tier 1 governance harness against a system and writes a report.
 *
 * Without arguments it runs the twelve checks against the reference system
 * (src/harness/reference.ts) so the tool works out of the box:
 *
 *   bun run eval:harness
 *
 * To run against a real deployment, pass a module that default-exports (or
 * exports `adapter`) your GovernanceAdapter — an object or a factory:
 *
 *   bun run eval:harness ./adapters/production.ts
 *   bun run eval:harness --out ./eval-reports ./adapters/production.ts
 *
 * The formatted report goes to stdout; JSON and Markdown copies are written to
 * the out directory. Exit status is 0 only when the grade is PASS.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { formatReport, runGovernanceHarness } from "./run";
import type { GovernanceAdapter, HarnessOptions } from "./types";

function flagValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function numberFlag(name: string, fallback: number): number {
  const value = flagValue(name);
  const parsed = value === undefined ? NaN : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function loadAdapter(spec: string): Promise<GovernanceAdapter> {
  const isPath = spec.startsWith(".") || spec.startsWith("/");
  const moduleUrl = isPath
    ? pathToFileURL(resolve(process.cwd(), spec)).href
    : spec;
  try {
    const mod = (await import(moduleUrl)) as Record<string, unknown>;
    const candidate = mod.default ?? (mod as { adapter?: unknown }).adapter;
    const adapter =
      typeof candidate === "function"
        ? (candidate as () => GovernanceAdapter)()
        : (candidate as GovernanceAdapter);
    if (!adapter || typeof adapter.systemName !== "string") {
      throw new Error(
        `${spec} does not export a GovernanceAdapter as default (or as 'adapter')`,
      );
    }
    return adapter;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`could not load adapter '${spec}': ${reason}`, {
      cause: error,
    });
  }
}

const DEFAULT_ADAPTER = join(import.meta.dir, "reference.ts");

const adapterSpec =
  process.argv
    .slice(2)
    .find((arg) => !arg.startsWith("-") && !arg.startsWith("eval:harness")) ??
  DEFAULT_ADAPTER;

const options: HarnessOptions = {
  stopLatencyBudgetMs: numberFlag("--stop-latency-ms", 30_000),
  interruptLatencyBudgetMs: numberFlag("--interrupt-ms", 5_000),
  estimateTolerance: numberFlag("--tolerance", 0.5),
  sequentialInteractions: numberFlag("--interactions", 8),
  grantTransitionBudgetMs: numberFlag("--grant-transition-ms", 5_000),
};

let adapter: GovernanceAdapter;
try {
  adapter = await loadAdapter(adapterSpec);
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
}
const report = await runGovernanceHarness(adapter, options);
const formatted = formatReport(report);
process.stdout.write(`${formatted}\n`);

const outDir = flagValue("--out") ?? "eval-reports";
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const safeName = report.systemName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, `${safeName}-${stamp}.json`), JSON.stringify(report, null, 2));
await writeFile(join(outDir, `${safeName}-${stamp}.md`), `${formatted}\n`);

if (report.grade !== "PASS") process.exit(1);