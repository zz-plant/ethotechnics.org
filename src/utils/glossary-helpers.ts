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
  scopeText: string;
  adjacentTerms: string[];
  operationalTests: string[];
  minimumEvidence: GlossaryEntry["minimumEvidence"];
  genealogy: string;
  references: GlossaryResource[];
} => {
  const categoryLabel = normalizeGlossaryHeading(category.heading);
  const scopeText =
    entry.scope ?? `${category.heading}. ${stripHtml(category.descriptionHtml)}`;
  const adjacentTerms = entry.adjacentTerms ?? entry.tags ?? [];
  const operationalTests =
    entry.operationalTests ?? [
      `Evidence appears in documentation, interface cues, or governance artifacts that reflect ${entry.title.toLowerCase()}.`,
      `Teams can point to a concrete example that demonstrates ${entry.title.toLowerCase()} in practice.`,
    ];
  const minimumEvidence = entry.minimumEvidence ?? {
    artifact: `Artifact documenting how ${entry.title} is expected, enforced, or governed.`,
    behavior: `Observed behavior showing ${entry.title} in practice during real use or drills.`,
    metric: `Metric tracked to monitor ${entry.title} performance over time.`,
  };
  const minimumEvidenceWithDefaults = {
    artifact: minimumEvidence.artifact,
    behavior: minimumEvidence.behavior,
    metric: minimumEvidence.metric,
    definition: minimumEvidence.definition ?? "Not specified yet.",
    unit: minimumEvidence.unit ?? "Not specified yet.",
    dataSource: minimumEvidence.dataSource ?? "Not specified yet.",
    calculation: minimumEvidence.calculation ?? "Not specified yet.",
    threshold: minimumEvidence.threshold ?? "Not specified yet.",
  };
  const genealogy =
    entry.genealogy ??
    `Ethotechnics uses ${entry.title} to extend the ${category.heading.toLowerCase()} vocabulary and connect governance, design, and policy teams.`;
  const references = entry.references ?? entry.resources ?? [];

  return {
    categoryLabel,
    scopeText,
    adjacentTerms,
    operationalTests,
    minimumEvidence: minimumEvidenceWithDefaults,
    genealogy,
    references,
  };
};
