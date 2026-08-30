import { describe, expect, it } from "bun:test";
import { resolveSemanticContext, roleCuratedPaths } from "./semantic-graph";

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
