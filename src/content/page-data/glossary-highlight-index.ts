import { glossaryContent, glossaryTerms } from "../glossary";
import {
  glossaryEntryPermalink,
  hasGlossaryEntryPage,
} from "../../utils/glossary";

/** One term the in-page highlighter can mark, with what its card shows. */
export type GlossaryHighlightEntry = {
  term: string;
  slug: string;
  definition: string;
  /** Absent for terms that are defined here but have no entry page. */
  href?: string;
  domain?: string;
  metric?: string;
  threshold?: string;
  scale?: string;
};

const normalizeDefinition = (definition: string): string => {
  const cleaned = definition.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 220) {
    return cleaned;
  }

  // Cut at a word boundary, as the entry page's meta description does, so a
  // card never ends mid-word.
  const cut = cleaned.slice(0, 217);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,:;—–-]+$/, "")}…`;
};

/**
 * The terms the highlighter marks and the few fields its card shows. Built on
 * the server and fetched by the page: importing the glossary into the client
 * script put all 566 KB of it, and the schema library that validates it, in a
 * bundle every page loaded, glossary pages that mark nothing included.
 */
export const buildGlossaryHighlightIndex = (): GlossaryHighlightEntry[] => {
  const fullEntries = new Map(
    glossaryContent.categories.flatMap((category) =>
      category.entries.map((entry) => [entry.id, entry]),
    ),
  );

  // Terms flagged `autoHighlight: false` are ordinary, legal, or engineering
  // words; the reader already knows them, and a card would swap in the site's
  // narrower sense.
  return glossaryTerms
    .filter((term) => term.autoHighlight !== false)
    .map(({ term, slug, definition }) => {
      const fullEntry = fullEntries.get(slug);
      const metric = fullEntry?.minimumEvidence?.metric;
      const threshold = fullEntry?.minimumEvidence?.threshold;

      return {
        term,
        slug,
        definition: normalizeDefinition(definition),
        href: hasGlossaryEntryPage(slug)
          ? glossaryEntryPermalink(slug)
          : undefined,
        domain: fullEntry?.domains?.[0],
        metric: metric && metric.length < 40 ? metric : undefined,
        threshold: threshold && threshold.length < 45 ? threshold : undefined,
        scale: fullEntry?.scale ?? undefined,
      };
    });
};
