import { describe, expect, it } from "bun:test";

import { cases } from "../content/casebook";
import { extractLaws, variablesForLaw } from "./laws";

const body = await Bun.file("src/content/standards/laws.mdx").text();

describe("extractLaws", () => {
  const laws = extractLaws(body);

  it("finds all twelve", () => {
    expect(laws.map((law) => law.numeral)).toEqual([
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
  });

  it("gives every law an invariant and a binding", () => {
    for (const law of laws) {
      expect(law.invariant.length, law.id).toBeGreaterThan(20);
      expect(law.bindsThrough.length, law.id).toBeGreaterThan(20);
      expect(law.title, law.id).not.toContain("\n");
    }
  });

  // Law X is bound by the shape of the eval stack rather than by a clause,
  // and its binding line should say so plainly. If a twelfth clause binding
  // appears this count changes and the comment should go with it.
  it("binds eleven laws through a standard and Law X through the evals", () => {
    const viaStandard = laws.filter((law) => /STD-\d\d/.test(law.bindsThrough));
    expect(viaStandard.map((law) => law.numeral)).not.toContain("X");
    expect(viaStandard).toHaveLength(11);
    expect(laws.find((law) => law.numeral === "X")?.bindsThrough).toMatch(
      /eval/i,
    );
  });

  it("attaches every state variable to at least one law", () => {
    const cited = new Set(laws.flatMap((law) => law.variables));
    expect(cited.size).toBe(6);
  });
});

describe("variablesForLaw", () => {
  const numerals = extractLaws(body).map((law) => law.numeral);

  // Laws IV, VI, and X protected nothing on /standards/laws, while every
  // casebook case filed its correction finding under Law IV.
  it("files every law under at least one state variable", () => {
    const unfiled = numerals.filter((n) => variablesForLaw(n).length === 0);
    expect(unfiled).toEqual([]);
  });

  it("files the law each case cites for a variable under that variable", () => {
    const counts = new Map<string, number>();
    for (const entry of cases) {
      for (const finding of entry.findings) {
        for (const law of finding.laws) {
          const key = `${finding.variable} ${law}`;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
    }
    // A law cited for a variable by two or more cases is how the casebook
    // applies it, so /method has to say the same. A single citation is a
    // case's own judgment.
    const missing = [...counts]
      .filter(([, count]) => count >= 2)
      .map(([key]) => key.split(" ") as [string, string])
      .filter(
        ([variable, law]) =>
          !variablesForLaw(law).some(
            (state) => state.toLowerCase() === variable,
          ),
      )
      .map(([variable, law]) => `${variable}: Law ${law}`);
    expect(missing).toEqual([]);
  });
});
