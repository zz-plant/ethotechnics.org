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
        meta: { title: "Contestability Standard", type: "Standards" },
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
          url: "/glossary/appeal-passage-rate",
          excerpt:
            "judged on &lt;b&gt;merits&lt;/b&gt; &amp; evidence when a person <mark>appealed</mark>",
          meta: { title: "Appeal passage rate", type: "Glossary" },
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

  it("groups results by the search group each page names", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.renderResults(
      [
        {
          url: "/roles/engineering",
          excerpt: "Who answers for an appeal",
          meta: { title: "Engineering: role path", type: "Guides" },
        },
        {
          url: "/glossary/appeal-passage-rate",
          excerpt: "Appeals are judged on merits",
          meta: { title: "Appeal passage rate", type: "Glossary" },
        },
        {
          url: "/old",
          excerpt: "From an index built before the groups",
          meta: { title: "Old page", type: "roles" },
        },
      ],
      "appeal",
    );

    expect(
      Array.from(
        container.querySelectorAll(".search-results__group-title"),
        (title) => title.textContent,
      ),
    ).toEqual(["Glossary", "Guides", "Other pages"]);
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
