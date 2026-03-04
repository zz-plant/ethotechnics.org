import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

type Finding = {
  file: string;
  line: number;
  message: string;
  snippet: string;
};

const ROOT = "src";
const FILE_EXTENSIONS = new Set([".astro", ".md", ".mdx", ".html", ".tsx"]);

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

function getAttributeStringValue(tag: string, attribute: string): string | null {
  const quotedMatch = tag.match(
    new RegExp(`${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i"),
  );
  if (quotedMatch) {
    return quotedMatch[2];
  }

  const jsxExpressionMatch = tag.match(
    new RegExp(`${attribute}\\s*=\\s*\\{\\s*(["'])(.*?)\\1\\s*\\}`, "i"),
  );
  if (jsxExpressionMatch) {
    return jsxExpressionMatch[2];
  }

  const jsxTemplateLiteralMatch = tag.match(
    new RegExp(`${attribute}\\s*=\\s*\\{\\s*\`([^\`]*)\`\\s*\\}`, "i"),
  );
  if (jsxTemplateLiteralMatch) {
    return jsxTemplateLiteralMatch[1];
  }

  return null;
}

function findUnsafeBlankTargets(file: string): Finding[] {
  const content = readFileSync(file, "utf8");
  const findings: Finding[] = [];
  const anchorTagRegex = /<a\b[^>]*>/gi;

  for (const match of content.matchAll(anchorTagRegex)) {
    const tag = match[0];
    const tagStart = match.index ?? 0;

    const targetValue = getAttributeStringValue(tag, "target");
    if (targetValue !== "_blank") {
      continue;
    }

    const relValue = getAttributeStringValue(tag, "rel");
    if (!relValue) {
      findings.push({
        file,
        line: getLine(content, tagStart),
        message:
          'Links with target="_blank" must include rel="noopener noreferrer".',
        snippet: tag,
      });
      continue;
    }

    const relTokens = relValue.toLowerCase().split(/\s+/).filter(Boolean);
    const missing = ["noopener", "noreferrer"].filter(
      (token) => !relTokens.includes(token),
    );

    if (missing.length > 0) {
      findings.push({
        file,
        line: getLine(content, tagStart),
        message: `Missing rel token(s): ${missing.join(", ")}.`,
        snippet: tag,
      });
    }
  }

  return findings;
}

const sourceFiles = walk(ROOT);
const findings = sourceFiles.flatMap((file) => findUnsafeBlankTargets(file));

if (findings.length > 0) {
  console.error("External link guardrail failed:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} ${finding.message}`);
    console.error(`  ${finding.snippet}`);
  }
  process.exit(1);
}

console.log(
  `Checked ${sourceFiles.length} files; all target="_blank" links include rel safeguards.`,
);
