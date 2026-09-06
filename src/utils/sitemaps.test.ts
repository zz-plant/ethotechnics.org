import { describe, expect, test } from "bun:test";

import { buildSitemapSections } from "./sitemaps";

const sections = await buildSitemapSections();
const paths = (key: keyof typeof sections) =>
  sections[key].map((entry) => entry.path);

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
