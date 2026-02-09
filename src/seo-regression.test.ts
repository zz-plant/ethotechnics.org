import { describe, expect, it } from "bun:test";

const read = (path: string) => Bun.file(path).text();

describe("SEO regression source checks", () => {
  it("keeps canonical, robots, and JSON-LD wiring in BaseLayout", async () => {
    const layout = await read("src/layouts/BaseLayout.astro");

    expect(layout).toContain("canonical={canonical}");
    expect(layout).toContain('name: "robots"');
    expect(layout).toContain('type="application/ld+json"');
  });

  it("blocks secondary hosts from indexing in robots.txt", async () => {
    const robotsRoute = await read("src/pages/robots.txt.ts");

    expect(robotsRoute).toContain("ethotechnics.org");
    expect(robotsRoute).not.toContain("ethotechnics.com");
    expect(robotsRoute).toContain("X-Robots-Tag");
  });

  it("keeps article date metadata support in BaseLayout", async () => {
    const layout = await read("src/layouts/BaseLayout.astro");

    expect(layout).toContain("publishedTime?: string");
    expect(layout).toContain("datePublished");
    expect(layout).toContain("dateModified");
    expect(layout).toContain("article:");
  });
});
