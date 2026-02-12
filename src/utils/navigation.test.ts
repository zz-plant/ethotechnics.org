import { describe, expect, it } from "bun:test";

import { isCurrentLink, normalizePath, toViewTransitionName } from "./navigation";

describe("normalizePath", () => {
  it("strips query and hash fragments", () => {
    expect(normalizePath("/tools/burden-budget-worksheet/?mode=print#overview")).toBe(
      "/tools/burden-budget-worksheet",
    );
  });

  it("falls back to root for hash-only URLs", () => {
    expect(normalizePath("#top")).toBe("/");
  });
});

describe("isCurrentLink", () => {
  it("treats canonical paths as current even when URL has query params", () => {
    expect(isCurrentLink("/start-here/", "/start-here?ref=navigation")).toBe(
      true,
    );
  });
});

describe("toViewTransitionName", () => {
  it("produces stable names for root links", () => {
    expect(toViewTransitionName("/?utm_source=site", "desktop")).toBe(
      "nav-link-desktop-home",
    );
  });
});
