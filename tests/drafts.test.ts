import { describe, expect, it, mock } from "bun:test";

/**
 * docs/drafts/ holds content written in a published format but not yet
 * published. Nothing there is built, routed, or listed in the sitemap. These
 * tests hold both halves of that: each draft fits the format it will be
 * published in, and none of it has leaked into the site.
 */

// content.config.ts calls defineCollection from a virtual module that only
// exists inside an Astro build. The schemas it builds are plain zod.
await mock.module("astro:content", () => ({
  defineCollection: <T>(config: T) => config,
}));

const { collections } = await import("../src/content.config");
const { cases, stateVariables } = await import("../src/content/casebook");
const { standardClauses, standardsContent } =
  await import("../src/content/standards");
const { buildSitemapSections } = await import("../src/utils/sitemaps");
const { draftHealthcareCasebook, draftHealthcareCases } =
  await import("../docs/drafts/healthcare-casebook");

const EXPLAINER_DRAFT = "docs/drafts/human-in-the-loop-or-rubber-stamp.mdx";

const frontmatter = async (path: string) => {
  const source = await Bun.file(path).text();
  const [, yaml] = source.split(/^---$/m);
  return Bun.YAML.parse(yaml ?? "") as Record<string, unknown>;
};

const sitemapPaths = async () => {
  const sections = await buildSitemapSections();
  return Object.values(sections).flatMap((entries) =>
    entries.map((entry) => entry.path),
  );
};

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

describe("human-in-the-loop explainer draft", () => {
  it("fits the explainers collection schema", async () => {
    const data = await frontmatter(EXPLAINER_DRAFT);
    const result = collections.explainers.schema.safeParse(data);
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it("keeps its description to 160 characters", async () => {
    const data = await frontmatter(EXPLAINER_DRAFT);
    expect(String(data.description).length).toBeLessThanOrEqual(160);
  });

  it("is not published: no explainer claims its permalink, and the sitemap does not list it", async () => {
    const { permalink } = await frontmatter(EXPLAINER_DRAFT);
    const published = new Bun.Glob("src/content/explainers/*.mdx");
    for await (const file of published.scan({ cwd: process.cwd() })) {
      const data = await frontmatter(file);
      expect(data.permalink, file).not.toBe(permalink);
    }
    expect(await sitemapPaths()).not.toContain(permalink);
  });
});

describe("healthcare casebook draft", () => {
  it("is not published: no case shares a slug, and the sitemap lists none", async () => {
    const publishedSlugs = new Set(cases.map((entry) => entry.slug));
    const listed = await sitemapPaths();
    for (const entry of draftHealthcareCases) {
      expect(publishedSlugs.has(entry.slug), entry.slug).toBe(false);
      expect(listed).not.toContain(`/casebook/${entry.slug}`);
    }
    expect(listed).not.toContain(draftHealthcareCasebook.permalink);
  });

  it("marks every score as a draft", () => {
    for (const entry of draftHealthcareCases) {
      expect(entry.scoreStatus, entry.slug).toBe("draft");
    }
  });

  it("scores every case on each of the six safeguards exactly once", () => {
    const ids = stateVariables.map((variable) => variable.id).sort();
    for (const entry of draftHealthcareCases) {
      const scored = entry.findings.map((finding) => finding.variable);
      expect(scored.slice().sort(), entry.slug).toEqual(ids);
    }
  });

  it("pins every clause to the register of a standard with a published page", () => {
    for (const entry of draftHealthcareCases) {
      for (const finding of entry.findings) {
        expect(finding.clauses.length).toBeGreaterThan(0);
        for (const ref of finding.clauses) {
          const label = `${entry.slug}/${finding.variable}: ${ref.standard} ${ref.clause}`;
          const clause = standardClauses[ref.standard]?.find(
            (candidate) => candidate.displayId === ref.clause,
          );
          expect(clause, label).toBeDefined();
          const standard = standardsContent.standards.find(
            (candidate) => candidate.id === ref.standard,
          );
          expect(standard?.listedOnSite, label).not.toBe(false);
        }
      }
    }
  });

  it("cites only the twelve laws", () => {
    for (const entry of draftHealthcareCases) {
      for (const finding of entry.findings) {
        expect(finding.laws.length).toBeGreaterThan(0);
        for (const law of finding.laws) expect(lawIds.has(law)).toBe(true);
      }
    }
  });

  it("keeps the casebook's claim that standing has never held", () => {
    for (const entry of draftHealthcareCases) {
      const standing = entry.findings.find(
        (finding) => finding.variable === "standing",
      );
      expect(standing?.verdict, entry.slug).not.toBe("held");
    }
  });

  it("dates and links every source, and says whether the case meets the admission rule", () => {
    for (const entry of draftHealthcareCases) {
      expect(entry.sources.length, entry.slug).toBeGreaterThan(0);
      for (const source of entry.sources) {
        // A month-only date stands where the document gives no day; the
        // published casebook needs the full date before this can move.
        expect(source.date, source.label).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
        if (source.href) expect(source.href).toMatch(/^https:\/\//);
      }
      expect(typeof entry.meetsAdmissionRule, entry.slug).toBe("boolean");
      expect(entry.admissionReason.length, entry.slug).toBeGreaterThan(0);
    }
  });

  it("does not cite press or a study for a case it says meets the admission rule", () => {
    for (const entry of draftHealthcareCases.filter(
      (candidate) => candidate.meetsAdmissionRule,
    )) {
      for (const source of entry.sources) {
        expect(["press", "study"], entry.slug).not.toContain(source.kind);
      }
    }
  });

  it("keeps timelines between four and seven events, in order, with at most one turn", () => {
    for (const entry of draftHealthcareCases) {
      const events = entry.timeline ?? [];
      expect(events.length, entry.slug).toBeGreaterThanOrEqual(4);
      expect(events.length, entry.slug).toBeLessThanOrEqual(7);
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
    expect(draftHealthcareCasebook.pageDescription.length).toBeLessThanOrEqual(
      160,
    );
    for (const entry of draftHealthcareCases) {
      expect(
        entry.metaDescription?.length ?? 0,
        entry.slug,
      ).toBeLessThanOrEqual(160);
    }
  });
});
