import { fieldNotesContent } from "../content/fieldNotes";
import type { FieldNotesContent } from "../content/fieldNotes";
import { glossaryContent } from "../content/glossary";
import type {
  GlossaryCategory,
  GlossaryContent,
  GlossaryEntry,
} from "../content/glossary";
import { incidentLessons } from "../content/incidents";
import { evalsContent } from "../content/evals";
import { artifacts, failureStates } from "../content/institute-site";
import { governanceCrosswalks } from "../content/crosswalks";
import { cases } from "../content/casebook";
import { libraryContent } from "../content/library";
import type { LibraryContent, Pattern } from "../content/library";
import { roles } from "../content/roles";
import { researchContent } from "../content/research";
import { standardsContent } from "../content/standards";
import { taxonomyEntries } from "../content/taxonomy";
import { homeContent } from "../content/home";
import { glossaryEntryPermalink } from "../utils/glossary";

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

const getContentEntries = async (collection: string): Promise<unknown> => {
  try {
    const mod = await import("astro:content");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await mod.getCollection(collection as any);
  } catch {
    return undefined;
  }
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

const loadPageModules = async () => {
  // Vite rewrites this call at build time. Outside a Vite context it throws,
  // so fall through to the filesystem scan rather than guarding on typeof:
  // the guard is false at runtime in the built Worker and silently emptied
  // the core sitemap.
  try {
    const modules = import.meta.glob("../pages/**/*.astro", { eager: true });
    const paths = Object.keys(modules ?? {});
    if (paths.length > 0) {
      return Object.fromEntries(
        paths.map((path) => [path.replace(/^\.\.\/pages\//, "./"), {}]),
      );
    }
  } catch {
    // Not running under Vite.
  }

  if (typeof Bun !== "undefined") {
    const glob = new Bun.Glob("src/pages/**/*.astro");
    const pagePaths = await Array.fromAsync(glob.scan({ cwd: process.cwd() }));
    return Object.fromEntries(
      pagePaths.map((file) => [file.replace(/^src\/pages\//, "./"), {}]),
    );
  }

  return {};
};

const normalizeRoutePath = (filePath: string) => {
  const withoutPrefix = filePath.replace(/^\.\//, "").replace(/\.astro$/, "");
  if (withoutPrefix.includes("[")) return null;
  if (withoutPrefix === "index") return "/";
  // A section index is /standards, not /standards/. The slashed form listed
  // the same page under a second URL, which is now a redirect.
  if (withoutPrefix.endsWith("/index")) return `/${withoutPrefix.slice(0, -6)}`;
  return `/${withoutPrefix}`;
};

const isPublicPath = (path: string) => {
  // /api is the human-readable reference page; /api/* are the JSON endpoints.
  if (path === "/404" || path.startsWith("/api/")) return false;
  // Site search is noindex, so listing it sends crawlers a mixed signal.
  if (path === "/search") return false;
  // A Playwright visual-testing harness. It answers 404 anywhere but
  // localhost, so it must never be advertised.
  if (path === "/components-preview") return false;
  return !path
    .split("/")
    .filter(Boolean)
    .some((segment) => segment.startsWith("_"));
};

const normalizeLastmod = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
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

type MdxDocMeta = {
  permalink: string;
  published?: string;
  updated?: string;
};

const readFrontmatterField = (source: string, field: string) => {
  const match = new RegExp(`^${field}:\\s*"?([^"\\n]+)"?\\s*$`, "m").exec(
    source,
  );
  return match?.[1]?.trim();
};

/**
 * Frontmatter fallback for MDX collections when `astro:content` is not
 * available, so sitemap coverage stays testable outside an Astro build.
 */
const readMdxCollection = async (dir: string): Promise<MdxDocMeta[]> => {
  if (typeof Bun === "undefined") return [];

  try {
    const glob = new Bun.Glob(`src/content/${dir}/*.mdx`);
    const files = await Array.fromAsync(glob.scan({ cwd: process.cwd() }));
    const docs = await Promise.all(
      files.map(async (file): Promise<MdxDocMeta | null> => {
        const source = await Bun.file(file).text();
        const permalink = readFrontmatterField(source, "permalink");
        if (!permalink) return null;
        return {
          permalink,
          published: readFrontmatterField(source, "published"),
          updated: readFrontmatterField(source, "updated"),
        };
      }),
    );

    return docs.filter((doc): doc is MdxDocMeta => doc !== null);
  } catch {
    return [];
  }
};

/** Sitemap paths for an MDX collection, from Astro or the frontmatter fallback. */
const mdxCollectionPaths = async (
  collection: string,
  dir: string,
): Promise<SitemapEntry[]> => {
  const entries: unknown = await getContentEntries(collection);
  const docs = Array.isArray(entries)
    ? entries
        .filter((entry): entry is { data: MdxDocMeta } =>
          hasEntryData<MdxDocMeta>(entry),
        )
        .map((entry) => entry.data)
        .filter((data) => Boolean(data.permalink))
    : await readMdxCollection(dir);

  return docs.map((doc) => ({
    path: doc.permalink,
    lastmod: doc.updated ?? doc.published,
    changefreq: "monthly",
  }));
};

const renderUrl = (base: URL, entry: SitemapEntry) => {
  const loc = new URL(entry.path, base).toString();
  const changefreq = entry.changefreq;
  const priority = entry.priority;
  const lastmod = normalizeLastmod(entry.lastmod);
  const lastmodTag = lastmod ? `\n  <lastmod>${lastmod}</lastmod>` : "";
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
  <loc>${loc}</loc>${lastmodTag}${changefreqTag}${priorityTag}${imageTags}
</url>`;
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
  // /glossary/[slug] resolves category entries and nothing else. glossaryTerms
  // carries tooltip definitions for 67 more terms than have a page; listing
  // those here advertised 67 URLs that 404.
  const glossaryPaths = glossaryData.categories.flatMap(
    (category: GlossaryCategory) =>
      category.entries.map((entry: GlossaryEntry) => ({
        path: glossaryEntryPermalink(entry.id),
        lastmod: glossaryLastmod,
        changefreq: "monthly",
      })),
  );

  const libraryEntry: unknown = await getContentEntry("library", "library");
  const libraryData: LibraryContent = hasEntryData<LibraryContent>(libraryEntry)
    ? libraryEntry.data
    : libraryContent;
  const libraryLastmod = libraryData
    ? normalizeLastmod(libraryData.updated ?? libraryData.published)
    : undefined;

  // /library/patterns/* is a middleware redirect to the same slug under
  // /mechanisms, not a second page.
  const patternPaths = libraryData
    ? libraryData.patterns.entries.map((pattern: Pattern) => ({
        path: `/mechanisms/patterns/${pattern.slug}`,
        lastmod: libraryLastmod,
        changefreq: "monthly",
      }))
    : [];

  const rolePaths = roles.map((role) => ({
    path: `/roles/${role.id}`,
    changefreq: "monthly",
  }));

  const theoryPaths = await mdxCollectionPaths("theory", "theory");
  const standardsCollectionPaths = await mdxCollectionPaths(
    "standards",
    "standards",
  );
  const evidencePackPaths = await mdxCollectionPaths(
    "evidencePacks",
    "evidence-packs",
  );

  // Dynamic routes are dropped from core, so every [slug] route has to be
  // listed here from the data it renders. These were missing, including
  // every explainer and every eval suite page.
  const explainerPaths = await mdxCollectionPaths("explainers", "explainers");

  const evalsLastmod = evalsContent.updated ?? evalsContent.published;
  const evalSuitePaths = evalsContent.suites.map((suite) => ({
    path: `/evals/${suite.slug}`,
    lastmod: evalsLastmod,
    changefreq: "monthly",
  }));

  const artifactPaths = artifacts.map((artifact) => ({
    path: `/artifacts/${artifact.slug}`,
    changefreq: "monthly",
  }));

  // A failure state with no resolvable artifact redirects to /artifacts, so
  // only the states that render are listed.
  const artifactSlugs = new Set(artifacts.map((artifact) => artifact.slug));
  const failurePaths = failureStates
    .filter((state) =>
      (state.artifactSlugs ?? []).some((slug) => artifactSlugs.has(slug)),
    )
    .map((state) => ({
      path: `/failure/${state.slug}`,
      changefreq: "monthly",
    }));

  const crosswalkPaths = governanceCrosswalks.map((control) => ({
    path: `/standards/crosswalk/${control.controlId.toLowerCase()}`,
    changefreq: "monthly",
  }));

  const incidentPaths = incidentLessons.map((lesson) => ({
    path: `/incidents/${lesson.slug}`,
    lastmod: lesson.updated ?? lesson.published,
  }));

  const casebookPaths = cases.map((entry) => ({
    path: `/casebook/${entry.slug}`,
    lastmod: entry.updated ?? entry.published,
  }));

  // The taxonomy domains render under /taxonomy only; the top-level mirrors
  // (/governance/policy, /delivery/intake, ...) are middleware redirects.
  const taxonomyPaths = taxonomyEntries.map((entry) => ({
    path: `/taxonomy/${entry.slug}`,
    changefreq: "monthly",
  }));

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
    if (!normalized) return;
    lastmodOverrides.set(overrideKey, normalized);
    changefreqOverrides.set(overrideKey, "monthly");
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
    "/casebook",
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

  const standardsSection = applyOverrides([
    ...standardsCollectionPaths,
    ...evidencePackPaths,
    ...incidentPaths,
    ...casebookPaths,
    ...rolePaths,
    ...theoryPaths,
  ]);
  const glossarySection = applyOverrides(glossaryPaths);
  const taxonomySection = applyOverrides([...taxonomyPaths, ...patternPaths]);

  // A path listed in a content section is dropped from core, so a page that
  // exists both as a static file and as a collection entry (the STD-01, -02,
  // and -06 evidence packs) is listed once.
  const listedElsewhere = new Set(
    [...standardsSection, ...glossarySection, ...taxonomySection].map((entry) =>
      normalizeOverrideKey(entry.path),
    ),
  );
  const coreSection = applyOverrides([
    ...corePaths,
    ...explainerPaths,
    ...evalSuitePaths,
    ...artifactPaths,
    ...failurePaths,
    // Crosswalk controls sit under /standards but are not MDX standards
    // documents, so they are listed with the core pages.
    ...crosswalkPaths,
  ]).filter((entry) => !listedElsewhere.has(normalizeOverrideKey(entry.path)));

  return {
    core: coreSection,
    glossary: glossarySection,
    // Standards come from the MDX collection /standards/[...slug] renders, not
    // from the registry: a registry entry can exist for clauses and changelogs
    // long before its page does (PM-01, STD-03, STD-04, STD-05 all did), and the
    // static standards pages are already in core with the other page files.
    // Registry dates still reach these entries through the lastmod overrides.
    standards: standardsSection,
    taxonomy: taxonomySection,
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
