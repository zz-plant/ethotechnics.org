import { describe, expect, it } from "bun:test";

import {
  navPrimaryLinks,
  navSections,
  navUtilityMobilePrimaryLinks,
  startHereCta,
} from "./navigation";

const sectionLinks = (heading: string) => {
  const section = navSections.find((entry) => entry.heading === heading);
  if (!section) {
    throw new Error(`Missing nav section: ${heading}`);
  }
  return section.links.map((link) => link.href);
};

describe("navPrimaryLinks", () => {
  it("keeps five primary items", () => {
    expect(navPrimaryLinks).toHaveLength(5);
  });

  it("puts the method in the primary bar", () => {
    expect(navPrimaryLinks[0]?.href).toBe("/method");
  });
});

describe("navSections", () => {
  it("keeps every section at five links or fewer", () => {
    for (const section of navSections) {
      expect(section.links.length).toBeLessThanOrEqual(5);
    }
  });

  it("routes to the method, the laws, and the evidence packs from the standards section", () => {
    expect(sectionLinks("Standards & Specifications")).toEqual([
      "/method",
      "/standards",
      "/standards/laws",
      "/standards#regulatory-crosswalks",
      "/evidence-packs",
    ]);
  });

  // The mobile menu renders navSections, not navPrimaryLinks, so a primary
  // destination that appears in no section is unreachable on a phone.
  it("reaches every primary destination from a section", () => {
    const allSectionLinks = navSections.flatMap((section) =>
      section.links.map((link) => link.href),
    );
    for (const link of navPrimaryLinks) {
      expect(allSectionLinks.some((href) => href.startsWith(link.href))).toBe(
        true,
      );
    }
  });

  it("lists both delegation tools under diagnostics", () => {
    const links = sectionLinks("Diagnostics & Workbench");
    expect(links).toContain("/diagnostics/delegation-audit");
    expect(links).toContain("/diagnostics/record-conformance");
  });

  it("lists theory under knowledge", () => {
    expect(sectionLinks("Knowledge & Evidence")).toContain("/research/theory");
  });

  it("uses unique hrefs across the mega menu", () => {
    const hrefs = navSections.flatMap((section) =>
      section.links.map((link) => link.href),
    );
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("start here", () => {
  it("resolves to one route", () => {
    expect(startHereCta.href).toBe("/start");
    expect(navUtilityMobilePrimaryLinks[0]?.href).toBe("/start");
  });
});
