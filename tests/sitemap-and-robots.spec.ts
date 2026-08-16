import type { APIContext } from "astro";
import { describe, expect, it } from "bun:test";

import { GET as getRobots } from "../src/pages/robots.txt";
import { GET as getSitemapIndex } from "../src/pages/sitemap.xml";
import { GET as getSitemapSection } from "../src/pages/sitemaps/[section].xml";

describe("robots.txt", () => {
  it("advertises the sitemap and default allow rules", async () => {
    const response = getRobots({
      request: new Request("https://ethotechnics.org/robots.txt"),
      site: new URL("https://example.org"),
    } as unknown as APIContext);

    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap: https://example.org/sitemap.xml");
  });

  it("falls back to the production domain when site is missing", async () => {
    const response = getRobots({
      request: new Request("https://ethotechnics.org/robots.txt"),
      site: undefined,
    } as unknown as APIContext);

    const body = await response.text();

    expect(body).toContain("https://ethotechnics.org/sitemap.xml");
  });

  it("blocks indexing on secondary hosts", async () => {
    const response = getRobots({
      request: new Request("https://ethotechnics.com/robots.txt"),
      site: new URL("https://ethotechnics.org"),
    } as unknown as APIContext);

    const body = await response.text();

    expect(body).toContain("Disallow: /");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("blocks indexing on non-production hosts", async () => {
    const response = getRobots({
      request: new Request("https://preview.ethotechnics.org/robots.txt"),
      site: new URL("https://example.org"),
    } as unknown as APIContext);

    const body = await response.text();

    expect(body).toContain("Disallow: /");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
});

describe("sitemap.xml", () => {
  it("lists section sitemaps with lastmod metadata", async () => {
    const response = await getSitemapIndex({
      request: new Request("https://example.test/sitemap.xml"),
      site: new URL("https://example.org"),
    } as unknown as APIContext);

    const xml = await response.text();

    expect(response.headers.get("Content-Type")).toContain("application/xml");
    expect(xml).toContain("https://example.org/sitemaps/core.xml");
    expect(xml).toContain("https://example.org/sitemaps/glossary.xml");
    expect(xml).toContain("<lastmod>");
  });

  it("includes image sitemap data for homepage in the core section", async () => {
    const response = await getSitemapSection({
      request: new Request("https://example.test/sitemaps/core.xml"),
      site: new URL("https://example.org"),
      params: { section: "core" },
    } as unknown as APIContext);

    const xml = await response.text();

    expect(xml).toContain(
      'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    );
    expect(xml).toContain("<image:image>");
    expect(xml).toContain(
      "https://example.org/assets/ethotechnics-hero-map.svg",
    );
  });
});
