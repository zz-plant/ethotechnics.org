import { describe, expect, it } from "bun:test";

import { buildApiEndpointMap } from "./api-endpoints";

describe("buildApiEndpointMap", () => {
  it("builds complete endpoint keys for API", () => {
    const baseMap = buildApiEndpointMap("/api", {
      includeReleaseEndpoints: true,
    });

    const baseKeys = new Set(Object.keys(baseMap));

    expect(baseKeys.has("changelog")).toBe(true);
    expect(baseKeys.has("releases")).toBe(true);
    expect(baseKeys.has("glossary")).toBe(true);
    expect(baseKeys.has("standards")).toBe(true);
  });

  it("normalizes trailing slashes in base paths", () => {
    const withoutSlash = buildApiEndpointMap("/api");
    const withSlash = buildApiEndpointMap("/api/");

    expect(withSlash).toEqual(withoutSlash);
  });
});
