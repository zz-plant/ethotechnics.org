import { describe, expect, it } from "bun:test";

import { casebookContent, cases, stateVariables } from "./casebook";
import {
  healthcareCasebookContent,
  healthcareCases,
} from "./healthcare-casebook";
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

/** The record kinds the pillar's rule names. */
const admitting = new Set(["court", "inquiry", "regulator", "study"]);

describe("healthcare pillar", () => {
  it("states its own admission rule and leaves the main casebook's alone", () => {
    expect(healthcareCasebookContent.admissionRule).toContain(
      "a court, a statutory inquiry, a regulator, or a peer-reviewed external validation",
    );
    expect(casebookContent.description).toContain(
      "Each case was established by a court, an inquiry, or a regulator.",
    );
    expect(casebookContent.description).not.toContain("peer-reviewed");
  });

  it("keeps its cases out of the main casebook", () => {
    const mainSlugs = new Set(cases.map((entry) => entry.slug));
    const slugs = healthcareCases.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(mainSlugs.has(slug), slug).toBe(false);
  });

  it("cites no press, and admits each case on a record the rule names", () => {
    for (const entry of healthcareCases) {
      expect(entry.meetsAdmissionRule, entry.slug).toBe(true);
      expect(entry.admissionReason.length, entry.slug).toBeGreaterThan(0);
      const kinds: string[] = entry.sources.map((source) => source.kind);
      expect(kinds, entry.slug).not.toContain("press");
      expect(
        kinds.some((kind) => admitting.has(kind)),
        entry.slug,
      ).toBe(true);
      for (const source of entry.sources) {
        expect(source.date, source.label).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(source.href, source.label).toMatch(/^https:\/\//);
      }
    }
  });

  it("names no press outlet in a published case", () => {
    const text = JSON.stringify(healthcareCases);
    for (const outlet of ["STAT", "NBC News", "MedCity"]) {
      expect(text).not.toContain(outlet);
    }
  });

  it("marks every score as a draft and lists what could not be confirmed", () => {
    for (const entry of healthcareCases) {
      expect(entry.scoreStatus, entry.slug).toBe("draft");
      expect(entry.gaps.length, entry.slug).toBeGreaterThan(0);
    }
  });

  it("says no system was halted only while that is what every case records", () => {
    expect(healthcareCasebookContent.haltStatement).toContain(
      "Neither system has a halt on the record.",
    );
    expect(healthcareCases.length).toBe(2);
    for (const entry of healthcareCases) {
      expect(entry.halt.status, entry.slug).toBe("not-halted");
      if (entry.halt.status === "not-halted") {
        expect(entry.halt.asOf, entry.slug).toBe("2026-10-08");
      }
    }
  });

  it("reads every case against each of the six safeguards exactly once", () => {
    const ids = stateVariables.map((variable) => variable.id).sort();
    for (const entry of healthcareCases) {
      const scored = entry.findings.map((finding) => finding.variable);
      expect(scored.slice().sort(), entry.slug).toEqual(ids);
    }
  });

  it("pins each score to clauses in the register and to the twelve laws, and a withheld score to none", () => {
    for (const entry of healthcareCases) {
      for (const finding of entry.findings) {
        const label = `${entry.slug}/${finding.variable}`;
        if (finding.verdict === "withheld") {
          expect(finding.clauses, label).toEqual([]);
          expect(finding.laws, label).toEqual([]);
          expect(finding.finding, label).toContain("does not cite");
          continue;
        }
        expect(finding.clauses.length, label).toBeGreaterThan(0);
        expect(finding.laws.length, label).toBeGreaterThan(0);
        for (const law of finding.laws) expect(lawIds.has(law)).toBe(true);
        for (const ref of finding.clauses) {
          const clause = standardClauses[ref.standard]?.find(
            (candidate) => candidate.displayId === ref.clause,
          );
          expect(
            clause,
            `${label}: ${ref.standard} ${ref.clause}`,
          ).toBeDefined();
          const standard = standardsContent.standards.find(
            (candidate) => candidate.id === ref.standard,
          );
          expect(standard?.listedOnSite, label).not.toBe(false);
        }
      }
    }
  });

  it("does not score standing as held", () => {
    for (const entry of healthcareCases) {
      const standing = entry.findings.find(
        (finding) => finding.variable === "standing",
      );
      expect(standing?.verdict, entry.slug).not.toBe("held");
    }
  });

  it("keeps timelines in order with at most one turn", () => {
    for (const entry of healthcareCases) {
      const events = entry.timeline ?? [];
      expect(events.length, entry.slug).toBeGreaterThan(0);
      expect(events.filter((event) => event.turn).length).toBeLessThanOrEqual(
        1,
      );
      const years = events.map((event) =>
        Number(/\d{4}/.exec(event.when)?.[0]),
      );
      expect(years, entry.slug).toEqual(years.slice().sort((a, b) => a - b));
    }
  });

  it("keeps page and case descriptions to 160 characters", () => {
    expect(
      healthcareCasebookContent.pageDescription.length,
    ).toBeLessThanOrEqual(160);
    for (const entry of healthcareCases) {
      expect(
        entry.metaDescription?.length ?? 0,
        entry.slug,
      ).toBeLessThanOrEqual(160);
    }
  });
});
