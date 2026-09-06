import { describe, expect, it } from "bun:test";

import { glossaryContent } from "../glossary";
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

    expect(index.map((entry) => entry.id)).toEqual([
      "alpha",
      "alpha-2",
      "beta",
    ]);
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

    expect(
      filterGlossaryIndexEntries(index, "ALPHA").map((entry) => entry.id),
    ).toEqual(["alpha", "alpha-2"]);
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
    expect(
      (setNode as { hasDefinedTerm: Array<{ name: string }> }).hasDefinedTerm[0]
        ?.name,
    ).toBe("Alpha");
  });
});

describe("published glossary content", () => {
  const index = buildGlossaryIndexEntries(glossaryContent.categories);
  const ids = new Set(index.map((entry) => entry.id));

  it("indexes the delegation-era terms", () => {
    for (const id of [
      "delegated-agency",
      "consequential-decision",
      "justified-delegation",
      "authority-grant",
      "authority-lease",
      "grant-state",
      "dependency-state",
      "exposure-score",
      "substitution-cost",
      "technical-reversibility",
      "operational-reversibility",
      "institutional-reversibility",
      "corrective-standing",
      "standing-mechanism",
      "procedural-force",
      "intervention-specification",
      "meaningful-control",
      "expansion-decision",
      "substrate-profile",
      "evaluation-layer",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("keeps every indexed id unique", () => {
    expect(ids.size).toBe(index.length);
  });

  it("finds authority terms through the index filter", () => {
    expect(
      filterGlossaryIndexEntries(index, "authority").map((entry) => entry.id),
    ).toContain("authority-grant");
  });
});
