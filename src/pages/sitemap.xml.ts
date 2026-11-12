import type { APIContext } from "astro";

import { SITEMAP_SECTIONS } from "../utils/seo/route-type";
import {
  buildSitemapSections,
  renderSitemapIndex,
} from "../utils/seo/sitemaps";

const fallbackSite = "https://ethotechnics.org";

export async function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const sections = await buildSitemapSections();
  const sitemapEntries = SITEMAP_SECTIONS.map((section) => {
    const sectionEntries = sections[section];
    const latestLastmod = sectionEntries.reduce<string | undefined>(
      (latest, entry) => {
        if (!entry.lastmod) return latest;
        if (!latest) return entry.lastmod;
        return new Date(entry.lastmod).getTime() > new Date(latest).getTime()
          ? entry.lastmod
          : latest;
      },
      undefined,
    );

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
