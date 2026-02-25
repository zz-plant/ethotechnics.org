import { describe, expect, it } from "bun:test";

import { buildOgSvg, resolveOgTemplate } from "./og-image";

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
