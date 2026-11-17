/**
 * Finds published copy that answers an objection no visitor has raised.
 *
 * The rule and the ledger of objections visitors have actually raised are in
 * docs/visitor-objections.md. That ledger is unrelated to the objections
 * process for the site's standards (docs/presence-automation.md).
 *
 * A sentence that matches a pattern below fails unless it carries a marker
 * naming a ledger id: `{/* objection: VO-001 *\/}` in MDX,
 * `<!-- objection: VO-001 -->` in Astro or HTML, `// objection: VO-001` in
 * TypeScript. The marker goes on a line the sentence occupies or the line
 * after it.
 */

import { readFile } from "node:fs/promises";

import { walkFiles } from "./walk";

export const LEDGER_PATH = "docs/visitor-objections.md";

/** Each pattern names one way copy presupposes a doubt. Case-insensitive. */
export const PRESUPPOSING_PATTERNS: ReadonlyArray<{
  kind: string;
  pattern: RegExp;
}> = [
  {
    kind: "mind-reading",
    pattern:
      /\byou (?:might|may) (?:be )?(?:wondering|wonder|think|thinking|worry|object|assume)\b|\byou(?:'re| are) probably (?:thinking|wondering)\b|\bworried (?:that|about)\b|\bbefore you ask\b/gi,
  },
  {
    kind: "reassurance",
    pattern:
      /\b(?:don'?t|do not) worry\b|\brest assured\b|\bno catch\b|\bno strings\b|\bno hidden\b/gi,
  },
  {
    kind: "motive denial",
    pattern:
      /\b(?:this|it) (?:isn'?t|is not) (?:a |an )?(?:sales )?(?:pitch|sales|ad|advertisement)\b|\bwe (?:won'?t|will not|never) (?:sell|spam)\b|\bnot another\b|\bwe(?:'re| are) not trying to\b|\b(?:this|that) (?:is not|isn'?t) (?:a claim that|to say)\b/gi,
  },
  {
    kind: "negation opener",
    pattern:
      /(?:^|[.!?]["'”’)]?\s+|\n\s*\n\s*|\n\s*[-*]\s+|>\s*|["`]\s*)not (?:a|an|another|just|only)\s|\bwhat (?:this|it|this \w+) (?:is not|isn'?t)\b|\bunlike (?:other|most|many|typical|traditional)\b/gi,
  },
  {
    kind: "self-justification",
    pattern:
      /\bwe (?:don'?t|do not|won'?t|will not) [^.!?]{0,100}?\bbecause\b/gi,
  },
];

/** Where the published copy lives. Tests, the eval harness, and generated wrappers are not copy. */
const SCAN_ROOTS = ["src"] as const;
const SCAN_EXTENSIONS = [".astro", ".mdx", ".md", ".ts", ".tsx", ".json"];
const SKIP = [
  /\.test\.tsx?$/,
  /^src\/test\//,
  /^src\/harness\//,
  /^src\/content\/generated\//,
];

/**
 * Files whose subject is what the discipline is not. Their negations answer
 * the essay's own argument, not a doubt it presupposes in the reader.
 */
export const EXEMPT_FILES: Record<string, string> = {
  "src/content/theory/what-ethotechnics-is-not.mdx":
    "an essay whose subject is the frameworks the discipline is distinguished from",
};

const MARKER = /objection:\s*(VO-\d+)/;

export type Finding = {
  file: string;
  line: number;
  kind: string;
  sentence: string;
  problem: "no marker" | "unknown id";
  id?: string;
};

/** Ledger ids from the table in docs/visitor-objections.md. */
export function parseLedgerIds(markdown: string): Set<string> {
  return new Set(
    [...markdown.matchAll(/^\|\s*(VO-\d+)\s*\|/gm)].map((match) => match[1]),
  );
}

const blank = (text: string) => text.replace(/[^\n]/g, " ");

/** Replace comments and thrown error messages with spaces, keeping offsets. */
function copyOnly(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank)
    .replace(/^\s*(?:\/\/|\/\*|\*).*$/gm, blank)
    .replace(/new Error\([^)]*\)/g, blank);
}

function sentenceSpan(text: string, index: number): [number, number] {
  let start = index;
  while (start > 0) {
    const previous = text.slice(Math.max(0, start - 2), start);
    if (/[.!?]\s$|\n\n$|[>"`]\s?$/.test(previous)) break;
    start -= 1;
  }
  const stop = text.slice(index).search(/[.!?](?=\s|["`<]|$)|[<"`]|\n\s*\n/);
  if (stop === -1) return [start, text.length];
  const end = index + stop;
  return [start, /[.!?]/.test(text[end]) ? end + 1 : end];
}

/** Findings in one file's text. `file` is used for reporting only. */
export function scanText(
  file: string,
  text: string,
  ledgerIds: Set<string>,
): Finding[] {
  const copy = copyOnly(text);
  const findings: Finding[] = [];
  const seen = new Set<number>();

  for (const { kind, pattern } of PRESUPPOSING_PATTERNS) {
    for (const match of copy.matchAll(new RegExp(pattern))) {
      const at = match.index + match[0].search(/[a-z]/i);
      const [start, end] = sentenceSpan(copy, at);
      if (seen.has(start)) continue;
      seen.add(start);

      const lineStart = text.lastIndexOf("\n", start) + 1;
      const afterEnd = text.indexOf("\n", end);
      const nextLineEnd =
        afterEnd === -1 ? text.length : text.indexOf("\n", afterEnd + 1);
      const window = text.slice(
        lineStart,
        nextLineEnd === -1 ? text.length : nextLineEnd,
      );
      const marker = window.match(MARKER);
      const line = text.slice(0, at).split("\n").length;
      const sentence = copy.slice(start, end).replace(/\s+/g, " ").trim();

      if (!marker) {
        findings.push({ file, line, kind, sentence, problem: "no marker" });
      } else if (!ledgerIds.has(marker[1])) {
        findings.push({
          file,
          line,
          kind,
          sentence,
          problem: "unknown id",
          id: marker[1],
        });
      }
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

/** Findings across the site's published copy, against the ledger on disk. */
export async function scanSite(): Promise<Finding[]> {
  const ledgerIds = parseLedgerIds(await readFile(LEDGER_PATH, "utf8"));
  const findings: Finding[] = [];
  for (const root of SCAN_ROOTS) {
    for (const file of await walkFiles(root, SCAN_EXTENSIONS)) {
      const path = file.replaceAll("\\", "/");
      if (SKIP.some((skip) => skip.test(path)) || EXEMPT_FILES[path]) continue;
      findings.push(...scanText(path, await readFile(file, "utf8"), ledgerIds));
    }
  }
  return findings;
}

export function formatFinding(finding: Finding): string {
  const reason =
    finding.problem === "unknown id"
      ? `marker names ${finding.id}, which is not in ${LEDGER_PATH}`
      : `${finding.kind}; rewrite it, or mark it with an id from ${LEDGER_PATH}`;
  return `${finding.file}:${finding.line}: ${reason}\n  ${finding.sentence}`;
}
