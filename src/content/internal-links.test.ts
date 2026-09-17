import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CONTENT_ROOT = "src/content";
const EXTENSIONS = new Set([".json", ".ts", ".mdx"]);
const TRAILING_SLASH_URL = /"(\/[a-z0-9][a-z0-9/-]*)\/"/g;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return EXTENSIONS.has(path.slice(path.lastIndexOf("."))) ? [path] : [];
  });

describe("stored internal links", () => {
  // Every page answers to one URL. A stored link with a trailing slash sends
  // the reader through a redirect to reach the page it already named.
  it("names paths without a trailing slash", () => {
    const offenders = walk(CONTENT_ROOT).flatMap((file) => {
      const matches = [
        ...readFileSync(file, "utf8").matchAll(TRAILING_SLASH_URL),
      ];
      return matches.map((match) => `${file}: ${match[0]}`);
    });

    expect(offenders).toEqual([]);
  });
});
