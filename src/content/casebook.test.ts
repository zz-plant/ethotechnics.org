import { describe, expect, it } from "bun:test";

import { cases, clauseHref, stateVariables, verdictTally } from "./casebook";
import { standardClauses, standardsContent } from "./standards";

const lawIds = new Set([
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
]);

describe("casebook", () => {
  it("scores every case on every state variable exactly once", () => {
    for (const entry of cases) {
      const scored = entry.findings.map((finding) => finding.variable);
      expect(new Set(scored).size).toBe(scored.length);
      expect(scored.sort()).toEqual(
        stateVariables.map((variable) => variable.id).sort(),
      );
    }
  });

  it("pins every clause reference to a clause in the register", () => {
    for (const entry of cases) {
      for (const finding of entry.findings) {
        expect(finding.clauses.length).toBeGreaterThan(0);
        for (const ref of finding.clauses) {
          const register = standardClauses[ref.standard];
          expect(
            register,
            `${entry.slug}: ${ref.standard} has no register`,
          ).toBeDefined();
          const clause = register?.find(
            (candidate) => candidate.displayId === ref.clause,
          );
          expect(
            clause,
            `${entry.slug}/${finding.variable}: ${ref.standard} ${ref.clause} is not in the register`,
          ).toBeDefined();
        }
      }
    }
  });

  it("cites only the twelve laws", () => {
    for (const entry of cases) {
      for (const finding of entry.findings) {
        expect(finding.laws.length).toBeGreaterThan(0);
        for (const law of finding.laws) expect(lawIds.has(law)).toBe(true);
      }
    }
  });

  it("links clauses to a standard that has a published page", () => {
    for (const entry of cases) {
      for (const finding of entry.findings) {
        for (const ref of finding.clauses) {
          const standard = standardsContent.standards.find(
            (candidate) => candidate.id === ref.standard,
          );
          expect(standard?.listedOnSite).not.toBe(false);
          expect(clauseHref(ref)).toBe(
            `/standards/${standard?.slug}#clause-register`,
          );
        }
      }
    }
  });

  it("dates every source and keeps slugs unique", () => {
    const slugs = cases.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const entry of cases) {
      expect(entry.sources.length).toBeGreaterThan(0);
      for (const source of entry.sources) {
        expect(source.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (source.href) expect(source.href).toMatch(/^https:\/\//);
      }
    }
  });

  it("tallies verdicts per variable", () => {
    const tally = verdictTally();
    for (const variable of stateVariables) {
      const counts = tally[variable.id];
      expect(counts.held + counts.drifted + counts.failed).toBe(cases.length);
    }
    // The casebook's own claim on the hub: standing has never held.
    expect(tally.standing.held).toBe(0);
  });
});
