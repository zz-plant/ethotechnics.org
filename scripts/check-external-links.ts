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

function parseFileArgs(): string[] | null {
  const fileArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  if (fileArgs.length === 0) {
    return null;
  }

  return fileArgs.filter((file) => {
    const extension = file.slice(file.lastIndexOf("."));
    return FILE_EXTENSIONS.has(extension);
  });
}

function findUnsafeBlankTargets(file: string): Finding[] {
  const content = readFileSync(file, "utf8");
  const findings: Finding[] = [];
  const anchorTagRegex = /<a\b[^>]*>/gi;

  for (const match of content.matchAll(anchorTagRegex)) {
    const tag = match[0];
    const tagStart = match.index ?? 0;

    const hasBlankTarget = /target\s*=\s*(["'])_blank\1/i.test(tag);
    if (!hasBlankTarget) {
      continue;
    }

    const relMatch = tag.match(/rel\s*=\s*(["'])(.*?)\1/i);
    if (!relMatch) {
      findings.push({
        file,
        line: getLine(content, tagStart),
        message:
          'Links with target="_blank" must include rel="noopener noreferrer".',
        snippet: tag,
      });
      continue;
    }

    const relTokens = relMatch[2].toLowerCase().split(/\s+/).filter(Boolean);
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

// The rel="noopener" pass is static and always runs. Resolving the URLs needs
// the network, so it runs only when asked for: `--fetch`, or the
// check:external-links:fetch script. Some publishers answer a scripted request
// with 403 while serving the page to a browser; that is a block, not a dead
// link, so it is reported separately and does not fail the run.
const EXTERNAL_URL = /https?:\/\/[^\s"'`<>)\]]+/g;
const SKIP_HOSTS = new Set(["127.0.0.1", "localhost", "example.com"]);

function collectExternalUrls(files: string[]): Map<string, string[]> {
  const urls = new Map<string, string[]>();

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(EXTERNAL_URL)) {
      const url = match[0].replace(/[.,;:]+$/, "");
      if (url.includes("${")) continue;
      let host: string;
      try {
        host = new URL(url).hostname;
      } catch {
        continue;
      }
      if (SKIP_HOSTS.has(host) || host.endsWith("ethotechnics.org")) continue;
      urls.set(url, [...(urls.get(url) ?? []), file]);
    }
  }

  return urls;
}

async function checkReachable(files: string[]): Promise<number> {
  const urls = collectExternalUrls(files);
  const dead: string[] = [];
  const blocked: string[] = [];

  for (const [url, sources] of urls) {
    let status: number | string;
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; ethotechnics-link-check)",
        },
        signal: AbortSignal.timeout(25_000),
      });
      status = response.status;
    } catch (error) {
      status = error instanceof Error ? error.name : "error";
    }

    const line = `${url} -> ${status}\n  cited by ${[...new Set(sources)].join(", ")}`;
    if (status === 403 || status === 429) blocked.push(line);
    else if (typeof status !== "number" || status >= 400) dead.push(line);
  }

  if (blocked.length > 0) {
    console.warn(`\n${blocked.length} link(s) refused a scripted request:`);
    for (const line of blocked) console.warn(`- ${line}`);
  }

  if (dead.length > 0) {
    console.error(`\n${dead.length} external link(s) did not resolve:`);
    for (const line of dead) console.error(`- ${line}`);
    return 1;
  }

  console.log(`\nResolved ${urls.size} external links; none are dead.`);
  return 0;
}

const candidateFiles = parseFileArgs();
const sourceFiles = candidateFiles ?? walk(ROOT);
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

if (process.argv.includes("--fetch")) {
  process.exit(await checkReachable(sourceFiles));
}
