import { describe, expect, it } from "bun:test";

import { readdirSync, readFileSync } from "node:fs";

import { cases } from "./casebook";
import { diagnosticsContent } from "./diagnostics";
import { evalsContent } from "./evals";
import { standardsContent } from "./standards";
import {
  practicesBySafeguard,
  SAFEGUARD_ORDER,
  taxonomyEntries,
} from "./taxonomy";

const filedHrefs = new Set(
  taxonomyEntries.flatMap((entry) =>
    entry.relatedArtifacts.map((artifact) => artifact.href),
  ),
);

const mechanismSlugs = (
  JSON.parse(readFileSync("src/content/library.json", "utf8")) as Array<{
    patterns: { entries: Array<{ slug: string }> };
  }>
)[0]!.patterns.entries.map((entry) => entry.slug);

const theorySlugs = readdirSync("src/content/theory")
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""));

const unfiled = (hrefs: string[]) =>
  hrefs.filter((href) => !filedHrefs.has(href));

describe("taxonomy entries", () => {
  // The six domains were a second list of six beside the safeguards, and two
  // of them had the safeguards' names. Practices are filed by safeguard now.
  it("files every practice once, under the first safeguard it serves", () => {
    const groups = practicesBySafeguard();
    expect(groups.map((group) => group.safeguard)).toEqual(
      SAFEGUARD_ORDER.filter((safeguard) =>
        taxonomyEntries.some((entry) => entry.safeguards[0] === safeguard),
      ),
    );
    for (const group of groups) {
      for (const practice of group.practices) {
        expect(practice.safeguards[0]).toBe(group.safeguard);
      }
    }
    expect(groups.flatMap((group) => group.practices)).toHaveLength(
      taxonomyEntries.length,
    );
  });

  it("files every entry under at least one safeguard, with a valid scope and at least two related artifacts", () => {
    for (const entry of taxonomyEntries) {
      expect(entry.safeguards.length).toBeGreaterThan(0);
      expect("owner" in entry).toBe(false);
      expect(["Capability", "Practice"]).toContain(entry.scope);
      expect(entry.summary.length).toBeGreaterThan(0);
      expect(entry.relatedArtifacts.length).toBeGreaterThanOrEqual(2);
    }
  });

  // The taxonomy is the site's map of practice. A standard, mechanism, eval,
  // tool, or case that no practice lists is one a reader filing by practice
  // never reaches, so a new one has to be filed before it ships.
  it("files every current standard, mechanism, eval suite, tool, and case", () => {
    expect(
      unfiled(
        standardsContent.standards
          .filter((standard) => standard.status !== "Deprecated")
          .map((standard) => `/standards/${standard.slug}`),
      ),
    ).toEqual([]);
    expect(
      unfiled(mechanismSlugs.map((slug) => `/mechanisms/patterns/${slug}`)),
    ).toEqual([]);
    expect(
      unfiled(evalsContent.suites.map((suite) => `/evals/${suite.slug}`)),
    ).toEqual([]);
    expect(
      unfiled(
        diagnosticsContent.tools.map((tool) => `/diagnostics/${tool.slug}`),
      ),
    ).toEqual([]);
    expect(unfiled(cases.map((entry) => `/casebook/${entry.slug}`))).toEqual(
      [],
    );
  });

  it("links only to mechanisms, evals, cases, and essays that exist", () => {
    const known = new Set([
      ...mechanismSlugs.map((slug) => `/mechanisms/patterns/${slug}`),
      ...evalsContent.suites.map((suite) => `/evals/${suite.slug}`),
      ...cases.map((entry) => `/casebook/${entry.slug}`),
      ...theorySlugs.map((slug) => `/research/theory/${slug}`),
    ]);
    const checked =
      /^\/(mechanisms\/patterns|evals|casebook|research\/theory)\/[^/]+$/;

    const broken = [...filedHrefs].filter(
      (href) => checked.test(href) && !known.has(href),
    );

    expect(broken).toEqual([]);
  });
});
