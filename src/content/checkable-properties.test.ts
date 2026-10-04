import { describe, expect, it } from "bun:test";

import {
  allEmittedFindingIds,
  allLiveCheckIds,
  checkableProperties,
  coverageOf,
  propertyForProbe,
} from "./checkable-properties";

/**
 * The catalogue is only worth anything if it is total.
 *
 * A partial map is worse than none: it would let someone read the coverage
 * page, see a property probed from both sides, and not know that three other
 * checks exist which the page never mentions. These tests are the reason the
 * ids in checks.ts and conformance.ts are typed unions rather than strings.
 */

const probeIds = checkableProperties.flatMap((property) =>
  property.probes.map((probe) => probe.id),
);

describe("the catalogue covers every probe exactly once", () => {
  it("catalogues every harness check", () => {
    const missing = allLiveCheckIds.filter((id) => !probeIds.includes(id));
    expect(missing).toEqual([]);
  });

  it("catalogues every conformance finding", () => {
    const missing = allEmittedFindingIds.filter((id) => !probeIds.includes(id));
    expect(missing).toEqual([]);
  });

  it("never files one probe under two properties", () => {
    const seen = new Set<string>();
    const duplicated = probeIds.filter((id) => {
      if (seen.has(id)) return true;
      seen.add(id);
      return false;
    });
    expect(duplicated).toEqual([]);
  });

  it("resolves each probe id back to its property", () => {
    for (const id of [...allLiveCheckIds, ...allEmittedFindingIds]) {
      expect(propertyForProbe(id)?.id).toBeDefined();
    }
  });
});

describe("catalogue entries are usable", () => {
  it("gives every property a unique id", () => {
    const ids = checkableProperties.map((property) => property.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("binds every property to at least one law", () => {
    for (const property of checkableProperties) {
      expect(property.laws.length).toBeGreaterThan(0);
      for (const law of property.laws) {
        expect(law).toMatch(/^law-[ivx]+$/);
      }
    }
  });

  it("states the gap wherever a side is unprobed", () => {
    for (const property of checkableProperties) {
      if (coverageOf(property) === "both") continue;
      expect(property.gap, `${property.id} has an unprobed side`).toBeTruthy();
    }
  });

  it("keeps at least one property honest about having no probe", () => {
    // Not a style rule. If this ever goes to zero it means either the gaps were
    // closed — in which case delete this test deliberately — or that a property
    // nobody could check was quietly dropped from the catalogue.
    const unprobed = checkableProperties.filter(
      (property) => coverageOf(property) === "none",
    );
    expect(unprobed.length).toBeGreaterThan(0);
  });
});
