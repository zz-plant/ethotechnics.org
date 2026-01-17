import type { APIContext } from 'astro';

const fallbackSite = 'https://ethotechnics.org';

const fallbackPaths = ['/'];

const loadPageModules = async () => {
  if (typeof import.meta.glob === 'function') {
    return import.meta.glob('./**/*.astro', { eager: true });
  }

  if (typeof Bun !== 'undefined') {
    const modules: Record<string, true> = {};
    const glob = new Bun.Glob('src/pages/**/*.astro');

    for await (const file of glob.scan({ cwd: process.cwd() })) {
      const relativePath = file.replace(/^src\/pages\//, '');
      modules[`./${relativePath}`] = true;
    }

    return modules;
  }

  return {};
};

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

const buildUrlSet = (base: URL, pagePaths: string[]) => {
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

const renderUrl = ({
  loc,
  lastmod,
  changefreq,
  priority,
}: ReturnType<typeof buildUrlSet>[number]) => {
  const changefreqTag = changefreq ? `\n  <changefreq>${changefreq}</changefreq>` : '';
  const priorityTag = priority ? `\n  <priority>${priority}</priority>` : '';

  return `<url>\n  <loc>${loc}</loc>\n  <lastmod>${lastmod}</lastmod>${changefreqTag}${priorityTag}\n</url>`;
};

export async function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const pageModules = await loadPageModules();
  const pagePaths = Object.keys(pageModules)
    .map(normalizeRoutePath)
    .filter((path): path is string => Boolean(path));
  const paths = pagePaths.length > 0 ? pagePaths : fallbackPaths;
  const urls = buildUrlSet(siteUrl, paths).map(renderUrl).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
