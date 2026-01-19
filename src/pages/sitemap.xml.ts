import { getEntry } from "astro:content";
import type { APIContext } from "astro";

import { glossaryContent } from "../content/glossary";
import type { GlossaryCategory, GlossaryEntry } from "../content/glossary";
import type { Pattern } from "../content/library";
import { quickStartGuides } from "../content/quick-start";
import { glossaryEntryPermalink } from "../utils/glossary";

const fallbackSite = "https://ethotechnics.org";

const fallbackPaths = ["/"];
const fallbackLastmod = new Date().toISOString();

const loadPageModules = async () => {
  if (typeof import.meta.glob === "function") {
    return import.meta.glob("./**/*.astro", { eager: true });
  }

  if (typeof Bun !== "undefined") {
    const modules: Record<string, true> = {};
    const glob = new Bun.Glob("src/pages/**/*.astro");

    for await (const file of glob.scan({ cwd: process.cwd() })) {
      const relativePath = file.replace(/^src\/pages\//, "");
      modules[`./${relativePath}`] = true;
    }

    return modules;
  }

  return {};
};

const normalizeRoutePath = (filePath: string) => {
  const withoutPrefix = filePath.replace(/^\.\//, "").replace(/\.astro$/, "");

  if (withoutPrefix.includes("[")) {
    return null;
  }

  if (withoutPrefix === "index") {
    return "/";
  }

  if (withoutPrefix.endsWith("/index")) {
    return `/${withoutPrefix.slice(0, -6)}/`;
  }

  return `/${withoutPrefix}`;
};

const isPublicPath = (path: string) => {
  if (path === "/404") {
    return false;
  }

  if (path.startsWith("/api")) {
    return false;
  }

  return !path
    .split("/")
    .filter(Boolean)
    .some((segment) => segment.startsWith("_"));
};

const normalizeLastmod = (value?: string) => {
  if (!value) {
    return fallbackLastmod;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallbackLastmod;
  }

  return date.toISOString();
};

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

const buildUrlSet = (base: URL, entries: SitemapEntry[]) =>
  entries.map((entry) => {
    const { path, lastmod, changefreq, priority } = entry;
    const loc = new URL(path, base).toString();
    const isHome = path === "/";

    return {
      loc,
      lastmod: normalizeLastmod(lastmod),
      changefreq: changefreq ?? (isHome ? "weekly" : "monthly"),
      priority: priority ?? (isHome ? "1.0" : undefined),
    };
  });

const renderUrl = ({
  loc,
  lastmod,
  changefreq,
  priority,
}: ReturnType<typeof buildUrlSet>[number]) => {
  const changefreqTag = changefreq
    ? `\n  <changefreq>${changefreq}</changefreq>`
    : "";
  const priorityTag = priority ? `\n  <priority>${priority}</priority>` : "";

  return `<url>\n  <loc>${loc}</loc>\n  <lastmod>${lastmod}</lastmod>${changefreqTag}${priorityTag}\n</url>`;
};

export async function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const pageModules = await loadPageModules();
  const pagePaths = Object.keys(pageModules)
    .map(normalizeRoutePath)
    .filter((path): path is string => Boolean(path))
    .filter(isPublicPath);
  const glossaryEntry = await getEntry("glossary", "glossary");
  const glossaryData = glossaryEntry?.data ?? glossaryContent;
  const glossaryLastmod = normalizeLastmod(
    glossaryData.publication.updated ?? glossaryData.publication.published,
  );
  const glossaryPaths = glossaryData.categories.flatMap(
    (category: GlossaryCategory) =>
      category.entries.map((entry: GlossaryEntry) => ({
        path: glossaryEntryPermalink(entry.id),
        lastmod: glossaryLastmod,
      })),
  );
  const libraryEntry = await getEntry("library", "library");
  const libraryLastmod = libraryEntry
    ? normalizeLastmod(
        libraryEntry.data.updated ?? libraryEntry.data.published,
      )
    : undefined;
  const patternPaths =
    libraryEntry?.data.patterns.entries.map((pattern: Pattern) => ({
      path: `/mechanisms/patterns/${pattern.slug}`,
      lastmod: libraryLastmod,
    })) ?? [];
  const quickStartPaths = quickStartGuides.map((guide) => ({
    path: `/quick-start/${guide.slug}`,
  }));
  const entries: SitemapEntry[] = [
    ...(pagePaths.length > 0
      ? pagePaths.map((path) => ({ path }))
      : fallbackPaths.map((path) => ({ path }))),
    ...glossaryPaths,
    ...patternPaths,
    ...quickStartPaths,
  ];
  const entryMap = new Map<string, SitemapEntry>();

  entries.forEach((entry) => {
    entryMap.set(entry.path, entry);
  });

  const urls = buildUrlSet(
    siteUrl,
    Array.from(entryMap.values()).sort((a, b) =>
      a.path.localeCompare(b.path),
    ),
  )
    .map(renderUrl)
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
