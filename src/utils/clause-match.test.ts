import { describe, expect, it } from "bun:test";

import { standardClauses, type StandardClause } from "../content/standards";
import {
  clauseLabel,
  clauseText,
  keywordStems,
  matchClauses,
  renderSubmissionBrief,
  stem,
} from "./clause-match";

const clause = (
  id: string,
  obligation: string,
  overrides: Partial<StandardClause> = {},
): StandardClause => ({
  id: `STD-02.${id}`,
  standardId: "STD-02",
  displayId: `§${id}`,
  type: "obligation",
  requirementLevel: "MUST",
  condition: "a decision is made",
  obligation,
  evidenceRequired: [],
  timeBound: "on demand",
  relatedMechanisms: [],
  relatedValidators: [],
  ...overrides,
});

const register = [
  clause("1.1", "give the reasons for the decision in plain language"),
  clause("2.1", "publish an appeal path with a named authority"),
  clause("2.3", "publish binding appeal deadlines", {
    evidenceRequired: ["appeal.deadline_policy"],
  }),
  clause("3.1", "set a review clock and escalate when it expires"),
];

describe("stem", () => {
  it("brings inflections of a word together", () => {
    expect(
      new Set(["appeal", "appeals", "appealed", "appealing"].map(stem)),
    ).toEqual(new Set(["appeal"]));
    expect(stem("decide")).toBe(stem("decided"));
    expect(stem("policies")).toBe("policy");
    expect(stem("processes")).toBe("process");
  });
});

describe("keywordStems", () => {
  it("drops short words, stopwords, and consultation boilerplate", () => {
    expect(
      keywordStems("The proposed rule on artificial intelligence and appeals"),
    ).toEqual(["appeal"]);
  });

  it("lists each stem once, in first-seen order", () => {
    expect(keywordStems("Review the review clock; reviewed clocks")).toEqual([
      "review",
      "clock",
    ]);
  });
});

describe("matchClauses", () => {
  it("ranks the clauses sharing the most distinctive words first", () => {
    const matches = matchClauses("appeal deadlines", register);
    expect(matches.map((match) => match.clause.displayId)).toEqual([
      "§2.3",
      "§2.1",
    ]);
    expect(matches[0]!.matched).toEqual(["deadlin", "appeal"]);
    expect(matches[0]!.score).toBeGreaterThan(matches[1]!.score);
  });

  it("reads field paths in the evidence list as words", () => {
    expect(clauseText(register[2]!)).toContain("deadline policy");
  });

  it("returns nothing when no word is shared, and respects the limit", () => {
    expect(matchClauses("fireworks and pyrotechnics", register)).toEqual([]);
    expect(
      matchClauses("appeal review reasons clock", register, 2),
    ).toHaveLength(2);
  });

  it("is deterministic, breaking ties by register order", () => {
    const tied = matchClauses("publish", register);
    expect(tied.map((match) => match.clause.displayId)).toEqual([
      "§2.1",
      "§2.3",
    ]);
    expect(matchClauses("publish", register)).toEqual(tied);
  });

  it("writes a brief grouped by standard, with a permalink per clause", () => {
    const brief = renderSubmissionBrief({
      topic: "appeal deadlines",
      matches: matchClauses("appeal deadlines", register),
      standards: [
        {
          id: "STD-02",
          slug: "std-02-contestability-recourse",
          title: "The Contestability & Recourse Standard",
          version: "1.3.1",
          status: "Draft",
        },
      ],
      site: new URL("https://ethotechnics.org"),
    });
    expect(brief).toContain("# Submission brief: appeal deadlines");
    expect(brief).toContain(
      "## STD-02: The Contestability & Recourse Standard (v1.3.1, Draft)",
    );
    expect(brief).toContain(
      "- **STD-02 §2.3** (MUST). When a decision is made: publish binding appeal deadlines. https://ethotechnics.org/standards/std-02-contestability-recourse#clause-register",
    );
    expect(brief.indexOf("§2.3")).toBeLessThan(brief.indexOf("§2.1"));
  });

  it("says so when nothing matches", () => {
    expect(
      renderSubmissionBrief({
        topic: "fireworks",
        matches: [],
        standards: [],
        site: new URL("https://ethotechnics.org"),
      }),
    ).toContain("No clause matched these keywords.");
  });

  it("finds the halt clauses in the real register", () => {
    const all = Object.values(standardClauses).flat();
    const labels = matchClauses("halt an automated process", all).map((match) =>
      clauseLabel(match.clause),
    );
    expect(labels).toContain("STD-01 §1.1");
  });
});
