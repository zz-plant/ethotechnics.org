import { describe, expect, it } from "bun:test";

import {
  getAriaCurrent,
  isCurrentLink,
  isHashLink,
  isSameDocumentHashLink,
  normalizePath,
  toViewTransitionName,
} from "./navigation";

describe("normalizePath", () => {
  it("strips query and hash fragments", () => {
    expect(
      normalizePath(
        "/diagnostics/burden-budget-worksheet/?mode=print#overview",
      ),
    ).toBe("/diagnostics/burden-budget-worksheet");
  });

  it("falls back to root for hash-only URLs", () => {
    expect(normalizePath("#top")).toBe("/");
  });
});

describe("isCurrentLink", () => {
  it("treats canonical paths as current even when URL has query params", () => {
    expect(isCurrentLink("/start/", "/start?ref=navigation")).toBe(true);
  });

  it("does not treat same-page hash links as separate pages", () => {
    expect(isCurrentLink("/#failure-intake", "/")).toBe(false);
  });
});

describe("getAriaCurrent", () => {
  it("returns page for canonical route matches", () => {
    expect(getAriaCurrent("/standards", "/standards")).toBe("page");
  });

  it("does not return location for homepage hash links when there is no hash", () => {
    expect(getAriaCurrent("/#failure-intake", "/")).toBeUndefined();
  });

  it("returns location only for hash links matching the current URL hash", () => {
    expect(getAriaCurrent("/#failure-intake", "/", "#failure-intake")).toBe(
      "location",
    );
    expect(
      getAriaCurrent("/#failure-intake", "/", "#standards"),
    ).toBeUndefined();
  });

  it("does not return a current state for homepage hash links on other routes", () => {
    expect(
      getAriaCurrent("/#failure-intake", "/diagnostics", "#failure-intake"),
    ).toBeUndefined();
  });

  it("supports section matching for child routes when matchSection is true", () => {
    expect(
      getAriaCurrent("/standards", "/standards/std-01-temporal-rights", "", true),
    ).toBe("true");
    expect(
      getAriaCurrent("/standards", "/standards/std-01-temporal-rights", "", false),
    ).toBeUndefined();
    expect(
      getAriaCurrent("/diagnostics", "/diagnostics/delegation-audit", "", true),
    ).toBe("true");
    expect(
      getAriaCurrent("/diagnostics", "/diagnostics", "", true),
    ).toBe("page");
    expect(
      getAriaCurrent("/", "/standards/std-01-temporal-rights", "", true),
    ).toBeUndefined();
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

describe("isSameDocumentHashLink", () => {
  it("detects same-document homepage section links", () => {
    expect(isSameDocumentHashLink("/#failure-intake")).toBe(true);
    expect(isSameDocumentHashLink("/standards#overview")).toBe(false);
  });
});
