import type {
  GlossaryCategory,
  GlossaryEntry,
  GlossaryMinimumEvidence,
  GlossaryResource,
} from "../content/glossary";
import type { PublicationMetadata } from "../content/types";

export const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]+>/g, " ")
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
