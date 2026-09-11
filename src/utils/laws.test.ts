import { describe, expect, it } from "bun:test";

import { extractLaws } from "./laws";

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
  // and the grid should say so plainly. If a twelfth clause binding appears
  // this count changes and the comment should go with it.
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
