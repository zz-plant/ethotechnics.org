export const prerender = true;

import type { APIContext } from "astro";

import {
  SITEMAP_SECTIONS,
  type SitemapSection,
} from "../../utils/seo/route-type";
import { buildSitemapSections, renderSitemap } from "../../utils/seo/sitemaps";

const fallbackSite = "https://ethotechnics.org";

export function getStaticPaths() {
  return SITEMAP_SECTIONS.map((section) => ({ params: { section } }));
}

export async function GET({ params, site }: APIContext) {
  const section = params.section;

  if (!section || !SITEMAP_SECTIONS.includes(section as SitemapSection)) {
    return new Response("Not found", { status: 404 });
  }

  const sections = await buildSitemapSections();
  const entries = sections[section as SitemapSection];
  const siteUrl = site ?? new URL(fallbackSite);
  const xml = renderSitemap(siteUrl, entries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
