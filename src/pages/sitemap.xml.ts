import type { APIContext } from "astro";

import { buildSitemapSections, renderSitemapIndex } from "../utils/sitemaps";

const fallbackSite = "https://ethotechnics.org";

const sitemapPaths = ["core", "glossary", "standards", "taxonomy"] as const;

export async function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const sections = await buildSitemapSections();
  const sitemapEntries = sitemapPaths.map((section) => {
    const sectionEntries = sections[section];
    const latestLastmod = sectionEntries.reduce<string | undefined>((latest, entry) => {
      if (!entry.lastmod) return latest;
      if (!latest) return entry.lastmod;
      return new Date(entry.lastmod).getTime() > new Date(latest).getTime()
        ? entry.lastmod
        : latest;
    }, undefined);

    return {
      path: `/sitemaps/${section}.xml`,
      lastmod: latestLastmod,
    };
  });
  const xml = renderSitemapIndex(siteUrl, sitemapEntries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
