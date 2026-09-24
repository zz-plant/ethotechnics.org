import { describe, expect, it } from "bun:test";

const read = (path: string) => Bun.file(path).text();

describe("SEO regression source checks", () => {
  it("keeps canonical, robots, and JSON-LD wiring in BaseLayout", async () => {
    const layout = await read("src/layouts/BaseLayout.astro");

    expect(layout).toContain("canonical={canonical}");
    expect(layout).toContain('name: "robots"');
    expect(layout).toContain('type="application/ld+json"');
    expect(layout).toContain('type: "application/rss+xml"');
    expect(layout).toContain('href: "/rss.xml"');
  });

  it("blocks secondary hosts from indexing in robots.txt", async () => {
    const robotsRoute = await read("src/pages/robots.txt.ts");

    expect(robotsRoute).toContain("ethotechnics.org");
    expect(robotsRoute).not.toContain("ethotechnics.com");
    expect(robotsRoute).toContain("X-Robots-Tag");
  });

  it("serves robots.txt from the route, not a static file that shadows it", async () => {
    // A static robots.txt in the build output is served before the Worker
    // runs, so the route's sitemap pointer, its /readouts/ rule, and its
    // noindex for preview hosts never ship. The astro-robots-txt
    // integration wrote exactly that file, pointing at a sitemap that 404s.
    const config = await read("astro.config.mjs");
    expect(config).not.toContain("astro-robots-txt");
    expect(await Bun.file("public/robots.txt").exists()).toBe(false);

    const robotsRoute = await read("src/pages/robots.txt.ts");
    expect(robotsRoute).toContain('"/sitemap.xml"');
    expect(robotsRoute).toContain("Disallow: /readouts/");
  });

  it("keeps article date metadata support wired through helpers", async () => {
    const layout = await read("src/layouts/BaseLayout.astro");
    const schemaBuilders = await read("src/utils/seo/schema/builders.ts");

    expect(layout).toContain("publishedTime?: string");
    expect(layout).toContain("article:");
    expect(schemaBuilders).toContain("datePublished");
    expect(schemaBuilders).toContain("dateModified");
  });
});
