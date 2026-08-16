import { describe, expect, it } from "bun:test";
import { createSearchRenderer } from "./render";
import type { PagefindResultData } from "./types";

describe("search renderer states", () => {
  it("renders empty and loading states", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.showEmpty();
    expect(container.textContent).toContain("Start typing to search");

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

  it("shows no-results state", () => {
    const container = document.createElement("div");
    const renderer = createSearchRenderer(container);

    renderer.renderResults([], "none");
    expect(container.textContent).toContain("No matches yet");
  });
});
