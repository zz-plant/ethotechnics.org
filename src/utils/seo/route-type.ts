/**
 * What a page is, decided once from its address.
 *
 * Every machine-readable label a page carries follows from this: its
 * schema.org type, its og:type, the group site search files it under, the
 * sitemap that lists it, its share-image template, and the name of its
 * section in the breadcrumb trail. Those used to be decided in six places
 * from six path tests. Hubs were typed as articles, tools as articles, the
 * contact page as a collection, mechanism specifications as plain articles;
 * the "standards" sitemap listed the casebook and the theory essays, and
 * site search filed /method, /use-cases, and /roles under "Other pages".
 */

/** The nature of a page, which sets its schema.org page and entity types. */
export type ContentKind =
  | "home"
  | "collection"
  | "standard"
  | "mechanism"
  | "eval"
  | "tool"
  | "term"
  | "case"
  | "essay"
  | "explainer"
  | "guide"
  | "about"
  | "contact"
  | "institute"
  | "search";

/** Site search groups, in the order results are shown. */
export const SEARCH_GROUPS = [
  "Standards",
  "Mechanisms",
  "Evals",
  "Tools",
  "Casebook",
  "Glossary",
  "Explainers",
  "Research",
  "Guides",
  "Institute",
] as const;
export type SearchGroup = (typeof SEARCH_GROUPS)[number];

export const SITEMAP_SECTIONS = [
  "core",
  "standards",
  "mechanisms",
  "glossary",
  "research",
] as const;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

export type ArticleType =
  "Article" | "TechArticle" | "ScholarlyArticle" | "Report";

export type WebPageType =
  | "WebPage"
  | "CollectionPage"
  | "AboutPage"
  | "ContactPage"
  | "SearchResultsPage";

export type OgTemplate =
  | "default"
  | "home"
  | "standards"
  | "glossary"
  | "taxonomy"
  | "mechanisms"
  | "editorial";

export type RouteProfile = {
  kind: ContentKind;
  group: SearchGroup;
  sitemap: SitemapSection;
  /** schema.org type of the page node. */
  pageType: WebPageType;
  /** schema.org type of the work the page carries, when it carries one. */
  articleType?: ArticleType;
  openGraphType: "website" | "article";
  ogTemplate: OgTemplate;
};

type Section = {
  /** The section's index page. */
  hub: string;
  /** Sentence-case name, used in breadcrumbs. */
  label: string;
  /** What a page under the hub is. The hub itself is a collection. */
  kind: ContentKind;
  group: SearchGroup;
  articleType?: ArticleType;
  ogTemplate?: OgTemplate;
};

/**
 * Sections, most specific first. A path belongs to the first section whose
 * hub it equals or sits under.
 */
const SECTIONS: Section[] = [
  {
    hub: "/research/theory",
    label: "Theory",
    kind: "essay",
    group: "Research",
    articleType: "ScholarlyArticle",
    ogTemplate: "editorial",
  },
  {
    hub: "/research",
    label: "Research",
    kind: "essay",
    group: "Research",
    ogTemplate: "editorial",
  },
  {
    hub: "/field-notes",
    label: "Field notes",
    kind: "essay",
    group: "Research",
    ogTemplate: "editorial",
  },
  {
    hub: "/standards",
    label: "Standards",
    kind: "standard",
    group: "Standards",
    ogTemplate: "standards",
  },
  {
    hub: "/evidence-packs",
    label: "Evidence packs",
    kind: "standard",
    group: "Standards",
    ogTemplate: "standards",
  },
  {
    hub: "/mechanisms",
    label: "Mechanisms",
    kind: "mechanism",
    group: "Mechanisms",
    ogTemplate: "mechanisms",
  },
  { hub: "/evals", label: "Evals", kind: "eval", group: "Evals" },
  { hub: "/diagnostics", label: "Diagnostics", kind: "tool", group: "Tools" },
  {
    hub: "/glossary",
    label: "Glossary",
    kind: "term",
    group: "Glossary",
    ogTemplate: "glossary",
  },
  {
    hub: "/casebook",
    label: "Casebook",
    kind: "case",
    group: "Casebook",
    articleType: "Report",
  },
  {
    hub: "/explainers",
    label: "Explainers",
    kind: "explainer",
    group: "Explainers",
    ogTemplate: "editorial",
  },
  { hub: "/use-cases", label: "Use cases", kind: "guide", group: "Guides" },
  { hub: "/agents", label: "Agents", kind: "guide", group: "Guides" },
  // Role pages have no index of their own; /start lists them.
  { hub: "/roles", label: "Roles", kind: "guide", group: "Guides" },
  { hub: "/institute", label: "About", kind: "institute", group: "Institute" },
  { hub: "/security", label: "About", kind: "institute", group: "Institute" },
  { hub: "/archive", label: "About", kind: "institute", group: "Institute" },
];

/** Single pages outside any section, and hubs that are not collections. */
const PAGES: Record<string, Omit<Section, "hub" | "label">> = {
  "/": { kind: "home", group: "Institute", ogTemplate: "home" },
  "/404": { kind: "institute", group: "Institute" },
  "/search": { kind: "search", group: "Institute" },
  "/about": { kind: "about", group: "Institute" },
  "/participate": { kind: "contact", group: "Institute" },
  "/record": { kind: "institute", group: "Institute" },
  "/api": { kind: "collection", group: "Institute" },
  "/artifacts": { kind: "collection", group: "Standards" },
  "/method": { kind: "standard", group: "Standards" },
  "/low-leverage": { kind: "standard", group: "Standards" },
  "/measurement-tiers": { kind: "eval", group: "Evals" },
  "/validators": {
    kind: "collection",
    group: "Tools",
    ogTemplate: "mechanisms",
  },
  "/evals/runner": { kind: "tool", group: "Tools" },
  "/mechanisms/cite": { kind: "guide", group: "Mechanisms" },
  "/taxonomy": { kind: "collection", group: "Guides", ogTemplate: "taxonomy" },
  "/triage": { kind: "guide", group: "Guides" },
  "/start": { kind: "guide", group: "Guides" },
  "/agents": { kind: "guide", group: "Guides" },
  "/incidents": { kind: "guide", group: "Guides", ogTemplate: "editorial" },
  // Hubs whose index is a collection although the section's pages are not.
  "/standards/exceptions": { kind: "collection", group: "Standards" },
  "/casebook/healthcare-ai": { kind: "collection", group: "Casebook" },
};

const SITEMAP_BY_GROUP: Record<SearchGroup, SitemapSection> = {
  Standards: "standards",
  Mechanisms: "mechanisms",
  Glossary: "glossary",
  Research: "research",
  Casebook: "research",
  Explainers: "research",
  Evals: "core",
  Tools: "core",
  Guides: "core",
  Institute: "core",
};

const PAGE_TYPE_BY_KIND: Partial<Record<ContentKind, WebPageType>> = {
  collection: "CollectionPage",
  about: "AboutPage",
  contact: "ContactPage",
  search: "SearchResultsPage",
};

const ARTICLE_TYPE_BY_KIND: Partial<Record<ContentKind, ArticleType>> = {
  standard: "TechArticle",
  mechanism: "TechArticle",
  eval: "TechArticle",
  explainer: "TechArticle",
  case: "Article",
  essay: "Article",
  guide: "Article",
};

/** Kinds a reader shares as a piece of writing rather than as a place. */
const ARTICLE_KINDS = new Set<ContentKind>([
  "standard",
  "mechanism",
  "eval",
  "term",
  "case",
  "essay",
  "explainer",
  "guide",
]);

export const normalizePath = (path: string): string => {
  if (!path) return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
};

const sectionFor = (path: string): Section | undefined =>
  SECTIONS.find(
    (section) => path === section.hub || path.startsWith(`${section.hub}/`),
  );

export const resolveRouteProfile = (rawPath: string): RouteProfile => {
  const path = normalizePath(rawPath).toLowerCase();
  const section = sectionFor(path);
  const page = PAGES[path];
  const isHub = !page && section?.hub === path;

  const kind: ContentKind =
    page?.kind ?? (isHub ? "collection" : (section?.kind ?? "guide"));
  const group: SearchGroup = page?.group ?? section?.group ?? "Guides";
  const articleKind = ARTICLE_TYPE_BY_KIND[kind];

  return {
    kind,
    group,
    sitemap: SITEMAP_BY_GROUP[group],
    pageType: PAGE_TYPE_BY_KIND[kind] ?? "WebPage",
    articleType: articleKind
      ? (!page && section?.articleType) || articleKind
      : undefined,
    openGraphType: ARTICLE_KINDS.has(kind) ? "article" : "website",
    ogTemplate: page?.ogTemplate ?? section?.ogTemplate ?? "default",
  };
};

/** The breadcrumb name of a section hub, when the path is one. */
export const sectionLabel = (rawPath: string): string | undefined => {
  const path = normalizePath(rawPath).toLowerCase();
  return SECTIONS.find((section) => section.hub === path)?.label;
};
