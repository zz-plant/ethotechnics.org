import { describe, expect, it } from "bun:test";

import { getTaxonomyBranch, taxonomyEntries } from "./taxonomy";

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
      "authority/policy-validity",
      "authority/expansion",
    ]);

    expect(getTaxonomyBranch("dependence").map((entry) => entry.slug)).toEqual([
      "dependence",
      "dependence/reversibility",
      "dependence/standing",
      "dependence/preserved-capacity",
    ]);
  });

  it("gives every entry an owner, a scope, and exactly two related artifacts", () => {
    for (const entry of taxonomyEntries) {
      expect(entry.owner.length).toBeGreaterThan(0);
      expect(["Domain", "Capability", "Practice"]).toContain(entry.scope);
      expect(entry.summary.length).toBeGreaterThan(0);
      expect(entry.relatedArtifacts).toHaveLength(2);
    }
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
