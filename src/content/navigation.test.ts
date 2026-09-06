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

  it("routes to the laws and the evidence packs from the standards section", () => {
    expect(sectionLinks("Standards & Specifications")).toEqual([
      "/standards",
      "/standards/laws",
      "/standards#regulatory-crosswalks",
      "/evidence-packs",
    ]);
  });

  it("lists the delegation audit under diagnostics", () => {
    expect(sectionLinks("Diagnostics & Workbench")).toContain(
      "/diagnostics/delegation-audit",
    );
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
