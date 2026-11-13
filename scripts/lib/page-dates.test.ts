import { describe, expect, test } from "bun:test";

import {
  buildPageDates,
  contentImports,
  parseGitLog,
  routeForPage,
} from "./page-dates";

describe("parseGitLog", () => {
  test("keeps each file's newest commit date", () => {
    const log = [
      "\x1e2026-11-12T16:18:44-06:00",
      "",
      "src/pages/method.astro",
      "src/content/method.ts",
      "\x1e2026-09-06T10:00:00-05:00",
      "",
      "src/pages/method.astro",
      "src/pages/about.astro",
    ].join("\n");
    const dates = parseGitLog(log);
    expect(dates.get("src/pages/method.astro")).toBe(
      "2026-11-12T16:18:44-06:00",
    );
    expect(dates.get("src/pages/about.astro")).toBe(
      "2026-09-06T10:00:00-05:00",
    );
  });
});

describe("routeForPage", () => {
  test("maps page files to the URLs they serve", () => {
    expect(routeForPage("src/pages/index.astro")).toBe("/");
    expect(routeForPage("src/pages/method.astro")).toBe("/method");
    expect(routeForPage("src/pages/standards/index.astro")).toBe("/standards");
  });

  test("skips dynamic and private routes", () => {
    expect(routeForPage("src/pages/glossary/[slug].astro")).toBeNull();
    expect(routeForPage("src/pages/_drafts/note.astro")).toBeNull();
  });
});

describe("contentImports", () => {
  const files = new Set([
    "src/content/method.ts",
    "src/data/glossary-retired.json",
    "src/content/standards/index.ts",
  ]);
  const exists = (path: string) => files.has(path);

  test("follows relative and aliased imports into content and data", () => {
    const source = `
      import { methodContent } from "../content/method";
      import retired from "@/data/glossary-retired.json";
      import { standards } from "../content/standards";
      import BaseLayout from "../layouts/BaseLayout.astro";
      import { cn } from "../utils/cn";
    `;
    expect(contentImports("src/pages/method.astro", source, exists)).toEqual([
      "src/content/method.ts",
      "src/data/glossary-retired.json",
      "src/content/standards/index.ts",
    ]);
  });
});

describe("buildPageDates", () => {
  test("dates a page by its latest commit to the page or its content", () => {
    const commits = new Map([
      ["src/pages/method.astro", "2026-09-06T00:00:00Z"],
      ["src/content/method.ts", "2026-11-12T22:16:22Z"],
      ["src/pages/about.astro", "2026-10-01T00:00:00Z"],
    ]);
    const sources: Record<string, string> = {
      "src/pages/method.astro": `import { m } from "../content/method";`,
      "src/pages/about.astro": `import Layout from "../layouts/BaseLayout.astro";`,
      "src/pages/glossary/[slug].astro": "",
    };
    const dates = buildPageDates(
      Object.keys(sources),
      commits,
      (path) => sources[path] ?? "",
      (path) => path === "src/content/method.ts",
    );
    expect(dates).toEqual({
      "/method": "2026-11-12T22:16:22.000Z",
      "/about": "2026-10-01T00:00:00.000Z",
    });
  });
});
