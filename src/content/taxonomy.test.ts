import { describe, expect, it } from "bun:test";

import { readdirSync, readFileSync } from "node:fs";

import { cases } from "./casebook";
import { diagnosticsContent } from "./diagnostics";
import { evalsContent } from "./evals";
import { standardsContent } from "./standards";
import { getTaxonomyBranch, taxonomyEntries } from "./taxonomy";

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

const rootSlugs = taxonomyEntries
  .filter((entry) => !entry.slug.includes("/"))
  .map((entry) => entry.slug);

describe("taxonomy entries", () => {
  it("exposes the six top-level branches", () => {
    expect([...rootSlugs].sort()).toEqual([
      "assurance",
      "authority",
      "delivery",
      "dependence",
      "experience",
      "governance",
    ]);
  });

  it("nests the authority and dependence children under their roots", () => {
    expect(getTaxonomyBranch("authority").map((entry) => entry.slug)).toEqual([
      "authority",
      "authority/delegation",
      "authority/delegation/leases",
      "authority/policy-validity",
      "authority/expansion",
    ]);

    expect(getTaxonomyBranch("dependence").map((entry) => entry.slug)).toEqual([
      "dependence",
      "dependence/reversibility",
      "dependence/reversibility/rollbacks",
      "dependence/standing",
      "dependence/preserved-capacity",
    ]);
  });

  it("files every entry under at least one safeguard, with a valid scope and at least two related artifacts", () => {
    for (const entry of taxonomyEntries) {
      expect(entry.safeguards.length).toBeGreaterThan(0);
      expect("owner" in entry).toBe(false);
      expect(["Domain", "Capability", "Practice"]).toContain(entry.scope);
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

  it("keeps every parent slug resolvable to a declared entry", () => {
    const slugs = new Set(taxonomyEntries.map((entry) => entry.slug));

    for (const entry of taxonomyEntries) {
      const segments = entry.slug.split("/");
      if (segments.length === 1) continue;
      expect(slugs.has(segments.slice(0, -1).join("/"))).toBe(true);
    }
  });
});
