import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

type Finding = {
  file: string;
  line: number;
  message: string;
  snippet: string;
};

const ROOTS = ["src", "docs"];
const FILE_EXTENSIONS = new Set([".md", ".mdx", ".astro", ".html"]);
const HEADING_REGEX = /^(#{1,6})\s+(.+)$/gm;
const HTML_HEADING_REGEX = /<h([1-6])\b[^>]*>(.*?)<\/h\1>/gims;

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    const extension = entry.slice(entry.lastIndexOf("."));
    if (FILE_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLine(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function normalizeSnippet(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function checkMarkdownHeadings(file: string, content: string): Finding[] {
  const findings: Finding[] = [];
  let previousLevel = 0;

  for (const match of content.matchAll(HEADING_REGEX)) {
    const level = match[1].length;
    const index = match.index ?? 0;

    if (previousLevel > 0 && level > previousLevel + 1) {
      findings.push({
        file,
        line: getLine(content, index),
        message: `Heading level jumps from h${previousLevel} to h${level}.`,
        snippet: normalizeSnippet(match[0]),
      });
    }

    previousLevel = level;
  }

  return findings;
}

function checkHtmlHeadings(file: string, content: string): Finding[] {
  const findings: Finding[] = [];
  let previousLevel = 0;

  for (const match of content.matchAll(HTML_HEADING_REGEX)) {
    const level = Number(match[1]);
    const index = match.index ?? 0;

    if (previousLevel > 0 && level > previousLevel + 1) {
      findings.push({
        file,
        line: getLine(content, index),
        message: `Heading level jumps from h${previousLevel} to h${level}.`,
        snippet: normalizeSnippet(match[0]),
      });
    }

    previousLevel = level;
  }

  return findings;
}

function checkFile(file: string): Finding[] {
  const content = readFileSync(file, "utf8");
  return [
    ...checkMarkdownHeadings(file, content),
    ...checkHtmlHeadings(file, content),
  ];
}

const sourceFiles = ROOTS.flatMap((root) => walk(root));
const findings = sourceFiles.flatMap((file) => checkFile(file));

if (findings.length > 0) {
  console.error("Heading hierarchy guardrail failed:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} ${finding.message}`);
    console.error(`  ${finding.snippet}`);
  }
  process.exit(1);
}

console.log(
  `Checked ${sourceFiles.length} files; heading hierarchy is consistent.`,
);
