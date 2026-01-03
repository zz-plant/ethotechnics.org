import type { APIContext } from 'astro';

const fallbackSite = 'https://ethotechnics.org';

const pageModules = import.meta.glob('./**/*.astro', { eager: true });

const normalizeRoutePath = (filePath: string) => {
  const withoutPrefix = filePath.replace(/^\.\//, '').replace(/\.astro$/, '');

  if (withoutPrefix.includes('[')) {
    return null;
  }

  if (withoutPrefix === 'index') {
    return '/';
  }

  if (withoutPrefix.endsWith('/index')) {
    return `/${withoutPrefix.slice(0, -6)}/`;
  }

  return `/${withoutPrefix}`;
};

const pagePaths = Object.keys(pageModules)
  .map(normalizeRoutePath)
  .filter((path): path is string => Boolean(path));

const buildUrlSet = (base: URL) => {
  const lastmod = new Date().toISOString();

  return pagePaths.map((path) => {
    const loc = new URL(path, base).toString();
    const isHome = path === '/';

    return {
      loc,
      lastmod,
      changefreq: isHome ? 'weekly' : 'monthly',
      priority: isHome ? '1.0' : undefined,
    };
  });
};

const renderUrl = ({ loc, lastmod, changefreq, priority }: ReturnType<typeof buildUrlSet>[number]) => {
  const changefreqTag = changefreq ? `\n  <changefreq>${changefreq}</changefreq>` : '';
  const priorityTag = priority ? `\n  <priority>${priority}</priority>` : '';

  return `<url>\n  <loc>${loc}</loc>\n  <lastmod>${lastmod}</lastmod>${changefreqTag}${priorityTag}\n</url>`;
};

export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const urls = buildUrlSet(siteUrl).map(renderUrl).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
