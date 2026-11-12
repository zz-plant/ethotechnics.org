import { describe, expect, it } from "bun:test";

import { resolveRouteProfile, sectionLabel } from "./route-type";

const profile = (path: string) => {
  const { kind, group, sitemap, pageType, articleType, openGraphType } =
    resolveRouteProfile(path);
  return { kind, group, sitemap, pageType, articleType, openGraphType };
};

describe("resolveRouteProfile", () => {
  it("types each kind of page once, from its address", () => {
    expect(profile("/")).toEqual({
      kind: "home",
      group: "Institute",
      sitemap: "core",
      pageType: "WebPage",
      articleType: undefined,
      openGraphType: "website",
    });
    expect(profile("/standards/std-08-delegation")).toEqual({
      kind: "standard",
      group: "Standards",
      sitemap: "standards",
      pageType: "WebPage",
      articleType: "TechArticle",
      openGraphType: "article",
    });
    expect(profile("/research/theory/insulation")).toMatchObject({
      kind: "essay",
      group: "Research",
      sitemap: "research",
      articleType: "ScholarlyArticle",
    });
    expect(profile("/casebook/robodebt")).toMatchObject({
      kind: "case",
      sitemap: "research",
      articleType: "Report",
    });
    expect(profile("/glossary/contestability")).toMatchObject({
      kind: "term",
      group: "Glossary",
      articleType: undefined,
      openGraphType: "article",
    });
  });

  it("types hubs as collections, never as articles", () => {
    for (const hub of [
      "/standards",
      "/mechanisms",
      "/evals",
      "/research",
      "/glossary",
      "/validators",
    ]) {
      expect(profile(hub)).toMatchObject({
        kind: "collection",
        pageType: "CollectionPage",
        articleType: undefined,
        openGraphType: "website",
      });
    }
  });

  it("types tools, the about page, contact, and search by what they are", () => {
    expect(profile("/diagnostics/record-conformance")).toMatchObject({
      kind: "tool",
      group: "Tools",
      articleType: undefined,
      openGraphType: "website",
    });
    expect(profile("/about").pageType).toBe("AboutPage");
    expect(profile("/participate").pageType).toBe("ContactPage");
    expect(profile("/search").pageType).toBe("SearchResultsPage");
  });

  it("files pages outside a section under a named group, not 'other'", () => {
    expect(profile("/method").group).toBe("Standards");
    expect(profile("/use-cases/examples/loan-approval").group).toBe("Guides");
    expect(profile("/roles/engineering").group).toBe("Guides");
    expect(profile("/measurement-tiers").group).toBe("Evals");
  });

  it("ignores a trailing slash and letter case", () => {
    expect(resolveRouteProfile("/Standards/")).toEqual(
      resolveRouteProfile("/standards"),
    );
  });
});

describe("sectionLabel", () => {
  it("names a hub in sentence case and nothing else", () => {
    expect(sectionLabel("/evidence-packs")).toBe("Evidence packs");
    expect(sectionLabel("/use-cases")).toBe("Use cases");
    expect(sectionLabel("/evidence-packs/std-01")).toBeUndefined();
  });
});
