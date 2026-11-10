export interface ExplainerSeoMetadata {
  publishedTime: string;
  modifiedTime: string;
}

const defaultExplainerMetadata: ExplainerSeoMetadata = {
  publishedTime: "2026-01-15T00:00:00.000Z",
  modifiedTime: "2026-02-09T00:00:00.000Z",
};

const explainerMetadataBySlug: Record<string, ExplainerSeoMetadata> = {
  stoppability: {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "time-to-halt": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "permission-surface": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "repair-log": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  contestability: {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-10-08T00:00:00.000Z",
  },
  "challenge-checklist": {
    publishedTime: "2026-01-21T00:00:00.000Z",
    modifiedTime: "2026-10-06T00:00:00.000Z",
  },
  "safety-valve": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "ethical-interrupts": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "consent-journey": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "language-people-can-use": {
    publishedTime: "2026-01-26T00:00:00.000Z",
    modifiedTime: "2026-10-06T00:00:00.000Z",
  },
  "design-authority": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "burden-index": {
    publishedTime: "2026-01-15T00:00:00.000Z",
    modifiedTime: "2026-02-09T00:00:00.000Z",
  },
  "governance-capability": {
    publishedTime: "2026-01-25T00:00:00.000Z",
    modifiedTime: "2026-10-06T00:00:00.000Z",
  },
  "remedy-essentials": {
    publishedTime: "2026-01-16T00:00:00.000Z",
    modifiedTime: "2026-10-06T00:00:00.000Z",
  },
  "open-weights-and-the-delegation-boundary": {
    publishedTime: "2026-09-06T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "justified-delegation": {
    publishedTime: "2026-09-06T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "authority-as-lease": {
    publishedTime: "2026-09-06T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "intervention-specification": {
    publishedTime: "2026-09-06T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "three-kinds-of-reversibility": {
    publishedTime: "2026-09-06T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "error-bearing-parties": {
    publishedTime: "2026-09-06T00:00:00.000Z",
    modifiedTime: "2026-09-06T00:00:00.000Z",
  },
  "typed-decision-models": {
    publishedTime: "2026-09-22T00:00:00.000Z",
    modifiedTime: "2026-09-22T00:00:00.000Z",
  },
};

export const getExplainerSeoMetadata = (
  permalink: string,
): ExplainerSeoMetadata => {
  const slug = permalink.replace(/^\/explainers\//, "").replace(/\/$/, "");
  return explainerMetadataBySlug[slug] ?? defaultExplainerMetadata;
};
