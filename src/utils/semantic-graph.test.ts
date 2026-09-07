import { describe, expect, it } from "bun:test";
import { glossaryContent } from "../content/glossary";
import { resolveSemanticContext, roleCuratedPaths } from "./semantic-graph";

const allGlossaryEntries = glossaryContent.categories.flatMap(
  (category) => category.entries,
);

const glossaryIds = new Set(allGlossaryEntries.map((entry) => entry.id));

// Terms added by the 2026-09 delegation reconstruction. Each must be reachable
// from at least two other entries so the semantic graph stays connected.
const delegationEraTerms = [
  "authority-drift",
  "authority-grant",
  "authority-lease",
  "automation-ratchet",
  "capability-catalog",
  "capability-discovery",
  "consequential-decision",
  "correction-capacity",
  "correction-obligation",
  "corrective-standing",
  "decision-system",
  "delegated-agency",
  "dependency-state",
  "error-bearing-party",
  "evaluation-layer",
  "expansion-decision",
  "exposure-score",
  "grant-state",
  "institutional-capture",
  "institutional-reversibility",
  "intervention-specification",
  "justified-delegation",
  "meaningful-control",
  "normalized-dependence",
  "operational-reversibility",
  "policy-as-state",
  "policy-record",
  "preserved-capacity",
  "procedural-force",
  "prospective-auditability",
  "revisable-delegation",
  "review-trigger",
  "rubber-stamp-review",
  "standing-mechanism",
  "substitution-cost",
  "substrate-profile",
  "technical-reversibility",
  "withdrawal-rehearsal",
];

const inboundLinks = (() => {
  const counts = new Map<string, Set<string>>();
  for (const id of glossaryIds) {
    counts.set(id, new Set<string>());
  }

  for (const entry of allGlossaryEntries) {
    for (const match of entry.bodyHtml.matchAll(/href="#([a-z0-9-]+)"/g)) {
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
    expect(context?.diagnostics.some((d) => d.id === "system-auditor")).toBe(
      true,
    );
  });

  it("resolves context for failure modes", () => {
    const context = resolveSemanticContext("unearned-closure");
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
      "delegated-agency",
      "authority-grant",
      "dependency-state",
      "institutional-reversibility",
      "corrective-standing",
    ]) {
      const context = resolveSemanticContext(id);
      expect(context).not.toBeNull();
      expect(context?.node.href).toBe(`/glossary/${id}`);
    }
  });

  it("provides distinct curated paths for all 4 roles", () => {
    const roles = ["engineer", "policy", "auditor", "executive"] as const;
    for (const role of roles) {
      const path = roleCuratedPaths[role];
      expect(path.role).toBe(role);
      expect(path.prioritySteps.length).toBe(3);
      expect(path.featuredDiagnostics.length).toBeGreaterThan(0);
    }
  });
});
