import glossaryData from '../content/glossary.json';

// Types for glossary entries
export type GlossaryEntry = {
  id: string;
  title: string;
  status: string | null;
  classes?: string[];
  bodyHtml: string;
  examples?: string[];
  tags?: string[];
  resources?: { label: string; href: string; type: string }[];
  relatedPatterns?: string[];
};

export type GlossaryCategory = {
  id: string;
  heading: string;
  descriptionHtml: string;
  comingSoon: boolean;
  entries: GlossaryEntry[];
};

// Build an index of all glossary terms for quick lookup
const glossaryIndex: Record<string, { term: string }> = {};
const data = glossaryData[0];
if (data && data.categories) {
  for (const category of data.categories) {
    for (const entry of category.entries) {
      glossaryIndex[entry.id] = { term: entry.title };
    }
  }
}

const formatSlug = (slug: string): string =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

/**
 * Get a human-readable label for a glossary term by its slug.
 * Falls back to a formatted version of the slug if not found.
 */
export const getGlossaryLabel = (slug: string): string =>
  glossaryIndex[slug]?.term ?? formatSlug(slug);

/**
 * Get the permalink for the glossary page.
 */
export const glossaryPermalink = data?.permalink ?? '/glossary';
