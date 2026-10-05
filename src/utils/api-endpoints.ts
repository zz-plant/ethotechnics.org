/**
 * The single list of read-only JSON endpoints under /api: the route path, a
 * one-line purpose shown on the /api reference page, and the group that
 * determines where the path is advertised.
 *
 * - core: advertised in agent-index.json and site-index.json
 * - delegation: the object-model v2 worked example, advertised separately
 * - release: versioned citation endpoints
 * - standalone: served, but not advertised in the endpoint indexes
 *
 * The catch-all route src/pages/api/[...endpoint].ts serves each path from
 * the handler table in src/pages/api/manifest.ts, and a test holds the two
 * lists to each other. Adding an endpoint means one entry here and one
 * handler there.
 */

export type ApiEndpointGroup = "core" | "delegation" | "release" | "standalone";

export type ApiEndpoint = {
  path: string;
  description: string;
  group: ApiEndpointGroup;
};

export const API_ENDPOINTS = [
  {
    path: "agent-index.json",
    description: "Index for agent discovery and tooling.",
    group: "core",
  },
  {
    path: "site-index.json",
    description: "Index of standards, validators, and research metadata.",
    group: "core",
  },
  {
    path: "standards.json",
    description: "Standard metadata with embedded clause objects.",
    group: "core",
  },
  {
    path: "clauses.json",
    description:
      "Clause-level obligations with evidence requirements and mappings.",
    group: "core",
  },
  {
    path: "mechanisms.json",
    description: "Mechanism catalog entries with filters and citations.",
    group: "core",
  },
  {
    path: "validators.json",
    description:
      "Validator definitions with inputs, thresholds, and clause mappings.",
    group: "core",
  },
  {
    path: "glossary.json",
    description: "Glossary terms with permalinks.",
    group: "core",
  },
  {
    path: "anti-patterns.json",
    description: "Negative patterns that surface legitimacy theater risks.",
    group: "core",
  },
  {
    path: "evidence-packs.json",
    description: "Evidence pack templates per clause.",
    group: "core",
  },
  {
    path: "crosswalks.json",
    description:
      "Control crosswalks with framework mappings and evidence artifacts.",
    group: "core",
  },
  {
    path: "post-market-monitoring.json",
    description:
      "Post-market monitoring and incident reporting workflow stages.",
    group: "core",
  },
  {
    path: "findings.json",
    description: "Canonical finding objects for remediation workflows.",
    group: "core",
  },
  {
    path: "diagnostic-results.json",
    description: "Portable diagnostic result artifacts.",
    group: "core",
  },
  {
    path: "eval-test-cases.json",
    description: "Eval test cases with scoring rubrics and suite assignments.",
    group: "core",
  },
  {
    path: "evals.json",
    description: "Eval suites with scoring methods and passing thresholds.",
    group: "core",
  },
  {
    path: "rag-corpus.jsonl",
    description:
      "JSONL corpus for retrieval pipelines. Every document carries a layer field: theory, method, or instrument. Add a limit query param for previews.",
    group: "core",
  },
  {
    path: "research.json",
    description: "Research publications and bridge artifacts.",
    group: "core",
  },
  {
    path: "capabilities.json",
    description:
      "Example capability catalog: what the worked-example agent can reach, with no permission fields.",
    group: "delegation",
  },
  {
    path: "grants.json",
    description:
      "Example authority grant with scope, evidence basis, and state history including a narrowing.",
    group: "delegation",
  },
  {
    path: "policies.json",
    description: "Example policy record with review triggers and expiry.",
    group: "delegation",
  },
  {
    path: "dependencies.json",
    description:
      "Example dependency record with three-level reversibility and exposure score.",
    group: "delegation",
  },
  {
    path: "standing.json",
    description:
      "Example standing register with its challenge and the reconsideration it triggered.",
    group: "delegation",
  },
  {
    path: "interventions.json",
    description:
      "Example intervention spec: what the steward can see, prevent, and alter.",
    group: "delegation",
  },
  {
    path: "substrate-profiles.json",
    description:
      "Example substrate profile with the 2.0.0 agent safety object model attached.",
    group: "delegation",
  },
  {
    path: "releases.json",
    description: "Versioned release index for stable citations.",
    group: "release",
  },
  {
    path: "changelog.json",
    description: "Merged changelog entries for mechanisms and research.",
    group: "release",
  },
  {
    path: "badges.json",
    description: "Repository badges for CI status and license.",
    group: "standalone",
  },
] as const satisfies readonly ApiEndpoint[];

/** Endpoints snapshotted under each release permalink for stable citations. */
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

const getEndpointName = (endpointPath: string) =>
  endpointPath
    .replace(/\.jsonl?$/, "")
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

export const getApiEndpointPaths = (options?: {
  includeReleaseEndpoints?: boolean;
}) => {
  const groups: ApiEndpointGroup[] = options?.includeReleaseEndpoints
    ? ["core", "release"]
    : ["core"];

  return API_ENDPOINTS.filter((endpoint) =>
    groups.includes(endpoint.group),
  ).map((endpoint) => endpoint.path);
};

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
