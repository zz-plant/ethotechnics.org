import type { APIContext } from 'astro';

const fallbackSite = 'https://ethotechnics.org';

const buildRobots = (siteUrl: URL) => {
  const sitemapUrl = new URL('/sitemap.xml', siteUrl);

  return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl.toString()}\n`;
};

export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);

  return new Response(buildRobots(siteUrl), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
