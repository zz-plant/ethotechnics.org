const CORE_ENDPOINT_PATHS = [
  "agent-index.json",
  "site-index.json",
  "standards.json",
  "clauses.json",
  "mechanisms.json",
  "validators.json",
  "glossary.json",
  "anti-patterns.json",
  "evidence-packs.json",
  "crosswalks.json",
  "post-market-monitoring.json",
  "findings.json",
  "diagnostic-results.json",
  "eval-test-cases.json",
  "evals.json",
  "rag-corpus.jsonl",
  "research.json",
] as const;

const RELEASE_ENDPOINT_PATHS = ["releases.json", "changelog.json"] as const;
const RELEASE_ARTIFACT_ENDPOINT_PATHS = [
  "site-index.json",
  "standards.json",
  "clauses.json",
  "mechanisms.json",
  "validators.json",
  "glossary.json",
  "findings.json",
  "diagnostic-results.json",
  "anti-patterns.json",
  "evidence-packs.json",
  "crosswalks.json",
  "post-market-monitoring.json",
  "rag-corpus.jsonl",
] as const;

export const getApiEndpointPaths = (options?: {
  includeReleaseEndpoints?: boolean;
}) =>
  options?.includeReleaseEndpoints
    ? [...CORE_ENDPOINT_PATHS, ...RELEASE_ENDPOINT_PATHS]
    : [...CORE_ENDPOINT_PATHS];

const getEndpointName = (endpointPath: string) =>
  endpointPath
    .replace(/\.jsonl?$/, "")
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

export const buildApiEndpointMap = (
  basePath: string,
  options?: { includeReleaseEndpoints?: boolean },
) => {
  const normalizedBase = basePath.replace(/\/$/, "");

  return Object.fromEntries(
    getApiEndpointPaths(options).map((endpointPath) => [
      getEndpointName(endpointPath),
      `${normalizedBase}/${endpointPath}`,
    ]),
  ) as Record<string, string>;
};

export const buildApiEndpointList = (
  basePath: string,
  options?: { includeReleaseEndpoints?: boolean },
) => {
  const normalizedBase = basePath.replace(/\/$/, "");

  return getApiEndpointPaths(options).map(
    (endpointPath) => `${normalizedBase}/${endpointPath}`,
  );
};

export const buildReleaseEndpoints = (releasePermalink: string) =>
  Object.fromEntries(
    RELEASE_ARTIFACT_ENDPOINT_PATHS.map((endpointPath) => [
      getEndpointName(endpointPath),
      `${releasePermalink}/${endpointPath}`,
    ]),
  ) as Record<string, string>;
