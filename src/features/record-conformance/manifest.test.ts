import { describe, expect, it } from "bun:test";

import { compareDeclaration, readManifest } from "./manifest";

/** Whether's shape: one level deep, under its own key. */
const whetherManifest = JSON.stringify({
  defaultCadence: "weekly",
  revisableDelegation: {
    loopPosition: "act",
    standard:
      "https://ethotechnics.org/standards/std-07-revisable-delegation-record",
    conformanceLevel: 2,
    kinds: ["belief"],
    records: "https://whether.work/api/decision-memory?format=records",
    verifier: "https://ethotechnics.org/diagnostics/record-conformance",
  },
});

/** Ambit's shape: five deep, under the MCP registry's _meta namespacing. */
const ambitManifest = JSON.stringify({
  name: "io.github.zz-plant/ambit",
  _meta: {
    "io.modelcontextprotocol.registry/publisher-provided": {
      "org.ethotechnics.revisable-delegation": {
        loopPosition: ["capability", "authorization"],
        standard:
          "https://ethotechnics.org/standards/std-07-revisable-delegation-record",
        conformanceLevel: 2,
        kinds: ["capability", "authorization", "discrepancy", "revision"],
      },
    },
  },
});

describe("finding the declaration", () => {
  it("reads both shipped manifest shapes, whatever they nest it under", () => {
    const whether = readManifest(whetherManifest);
    expect(whether.ok && whether.declaration.conformanceLevel).toBe(2);
    expect(whether.ok && whether.declaration.at).toBe("revisableDelegation");

    const ambit = readManifest(ambitManifest);
    expect(ambit.ok && ambit.declaration.conformanceLevel).toBe(2);
    expect(ambit.ok && ambit.declaration.kinds).toHaveLength(4);
  });

  it("ignores a conformanceLevel that is not about this standard", () => {
    // Otherwise any manifest carrying the word would be read as an STD-07
    // declaration, and the checker would report on something nobody claimed.
    const result = readManifest(
      JSON.stringify({
        accessibility: { conformanceLevel: 2, standard: "WCAG 2.2 AA" },
      }),
    );
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain("no revisable-delegation");
  });

  it("refuses a manifest that declares two levels", () => {
    const doubled = JSON.stringify({
      a: {
        standard: "https://ethotechnics.org/standards/std-07-revisable-delegation-record",
        conformanceLevel: 1,
      },
      b: {
        standard: "https://ethotechnics.org/standards/std-07-revisable-delegation-record",
        conformanceLevel: 3,
      },
    });
    const result = readManifest(doubled);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain("has not said one");
  });

  it("says so when the manifest is not JSON at all", () => {
    expect(readManifest("<html>").ok).toBe(false);
    expect(readManifest("   ").ok).toBe(false);
  });
});

describe("what the manifest claims against what the stream shows", () => {
  const declaration = {
    at: "revisableDelegation",
    conformanceLevel: 2,
    kinds: ["belief", "objection"],
    systemId: null,
    records: null,
    verifier: null,
  };

  it("reports a declared kind the stream does not contain", () => {
    const findings = compareDeclaration(declaration, {
      parsed: 3,
      kinds: { belief: 3 },
    });
    const finding = findings.find((entry) => entry.id === "manifest-kind-absent");
    expect(finding?.detail).toContain("objection");
  });

  it("reports a kind the stream contains and the manifest hides", () => {
    const findings = compareDeclaration(declaration, {
      parsed: 4,
      kinds: { belief: 3, objection: 1, action: 1 },
    });
    const finding = findings.find(
      (entry) => entry.id === "manifest-kind-undeclared",
    );
    expect(finding?.detail).toContain("action");
  });

  it("reports a kind the standard does not define", () => {
    const findings = compareDeclaration(
      { ...declaration, kinds: ["belief", "vibe"] },
      { parsed: 1, kinds: { belief: 1 } },
    );
    expect(
      findings.some((entry) => entry.id === "manifest-unknown-kind"),
    ).toBe(true);
  });

  it("says nothing about an empty stream", () => {
    expect(compareDeclaration(declaration, { parsed: 0, kinds: {} })).toEqual([]);
  });
});
