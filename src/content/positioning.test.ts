import { describe, expect, it } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";

import { cases } from "./casebook";
import { evalsContent } from "./evals";
import { methodContent } from "./method";
import {
  adversaries,
  completions,
  convergence,
  embeddedPolitics,
  instruments,
  positioning,
} from "./positioning";

/**
 * The positioning module promises each scholar a named instrument with links
 * to where it lives, each interlocutor a testable addition, and each
 * counterposition an empirical question. These tests are what notice when a
 * pairing loses its links, a numeral loses its law, or a route the module
 * names stops existing.
 */

const glossaryIds = new Set(
  (
    JSON.parse(readFileSync("src/content/glossary.json", "utf8")) as Array<{
      categories: Array<{ entries: Array<{ id: string }> }>;
    }>
  )
    .flatMap((page) => page.categories)
    .flatMap((category) => category.entries)
    .map((entry) => entry.id),
);
const theorySlugs = new Set(
  readdirSync("src/content/theory")
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, "")),
);
const standardSlugs = new Set(
  readdirSync("src/content/standards")
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, "")),
);
const diagnosticRoutes = new Set(
  readdirSync("src/pages/diagnostics")
    .filter((file) => file.endsWith(".astro"))
    .map((file) => file.replace(/\.astro$/, "")),
);
const evalSlugs = new Set(evalsContent.suites.map((suite) => suite.slug));
const casebookSlugs = new Set(cases.map((entry) => entry.slug));
const patternSlugs = new Set(
  (
    JSON.parse(readFileSync("src/content/library.json", "utf8")) as Array<{
      patterns: { entries: Array<{ slug: string }> };
    }>
  )
    .flatMap((page) => page.patterns.entries)
    .map((entry) => entry.slug),
);

/** Page routes this site serves statically, one entry per stored prefix. */
const pageFiles: Record<string, string> = {
  "/research/scholarly-crossings":
    "src/pages/research/scholarly-crossings.astro",
  "/casebook": "src/pages/casebook/index.astro",
  "/standards/laws": "src/content/standards/laws.mdx",
  "/diagnostics/delegation-audit":
    "src/pages/diagnostics/delegation-audit.astro",
};

const resolves = (href: string): boolean => {
  const [path] = href.split("#");
  if (!path) return false;
  if (pageFiles[path]) return existsSync(pageFiles[path]);
  // "/section/slug[/tail]" — the leading empty element is skipped, matching
  // the resolver in use-cases.test.ts.
  const [, section, slug, ...rest] = path.split("/");
  const tail = rest.join("/");
  switch (section) {
    case "glossary":
      return glossaryIds.has(slug);
    case "research":
      return slug === "theory" ? theorySlugs.has(tail) : false;
    case "standards":
      return standardSlugs.has(slug) || standardSlugs.has(tail);
    case "evals":
      return evalSlugs.has(slug);
    case "casebook":
      return casebookSlugs.has(slug);
    case "mechanisms":
      return slug === "patterns" ? patternSlugs.has(tail) : false;
    case "diagnostics":
      return diagnosticRoutes.has(slug);
    default:
      return false;
  }
};

describe("positioning instruments", () => {
  it("keeps nine scholar pairings", () => {
    expect(instruments).toHaveLength(9);
  });

  it("names a tradition, scholars, and an instrument for each", () => {
    for (const entry of instruments) {
      expect(entry.tradition.length).toBeGreaterThan(0);
      expect(entry.scholars.length).toBeGreaterThan(0);
      expect(entry.instrument.length).toBeGreaterThan(0);
      expect(entry.has.length).toBeGreaterThan(0);
      expect(entry.supplies.length).toBeGreaterThan(0);
    }
  });

  it("links every instrument to at least one artifact on this site", () => {
    const unlinked = instruments.filter(
      (entry) =>
        entry.links.length === 0 || entry.links.some((l) => !resolves(l.href)),
    );
    expect(unlinked).toEqual([]);
  });
});

describe("positioning completions", () => {
  it("keeps eight governance-mechanism completions", () => {
    expect(completions).toHaveLength(8);
  });

  it("states an addition and a testable record for each", () => {
    for (const entry of completions) {
      expect(entry.interlocutor.length).toBeGreaterThan(0);
      expect(entry.mechanism.length).toBeGreaterThan(0);
      expect(entry.addition.length).toBeGreaterThan(0);
      expect(entry.testable.length).toBeGreaterThan(0);
    }
  });
});

describe("positioning adversaries", () => {
  it("keeps five counterpositions", () => {
    expect(adversaries).toHaveLength(5);
  });

  it("states the challenge, the demonstration, and the settling question", () => {
    for (const entry of adversaries) {
      expect(entry.position.length).toBeGreaterThan(0);
      expect(entry.challenge.length).toBeGreaterThan(0);
      expect(entry.demonstration.length).toBeGreaterThan(0);
      expect(entry.question.length).toBeGreaterThan(0);
    }
  });

  it("names the Robodebt case where the position cites the casebook", () => {
    const mentions = adversaries.filter((entry) =>
      [entry.challenge, entry.demonstration, entry.question].some((text) =>
        text.includes("Robodebt"),
      ),
    );
    expect(mentions.length).toBe(1);
    expect(casebookSlugs.has("robodebt")).toBe(true);
  });
});

describe("convergence", () => {
  it("keeps five capacities the instruments converge on", () => {
    expect(convergence).toHaveLength(5);
    for (const entry of convergence) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.statement.length).toBeGreaterThan(0);
      expect(entry.question.length).toBeGreaterThan(0);
    }
  });
});

describe("embedded politics", () => {
  const expectedNumerals = methodContent.laws.map((law) => law.numeral);

  it("translates all twelve laws, in law order", () => {
    expect(embeddedPolitics.map((entry) => entry.numeral)).toEqual(
      expectedNumerals,
    );
  });

  it("states a proposition for each law", () => {
    for (const entry of embeddedPolitics) {
      expect(entry.proposition.length).toBeGreaterThan(0);
    }
  });

  it("resolves every numeral to a law with a live anchor", () => {
    for (const entry of embeddedPolitics) {
      const law = methodContent.laws.find(
        (candidate) => candidate.numeral === entry.numeral,
      );
      expect(law).toBeDefined();
      expect(resolves(law!.href)).toBe(true);
    }
  });
});

describe("positioning note", () => {
  it("is a dated note at a permalink the site serves", () => {
    expect(positioning.permalink).toBe("/research/scholarly-crossings");
    expect(resolves(positioning.permalink)).toBe(true);
    expect(positioning.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(positioning.disclaimer.length).toBeGreaterThan(0);
    expect(positioning.sourcesNote.length).toBeGreaterThan(0);
  });
});

describe("positioning voice", () => {
  // The site's copy rules ban selling language. The module holds user-facing
  // strings for the About page and the crossings note, so it is checked here.
  const banned = [
    "actionable",
    "seamless",
    "unlock",
    "empower",
    "stakeholder-ready",
    "comprehensive",
    "cutting-edge",
    "state-of-the-art",
  ];

  it("carries no selling language", () => {
    const strings: string[] = [];
    for (const entry of instruments) {
      strings.push(
        entry.has,
        entry.supplies,
        ...entry.links.map((link) => link.label),
      );
    }
    for (const entry of completions) {
      strings.push(entry.addition, entry.testable);
    }
    for (const entry of adversaries) {
      strings.push(entry.challenge, entry.demonstration, entry.question);
    }
    for (const entry of convergence)
      strings.push(entry.statement, entry.question);
    for (const entry of embeddedPolitics) strings.push(entry.proposition);
    const offenders = strings.filter((text) =>
      banned.some((word) => text.toLowerCase().includes(word)),
    );
    expect(offenders).toEqual([]);
  });
});
