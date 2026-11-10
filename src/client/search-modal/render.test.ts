import { describe, expect, it } from "bun:test";
import { createSearchRenderer } from "./render";
import type { PagefindResultData } from "./types";

describe("search renderer states", () => {
  it("renders empty and loading states", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.showEmpty();
    expect(container.textContent).toContain("Results appear here as you type");

    renderer.showLoading();
    expect(container.textContent).toContain("Searching…");
  });

  it("renders grouped results with highlights", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    const results: PagefindResultData[] = [
      {
        url: "/standards/a",
        excerpt: "Contestability and recourse details",
        meta: { title: "Contestability Standard", type: "standard" },
      },
    ];

    renderer.renderResults(results, "contest");

    expect(
      container.querySelector(".search-results__group-title")?.textContent,
    ).toBe("Standards");
    expect(container.querySelectorAll("mark").length).toBeGreaterThan(0);
  });

  it("shows Pagefind's marks as highlights and the rest of an excerpt as text", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.renderResults(
      [
        {
          url: "/glossary/appeal-integrity",
          excerpt:
            "judged on &lt;b&gt;merits&lt;/b&gt; &amp; evidence when a person <mark>appealed</mark>",
          meta: { title: "Appeal integrity", type: "glossary" },
        },
      ],
      "appeal",
    );

    const excerpt = container.querySelector(".search-result__excerpt");
    expect(excerpt?.textContent).toBe(
      "judged on <b>merits</b> & evidence when a person appealed",
    );
    expect(
      Array.from(
        excerpt?.querySelectorAll("mark") ?? [],
        (mark) => mark.textContent,
      ),
    ).toEqual(["appealed"]);
    expect(excerpt?.querySelector("b")).toBeNull();
  });

  it("shows no-results state", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.renderResults([], "none");
    expect(container.textContent).toContain("No pages match “none”");
  });

  it("names glossary results instead of filing them under other pages", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.renderResults(
      [
        {
          url: "/glossary/appeal-integrity",
          excerpt: "Appeals are judged on merits",
          meta: { title: "Appeal integrity", type: "glossary" },
        },
        {
          url: "/roles/risk-owner",
          excerpt: "Who answers for an appeal",
          meta: { title: "Risk owner", type: "roles" },
        },
      ],
      "appeal",
    );

    expect(
      Array.from(
        container.querySelectorAll(".search-results__group-title"),
        (title) => title.textContent,
      ),
    ).toEqual(["Glossary", "Other pages"]);
  });

  it("offers the title search when full-text search cannot answer", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.showFallback(
      "Full-text search did not load.",
      "Search titles and summaries instead",
      "time to halt",
    );

    expect(container.textContent).toBe(
      "Full-text search did not load. Search titles and summaries instead.",
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "/search?q=time%20to%20halt",
    );
  });
});
