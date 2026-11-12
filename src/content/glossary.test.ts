import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";

import retiredEntries from "../data/glossary-retired.json" with { type: "json" };
import { glossaryContent, glossaryTermSeeds, glossaryTerms } from "./glossary";
import { evalsContent } from "./evals";
import { libraryContent } from "./library";

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
    for (const slug of ["redress", "decision-system"]) {
      expect(highlighted.has(slug)).toBe(false);
    }
  });
});

describe("retired glossary entries", () => {
  const live = new Set(
    glossaryContent.categories.flatMap((category) =>
      category.entries.map((entry) => entry.id),
    ),
  );
  const patternSlugs = new Set(
    libraryContent.patterns.entries.map((pattern) => pattern.slug),
  );
  // A retired permalink lands on a page in one hop. The page is a live entry
  // or one of the pages the table names; never another retired entry.
  const resolves = (target: string): boolean => {
    const [, section, rest] = /^\/([a-z-]+)\/?(.*)$/.exec(target) ?? [];
    if (section === "glossary") return live.has(rest);
    if (section === "explainers")
      return existsSync(`src/content/explainers/${rest}.mdx`);
    if (section === "research" && rest.startsWith("theory/"))
      return existsSync(`src/content/${rest}.mdx`);
    if (section === "mechanisms" && rest.startsWith("patterns/"))
      return patternSlugs.has(rest.slice("patterns/".length));
    return existsSync(`src/pages/${section}/index.astro`) && rest === "";
  };

  it("retires no entry that is still published", () => {
    const stillLive = Object.keys(retiredEntries).filter((slug) =>
      live.has(slug),
    );
    expect(stillLive).toEqual([]);
  });

  it("sends every retired entry to a page that exists", () => {
    const dangling = Object.entries(retiredEntries)
      .filter(([, target]) => !resolves(target))
      .map(([slug, target]) => `${slug} -> ${target}`);
    expect(dangling).toEqual([]);
  });
});

describe("glossary references", () => {
  // The eval suites kept naming 43 retired entries after the glossary was
  // cut to 42, so every suite page linked through a redirect, under a label
  // made from the retired slug.
  it("name only published entries in the eval suites", () => {
    const stale = evalsContent.suites.flatMap((suite) =>
      suite.glossaryRefs
        .filter((ref) => !entryIds.has(ref))
        .map((ref) => `${suite.slug}: ${ref}`),
    );
    expect(stale).toEqual([]);
  });
});
