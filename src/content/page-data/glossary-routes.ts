import {
  normalizeGlossaryHeading,
  stripHtml,
} from "../../utils/glossary-helpers";
import { glossaryEntryPermalink } from "../../utils/glossary";
import type { PageSchema } from "../../utils/seo/schema";

export type GlossaryIndexSourceEntry = {
  id: string;
  title: string;
  status: string | null;
  bodyHtml: string;
  tags?: readonly string[];
  domains?: readonly string[];
  phase?: readonly string[];
  measurability?: string | null;
  maturity?: string | null;
  scale?: string | null;
};

export type GlossaryIndexSourceCategory = {
  id: string;
  heading: string;
  entries: readonly GlossaryIndexSourceEntry[];
};

export type GlossaryIndexEntry = {
  id: string;
  title: string;
  status: string | null;
  tags: readonly string[];
  domains: readonly string[];
  phases: readonly string[];
  measurability: string;
  maturity: string;
  scale: string;
  categoryLabel: string;
  categoryId: string;
  searchText: string;
};

const buildEntrySearchText = (
  entry: GlossaryIndexSourceEntry,
  categoryLabel: string,
) =>
  [
    entry.title,
    categoryLabel,
    stripHtml(entry.bodyHtml),
    ...(entry.tags ?? []),
    ...(entry.domains ?? []),
    ...(entry.phase ?? []),
    entry.measurability ?? "",
    entry.maturity ?? "",
    entry.scale ?? "",
    entry.status ?? "",
  ]
    .join(" ")
    .toLowerCase();

export const buildGlossaryIndexEntries = (
  categories: readonly GlossaryIndexSourceCategory[],
): GlossaryIndexEntry[] =>
  categories
    .flatMap((category) => {
      const categoryLabel = normalizeGlossaryHeading(category.heading);

      return category.entries.map((entry, index) => ({
        id: entry.id,
        title: entry.title,
        status: entry.status,
        tags: entry.tags ?? [],
        domains: entry.domains ?? [],
        phases: entry.phase ?? [],
        measurability: entry.measurability ?? "",
        maturity: entry.maturity ?? "",
        scale: entry.scale ?? "",
        categoryLabel,
        categoryId: category.id,
        searchText: buildEntrySearchText(entry, categoryLabel),
        sortIndex: index,
      }));
    })
    .sort((left, right) => {
      const titleDelta = left.title.localeCompare(right.title, "en", {
        sensitivity: "base",
      });
      return titleDelta === 0 ? left.sortIndex - right.sortIndex : titleDelta;
    })
    .map((item) => {
      const { sortIndex, ...entry } = item;
      void sortIndex;
      return entry;
    });

/**
 * Each term's search text, keyed by id: the full definition, tags, and facet
 * values the index filter matches against. It is served on its own, at
 * /glossary/search-index.json, and fetched the first time a reader filters.
 * Written into every row as a data attribute it was a fifth of the index
 * page, 205 KB of definitions sent to every visitor whether or not they
 * searched.
 */
export const buildGlossarySearchIndex = (
  entries: readonly GlossaryIndexEntry[],
): Record<string, string> =>
  Object.fromEntries(entries.map((entry) => [entry.id, entry.searchText]));

export const filterGlossaryIndexEntries = (
  entries: readonly GlossaryIndexEntry[],
  searchQuery: string,
): GlossaryIndexEntry[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return [...entries];
  }

  return entries.filter((entry) => entry.searchText.includes(normalizedQuery));
};

export const buildGlossaryIndexFacets = (
  categories: readonly GlossaryIndexSourceCategory[],
  entryIndex: readonly GlossaryIndexEntry[],
) => {
  const statusFilters = Array.from(
    new Set(
      categories
        .flatMap((category) => category.entries.map((entry) => entry.status))
        .filter((status): status is string => Boolean(status)),
    ),
  ).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  const glossaryLetters = Array.from(
    new Set(
      entryIndex
        .map((entry) => entry.title.trim().charAt(0).toUpperCase())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  return {
    statusFilters,
    glossaryLetters,
  };
};

/**
 * What the glossary index adds to the layout's graph: the term set as the
 * page's main entity. Each term is named by the @id of the DefinedTerm on its
 * own page, so the two descriptions are one entity.
 */
export const buildGlossarySchema = (input: {
  pageTitle: string;
  pageDescription: string;
  permalink: string;
  categories: readonly GlossaryIndexSourceCategory[];
  publication: {
    published: string;
    updated?: string;
  };
  siteBase: string;
}): PageSchema => {
  const organizationId = `${input.siteBase}#organization`;
  const pageUrl = new URL(input.permalink, input.siteBase).toString();
  const glossaryEntryUrl = (slug: string) =>
    new URL(glossaryEntryPermalink(slug), input.siteBase).toString();

  // Name and address only. Each term's page carries the full definition.
  const definedTerms = input.categories.flatMap((category) =>
    category.entries.map((entry) => ({
      "@type": "DefinedTerm",
      "@id": `${glossaryEntryUrl(entry.id)}#defined-term`,
      name: entry.title,
      url: glossaryEntryUrl(entry.id),
    })),
  );
  const sections = Array.from(
    new Set(
      input.categories.map((category) =>
        normalizeGlossaryHeading(category.heading),
      ),
    ),
  );
  const glossarySetId = `${pageUrl}#defined-term-set`;

  return {
    page: {
      keywords: sections,
      mainEntity: { "@id": glossarySetId },
    },
    nodes: [
      {
        "@type": "DefinedTermSet",
        "@id": glossarySetId,
        name: input.pageTitle,
        description: input.pageDescription,
        url: pageUrl,
        inLanguage: "en",
        datePublished: input.publication.published,
        dateModified: input.publication.updated ?? input.publication.published,
        about: sections,
        numberOfItems: definedTerms.length,
        publisher: { "@id": organizationId },
        hasDefinedTerm: definedTerms,
      },
    ],
  };
};
