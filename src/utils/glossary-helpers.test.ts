import { describe, expect, it } from "bun:test";

import { glossaryContent } from "../content/glossary";
import {
  getDefinitionLinks,
  getRelatedGlossaryTerms,
} from "./glossary-helpers";

const entry = (id: string, bodyHtml: string, adjacentTerms?: string[]) => ({
  id,
  bodyHtml,
  adjacentTerms,
});

describe("getDefinitionLinks", () => {
  it("lists linked entry ids once, in order, without the entry itself", () => {
    expect(
      getDefinitionLinks(
        entry(
          "a",
          '<p><a href="/glossary/b">b</a>, <a href="/glossary/a">a</a>, <a href="/glossary/c">c</a>, <a href="/glossary/b">b</a></p>',
        ),
      ),
    ).toEqual(["b", "c"]);
  });
});

describe("getRelatedGlossaryTerms", () => {
  const entries = [
    entry("a", '<p>Links <a href="/glossary/b">b</a>.</p>', ["c", "missing"]),
    entry("b", "<p>No links.</p>"),
    entry("c", "<p>No links.</p>"),
    entry("d", '<p>Points back to <a href="/glossary/a">a</a>.</p>'),
    entry("e", "<p>No links.</p>", ["a"]),
  ];

  it("joins adjacent terms and entries that point at this one", () => {
    expect(getRelatedGlossaryTerms(entries[0], entries)).toEqual([
      "c",
      "d",
      "e",
    ]);
  });

  it("leaves out terms the definition already links and ids with no page", () => {
    const related = getRelatedGlossaryTerms(entries[0], entries);
    expect(related).not.toContain("b");
    expect(related).not.toContain("missing");
  });

  it("returns only ids that have a glossary page", () => {
    const all = glossaryContent.categories.flatMap(
      (category) => category.entries,
    );
    const ids = new Set(all.map((item) => item.id));
    for (const item of all) {
      for (const id of getRelatedGlossaryTerms(item, all)) {
        expect(ids.has(id)).toBe(true);
      }
    }
  });
});
