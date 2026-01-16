import taxonomyData from "./taxonomy.json";

export type TaxonomyArtifact = {
  label: string;
  href: string;
  type: string;
};

export type TaxonomyEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  owner: string;
  scope: string;
  readiness: "draft" | "alpha" | "beta" | "stable";
  relatedArtifacts: TaxonomyArtifact[];
};

export const taxonomyEntries = taxonomyData as TaxonomyEntry[];
