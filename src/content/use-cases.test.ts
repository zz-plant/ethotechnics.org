import { describe, expect, it } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";

import { cases } from "./casebook";
import { getStandardBySlug } from "./standards";
import {
  boundaries,
  caseLink,
  fitForExample,
  standardLink,
  toolLink,
  useCases,
  useCasesContent,
} from "./use-cases";

/**
 * The page claims each worked example for one context, cites a clause for
 * each scored case, and links standards, tools, cases, and incidents by id.
 * These tests are what notice when any of those stops being true.
 */

const exampleSlugs = readdirSync("src/pages/examples")
  .filter((file) => file.endsWith(".astro") && file !== "index.astro")
  .map((file) => file.replace(/\.astro$/, ""));

const pageIds = new Set([
  ...useCases.map((entry) => entry.id),
  ...boundaries.map((entry) => entry.id),
]);

/** Whether a stored internal link reaches a route this site serves. */
const resolves = (href: string): boolean => {
  if (href.startsWith("#")) return pageIds.has(href.slice(1));
  const path = href.split("#")[0] ?? href;
  const [, section, slug, ...rest] = path.split("/");
  if (rest.length === 0 && slug) {
    if (section === "standards" && getStandardBySlug(slug)) return true;
    if (section === "casebook") return cases.some((c) => c.slug === slug);
    if (section === "incidents")
      return existsSync(`src/content/incidents/${slug}.mdx`);
    if (section === "glossary")
      return readFileSync("src/content/glossary.json", "utf8").includes(
        `"id": "${slug}"`,
      );
  }
  return (
    existsSync(`public${path}`) ||
    existsSync(`src/pages${path}.astro`) ||
    existsSync(`src/pages${path}/index.astro`)
  );
};

describe("every worked example belongs somewhere", () => {
  it("claims each example page for exactly one context or boundary", () => {
    for (const slug of exampleSlugs) {
      const href = `/examples/${slug}`;
      const claims = [...useCases, ...boundaries].filter((entry) =>
        entry.examples.some((example) => example.href === href),
      );
      expect(claims.length, `${slug} is claimed ${claims.length} times`).toBe(
        1,
      );
      expect(fitForExample(slug)).toBeDefined();
    }
  });

  it("claims no example that has no page", () => {
    for (const entry of [...useCases, ...boundaries]) {
      for (const example of entry.examples) {
        expect(
          exampleSlugs.map((slug) => `/examples/${slug}`),
          `${entry.id} claims ${example.href}`,
        ).toContain(example.href);
      }
    }
  });
});

describe("the registry points at things that exist", () => {
  it("gives every context and boundary a unique anchor", () => {
    expect(pageIds.size).toBe(useCases.length + boundaries.length);
  });

  it("resolves every standard, tool, and case it names", () => {
    for (const entry of useCases) {
      for (const id of entry.bind) expect(() => standardLink(id)).not.toThrow();
      expect(() => toolLink(entry.runFirst)).not.toThrow();
      for (const ref of entry.cases) expect(() => caseLink(ref)).not.toThrow();
    }
  });

  // A clause is cited on this page because the case says it would have
  // caught the failure. If the case stops saying so, the citation is ours.
  it("cites only the clause each case's missing record names", () => {
    for (const entry of useCases) {
      for (const ref of entry.cases) {
        const scored = cases.find((c) => c.slug === ref.slug);
        expect(
          scored?.theMissingRecord,
          `${ref.slug} does not name ${ref.clause.standard} ${ref.clause.clause}`,
        ).toContain(`${ref.clause.standard} ${ref.clause.clause}`);
      }
    }
  });

  it("says something in place of a case when none is scored", () => {
    for (const entry of useCases) {
      if (entry.cases.length === 0) {
        expect(entry.noCaseNote, `${entry.id} needs a note`).toBeTruthy();
      }
    }
  });

  it("links only to routes the site serves", () => {
    const hrefs = [
      ...useCasesContent.shortAnswer.map((item) => item.link.href),
      ...useCasesContent.tooling.flatMap((item) =>
        item.links.map((link) => link.href),
      ),
      ...useCases.flatMap((entry) => [
        ...entry.examples.map((link) => link.href),
        ...entry.incidents.map((link) => link.href),
      ]),
      ...boundaries.flatMap((entry) => (entry.link ? [entry.link.href] : [])),
    ];
    for (const href of hrefs) {
      expect(resolves(href), `${href} does not resolve`).toBe(true);
    }
  });
});
