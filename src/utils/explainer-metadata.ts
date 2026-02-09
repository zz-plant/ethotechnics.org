export interface ExplainerSeoMetadata {
  publishedTime: string;
  modifiedTime: string;
}

const defaultExplainerMetadata: ExplainerSeoMetadata = {
  publishedTime: "2025-01-15T00:00:00.000Z",
  modifiedTime: "2026-02-09T00:00:00.000Z",
};

const explainerMetadataBySlug: Record<string, ExplainerSeoMetadata> = {
  stoppability: defaultExplainerMetadata,
  "time-to-halt": defaultExplainerMetadata,
  "permission-surface": defaultExplainerMetadata,
  "repair-log": defaultExplainerMetadata,
  contestability: defaultExplainerMetadata,
  "contestability-checklist": defaultExplainerMetadata,
  "safety-valve": defaultExplainerMetadata,
  "ethical-interrupts": defaultExplainerMetadata,
  "consent-journey": defaultExplainerMetadata,
  "public-memory": defaultExplainerMetadata,
  "language-people-can-use": defaultExplainerMetadata,
  "design-authority": defaultExplainerMetadata,
  "burden-index": defaultExplainerMetadata,
  "governance-capability": defaultExplainerMetadata,
  "remedy-essentials": defaultExplainerMetadata,
  "democratic-vs-coercive-governability": defaultExplainerMetadata,
};

export const getExplainerSeoMetadata = (
  permalink: string,
): ExplainerSeoMetadata => {
  const slug = permalink.replace(/^\/explainers\//, "").replace(/\/$/, "");
  return explainerMetadataBySlug[slug] ?? defaultExplainerMetadata;
};
