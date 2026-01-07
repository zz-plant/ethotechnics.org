import type { APIContext } from 'astro';

const fallbackSite = 'https://ethotechnics.org';
const productionHosts = new Set(['ethotechnics.org', 'www.ethotechnics.org']);

const buildRobots = (siteUrl: URL, allowIndexing: boolean) => {
  if (!allowIndexing) {
    return 'User-agent: *\nDisallow: /\n';
  }

  const sitemapUrl = new URL('/sitemap.xml', siteUrl);

  return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl.toString()}\n`;
};

export function GET({ request, site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const requestHost = new URL(request.url).hostname;
  const allowIndexing = productionHosts.has(requestHost);

  return new Response(buildRobots(siteUrl, allowIndexing), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      ...(allowIndexing ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }),
    },
  });
}
