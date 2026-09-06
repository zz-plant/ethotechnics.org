import { describe, expect, it } from "bun:test";

import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const contentDir = new URL("./", import.meta.url).pathname;
const repoRoot = new URL("../../", import.meta.url).pathname;
const promptPackDir = join(repoRoot, "public/agent-toolkit");
const scannedExtensions = [".ts", ".json", ".mdx"];
const mechanismReference = /MEC-(\d\d) ([^"\n<]+)/g;

type LibraryFile = Array<{
  patterns: { entries: Array<{ title: string }> };
}>;

const collectFiles = async (
  dir: string,
  extensions: string[],
): Promise<string[]> => {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const path = join(dir, dirent.name);

      if (dirent.isDirectory()) {
        return collectFiles(path, extensions);
      }

      return extensions.some((extension) => dirent.name.endsWith(extension))
        ? [path]
        : [];
    }),
  );

  return files.flat();
};

const loadCanonicalTitles = async () => {
  const raw = await readFile(join(contentDir, "library.json"), "utf-8");
  const parsed = JSON.parse(raw) as LibraryFile;
  const titles = new Map<string, string>();

  for (const entry of parsed[0]?.patterns.entries ?? []) {
    const match = /^MEC-(\d\d) (.+)$/.exec(entry.title);

    if (match) {
      titles.set(match[1]!, match[2]!);
    }
  }

  return titles;
};

// Titles are quoted in prose and in JSON strings, where an escaped newline is
// two characters. Stop the reference at the first closing bracket or escape so
// the surrounding sentence is not compared against the title.
const titleBody = (value: string) => value.split(/[)\]]|\\n/)[0] ?? value;

const normalize = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/[\s.,;:)\]]+$/, "")
    .trim()
    .toLowerCase();

// A reference is a title when the text after the id starts with a capital
// letter. Lowercase references such as "MEC-13 authority grant register" are
// prose, not titles, and are left to the prose checks in review.
const isTitleReference = (body: string) => /^[A-Z]/.test(body);

const isPrefixOf = (shorter: string, longer: string) =>
  longer === shorter ||
  (longer.startsWith(shorter) && longer.charAt(shorter.length) === " ");

describe("mechanism names", () => {
  it("matches every MEC title reference against library.json", async () => {
    const canonicalTitles = await loadCanonicalTitles();

    expect(canonicalTitles.size).toBeGreaterThan(0);

    const files = [
      ...(await collectFiles(contentDir, scannedExtensions)),
      ...(await collectFiles(promptPackDir, [".md"])),
    ].filter((file) => !file.endsWith("mechanism-names.test.ts"));

    const mismatches: string[] = [];

    for (const file of files) {
      const contents = await readFile(file, "utf-8");

      for (const match of contents.matchAll(mechanismReference)) {
        const [, id, rawBody] = match;

        if (!id || !rawBody || !isTitleReference(rawBody)) {
          continue;
        }

        const canonical = canonicalTitles.get(id);

        if (!canonical) {
          mismatches.push(
            `${relative(repoRoot, file)}: MEC-${id} is not a published mechanism`,
          );
          continue;
        }

        const body = normalize(titleBody(rawBody));
        const expected = normalize(canonical);

        // Allow both a shortened reference and a title followed by more text
        // on the same line, but nothing that contradicts the canonical title.
        if (!isPrefixOf(body, expected) && !isPrefixOf(expected, body)) {
          mismatches.push(
            `${relative(repoRoot, file)}: "MEC-${id} ${titleBody(rawBody).trim()}" does not match "MEC-${id} ${canonical}"`,
          );
        }
      }
    }

    expect(mismatches).toEqual([]);
  });
});
