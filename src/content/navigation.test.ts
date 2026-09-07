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

  // The four sections are the content layers, not file types. A section whose
  // heading names a format is a section every new page has to argue its way
  // into, which is how the menu filled up in the first place.
  it("names the sections for the layers", () => {
    expect(navSections.map((section) => section.heading)).toEqual([
      "Method",
      "Mechanisms and evals",
      "Instruments",
      "Knowledge",
    ]);
  });

  it("routes to the method, the laws, and the evidence packs from the method section", () => {
    expect(sectionLinks("Method")).toEqual([
      "/method",
      "/standards/laws",
      "/standards",
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

  it("lists both delegation tools under instruments", () => {
    const links = sectionLinks("Instruments");
    expect(links).toContain("/diagnostics/delegation-audit");
    expect(links).toContain("/diagnostics/record-conformance");
  });

  // The instruments differ by what the reader has to bring. Leading with the
  // one that takes a workflow is deliberate: it is the only input every reader
  // already has.
  it("orders instruments by input, workflow first", () => {
    expect(sectionLinks("Instruments")[0]).toBe(
      "/diagnostics/delegation-audit",
    );
    expect(sectionLinks("Instruments").at(-1)).toBe("/diagnostics");
  });

  it("lists theory under knowledge", () => {
    expect(sectionLinks("Knowledge")).toContain("/research/theory");
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
