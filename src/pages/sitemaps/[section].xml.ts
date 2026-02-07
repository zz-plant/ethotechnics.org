import type { APIContext } from "astro";

import { buildSitemapSections, renderSitemap } from "../../utils/sitemaps";

const fallbackSite = "https://ethotechnics.org";
const validSections = ["core", "glossary", "standards", "taxonomy"] as const;
type SitemapSection = (typeof validSections)[number];

export function getStaticPaths() {
  return validSections.map((section) => ({ params: { section } }));
}

export async function GET({ params, site }: APIContext) {
  const section = params.section;

  if (!section || !validSections.includes(section as SitemapSection)) {
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
