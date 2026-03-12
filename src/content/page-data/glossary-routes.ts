import { normalizeGlossaryHeading, stripHtml } from "../../utils/glossary-helpers";
import { glossaryEntryPermalink } from "../../utils/glossary";

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

  const glossarySuggestions = entryIndex.map((entry) => entry.title);
  const glossaryLetters = Array.from(
    new Set(
      entryIndex
        .map((entry) => entry.title.trim().charAt(0).toUpperCase())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  const territoryCounts = new Map(
    categories.map((category) => [category.id, category.entries.length]),
  );

  return {
    statusFilters,
    glossarySuggestions,
    glossaryLetters,
    territoryCounts,
  };
};

export const buildGlossaryStructuredDataPayload = (input: {
  pageTitle: string;
  pageDescription: string;
  permalink: string;
  categories: readonly GlossaryIndexSourceCategory[];
  publication: {
    published: string;
    updated?: string;
  };
  siteBase: string;
}) => {
  const organizationId = `${input.siteBase}#organization`;
  const websiteId = `${input.siteBase}#website`;
  const pageUrl = input.permalink.startsWith("http")
    ? input.permalink
    : new URL(input.permalink, input.siteBase).toString();
  const glossaryEntryUrl = (slug: string) =>
    new URL(glossaryEntryPermalink(slug), input.siteBase).toString();

  const structuredEntries = input.categories.flatMap((category) =>
    category.entries.map((entry) => ({
      "@type": "DefinedTerm",
      name: entry.title,
      url: glossaryEntryUrl(entry.id),
      inDefinedTermSet: pageUrl,
      description: stripHtml(entry.bodyHtml),
    })),
  );

  const glossaryPublished = input.publication.published ?? null;
  const glossaryUpdated = input.publication.updated ?? input.publication.published ?? null;
  const glossaryKeywords = Array.from(
    new Set([
      "Ethotechnics glossary",
      "ethical technology",
      "AI governance",
      "human-centered design",
      "algorithmic accountability",
      "consent frameworks",
      "safety and stewardship",
      ...input.categories.map((category) => normalizeGlossaryHeading(category.heading)),
    ]),
  );
  const glossaryAbout = Array.from(
    new Set(input.categories.map((category) => normalizeGlossaryHeading(category.heading))),
  );
  const glossarySetId = `${pageUrl}#defined-term-set`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: input.pageTitle,
        description: input.pageDescription,
        keywords: glossaryKeywords,
        url: pageUrl,
        inLanguage: "en",
        datePublished: glossaryPublished,
        dateModified: glossaryUpdated,
        isPartOf: {
          "@id": websiteId,
        },
        publisher: {
          "@id": organizationId,
        },
        mainEntity: {
          "@id": glossarySetId,
        },
      },
      {
        "@type": "DefinedTermSet",
        "@id": glossarySetId,
        name: input.pageTitle,
        description: input.pageDescription,
        url: pageUrl,
        inLanguage: "en",
        datePublished: glossaryPublished,
        dateModified: glossaryUpdated,
        keywords: glossaryKeywords,
        about: glossaryAbout,
        numberOfItems: structuredEntries.length,
        isPartOf: {
          "@id": pageUrl,
        },
        publisher: {
          "@id": organizationId,
        },
        hasDefinedTerm: structuredEntries,
        potentialAction: {
          "@type": "SearchAction",
          target: `${pageUrl}?query={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: new URL("/", input.siteBase).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Glossary",
            item: pageUrl,
          },
        ],
      },
    ],
  };
};
