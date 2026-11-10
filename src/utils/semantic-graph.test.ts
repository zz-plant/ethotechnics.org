import { describe, expect, it } from "bun:test";
import { glossaryContent } from "../content/glossary";
import { resolveSemanticContext } from "./semantic-graph";

const allGlossaryEntries = glossaryContent.categories.flatMap(
  (category) => category.entries,
);

const glossaryIds = new Set(allGlossaryEntries.map((entry) => entry.id));

// Terms added by the 2026-09 delegation reconstruction that the November 2026
// cut kept. Each must be reachable from at least two other entries so the
// semantic graph stays connected.
const delegationEraTerms = [
  "authority-drift",
  "authority-grant",
  "automation-ratchet",
  "consequential-decision",
  "correction-capacity",
  "corrective-standing",
  "decision-system",
  "dependency-state",
  "expansion-decision",
  "grant-state",
  "meaningful-control",
  "policy-record",
  "revisable-delegation",
  "review-trigger",
];

const inboundLinks = (() => {
  const counts = new Map<string, Set<string>>();
  for (const id of glossaryIds) {
    counts.set(id, new Set<string>());
  }

  for (const entry of allGlossaryEntries) {
    // Cross-references used to be bare fragments, from when the glossary was
    // one page. They name the entry's own URL now.
    for (const match of entry.bodyHtml.matchAll(
      /href="\/glossary\/([a-z0-9-]+)"/g,
    )) {
      const target = match[1];
      if (target === entry.id) continue;
      counts.get(target)?.add(entry.id);
    }
  }

  return counts;
})();

describe("Semantic Graph Engine", () => {
  it("resolves context for STD-01 Temporal Rights", () => {
    const context = resolveSemanticContext("std-01-temporal-rights");
    expect(context).not.toBeNull();
    expect(context?.node.title).toContain("STD-01");
    expect(context?.diagnostics.length).toBeGreaterThan(0);
    expect(context?.diagnostics.some((d) => d.id === "delegation-audit")).toBe(
      true,
    );
  });

  it("resolves context for failure modes", () => {
    const context = resolveSemanticContext("authority-drift");
    expect(context).not.toBeNull();
    expect(context?.node.type).toBe("failure_mode");
  });

  it("keeps every delegation-era term reachable by at least two inbound cross-links", () => {
    const underLinked = delegationEraTerms
      .filter((id) => (inboundLinks.get(id)?.size ?? 0) < 2)
      .sort();

    expect(underLinked).toEqual([]);
  });

  it("resolves the delegation-era terms added for the authority and dependence branches", () => {
    for (const id of [
      "revisable-delegation",
      "authority-grant",
      "dependency-state",
      "reversibility",
      "corrective-standing",
    ]) {
      const context = resolveSemanticContext(id);
      expect(context).not.toBeNull();
      expect(context?.node.href).toBe(`/glossary/${id}`);
    }
  });
});
