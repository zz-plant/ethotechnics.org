import { lstat, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

import { fieldNotesContent } from "../content/fieldNotes";
import type { FieldNotesContent } from "../content/fieldNotes";
import { glossaryContent, glossaryTerms } from "../content/glossary";
import type {
  GlossaryCategory,
  GlossaryContent,
  GlossaryEntry,
} from "../content/glossary";
import { incidentLessons } from "../content/incidents";
import { libraryContent } from "../content/library";
import type { LibraryContent, Pattern } from "../content/library";
import { governanceCrosswalks } from "../content/crosswalks";
import { quickStartGuides } from "../content/quick-start";
import { researchContent } from "../content/research";
import { standardsContent } from "../content/standards";
import { getTaxonomyBranch, taxonomyEntries } from "../content/taxonomy";
import { homeContent } from "../content/home";
import { glossaryEntryPermalink } from "../utils/glossary";
import {
  getGlossaryTestSlugs,
  glossaryTestPermalink,
} from "../utils/glossary-sections";

const fallbackLastmod = new Date().toISOString();

const getContentEntry = async (
  collection: string,
  slug: string,
): Promise<unknown> => {
  try {
    const mod = await import("astro:content");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await mod.getEntry(collection as any, slug);
  } catch {
    return undefined;
  }
};

type PageModule = {
  lastmod?: string;
};

type SitemapImage = {
  loc: string;
  title?: string;
};

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  images?: SitemapImage[];
};

const normalizeOverrideKey = (path: string) =>
  path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

const canReadFileSystem =
  typeof process !== "undefined" && Boolean(process.versions?.node);

const getPagesRoot = async () => {
  const rootPath = await realpath(process.cwd());
  const pagesRoot = await realpath(resolve(rootPath, "src", "pages"));
  return { rootPath, pagesRoot };
};

const buildPageModules = async (
  pagePaths: string[],
  pagesRoot: string,
): Promise<Record<string, PageModule>> => {
  const modules: Record<string, PageModule> = {};

  await Promise.all(
    pagePaths.map(async (pagePath) => {
      const normalizedPath = pagePath.replace(/^\.\//, "");
      const fullPath = resolve(pagesRoot, normalizedPath);
      const stats = await lstat(fullPath);
      if (stats.isSymbolicLink()) return;
      modules[pagePath] = { lastmod: stats.mtime.toISOString() };
    }),
  );

  return modules;
};

const loadPageModules = async () => {
  if (typeof import.meta.glob === "function") {
    const modules = import.meta.glob("../pages/**/*.astro", { eager: true });
    const pagePaths = Object.keys(modules).map((path) =>
      path.replace(/^\.\.\/pages\//, "./"),
    );

    if (!canReadFileSystem) {
      return Object.fromEntries(
        pagePaths.map((pagePath) => [pagePath, {}]),
      );
    }

    const { pagesRoot } = await getPagesRoot();
    return buildPageModules(pagePaths, pagesRoot);
  }

  if (typeof Bun !== "undefined") {
    const glob = new Bun.Glob("src/pages/**/*.astro");
    const { rootPath, pagesRoot } = await getPagesRoot();
    const pagePaths: string[] = [];

    for await (const file of glob.scan({ cwd: rootPath })) {
      const fullPath = resolve(rootPath, file);
      const stats = await lstat(fullPath);
      if (stats.isSymbolicLink()) continue;
      const relativePath = relative(pagesRoot, fullPath);
      if (relativePath.startsWith("..")) continue;
      pagePaths.push(`./${relativePath.split(sep).join("/")}`);
    }

    return buildPageModules(pagePaths, pagesRoot);
  }

  return {};
};

const normalizeRoutePath = (filePath: string) => {
  const withoutPrefix = filePath.replace(/^\.\//, "").replace(/\.astro$/, "");
  if (withoutPrefix.includes("[")) return null;
  if (withoutPrefix === "index") return "/";
  if (withoutPrefix.endsWith("/index"))
    return `/${withoutPrefix.slice(0, -6)}/`;
  return `/${withoutPrefix}`;
};

const isPublicPath = (path: string) => {
  if (path === "/404" || path.startsWith("/api")) return false;
  return !path
    .split("/")
    .filter(Boolean)
    .some((segment) => segment.startsWith("_"));
};

const normalizeLastmod = (value?: string) => {
  if (!value) return fallbackLastmod;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallbackLastmod;
  return date.toISOString();
};

const inferChangefreq = (lastmod: string) => {
  const lastmodDate = new Date(lastmod);
  const diffMs = Date.now() - lastmodDate.getTime();
  if (Number.isNaN(lastmodDate.getTime()) || diffMs < 0) return "monthly";
  const days = diffMs / (1000 * 60 * 60 * 24);
  if (days <= 30) return "weekly";
  if (days <= 180) return "monthly";
  return "yearly";
};

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const hasEntryData = <TData>(
  value: unknown,
): value is {
  data: TData;
} => typeof value === "object" && value !== null && "data" in value;

const renderUrl = (base: URL, entry: SitemapEntry) => {
  const loc = new URL(entry.path, base).toString();
  const changefreq = entry.changefreq;
  const priority = entry.priority;
  const lastmod = normalizeLastmod(entry.lastmod);
  const changefreqTag = changefreq
    ? `\n  <changefreq>${changefreq}</changefreq>`
    : "";
  const priorityTag = priority
    ? `
  <priority>${priority}</priority>`
    : "";
  const imageTags =
    entry.images
      ?.map((image) => {
        const imageLoc = new URL(image.loc, base).toString();
        const imageTitle = image.title ? escapeXml(image.title) : undefined;
        const titleTag = image.title
          ? `
    <image:title>${imageTitle}</image:title>`
          : "";
        return `
  <image:image>
    <image:loc>${imageLoc}</image:loc>${titleTag}
  </image:image>`;
      })
      .join("") ?? "";
  return `<url>
  <loc>${loc}</loc>
  <lastmod>${lastmod}</lastmod>${changefreqTag}${priorityTag}${imageTags}
</url>`;
};

const contentMtime = async (filePath: string) => {
  try {
    const fileStats = await lstat(resolve(process.cwd(), filePath));
    return fileStats.mtime.toISOString();
  } catch {
    return undefined;
  }
};

export const buildSitemapSections = async () => {
  const pageModules = await loadPageModules();
  const pagePaths = Object.entries(pageModules)
    .map(([path, module]) => {
      const routePath = normalizeRoutePath(path);
      if (!routePath) return null;
      const mod = module as { lastmod?: string };
      return mod.lastmod
        ? { path: routePath, lastmod: mod.lastmod }
        : { path: routePath };
    })
    .filter((entry): entry is SitemapEntry => entry !== null)
    .filter((entry) => isPublicPath(entry.path));

  const glossaryEntry: unknown = await getContentEntry("glossary", "glossary");
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
    category.entries.forEach((entry: GlossaryEntry) =>
      glossarySlugSet.add(entry.id),
    );
  });

  const glossaryPaths = Array.from(glossarySlugSet).map((slug) => ({
    path: glossaryEntryPermalink(slug),
    lastmod: glossaryLastmod,
    changefreq: "monthly",
  }));

  const glossaryTestPaths = glossaryData.categories.flatMap(
    (category: GlossaryCategory) =>
      category.entries.flatMap((entry: GlossaryEntry) =>
        getGlossaryTestSlugs(entry.operationalTests ?? []).map((test) => ({
          path: glossaryTestPermalink(entry.id, test.slug),
          lastmod: glossaryLastmod,
          changefreq: "monthly",
          priority: "0.3",
        })),
      ),
  );

  const libraryEntry: unknown = await getContentEntry("library", "library");
  const libraryData: LibraryContent = hasEntryData<LibraryContent>(libraryEntry)
    ? libraryEntry.data
    : libraryContent;
  const libraryLastmod = libraryData
    ? normalizeLastmod(libraryData.updated ?? libraryData.published)
    : undefined;

  const patternPaths = libraryData
    ? [
        ...libraryData.patterns.entries.map((pattern: Pattern) => ({
          path: `/mechanisms/patterns/${pattern.slug}`,
          lastmod: libraryLastmod,
          changefreq: "monthly",
        })),
        ...libraryData.patterns.entries.map((pattern: Pattern) => ({
          path: `/library/patterns/${pattern.slug}`,
          lastmod: libraryLastmod,
          changefreq: "monthly",
        })),
      ]
    : [];

  const quickStartLastmod = await contentMtime("src/content/quick-start.ts");
  const taxonomyLastmod = await contentMtime("src/content/taxonomy.json");

  const quickStartPaths = quickStartGuides.map((guide) => ({
    path: `/quick-start/${guide.slug}`,
    lastmod: quickStartLastmod,
    changefreq: quickStartLastmod
      ? inferChangefreq(quickStartLastmod)
      : "monthly",
  }));

  const incidentPaths = incidentLessons.map((lesson) => ({
    path: `/incidents/${lesson.slug}`,
    lastmod: lesson.updated ?? lesson.published,
  }));

  const latestStandardPublished = standardsContent.standards.reduce(
    (latest, standard) =>
      new Date(standard.published).getTime() > new Date(latest).getTime()
        ? standard.published
        : latest,
    standardsContent.standards[0]?.published ?? fallbackLastmod,
  );

  const crosswalkControlPaths = governanceCrosswalks.map((control) => ({
    path: `/standards/crosswalk/${control.controlId.toLowerCase()}`,
    lastmod: latestStandardPublished,
    changefreq: inferChangefreq(latestStandardPublished),
  }));

  const taxonomyPaths = taxonomyEntries.map((entry) => ({
    path: `/taxonomy/${entry.slug}`,
    lastmod: taxonomyLastmod,
    changefreq: taxonomyLastmod ? inferChangefreq(taxonomyLastmod) : "monthly",
  }));

  const domainRoots = ["governance", "delivery", "assurance", "experience"];
  const domainPaths = domainRoots.flatMap((rootSlug) =>
    getTaxonomyBranch(rootSlug)
      .filter((entry) => entry.slug !== rootSlug)
      .map((entry) => ({
        path: `/${rootSlug}/${entry.slug.split("/").slice(1).join("/")}`,
        lastmod: taxonomyLastmod,
        changefreq: taxonomyLastmod
          ? inferChangefreq(taxonomyLastmod)
          : "monthly",
      })),
  );

  const fieldNotesEntry: unknown = await getContentEntry(
    "fieldNotes",
    "field-notes",
  );
  const fieldNotesData = hasEntryData<FieldNotesContent>(fieldNotesEntry)
    ? fieldNotesEntry.data
    : fieldNotesContent;

  const lastmodOverrides = new Map<string, string>();
  const changefreqOverrides = new Map<string, string>();
  const priorityOverrides = new Map<string, string>();

  const addOverride = (path: string, lastmod?: string) => {
    if (!lastmod) return;
    const overrideKey = normalizeOverrideKey(path);
    const normalized = normalizeLastmod(lastmod);
    lastmodOverrides.set(overrideKey, normalized);
    changefreqOverrides.set(overrideKey, inferChangefreq(normalized));
  };

  addOverride("/glossary", glossaryLastmod);
  addOverride(
    "/research",
    researchContent.updated ?? researchContent.published,
  );
  addOverride(
    "/field-notes",
    fieldNotesData.latestUpdate ??
      fieldNotesData.updated ??
      fieldNotesData.published,
  );
  if (libraryLastmod) {
    addOverride("/mechanisms", libraryLastmod);
    addOverride("/library", libraryLastmod);
  }

  if (incidentLessons.length > 0) {
    const latestIncident = incidentLessons.reduce((latest, lesson) =>
      new Date(lesson.updated ?? lesson.published).getTime() >
      new Date(latest.updated ?? latest.published).getTime()
        ? lesson
        : latest,
    );
    addOverride(
      "/incidents",
      latestIncident.updated ?? latestIncident.published,
    );
  }

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

  const homePath = pagePaths.find((entry) => entry.path === "/");
  if (homePath) {
    homePath.images = [
      {
        loc: homeContent.hero.media.src,
        title: homeContent.hero.media.alt,
      },
    ];
  }

  [
    "/glossary",
    "/incidents",
    "/mechanisms",
    "/standards",
    "/research",
    "/taxonomy",
  ].forEach((path) => priorityOverrides.set(normalizeOverrideKey(path), "0.8"));

  const applyOverrides = (entries: SitemapEntry[]) => {
    const entryMap = new Map<string, SitemapEntry>();
    entries.forEach((entry) =>
      entryMap.set(normalizeOverrideKey(entry.path), entry),
    );

    return Array.from(entryMap.entries())
      .map(([entryKey, entry]) => ({
        ...entry,
        lastmod: lastmodOverrides.get(entryKey) ?? entry.lastmod,
        changefreq: changefreqOverrides.get(entryKey) ?? entry.changefreq,
        priority: priorityOverrides.get(entryKey) ?? entry.priority,
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
  };

  const corePaths = pagePaths.length > 0 ? pagePaths : [{ path: "/" }];

  return {
    core: applyOverrides(corePaths),
    glossary: applyOverrides([
      ...glossaryPaths,
      ...glossaryTestPaths,
    ]),
    standards: applyOverrides([
      ...standardsContent.standards.map((standard) => ({
        path: `/standards/${standard.slug}`,
        lastmod: standard.published,
      })),
      ...crosswalkControlPaths,
      ...incidentPaths,
      ...quickStartPaths,
    ]),
    taxonomy: applyOverrides([
      ...taxonomyPaths,
      ...domainPaths,
      ...patternPaths,
    ]),
  };
};

export const renderSitemap = (siteUrl: URL, entries: SitemapEntry[]) => {
  const urls = entries.map((entry) => renderUrl(siteUrl, entry)).join("\n");
  const hasImageEntries = entries.some(
    (entry) => (entry.images?.length ?? 0) > 0,
  );
  const imageNamespace = hasImageEntries
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNamespace}>\n${urls}\n</urlset>`;
};

type SitemapIndexEntry = {
  path: string;
  lastmod?: string;
};

export const renderSitemapIndex = (
  siteUrl: URL,
  sitemapEntries: SitemapIndexEntry[],
) => {
  const urls = sitemapEntries
    .map((entry) => {
      const loc = new URL(entry.path, siteUrl).toString();
      const lastmod = entry.lastmod
        ? `\n  <lastmod>${normalizeLastmod(entry.lastmod)}</lastmod>`
        : "";
      return `<sitemap>\n  <loc>${loc}</loc>${lastmod}\n</sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</sitemapindex>`;
};
