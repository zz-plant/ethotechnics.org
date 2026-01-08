import type { APIContext } from "astro";
import { describe, expect, it } from "bun:test";

import { GET as getRobots } from "../src/pages/robots.txt";
import { GET as getSitemap } from "../src/pages/sitemap.xml";

describe("robots.txt", () => {
  it("advertises the sitemap and default allow rules", async () => {
    const response = getRobots({
      request: new Request("https://ethotechnics.org/robots.txt"),
      site: new URL("https://example.org"),
    } as APIContext);

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
    } as APIContext);

    const body = await response.text();

    expect(body).toContain("https://ethotechnics.org/sitemap.xml");
  });

  it("blocks indexing on non-production hosts", async () => {
    const response = getRobots({
      request: new Request("https://preview.ethotechnics.org/robots.txt"),
      site: new URL("https://example.org"),
    } as APIContext);

    const body = await response.text();

    expect(body).toContain("Disallow: /");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
});

describe("sitemap.xml", () => {
  it("includes key routes with metadata", async () => {
    const response = getSitemap({
      request: new Request("https://example.test/sitemap.xml"),
      site: new URL("https://example.org"),
    } as APIContext);

    const xml = await response.text();
    const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(
      ([, loc]) => loc
    );

    expect(response.headers.get("Content-Type")).toContain("application/xml");
    expect(locs).toEqual(expect.arrayContaining(["https://example.org/"]));
    expect(locs).toEqual(
      expect.arrayContaining([
        "https://example.org/start-here/",
        "https://example.org/tools/maintenance-simulator",
      ])
    );
    expect(locs).not.toEqual(expect.arrayContaining([expect.stringMatching(/\[/)]));
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain("<priority>1.0</priority>");
  });
});
