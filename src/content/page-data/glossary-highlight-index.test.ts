import { describe, expect, it } from "bun:test";

import { glossaryTerms } from "../glossary";
import { buildGlossaryHighlightIndex } from "./glossary-highlight-index";

describe("buildGlossaryHighlightIndex", () => {
  const index = buildGlossaryHighlightIndex();

  it("leaves out terms flagged autoHighlight: false", () => {
    const optedOut = glossaryTerms
      .filter((term) => term.autoHighlight === false)
      .map((term) => term.slug);
    const slugs = new Set(index.map((entry) => entry.slug));

    expect(optedOut.length).toBeGreaterThan(0);
    expect(optedOut.filter((slug) => slugs.has(slug))).toEqual([]);
    expect(index.length).toBe(glossaryTerms.length - optedOut.length);
  });

  it("keeps each definition short enough for a card", () => {
    expect(index.filter((entry) => entry.definition.length > 220)).toEqual([]);
  });

  // Every page with prose downloads this. The glossary itself is 750 KB.
  it("stays a fraction of the glossary's size", () => {
    expect(JSON.stringify(index).length).toBeLessThan(150_000);
  });
});
