import { describe, expect, it } from "bun:test";

import {
  buildOgEtag,
  buildOgSvg,
  isIfNoneMatchSatisfied,
  normalizeOgRequestInput,
  resolveOgTemplate,
} from "./og-image";

describe("resolveOgTemplate", () => {
  it("maps major content routes to custom templates", () => {
    expect(resolveOgTemplate(undefined, "/")).toBe("home");
    expect(resolveOgTemplate(undefined, "/standards/std-01")).toBe("standards");
    expect(resolveOgTemplate(undefined, "/glossary/latency")).toBe("glossary");
    expect(resolveOgTemplate(undefined, "/taxonomy/governance")).toBe(
      "taxonomy",
    );
    expect(resolveOgTemplate(undefined, "/mechanisms/patterns/bindings")).toBe(
      "mechanisms",
    );
    expect(resolveOgTemplate(undefined, "/research/agenda")).toBe("editorial");
  });

  it("honors explicit template values when valid", () => {
    expect(resolveOgTemplate("standards", "/research/agenda")).toBe(
      "standards",
    );
  });

  it("falls back to default template when no mapping exists", () => {
    expect(resolveOgTemplate(undefined, "/start-here")).toBe("default");
  });
});

describe("buildOgSvg", () => {
  it("renders template-specific labels", () => {
    const svg = buildOgSvg("Latency budgets", "A short explainer", {
      template: "editorial",
    });

    expect(svg).toContain("Editorial");
    expect(svg).toContain("Research, incidents, and field notes");
  });
});

describe("OG request normalization and validators", () => {
  it("normalizes and clamps request inputs", () => {
    const normalized = normalizeOgRequestInput({
      title: `  ${"T".repeat(150)}  `,
      description: `\n${"D".repeat(250)}\n`,
      template: `  ${"mechanisms".repeat(10)}  `,
      path: ` /docs/${"very-long-segment-".repeat(20)} `,
    });

    expect(normalized.title.length).toBeLessThanOrEqual(98);
    expect(normalized.description.length).toBeLessThanOrEqual(185);
    expect(normalized.template?.length).toBeLessThanOrEqual(32);
    expect(normalized.path?.length).toBeLessThanOrEqual(240);
    expect(normalized.title.endsWith("…")).toBeTrue();
    expect(normalized.description.endsWith("…")).toBeTrue();
  });

  it("builds deterministic etags for equivalent inputs", () => {
    const first = buildOgEtag({
      title: "  Shared title  ",
      description: "Shared\n description",
      template: " standards ",
      path: " /standards/std-01 ",
    });
    const second = buildOgEtag({
      title: "Shared title",
      description: "Shared description",
      template: "standards",
      path: "/standards/std-01",
    });

    expect(first).toBe(second);
  });

  it("matches if-none-match against strong and weak tags", () => {
    const etag = buildOgEtag({ title: "Title", description: "Description" });

    expect(isIfNoneMatchSatisfied(etag, etag)).toBeTrue();
    expect(isIfNoneMatchSatisfied(`W/${etag}`, etag)).toBeTrue();
    expect(isIfNoneMatchSatisfied(`"other", ${etag}`, etag)).toBeTrue();
    expect(isIfNoneMatchSatisfied("\"other\"", etag)).toBeFalse();
  });
});
