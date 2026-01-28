import { getEntry } from "astro:content";
import type { APIContext } from "astro";
import { lstat, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

import { glossaryContent } from "../content/glossary";
import type {
  GlossaryCategory,
  GlossaryContent,
  GlossaryEntry,
} from "../content/glossary";
import { glossaryTerms } from "../content/glossary";
import type { LibraryContent, Pattern } from "../content/library";
import { researchContent } from "../content/research";
import { standardsContent } from "../content/standards";
import { taxonomyEntries, getTaxonomyBranch } from "../content/taxonomy";
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

    const rootPath = await realpath(process.cwd());
    const pagesRoot = await realpath(resolve(rootPath, "src", "pages"));

    for await (const file of glob.scan({ cwd: rootPath })) {
      const fullPath = resolve(rootPath, file);
      const stats = await lstat(fullPath);
      if (stats.isSymbolicLink()) continue;
      const relativePath = relative(pagesRoot, fullPath);
      if (relativePath.startsWith("..")) continue;
      modules[`./${relativePath.split(sep).join("/")}`] = true;
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

const normalizeOverrideKey = (path: string) =>
  path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

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

const inferChangefreq = (lastmod: string) => {
  const lastmodDate = new Date(lastmod);
  const diffMs = Date.now() - lastmodDate.getTime();

  if (Number.isNaN(lastmodDate.getTime()) || diffMs < 0) {
    return "monthly";
  }

  const days = diffMs / (1000 * 60 * 60 * 24);

  if (days <= 30) {
    return "weekly";
  }

  if (days <= 180) {
    return "monthly";
  }

  return "yearly";
};

const hasEntryData = <TData>(
  value: unknown,
): value is {
  data: TData;
} => typeof value === "object" && value !== null && "data" in value;

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
  const glossaryEntry = (await getEntry("glossary", "glossary")) as unknown;
  const glossaryData: GlossaryContent = hasEntryData<GlossaryContent>(
    glossaryEntry,
  )
    ? glossaryEntry.data
    : glossaryContent;
  const glossaryLastmod = normalizeLastmod(
    glossaryData.publication.updated ?? glossaryData.publication.published,
  );
  const glossarySlugSet = new Set<string>(
    glossaryTerms.map((term) => term.slug),
  );

  glossaryData.categories.forEach((category: GlossaryCategory) => {
    category.entries.forEach((entry: GlossaryEntry) => {
      glossarySlugSet.add(entry.id);
    });
  });

  const glossaryPaths = Array.from(glossarySlugSet).map((slug) => ({
    path: glossaryEntryPermalink(slug),
    lastmod: glossaryLastmod,
  }));
  const libraryEntry = (await getEntry("library", "library")) as unknown;
  const libraryData = hasEntryData<LibraryContent>(libraryEntry)
    ? libraryEntry.data
    : undefined;
  const libraryLastmod = libraryData
    ? normalizeLastmod(libraryData.updated ?? libraryData.published)
    : undefined;
  const patternPaths = libraryData
    ? libraryData.patterns.entries.map((pattern: Pattern) => ({
        path: `/mechanisms/patterns/${pattern.slug}`,
        lastmod: libraryLastmod,
      }))
    : [];
  const quickStartPaths = quickStartGuides.map((guide) => ({
    path: `/quick-start/${guide.slug}`,
  }));
  const taxonomyPaths = taxonomyEntries.map((entry) => ({
    path: `/taxonomy/${entry.slug}`,
  }));
  const domainRoots = ["governance", "delivery", "assurance", "experience"];
  const domainPaths = domainRoots.flatMap((rootSlug) =>
    getTaxonomyBranch(rootSlug)
      .filter((entry) => entry.slug !== rootSlug)
      .map((entry) => ({
        path: `/${rootSlug}/${entry.slug.split("/").slice(1).join("/")}`,
      })),
  );
  const lastmodOverrides = new Map<string, string>();
  const changefreqOverrides = new Map<string, string>();
  const priorityOverrides = new Map<string, string>();
  const addOverride = (path: string, lastmod?: string) => {
    if (!lastmod) {
      return;
    }

    const overrideKey = normalizeOverrideKey(path);
    const normalized = normalizeLastmod(lastmod);
    lastmodOverrides.set(overrideKey, normalized);
    changefreqOverrides.set(overrideKey, inferChangefreq(normalized));
  };

  addOverride("/glossary", glossaryLastmod);
  if (libraryLastmod) {
    addOverride("/mechanisms", libraryLastmod);
  }

  addOverride(
    "/research",
    researchContent.updated ?? researchContent.published,
  );

  if (standardsContent.standards.length > 0) {
    const latestStandard = standardsContent.standards.reduce((latest, entry) =>
      new Date(entry.published).getTime() > new Date(latest.published).getTime()
        ? entry
        : latest,
    );
    addOverride("/standards", latestStandard.published);
  }

  standardsContent.standards.forEach((standard) => {
    addOverride(`/standards/${standard.slug}`, standard.published);
  });

  ["/glossary", "/mechanisms", "/standards", "/research", "/taxonomy"].forEach(
    (path) => priorityOverrides.set(normalizeOverrideKey(path), "0.8"),
  );
  const entries: SitemapEntry[] = [
    ...(pagePaths.length > 0
      ? pagePaths.map((path) => ({ path }))
      : fallbackPaths.map((path) => ({ path }))),
    ...glossaryPaths,
    ...patternPaths,
    ...quickStartPaths,
    ...taxonomyPaths,
    ...domainPaths,
  ];
  const entryMap = new Map<string, SitemapEntry>();

  entries.forEach((entry) => {
    entryMap.set(normalizeOverrideKey(entry.path), entry);
  });

  const entriesWithOverrides = Array.from(entryMap.entries()).map(
    ([entryKey, entry]) => ({
      ...entry,
      lastmod: lastmodOverrides.get(entryKey) ?? entry.lastmod,
      changefreq: changefreqOverrides.get(entryKey) ?? entry.changefreq,
      priority: priorityOverrides.get(entryKey) ?? entry.priority,
    }),
  );

  const urls = buildUrlSet(
    siteUrl,
    entriesWithOverrides.sort((a, b) => a.path.localeCompare(b.path)),
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
