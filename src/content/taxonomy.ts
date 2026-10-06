import { taxonomyEntriesData } from "./generated/taxonomy.generated";

export type TaxonomyArtifact = {
  label: string;
  href: string;
  type: string;
};

/**
 * The six safeguards the method names. Each taxonomy entry says which of them
 * it serves, so the taxonomy's six domains read as a way of filing practices
 * under the safeguards rather than as a second, competing six.
 */
export type Safeguard =
  | "Capability"
  | "Authority"
  | "Evidence"
  | "Dependency"
  | "Standing"
  | "Correction";

export type TaxonomyEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  scope: string;
  safeguards: Safeguard[];
  relatedArtifacts: TaxonomyArtifact[];
};

export const taxonomyEntries = taxonomyEntriesData as TaxonomyEntry[];

/** The id of an entry's row or section on /taxonomy: its slug, dashed. */
export const taxonomyAnchor = (slug: string) => slug.replaceAll("/", "-");

export const getTaxonomyBranch = (rootSlug: string) =>
  taxonomyEntries.filter(
    (entry) => entry.slug === rootSlug || entry.slug.startsWith(`${rootSlug}/`),
  );
