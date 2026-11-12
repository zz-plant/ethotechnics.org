import { taxonomyEntriesData } from "./generated/taxonomy.generated";

export type TaxonomyArtifact = {
  label: string;
  href: string;
  type: string;
};

/**
 * The six safeguards the method names. Each practice says which of them it
 * serves, first the one it is filed under on /method.
 *
 * The practices used to sit under six domains of their own (Governance,
 * Delivery, Assurance, Experience, Authority, Dependence) on a separate
 * /taxonomy page: a second list of six beside the safeguards, two of them the
 * safeguards' own names. The domains are gone, their links moved to the
 * practice each fits, and the practices are filed by safeguard on /method.
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

/** The id of a practice's row on /method: its slug, dashed. */
export const taxonomyAnchor = (slug: string) => slug.replaceAll("/", "-");

export const SAFEGUARD_ORDER: Safeguard[] = [
  "Capability",
  "Authority",
  "Evidence",
  "Dependency",
  "Standing",
  "Correction",
];

/** Practices grouped by the safeguard each is filed under, in method order. */
export const practicesBySafeguard = (entries = taxonomyEntries) =>
  SAFEGUARD_ORDER.map((safeguard) => ({
    safeguard,
    practices: entries.filter((entry) => entry.safeguards[0] === safeguard),
  })).filter((group) => group.practices.length > 0);
