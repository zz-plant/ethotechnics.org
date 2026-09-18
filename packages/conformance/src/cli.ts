#!/usr/bin/env node
/**
 * ethotechnics-conformance — grade an STD-07 record stream from the shell.
 *
 *   ethotechnics-conformance records.jsonl [--manifest manifest.json]
 *       [--declared-level N] [--as-of ISO] [--format text|json|github]
 *       [--fail-on blocking|finding|overclaim|never]
 *
 * Exit status is the verdict: 0 when nothing at or above the --fail-on
 * severity was found, 1 otherwise, 2 for a usage error. `--format github`
 * writes workflow-command annotations so findings land on the pull request.
 */
import { readFile } from "node:fs/promises";
import process from "node:process";

import {
  auditRecords,
  type ConformanceFinding,
  type ConformanceReport,
  type Severity,
} from "../../../src/features/record-conformance/conformance";

type Format = "text" | "json" | "github";
type FailOn = "blocking" | "finding" | "overclaim" | "never";

type Options = {
  records: string;
  manifest?: string;
  declaredLevel?: number;
  asOf?: string;
  format: Format;
  failOn: FailOn;
};

const USAGE = `usage: ethotechnics-conformance <records.jsonl> [options]

  --manifest <path>        The emitter's manifest; its declaration supplies
                           the claimed level.
  --declared-level <0-3>   The claimed level, when there is no manifest.
  --as-of <ISO 8601>       Grade clocks against this moment, not now.
  --format <text|json|github>   Default text. github emits annotations.
  --fail-on <blocking|finding|overclaim|never>
                           Default overclaim: fail when the stream earns less
                           than it declares, or carries a blocking finding.
  -h, --help
`;

const FORMATS = new Set<Format>(["text", "json", "github"]);
const FAIL_ON = new Set<FailOn>(["blocking", "finding", "overclaim", "never"]);

export function parseArgs(argv: string[]): Options | { error: string } {
  const options: Partial<Options> = { format: "text", failOn: "overclaim" };
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      i += 1;
      return value;
    };
    try {
      switch (arg) {
        case "-h":
        case "--help":
          return { error: "" };
        case "--manifest":
          options.manifest = next();
          break;
        case "--declared-level": {
          const level = Number(next());
          if (![0, 1, 2, 3].includes(level))
            return { error: "--declared-level must be 0, 1, 2, or 3" };
          options.declaredLevel = level;
          break;
        }
        case "--as-of":
          options.asOf = next();
          break;
        case "--format": {
          const format = next() as Format;
          if (!FORMATS.has(format))
            return { error: "--format must be text, json, or github" };
          options.format = format;
          break;
        }
        case "--fail-on": {
          const failOn = next() as FailOn;
          if (!FAIL_ON.has(failOn))
            return {
              error: "--fail-on must be blocking, finding, overclaim, or never",
            };
          options.failOn = failOn;
          break;
        }
        default:
          if (arg.startsWith("-")) return { error: `unknown option ${arg}` };
          positional.push(arg);
      }
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
  if (positional.length !== 1)
    return { error: "exactly one records file is required" };
  return { ...options, records: positional[0]! } as Options;
}

const SEVERITY_RANK: Record<Severity, number> = {
  blocking: 3,
  finding: 2,
  note: 1,
};

/** Whether the report fails under the chosen policy. */
export function shouldFail(report: ConformanceReport, failOn: FailOn): boolean {
  if (failOn === "never") return false;
  const worst = Math.max(
    0,
    ...report.findings.map((finding) => SEVERITY_RANK[finding.severity]),
  );
  if (failOn === "finding") return worst >= SEVERITY_RANK.finding;
  if (failOn === "blocking") return worst >= SEVERITY_RANK.blocking;
  // overclaim: a blocking finding, or an earned level below the declared one.
  if (worst >= SEVERITY_RANK.blocking) return true;
  return (
    report.declaredLevel !== null &&
    report.earnedLevel !== null &&
    report.earnedLevel < report.declaredLevel
  );
}

export function formatText(report: ConformanceReport): string {
  const lines: string[] = [];
  lines.push(`Record conformance, as of ${report.asOf}`);
  lines.push(
    `${report.parsed} records parsed` +
      (report.rejected.length ? `, ${report.rejected.length} rejected` : ""),
  );
  const kinds = Object.entries(report.kinds)
    .map(([kind, count]) => `${kind} ${count}`)
    .join(", ");
  if (kinds) lines.push(`Kinds: ${kinds}`);
  lines.push("");
  lines.push(
    `Earned: ${report.earnedLabel}` +
      (report.declaredLevel !== null
        ? ` · Declared: Level ${report.declaredLevel}`
        : ""),
  );
  lines.push(report.verdict);
  if (report.manifestError) lines.push(`Manifest: ${report.manifestError}`);
  if (report.findings.length) {
    lines.push("");
    lines.push("Findings");
    for (const finding of report.findings) {
      lines.push(
        `- [${finding.severity}] ${finding.title}` +
          (finding.clause ? ` (${finding.clause})` : ""),
      );
      lines.push(`  ${finding.detail}`);
      if (finding.records.length) {
        const shown = finding.records.slice(0, 5).join(", ");
        const more =
          finding.records.length > 5
            ? ` and ${finding.records.length - 5} more`
            : "";
        lines.push(`  records: ${shown}${more}`);
      }
    }
  }
  if (report.blockedFrom.length) {
    lines.push("");
    for (const block of report.blockedFrom) {
      lines.push(`Level ${block.level} blocked: ${block.because}`);
    }
  }
  return lines.join("\n");
}

const ANNOTATION_LEVEL: Record<Severity, "error" | "warning" | "notice"> = {
  blocking: "error",
  finding: "warning",
  note: "notice",
};

const escapeAnnotation = (value: string) =>
  value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");

/** GitHub workflow commands, one per finding, then the text report. */
export function formatGithub(report: ConformanceReport, file: string): string {
  const lines: string[] = [];
  const annotate = (finding: ConformanceFinding) => {
    const title = escapeAnnotation(
      finding.clause ? `${finding.clause}: ${finding.title}` : finding.title,
    );
    const message = escapeAnnotation(
      finding.records.length
        ? `${finding.detail} Records: ${finding.records.slice(0, 5).join(", ")}`
        : finding.detail,
    );
    lines.push(
      `::${ANNOTATION_LEVEL[finding.severity]} file=${file},title=${title}::${message}`,
    );
  };
  for (const finding of report.findings) annotate(finding);
  lines.push("");
  lines.push(formatText(report));
  return lines.join("\n");
}

export async function run(argv: string[]): Promise<number> {
  const parsed = parseArgs(argv);
  if ("error" in parsed) {
    process.stderr.write(parsed.error ? `${parsed.error}\n\n${USAGE}` : USAGE);
    return parsed.error ? 2 : 0;
  }

  let text: string;
  try {
    text = await readFile(parsed.records, "utf8");
  } catch {
    process.stderr.write(`cannot read ${parsed.records}\n`);
    return 2;
  }
  let manifest: string | undefined;
  if (parsed.manifest) {
    try {
      manifest = await readFile(parsed.manifest, "utf8");
    } catch {
      process.stderr.write(`cannot read ${parsed.manifest}\n`);
      return 2;
    }
  }

  const report = await auditRecords(text, {
    declaredLevel: parsed.declaredLevel,
    asOf: parsed.asOf,
    manifest,
  });

  const output =
    parsed.format === "json"
      ? JSON.stringify(report, null, 2)
      : parsed.format === "github"
        ? formatGithub(report, parsed.records)
        : formatText(report);
  process.stdout.write(`${output}\n`);

  return shouldFail(report, parsed.failOn) ? 1 : 0;
}

const invokedDirectly =
  typeof process.argv[1] === "string" &&
  /cli\.(ts|js)$/.test(process.argv[1]) &&
  import.meta.url.endsWith(process.argv[1].split("/").pop() ?? "");

if (invokedDirectly) {
  run(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (error) => {
      process.stderr.write(`${(error as Error).message}\n`);
      process.exit(2);
    },
  );
}
