import type {
  GlossaryCategory,
  GlossaryEntry,
  GlossaryMinimumEvidence,
  GlossaryResource,
} from "../content/glossary";
import type { PublicationMetadata } from "../content/types";

/**
 * The visible text of an HTML fragment, on one line. Tags become spaces so
 * block boundaries do not run words together; the spaces that leaves before
 * punctuation and inside brackets are then closed. Replacing tags with spaces
 * alone turned "for someone</a>: models" into "for someone : models" in 224
 * of 386 entries, and that text fed meta descriptions, the index summaries,
 * structured data, and the related-standards cards.
 */
export const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+([,.;:!?)\]”’])/g, "$1")
    .replace(/([([“])\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeGlossaryHeading = (heading: string): string =>
  heading.replace(/^[A-Z]\.\s*/, "");

export const getGlossaryAuthor = (publication: PublicationMetadata): string =>
  publication.authors.map((author) => author.name).join(", ") ||
  "Ethotechnics Institute";

/**
 * An entry's recorded evidence, and nothing where none is recorded.
 *
 * This used to fill the gap with three sentences built from the term itself
 * ("Artifact documenting how X is expected, enforced, or governed"), which
 * read as evidence while saying the same thing about all 261 terms. A term
 * with no evidence behind it is listed under the entry's completeness notes
 * instead, which is the claim the site can actually support.
 */
export const getMinimumEvidenceDefaults = (
  entry: Pick<GlossaryEntry, "minimumEvidence" | "title">,
): GlossaryMinimumEvidence => entry.minimumEvidence ?? {};

export const buildGlossaryEntrySearchText = (
  entry: GlossaryEntry,
  categoryLabel: string,
): string => {
  const plainDescription = stripHtml(entry.bodyHtml);
  const tags = entry.tags?.join(" ") ?? "";
  const domains = entry.domains?.join(" ") ?? "";
  const phases = entry.phase?.join(" ") ?? "";
  const measurability = entry.measurability ?? "";
  const maturity = entry.maturity ?? "";
  const examples = entry.examples?.join(" ") ?? "";
  const searchText =
    `${entry.title} ${categoryLabel} ${plainDescription} ${tags} ${domains} ${phases} ${measurability} ${maturity} ${examples}`.trim();

  return searchText.toLowerCase();
};

const GLOSSARY_LINK = /href="\/glossary\/([a-z0-9-]+)/g;

/** Entry ids an entry's definition links to, in order, without repeats. */
export const getDefinitionLinks = (
  entry: Pick<GlossaryEntry, "id" | "bodyHtml">,
): string[] =>
  Array.from(
    new Set(
      Array.from(entry.bodyHtml.matchAll(GLOSSARY_LINK), (match) => match[1]),
    ),
  ).filter((id): id is string => Boolean(id) && id !== entry.id);

/**
 * Terms related to an entry, as its authors recorded them: the adjacent terms
 * it lists, then the entries whose definition links to it or that list it as
 * adjacent. Terms its own definition already links to are left out, because
 * the reader has those links in front of them. Only ids with a page count.
 *
 * An entry with neither a related term nor a matched public case used to end
 * at the citation block, with nowhere to go from a page most readers reach
 * from search.
 */
export const getRelatedGlossaryTerms = (
  entry: Pick<GlossaryEntry, "id" | "bodyHtml" | "adjacentTerms">,
  entries: readonly Pick<GlossaryEntry, "id" | "bodyHtml" | "adjacentTerms">[],
  limit = 8,
): string[] => {
  const known = new Set(entries.map((candidate) => candidate.id));
  const inDefinition = new Set(getDefinitionLinks(entry));
  const referrers = entries
    .filter(
      (candidate) =>
        candidate.id !== entry.id &&
        (getDefinitionLinks(candidate).includes(entry.id) ||
          (candidate.adjacentTerms ?? []).includes(entry.id)),
    )
    .map((candidate) => candidate.id);

  return Array.from(new Set([...(entry.adjacentTerms ?? []), ...referrers]))
    .filter((id) => id !== entry.id && known.has(id) && !inDefinition.has(id))
    .slice(0, limit);
};

export const getGlossaryEntryDefaults = (
  entry: GlossaryEntry,
  category: GlossaryCategory,
): {
  categoryLabel: string;
  scopeText?: string;
  adjacentTerms: string[];
  operationalTests: string[];
  commonCounterfeits: string[];
  minimumEvidence: GlossaryMinimumEvidence;
  genealogy?: string;
  references: GlossaryResource[];
} => {
  const categoryLabel = normalizeGlossaryHeading(category.heading);
  const scopeText = entry.scope ?? "";
  // Adjacent terms are entry ids and render as links; tags are keywords and
  // never resolve to an entry, so they cannot stand in.
  const adjacentTerms = entry.adjacentTerms ?? [];
  const operationalTests = entry.operationalTests ?? [];
  const commonCounterfeits = entry.commonCounterfeits ?? [];
  const minimumEvidence = getMinimumEvidenceDefaults(entry);
  const minimumEvidenceWithDefaults = {
    artifact: minimumEvidence.artifact,
    behavior: minimumEvidence.behavior,
    metric: minimumEvidence.metric,
    definition: minimumEvidence.definition,
    unit: minimumEvidence.unit,
    dataSource: minimumEvidence.dataSource,
    calculation: minimumEvidence.calculation,
    threshold: minimumEvidence.threshold,
  };
  const genealogy = entry.genealogy ?? "";
  const references = entry.references ?? entry.resources ?? [];

  return {
    categoryLabel,
    scopeText: scopeText || undefined,
    adjacentTerms,
    operationalTests,
    commonCounterfeits,
    minimumEvidence: minimumEvidenceWithDefaults,
    genealogy: genealogy || undefined,
    references,
  };
};
