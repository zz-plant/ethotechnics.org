import { describe, expect, it } from "bun:test";

import {
  buildOgEtag,
  buildOgSvg,
  isIfNoneMatchSatisfied,
  normalizeOgRequestInput,
  renderOgPng,
  resolveOgTemplate,
} from "./og-image";
import {
  describeOgCard,
  parseTimeToHalt,
  resolveOgCard,
  scaleHook,
} from "./og-cards";

describe("resolveOgTemplate", () => {
  it("maps major content routes to custom templates", () => {
    expect(resolveOgTemplate(undefined, "/")).toBe("home");
    expect(resolveOgTemplate(undefined, "/standards/std-01")).toBe("standards");
    expect(resolveOgTemplate(undefined, "/glossary/latency")).toBe("glossary");
    // Taxonomy entries are anchors on /taxonomy; /taxonomy/* redirects there.
    expect(resolveOgTemplate(undefined, "/taxonomy")).toBe("taxonomy");
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

    // The label is set in the pill as uppercase.
    expect(svg).toContain("EDITORIAL");
    expect(svg).toContain("Research, incidents, and field notes");
  });

  it("renders the title as SVG text rather than a foreignObject", () => {
    // resvg has no foreignObject support, so anything laid out that way is
    // silently dropped from /api/og.png — the image every share actually uses.
    const svg = buildOgSvg("Latency budgets", "A short explainer");

    expect(svg).not.toContain("foreignObject");
    expect(svg).toContain("<tspan");
    expect(svg).toContain("Latency budgets");
  });

  it("wraps long titles onto multiple lines", () => {
    const svg = buildOgSvg(
      "Keeping authority, evidence, capability, consequence, and correction coupled",
      "A short explainer",
    );

    const lines = svg.match(/<tspan/g) ?? [];
    expect(lines.length).toBeGreaterThan(2);
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
    expect(isIfNoneMatchSatisfied('"other"', etag)).toBeFalse();
  });
});

describe("renderOgPng", () => {
  it("renders a PNG with visible text glyphs rather than an empty frame", async () => {
    const png = await renderOgPng(
      "Ethotechnics Institute",
      "Standards, mechanisms, and validators for accountable system governance.",
      { template: "home" },
    );

    expect(png).toBeInstanceOf(Uint8Array);
    // PNG header
    expect(png[0]).toBe(0x89);
    expect(png[1]).toBe(0x50);
    expect(png[2]).toBe(0x4e);
    expect(png[3]).toBe(0x47);

    // Textless frame drops all text and is under 12 KB; fully rendered PNG with fonts is > 25 KB.
    expect(png.length).toBeGreaterThan(25000);
  });
});

describe("share cards", () => {
  it("parses the casebook's time-to-halt wording into a figure", () => {
    expect(parseTimeToHalt("Three years and four months")).toEqual({
      figure: "3 years 4 months",
      until: undefined,
    });
    expect(parseTimeToHalt("About twenty years").figure).toBe("~20 years");
    expect(
      parseTimeToHalt(
        "About seventeen months to a policy change; the model was not withdrawn.",
      ),
    ).toEqual({ figure: "~17 months", until: "to a policy change" });
  });

  it("leads a long scale line with its first clauses", () => {
    expect(
      scaleHook(
        "More than 900 prosecutions; hundreds imprisoned, bankrupted, or both; the inquiry's first volume links at least thirteen suicides to the scandal.",
      ),
    ).toBe(
      "More than 900 prosecutions; hundreds imprisoned, bankrupted, or both",
    );
  });

  it("draws a casebook entry from the casebook, not the query string", () => {
    expect(resolveOgCard({ path: "/casebook/robodebt" }).kind).toBe("case");
    const svg = buildOgSvg("ignored", "ignored", {
      path: "/casebook/robodebt",
    });
    expect(svg).toContain("Robodebt");
    expect(svg).toContain("470,000");
    expect(svg).toContain("3 years 4 months");
    expect(svg).toContain("SIX SAFEGUARDS");
    // Cards use plain words, not the casebook's coined terms.
    expect(svg).toContain(">Appeal<");
    expect(svg).not.toContain(">Standing<");
    expect(svg).not.toContain("ignored");
  });

  it("charts time to halt on the home page and casebook index", () => {
    expect(resolveOgCard({ path: "/" }).kind).toBe("halt-chart");
    expect(resolveOgCard({ path: "/casebook" }).kind).toBe("halt-chart");
    const svg = buildOgSvg("Home", "Home", { path: "/" });
    expect(svg).toContain("Post Office Horizon");
    expect(svg).toContain("4 days");
    // Apple Card got a policy change, not a halt; the headline must cover it.
    expect(svg).not.toContain("stopped it");
    expect(svg).toContain("How long until someone stepped in?");
  });

  it("sets a glossary entry as a defined term", () => {
    const svg = buildOgSvg(
      "Authority lease — Ethotechnics glossary",
      "Authority lease: A time-limited grant of decision power.",
      { path: "/glossary/authority-lease" },
    );
    expect(svg).toContain(">Authority lease<");
    expect(svg).not.toContain("Ethotechnics glossary</tspan>");
    expect(svg).toContain("A time-limited grant of decision power.");
  });

  it("falls back to the section card for unknown casebook slugs", () => {
    expect(resolveOgCard({ path: "/casebook/not-a-case" }).kind).toBe(
      "section",
    );
  });

  it("describes data cards in alt text and leaves the rest to the layout", () => {
    expect(describeOgCard({ path: "/casebook/robodebt" })).toBe(
      "Robodebt, casebook entry. About 470,000 debts raised unlawfully. 3 years 4 months before it was stopped. Six safeguards scored: 4 failed, 2 drifted.",
    );
    const chart = describeOgCard({ path: "/" }) ?? "";
    expect(chart).toContain("Post Office Horizon, about 20 years");
    expect(chart).toContain("to a policy change");
    expect(chart).not.toContain("~");
    expect(describeOgCard({ path: "/standards/std-01" })).toBeUndefined();
  });
});
