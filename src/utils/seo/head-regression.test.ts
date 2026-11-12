import { describe, expect, it } from "bun:test";

import { resolveOgTemplate } from "./og-template";
import { resolveRouteProfile } from "./route-type";

/**
 * og:type and the share-image template follow from what a page is. They used
 * to come from two separate path tests, which typed every hub and every tool
 * as an article.
 */
describe("head metadata", () => {
  const cases: Array<[string, "website" | "article", string]> = [
    ["/", "website", "home"],
    ["/standards", "website", "standards"],
    ["/standards/w3c-vc-schemas", "article", "standards"],
    ["/glossary", "website", "glossary"],
    ["/glossary/contestability", "article", "glossary"],
    ["/mechanisms/patterns/kill-switch", "article", "mechanisms"],
    ["/validators", "website", "mechanisms"],
    ["/taxonomy", "website", "taxonomy"],
    ["/research/theory/insulation", "article", "editorial"],
    ["/explainers/stoppability", "article", "editorial"],
    ["/diagnostics/delegation-audit", "website", "default"],
    ["/casebook/robodebt", "article", "default"],
  ];

  it("derives og:type and the share-image template from the route profile", () => {
    for (const [path, openGraphType, template] of cases) {
      const profile = resolveRouteProfile(path);
      expect(`${path} ${profile.openGraphType}`).toBe(
        `${path} ${openGraphType}`,
      );
      expect(`${path} ${resolveOgTemplate(undefined, path)}`).toBe(
        `${path} ${template}`,
      );
    }
  });

  it("lets an explicit template override the route's", () => {
    expect(resolveOgTemplate("glossary", "/standards")).toBe("glossary");
    expect(resolveOgTemplate("not-a-template", "/standards")).toBe("standards");
  });
});
