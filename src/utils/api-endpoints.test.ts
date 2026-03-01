import { describe, expect, it } from "bun:test";

import { buildApiEndpointMap } from "./api-endpoints";

describe("buildApiEndpointMap", () => {
  it("keeps stable endpoint key parity between base and versioned APIs", () => {
    const baseMap = buildApiEndpointMap("/api", {
      includeReleaseEndpoints: true,
    });
    const versionedMap = buildApiEndpointMap("/api/v/2026.01");

    const baseKeys = new Set(Object.keys(baseMap));
    const versionedKeys = new Set(Object.keys(versionedMap));

    expect([...versionedKeys].every((key) => baseKeys.has(key))).toBe(true);
    expect(baseKeys.has("changelog")).toBe(true);
    expect(baseKeys.has("releases")).toBe(true);
  });

  it("normalizes trailing slashes in base paths", () => {
    const withoutSlash = buildApiEndpointMap("/api/v/2026.01");
    const withSlash = buildApiEndpointMap("/api/v/2026.01/");

    expect(withSlash).toEqual(withoutSlash);
  });
});
