import type { APIContext } from "astro";

import { renderSitemapIndex } from "../utils/sitemaps";

const fallbackSite = "https://ethotechnics.org";

const sitemapPaths = [
  "/sitemaps/core.xml",
  "/sitemaps/glossary.xml",
  "/sitemaps/standards.xml",
  "/sitemaps/taxonomy.xml",
];

export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const xml = renderSitemapIndex(siteUrl, sitemapPaths);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
