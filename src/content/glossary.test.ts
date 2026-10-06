import { describe, expect, it } from "bun:test";

import { glossaryContent, glossaryTermSeeds, glossaryTerms } from "./glossary";

/**
 * Tooltips read their definition from the glossary entry, so the two cannot
 * drift apart. These tests notice when a second copy of a definition comes
 * back, or when a tooltip stops opening on a sentence.
 */

const entryIds = new Set(
  glossaryContent.categories.flatMap((category) =>
    category.entries.map((entry) => entry.id),
  ),
);

describe("glossary tooltip definitions", () => {
  it("keep no second copy of a definition for a term with an entry", () => {
    const duplicated = glossaryTermSeeds
      .filter((seed) => entryIds.has(seed.slug) && seed.definition)
      .map((seed) => seed.slug);
    expect(duplicated).toEqual([]);
  });

  it("define every term with no entry", () => {
    const undefinedTerms = glossaryTermSeeds
      .filter((seed) => !entryIds.has(seed.slug) && !seed.definition)
      .map((seed) => seed.slug);
    expect(undefinedTerms).toEqual([]);
  });

  it("open on the start of a sentence", () => {
    const malformed = glossaryTerms
      .filter((term) => !/^[A-Z“"‘]/.test(term.definition))
      .map((term) => `${term.slug}: ${term.definition.slice(0, 40)}`);
    expect(malformed).toEqual([]);
  });
});

describe("glossary highlighting", () => {
  it("leaves everyday, legal, and engineering words to their ordinary sense", () => {
    const highlighted = new Set(
      glossaryTerms
        .filter((term) => term.autoHighlight !== false)
        .map((term) => term.slug),
    );
    for (const slug of [
      "settlement",
      "rollback",
      "audit-trail",
      "redress",
      "extraction",
      "human-factors",
      "stewardship",
      "backstop",
    ]) {
      expect(highlighted.has(slug)).toBe(false);
    }
  });
});
