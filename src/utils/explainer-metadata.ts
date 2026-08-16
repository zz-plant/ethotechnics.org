export interface ExplainerSeoMetadata {
  publishedTime: string;
  modifiedTime: string;
}

const defaultExplainerMetadata: ExplainerSeoMetadata = {
  publishedTime: "2025-01-15T00:00:00.000Z",
  modifiedTime: "2026-02-09T00:00:00.000Z",
};

const explainerMetadataBySlug: Record<string, ExplainerSeoMetadata> = {
  stoppability: {
    publishedTime: "2025-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "time-to-halt": {
    publishedTime: "2025-01-20T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "permission-surface": {
    publishedTime: "2025-02-10T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "repair-log": {
    publishedTime: "2025-03-05T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  contestability: {
    publishedTime: "2025-03-20T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "contestability-checklist": {
    publishedTime: "2025-04-01T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "safety-valve": {
    publishedTime: "2025-05-10T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "ethical-interrupts": {
    publishedTime: "2025-06-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "consent-journey": {
    publishedTime: "2025-07-01T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "public-memory": {
    publishedTime: "2025-08-10T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "language-people-can-use": {
    publishedTime: "2025-09-05T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "design-authority": {
    publishedTime: "2025-10-01T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "burden-index": {
    publishedTime: "2025-10-20T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "governance-capability": {
    publishedTime: "2025-11-10T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "remedy-essentials": {
    publishedTime: "2025-12-01T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "democratic-vs-coercive-governability": {
    publishedTime: "2026-01-10T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
};

export const getExplainerSeoMetadata = (
  permalink: string,
): ExplainerSeoMetadata => {
  const slug = permalink.replace(/^\/explainers\//, "").replace(/\/$/, "");
  return explainerMetadataBySlug[slug] ?? defaultExplainerMetadata;
};
