import { describe, expect, it } from "bun:test";

import { eyebrowRestatesTitle } from "./eyebrow";

describe("eyebrowRestatesTitle", () => {
  it("catches an eyebrow the heading already says", () => {
    expect(eyebrowRestatesTitle("Evidence pack", "STD-01 Evidence Pack")).toBe(
      true,
    );
    expect(eyebrowRestatesTitle("Test cases", "12 test cases")).toBe(true);
  });

  it("keeps an eyebrow that adds a word", () => {
    expect(
      eyebrowRestatesTitle("Standard", "The Temporal Bill of Rights"),
    ).toBe(false);
    expect(eyebrowRestatesTitle("STD-01", "Stoppability")).toBe(false);
  });

  it("keeps an eyebrow with no word to compare", () => {
    expect(eyebrowRestatesTitle("P1", "Anything")).toBe(false);
  });
});
