import { describe, expect, mock, test } from "bun:test";
import type { APIContext } from "astro";

import { glossaryContent } from "../content/glossary";
import { standardsContent } from "../content/standards";
import { onRequest } from "../middleware";
import { buildSitemapSections } from "./sitemaps";

const sections = await buildSitemapSections();
const paths = (key: keyof typeof sections) =>
  sections[key].map((entry) => entry.path);
const allPaths = (Object.keys(sections) as (keyof typeof sections)[]).flatMap(
  paths,
);

describe("sitemap coverage", () => {
  test("lists the standards added by the delegation rebuild", () => {
    const standards = paths("standards");
    expect(standards).toContain("/standards/std-08-delegation");
    expect(standards).toContain("/standards/std-06-human-impact-safety-case");
    expect(standards).toContain("/standards/laws");
  });

  test("lists every theory essay", () => {
    const standards = paths("standards");
    expect(standards).toContain("/research/theory/dependence-without-standing");
    expect(standards).toContain("/research/theory/absorption-as-concealment");
    expect(standards).toContain(
      "/research/theory/democratic-vs-coercive-governability",
    );
    expect(standards).toContain("/research/theory/what-does-not-convert");
    expect(standards).toContain("/research/theory/dependence-runs-both-ways");
    expect(standards).toContain("/research/theory/endogenous-authorization");
  });

  test("lists the evidence packs, including the dynamic STD-08 route", () => {
    const standards = paths("standards");
    expect(standards).toContain("/evidence-packs/std-08");
    expect(standards).toContain("/evidence-packs/std-01");
  });

  test("lists the authority and dependence taxonomy branches", () => {
    const taxonomy = paths("taxonomy");
    for (const path of [
      "/taxonomy/authority",
      "/taxonomy/authority/delegation",
      "/taxonomy/authority/policy-validity",
      "/taxonomy/authority/expansion",
      "/taxonomy/dependence",
      "/taxonomy/dependence/reversibility",
      "/taxonomy/dependence/standing",
      "/taxonomy/dependence/preserved-capacity",
    ]) {
      expect(taxonomy).toContain(path);
    }
  });

  test("lists the method page and the frontier doctrine scan", () => {
    const core = paths("core");
    expect(core).toContain("/method");
    expect(core).toContain("/research/frontier-doctrine-scan");
  });

  test("drops the retired /start-here route in favour of /start", () => {
    const core = paths("core");
    expect(core).toContain("/start");
    expect(core).not.toContain("/start-here/");
  });
});

/**
 * The sitemap listed 104 URLs that did not answer 200 before anything checked
 * it against the routes. scripts/check-sitemap.ts requests every URL from a
 * built site; these hold the builder to the same rule without a server.
 */
describe("sitemap lists only routes that render", () => {
  test("no listed path is one the middleware redirects", async () => {
    const redirected: string[] = [];
    for (const path of allPaths) {
      const next = mock(() => Promise.resolve(new Response("next")));
      const response = await onRequest(
        {
          request: new Request(`https://ethotechnics.org${path}`),
          locals: {} as App.Locals,
        } as APIContext,
        next,
      );
      if (response?.status === 301 || response?.status === 302) {
        redirected.push(`${path} -> ${response.headers.get("Location")}`);
      }
    }
    expect(redirected).toEqual([]);
  });

  test("glossary lists exactly the entries /glossary/[slug] resolves", () => {
    const entryIds = new Set(
      glossaryContent.categories.flatMap((category) =>
        category.entries.map((entry) => entry.id),
      ),
    );
    const listed = paths("glossary")
      .filter((path) => /^\/glossary\/[^/]+$/.test(path))
      .map((path) => path.slice("/glossary/".length));

    expect(new Set(listed)).toEqual(entryIds);
  });

  test("standards lists only slugs backed by an MDX document", async () => {
    const standards = paths("standards").filter((path) =>
      path.startsWith("/standards/"),
    );
    for (const path of standards) {
      const slug = path.slice("/standards/".length);
      expect(await Bun.file(`src/content/standards/${slug}.mdx`).exists()).toBe(
        true,
      );
    }
    // Registry entries without a page never reach the sitemap, whatever their
    // listedOnSite flag says.
    for (const standard of standardsContent.standards) {
      if (standard.listedOnSite === false) {
        expect(allPaths).not.toContain(`/standards/${standard.slug}`);
      }
    }
    expect(allPaths).not.toContain("/standards/crosswalk/ctrl-01");
  });

  test("taxonomy lists canonical branch and pattern paths only", () => {
    for (const path of paths("taxonomy")) {
      expect(path).toMatch(/^\/(taxonomy|mechanisms\/patterns)\//);
    }
  });

  test("core lists no redirect stubs", () => {
    const core = paths("core");
    for (const path of ["/contact", "/intake", "/library/", "/library/cite"]) {
      expect(core).not.toContain(path);
    }
  });
});
