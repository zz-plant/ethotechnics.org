import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * The participate page names one inbox, hello@ethotechnics.org. Publication
 * records also listed research@, standards@, institute@, and diagnostics@,
 * which no page explained and nobody was named as reading. Contact goes to the
 * inbox the site names; security reports keep their own address, which
 * security.txt publishes.
 */

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(astro|ts|tsx|json|mdx|txt)$/.test(path) ? [path] : [];
  });

const sources = [...walk("src"), ...walk("public")].filter(
  (file) => !file.endsWith("contact.test.ts"),
);

describe("contact addresses", () => {
  it("sends no one to a role inbox the site does not name", () => {
    const retired = /\b(research|standards|institute|diagnostics)@ethotechnics\.org/;
    const offenders = sources.filter((file) =>
      retired.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
