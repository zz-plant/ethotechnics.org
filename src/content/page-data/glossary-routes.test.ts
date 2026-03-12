import { describe, expect, it } from "bun:test";

import {
  buildGlossaryIndexEntries,
  buildGlossaryStructuredDataPayload,
  filterGlossaryIndexEntries,
} from "./glossary-routes";

const categories = [
  {
    id: "core",
    heading: "A. Core concepts",
    entries: [
      {
        id: "alpha",
        title: "Alpha",
        status: "Stable",
        bodyHtml: "<p>First term</p>",
        tags: ["control"],
        domains: ["temporal"],
        phase: ["design"],
        measurability: "qualitative",
        maturity: "core_concept",
        scale: "individual",
      },
      {
        id: "alpha-2",
        title: "Alpha",
        status: "Draft",
        bodyHtml: "<p>Second alpha</p>",
      },
    ],
  },
  {
    id: "ops",
    heading: "B. Operations",
    entries: [
      {
        id: "beta",
        title: "Beta",
        status: null,
        bodyHtml: "<p>Operational term</p>",
      },
    ],
  },
] as const;

describe("buildGlossaryIndexEntries", () => {
  it("sorts entries stably when titles collide", () => {
    const index = buildGlossaryIndexEntries([...categories]);

    expect(index.map((entry) => entry.id)).toEqual(["alpha", "alpha-2", "beta"]);
  });

  it("supports empty and single-item datasets", () => {
    expect(buildGlossaryIndexEntries([])).toHaveLength(0);

    const single = buildGlossaryIndexEntries([
      {
        id: "single",
        heading: "Single",
        entries: [
          {
            id: "only",
            title: "Only",
            status: null,
            bodyHtml: "<p>Only term</p>",
          },
        ],
      },
    ]);

    expect(single).toHaveLength(1);
    expect(single[0]?.id).toBe("only");
  });
});

describe("filterGlossaryIndexEntries", () => {
  it("applies case-insensitive query semantics", () => {
    const index = buildGlossaryIndexEntries([...categories]);

    expect(filterGlossaryIndexEntries(index, "ALPHA").map((entry) => entry.id)).toEqual([
      "alpha",
      "alpha-2",
    ]);
    expect(filterGlossaryIndexEntries(index, "")).toHaveLength(index.length);
  });
});


describe("buildGlossaryStructuredDataPayload", () => {
  it("creates defined-term set payload with expected counts", () => {
    const payload = buildGlossaryStructuredDataPayload({
      pageTitle: "Glossary",
      pageDescription: "Definitions",
      permalink: "/glossary",
      categories: [...categories],
      publication: { published: "2026-01-01", updated: "2026-01-02" },
      siteBase: "https://ethotechnics.org",
    });

    const graph = payload["@graph"];
    const setNode = graph.find((item) => item["@type"] === "DefinedTermSet");

    expect(setNode).toBeDefined();
    expect(setNode?.numberOfItems).toBe(3);
    expect((setNode as { hasDefinedTerm: Array<{ name: string }> }).hasDefinedTerm[0]?.name).toBe(
      "Alpha",
    );
  });
});
