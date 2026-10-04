import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  safeguardsInTaxonomy,
  theoryTaxonomy,
  theoryTaxonomyBySlug,
  getTheoryQuestionsBySafeguard,
} from "./theory-taxonomy";

describe("theory inquiry taxonomy", () => {
  it("covers all theory essays in src/content/theory", () => {
    const theoryDir = "src/content/theory";
    const files = readdirSync(theoryDir).filter((file) =>
      file.endsWith(".mdx"),
    );

    expect(theoryTaxonomy.length).toBe(files.length);

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const entry = theoryTaxonomyBySlug.get(slug);
      expect(entry).toBeDefined();

      const content = readFileSync(join(theoryDir, file), "utf-8");
      const matchTitle = content.match(/^title:\s*"([^"]+)"/m);
      const matchQuestion = content.match(/^question:\s*"([^"]+)"/m);
      const matchPermalink = content.match(/^permalink:\s*"([^"]+)"/m);

      expect(matchTitle).not.toBeNull();
      expect(matchQuestion).not.toBeNull();
      expect(matchPermalink).not.toBeNull();

      expect(entry?.title).toBe(matchTitle![1]);
      expect(entry?.question).toBe(matchQuestion![1]);
      expect(entry?.href).toBe(matchPermalink![1]);
    }
  });

  it("files every entry under a valid safeguard and domain", () => {
    const validSafeguards = new Set(safeguardsInTaxonomy);
    const validDomains = new Set([
      "Governance",
      "Assurance",
      "Delivery",
      "Dependence",
      "Experience",
      "Authority",
    ]);

    for (const entry of theoryTaxonomy) {
      expect(validSafeguards.has(entry.safeguard)).toBe(true);
      expect(validDomains.has(entry.domain)).toBe(true);
      expect(entry.question.endsWith("?")).toBe(true);
      expect(entry.mechanism.length).toBeGreaterThan(10);
    }
  });

  it("distributes questions across all six safeguards", () => {
    for (const safeguard of safeguardsInTaxonomy) {
      const questions = getTheoryQuestionsBySafeguard(safeguard);
      expect(questions.length).toBeGreaterThanOrEqual(2);
    }
  });
});
