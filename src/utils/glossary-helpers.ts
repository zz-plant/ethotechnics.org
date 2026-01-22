import type {
  GlossaryCategory,
  GlossaryEntry,
  GlossaryResource,
} from "../content/glossary";
import type { PublicationMetadata } from "../content/types";

export const stripHtml = (value: string): string =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const normalizeGlossaryHeading = (heading: string): string =>
  heading.replace(/^[A-Z]\.\s*/, "");

export const getGlossaryAuthor = (publication: PublicationMetadata): string =>
  publication.authors.map((author) => author.name).join(", ") ||
  "Ethotechnics Institute";

export const buildGlossaryEntrySearchText = (
  entry: GlossaryEntry,
  categoryLabel: string,
): string => {
  const plainDescription = stripHtml(entry.bodyHtml);
  const tags = entry.tags?.join(" ") ?? "";
  const examples = entry.examples?.join(" ") ?? "";
  const searchText =
    `${entry.title} ${categoryLabel} ${plainDescription} ${tags} ${examples}`.trim();

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
  minimumEvidence: GlossaryEntry["minimumEvidence"];
  genealogy?: string;
  references: GlossaryResource[];
} => {
  const categoryLabel = normalizeGlossaryHeading(category.heading);
  const scopeText = entry.scope ?? "";
  const adjacentTerms = entry.adjacentTerms ?? entry.tags ?? [];
  const operationalTests = entry.operationalTests ?? [];
  const commonCounterfeits = entry.commonCounterfeits ?? [];
  const minimumEvidence = entry.minimumEvidence ?? {
    artifact: `Artifact documenting how ${entry.title} is expected, enforced, or governed.`,
    behavior: `Observed behavior showing ${entry.title} in practice during real use or drills.`,
    metric: `Metric tracked to monitor ${entry.title} performance over time.`,
  };
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
