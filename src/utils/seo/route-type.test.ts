import { describe, expect, it } from "bun:test";

import {
  classifyRouteType,
  resolveOpenGraphType,
  resolveStructuredDataType,
} from "./route-type";

describe("classifyRouteType", () => {
  it("classifies homepage, glossary, standards, utility, and article routes", () => {
    expect(classifyRouteType("/")).toBe("homepage");
    expect(classifyRouteType("/glossary")).toBe("glossary-index");
    expect(classifyRouteType("/glossary/accountability")).toBe("glossary-term");
    expect(classifyRouteType("/standards/w3c-vc-schemas")).toBe("standards");
    expect(classifyRouteType("/search")).toBe("utility");
    expect(classifyRouteType("/research/field-note-01")).toBe("article");
  });
});

describe("SEO route-derived metadata", () => {
  it("resolves Open Graph type from route when not explicitly provided", () => {
    expect(resolveOpenGraphType("/")).toBe("website");
    expect(resolveOpenGraphType("/glossary")).toBe("website");
    expect(resolveOpenGraphType("/glossary/accountability")).toBe("website");
    expect(resolveOpenGraphType("/standards/w3c-vc-schemas")).toBe("article");
  });

  it("resolves structured data mode from route", () => {
    expect(resolveStructuredDataType("/", "auto")).toBe("collection");
    expect(resolveStructuredDataType("/glossary/accountability", "auto")).toBe(
      "defined-term",
    );
    expect(resolveStructuredDataType("/standards/w3c-vc-schemas", "auto")).toBe(
      "webpage",
    );
  });
});
