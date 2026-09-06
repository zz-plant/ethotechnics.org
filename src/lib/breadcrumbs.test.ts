import { describe, expect, it } from "bun:test";

import { normalizeBreadcrumbItems } from "./breadcrumbs";

const siteBase = "https://ethotechnics.org";

describe("normalizeBreadcrumbItems", () => {
  it("derives a Research > Theory > essay trail for /research/theory/* pages", () => {
    const items = normalizeBreadcrumbItems({
      siteBase,
      currentPath: "/research/theory/dependence-without-standing",
      title: "Dependence without standing — Ethotechnics Institute",
    });

    expect(items.map((item) => item.name)).toEqual([
      "Home",
      "Research",
      "Theory",
      "Dependence without standing",
    ]);
    expect(items.map((item) => item.href)).toEqual([
      "/",
      "/research",
      "/research/theory",
      "/research/theory/dependence-without-standing",
    ]);
  });

  it("uses the theory index title for /research/theory", () => {
    const items = normalizeBreadcrumbItems({
      siteBase,
      currentPath: "/research/theory",
      title: "Theory — Ethotechnics Institute",
    });

    expect(items.map((item) => item.name)).toEqual([
      "Home",
      "Research",
      "Theory",
    ]);
  });

  it("prefers explicit breadcrumb items and dedupes repeats", () => {
    const items = normalizeBreadcrumbItems({
      siteBase,
      currentPath: "/research/theory/automation-and-capture",
      breadcrumbItems: [
        { name: "Home", url: "/" },
        { name: "Research", url: "/research" },
        { name: "Theory", url: "/research/theory" },
        { name: "Theory", url: "/research/theory" },
        {
          name: "Automation and capture",
          url: "/research/theory/automation-and-capture",
        },
      ],
    });

    expect(items).toHaveLength(4);
    expect(items[3].absoluteUrl).toBe(
      "https://ethotechnics.org/research/theory/automation-and-capture",
    );
  });
});
