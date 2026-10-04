/**
 * Fails the build when a generated file is too small to be what it claims.
 *
 * This exists because of a real outage-shaped defect that shipped unnoticed for
 * months. Prerendering under the Cloudflare adapter wrote a 15-byte file
 * containing the string "[object Object]" for every .astro route — 877 pages,
 * the entire glossary and every theory essay among them. Nothing caught it:
 * the routes returned HTTP 200, and the e2e suite asserted status codes on
 * pages that were server-rendered rather than content on pages that were not.
 * See docs/planning/prerender-finding-2026-09.md.
 *
 * The lesson is not "check for [object Object]". It is that a build can emit a
 * file that is structurally present and semantically empty, and that a check
 * cheap enough to run every time is worth more than a clever one. So this
 * asserts a floor on size and a couple of things every document of its type
 * must contain, and says plainly what it found.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const CLIENT_DIR = "dist/client";

/**
 * Floors, not targets. A real page here is tens of kilobytes; these numbers are
 * set far below that so the check fails only on output that is obviously not a
 * document, never on a legitimately terse one.
 */
const RULES: {
  ext: string;
  minBytes: number;
  mustContain: string[];
  label: string;
}[] = [
  {
    ext: ".html",
    minBytes: 500,
    mustContain: ["<html", "</html>"],
    label: "HTML page",
  },
  { ext: ".xml", minBytes: 100, mustContain: ["<?xml"], label: "XML document" },
];

const SENTINELS = ["[object Object]", "undefined", "null", "[object Promise]"];

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const failures: string[] = [];
let checked = 0;

for await (const file of walk(CLIENT_DIR)) {
  const rule = RULES.find((candidate) => candidate.ext === extname(file));
  if (!rule) continue;
  checked += 1;

  const { size } = await stat(file);
  const contents = await readFile(file, "utf-8");
  const trimmed = contents.trim();

  if (SENTINELS.includes(trimmed)) {
    failures.push(
      `${file}: the whole file is the string "${trimmed}". Something was ` +
        `stringified instead of rendered.`,
    );
    continue;
  }

  if (size < rule.minBytes) {
    failures.push(
      `${file}: ${size} bytes is below the ${rule.minBytes}-byte floor for a ` +
        `${rule.label}. Starts: ${JSON.stringify(trimmed.slice(0, 80))}`,
    );
    continue;
  }

  const missing = rule.mustContain.filter((token) => !contents.includes(token));
  if (missing.length > 0) {
    failures.push(
      `${file}: a ${rule.label} that does not contain ${missing.join(" or ")}.`,
    );
  }
}

if (failures.length > 0) {
  console.error(
    `Build output check failed: ${failures.length} of ${checked} generated files are not what they claim to be.\n`,
  );
  for (const failure of failures.slice(0, 25)) console.error(`  - ${failure}`);
  if (failures.length > 25) {
    console.error(`  ... and ${failures.length - 25} more.`);
  }
  process.exit(1);
}

console.log(
  `Build output check passed; ${checked} generated files are intact.`,
);
