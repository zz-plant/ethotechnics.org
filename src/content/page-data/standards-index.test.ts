import { describe, expect, it } from "bun:test";

import {
  buildStandardsCardViewModels,
  buildStandardsGroupingAndFilters,
  buildStandardsStructuredDataPayload,
} from "./standards-index";
import { implementationExamples } from "../implementation-examples";
import { standardsContent, type StandardEntry } from "../standards";

describe("buildStandardsGroupingAndFilters", () => {
  it("groups standards by lane and reports counts", () => {
    const result = buildStandardsGroupingAndFilters(standardsContent.standards);

    expect(
      result.standardsGrouping.find((group) => group.lane === "core")?.items
        .length,
    ).toBeGreaterThan(0);
    expect(result.standardsLaneCounts.all).toBe(result.activeStandards.length);
    expect(result.standardsLaneCounts.core).toBeGreaterThan(0);
  });

  it("places STD-08 in the core lane", () => {
    const result = buildStandardsGroupingAndFilters(standardsContent.standards);

    expect(result.standardsLaneById.get("STD-08")).toBe("core");
    expect(
      result.standardsGrouping
        .find((group) => group.lane === "core")
        ?.items.map((item) => item.id),
    ).toContain("STD-08");
  });

  it("preserves sort stability for identical published dates", () => {
    const standards: StandardEntry[] = [
      {
        id: "A",
        slug: "a",
        title: "A",
        description: "A",
        status: "Stable",
        version: "1.0",
        stableCriteria: "n/a",
        effectiveDate: "now",
        published: "2026-01-01",
      },
      {
        id: "B",
        slug: "b",
        title: "B",
        description: "B",
        status: "Stable",
        version: "1.0",
        stableCriteria: "n/a",
        effectiveDate: "now",
        published: "2026-01-01",
      },
    ];

    const result = buildStandardsGroupingAndFilters(standards);

    expect(result.recentlyUpdatedStandards.map((item) => item.id)).toEqual([
      "A",
      "B",
    ]);
  });

  it("handles empty and single-item datasets", () => {
    const empty = buildStandardsGroupingAndFilters([]);
    expect(empty.activeStandards).toHaveLength(0);
    expect(empty.recentlyUpdatedStandards).toHaveLength(0);

    const single = buildStandardsGroupingAndFilters([
      standardsContent.standards[0],
    ]);
    expect(single.activeStandards).toHaveLength(1);
    expect(single.recentlyUpdatedStandards).toHaveLength(1);
  });
});

describe("buildStandardsStructuredDataPayload", () => {
  it("builds collection payload with canonical urls", () => {
    const cards = buildStandardsCardViewModels({
      standards: standardsContent.standards,
      doctrine: standardsContent.doctrine,
      implementationExamples,
    });

    const payload = buildStandardsStructuredDataPayload({
      standardsContent,
      adoptedStandards: cards.adoptedStandards,
      siteUrl: new URL("https://ethotechnics.org"),
    });

    expect(payload["@type"]).toBe("CollectionPage");
    expect(payload.url).toBe("https://ethotechnics.org/standards");
    expect(payload.hasPart.length).toBeGreaterThan(
      standardsContent.standards.length,
    );
  });
});
