import { describe, expect, it } from "bun:test";

import {
  getAriaCurrent,
  isCurrentLink,
  isHashLink,
  normalizePath,
  toViewTransitionName,
} from "./navigation";

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

  it("does not treat same-page hash links as separate pages", () => {
    expect(isCurrentLink("/#failure-intake", "/")).toBe(false);
  });
});

describe("getAriaCurrent", () => {
  it("returns page for canonical route matches", () => {
    expect(getAriaCurrent("/standards", "/standards")).toBe("page");
  });

  it("returns location for homepage hash links when already on home", () => {
    expect(getAriaCurrent("/#failure-intake", "/")).toBe("location");
  });

  it("does not return a current state for homepage hash links on other routes", () => {
    expect(getAriaCurrent("/#failure-intake", "/diagnostics")).toBeUndefined();
  });
});

describe("toViewTransitionName", () => {
  it("produces stable names for root links", () => {
    expect(toViewTransitionName("/?utm_source=site", "desktop")).toBe(
      "nav-link-desktop-home",
    );
  });
});

describe("isHashLink", () => {
  it("detects hash navigation links", () => {
    expect(isHashLink("/#failure-intake")).toBe(true);
    expect(isHashLink("/standards")).toBe(false);
  });
});
