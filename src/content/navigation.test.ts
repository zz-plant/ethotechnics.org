import { describe, expect, it } from "bun:test";

import { navSections } from "./navigation";
import { siteFooter } from "./site-footer";

const sectionLinks = (heading: string) => {
  const section = navSections.find((entry) => entry.heading === heading);
  if (!section) {
    throw new Error(`Missing nav section: ${heading}`);
  }
  return section.links.map((link) => link.href);
};

describe("navSections", () => {
  it("gives every section a unique id", () => {
    const ids = navSections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

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
      "Diagnostics",
      "Knowledge",
    ]);
  });

  // The laws, the standards that test them, and the evidence each standard
  // asks for sit in that order, so the pages that sound alike sit together.
  it("routes to the method, the laws, and the evidence packs from the method section", () => {
    expect(sectionLinks("Method")).toEqual([
      "/method",
      "/standards/laws",
      "/standards",
      "/evidence-packs",
      "/low-leverage",
    ]);
  });

  it("lists both delegation tools under diagnostics", () => {
    const links = sectionLinks("Diagnostics");
    expect(links).toContain("/diagnostics/delegation-audit");
    expect(links).toContain("/diagnostics/record-conformance");
  });

  // The instruments differ by what the reader has to bring. Leading with the
  // one that takes a workflow is deliberate: it is the only input every reader
  // already has.
  it("orders tools by input, workflow first", () => {
    expect(sectionLinks("Diagnostics")[0]).toBe(
      "/diagnostics/delegation-audit",
    );
  });

  // The section description names five inputs, the fifth being "a decision
  // made about you." The reader who brings that one is the person the system
  // decided about — the audience the site's purpose statement names — so the
  // link goes to their checks, not to a hub they then have to interpret.
  it("gives the person a system decided about a direct link", () => {
    expect(sectionLinks("Diagnostics")).toContain(
      "/diagnostics/self-defense-tools",
    );
  });

  it("lists theory under knowledge", () => {
    expect(sectionLinks("Knowledge")).toContain("/research/theory");
  });

  it("uses unique hrefs across all sections and hub links", () => {
    const hrefs = navSections.flatMap((section) => [
      ...(section.href ? [section.href] : []),
      ...section.links.map((link) => link.href),
    ]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("site footer", () => {
  // The footer used to mirror the header's sections, so every page listed the
  // same destinations twice. It carries only what no menu does.
  it("repeats no destination the header already reaches", () => {
    const headerHrefs = new Set([
      "/start",
      ...navSections.flatMap((section) => [
        ...(section.href ? [section.href] : []),
        ...section.links.map((link) => link.href),
      ]),
    ]);
    const repeated = siteFooter.navigation
      .flatMap((column) => column.links)
      .filter((link) => headerHrefs.has(link.href));
    expect(repeated).toEqual([]);
  });
});
