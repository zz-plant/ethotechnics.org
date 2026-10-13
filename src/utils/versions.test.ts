import { describe, expect, it } from "bun:test";

import { formatVersion } from "./versions";

describe("formatVersion", () => {
  it("prefixes a bare version number", () => {
    expect(formatVersion("1.0.2")).toBe("v1.0.2");
    expect(formatVersion("0.7")).toBe("v0.7");
  });

  it("keeps one prefix on a version that already has one", () => {
    expect(formatVersion("v1.17.1")).toBe("v1.17.1");
    expect(formatVersion("V2.0.0")).toBe("v2.0.0");
  });
});
