import type { APIContext } from "astro";

import {
  createAgentIndexResponse,
  createAntiPatternsResponse,
  createBadgesResponse,
  createCapabilitiesResponse,
  createChangelogResponse,
  createClausesResponse,
  createCrosswalksResponse,
  createDependenciesResponse,
  createDiagnosticResultsResponse,
  createEvalTestCasesResponse,
  createEvalsResponse,
  createEvidencePacksResponse,
  createFindingsResponse,
  createGlossaryResponse,
  createGrantsResponse,
  createInterventionsResponse,
  createMechanismsResponse,
  createPoliciesResponse,
  createPostMarketMonitoringResponse,
  createRagCorpusResponse,
  createReleasesResponse,
  createResearchResponse,
  createSiteIndexResponse,
  createStandardsResponse,
  createStandingResponse,
  createSubstrateProfilesResponse,
  createValidatorsResponse,
} from "../../utils/api-responses";

export type ApiVariant = "unversioned";

export type EndpointId =
  | "agent-index"
  | "anti-patterns"
  | "badges"
  | "capabilities"
  | "changelog"
  | "clauses"
  | "crosswalks"
  | "dependencies"
  | "diagnostic-results"
  | "eval-test-cases"
  | "evals"
  | "evidence-packs"
  | "findings"
  | "glossary"
  | "grants"
  | "interventions"
  | "mechanisms"
  | "policies"
  | "post-market-monitoring"
  | "rag-corpus"
  | "releases"
  | "research"
  | "site-index"
  | "standards"
  | "standing"
  | "substrate-profiles"
  | "validators";

type RouteOptions = {
  basePath?: string;
  includeReleaseEndpoints?: boolean;
  includeSnapshots?: boolean;
};

type EndpointConfig = {
  slug: string;
  variants: Partial<Record<ApiVariant, RouteOptions>>;
  createResponse: (context: APIContext, options?: RouteOptions) => Response;
};

const parseLimit = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const limitValue = Number(searchParams.get("limit"));
  return Number.isFinite(limitValue) && limitValue > 0 ? limitValue : undefined;
};

export const endpointConfig: Record<EndpointId, EndpointConfig> = {
  "agent-index": {
    slug: "agent-index.json",
    variants: {
      unversioned: { basePath: "/api", includeReleaseEndpoints: true },
    },
    createResponse: (_context, options) =>
      createAgentIndexResponse({
        basePath: options?.basePath ?? "/api",
        includeReleaseEndpoints: options?.includeReleaseEndpoints,
      }),
  },
  "anti-patterns": {
    slug: "anti-patterns.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createAntiPatternsResponse(),
  },
  badges: {
    slug: "badges.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createBadgesResponse(),
  },
  capabilities: {
    slug: "capabilities.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createCapabilitiesResponse(),
  },
  changelog: {
    slug: "changelog.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createChangelogResponse(),
  },
  clauses: {
    slug: "clauses.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createClausesResponse(),
  },
  crosswalks: {
    slug: "crosswalks.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createCrosswalksResponse(),
  },
  dependencies: {
    slug: "dependencies.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createDependenciesResponse(),
  },
  "diagnostic-results": {
    slug: "diagnostic-results.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createDiagnosticResultsResponse(),
  },
  "eval-test-cases": {
    slug: "eval-test-cases.json",
    variants: { unversioned: {} },
    createResponse: () => createEvalTestCasesResponse(),
  },
  evals: {
    slug: "evals.json",
    variants: { unversioned: {} },
    createResponse: () => createEvalsResponse(),
  },
  "evidence-packs": {
    slug: "evidence-packs.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createEvidencePacksResponse(),
  },
  findings: {
    slug: "findings.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createFindingsResponse(),
  },
  glossary: {
    slug: "glossary.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createGlossaryResponse(),
  },
  grants: {
    slug: "grants.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createGrantsResponse(),
  },
  interventions: {
    slug: "interventions.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createInterventionsResponse(),
  },
  mechanisms: {
    slug: "mechanisms.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createMechanismsResponse(),
  },
  policies: {
    slug: "policies.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createPoliciesResponse(),
  },
  "post-market-monitoring": {
    slug: "post-market-monitoring.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createPostMarketMonitoringResponse(),
  },
  "rag-corpus": {
    slug: "rag-corpus.jsonl",
    variants: {
      unversioned: {},
    },
    createResponse: (context) =>
      createRagCorpusResponse(parseLimit(context.request)),
  },
  releases: {
    slug: "releases.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createReleasesResponse(),
  },
  research: {
    slug: "research.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createResearchResponse(),
  },
  "site-index": {
    slug: "site-index.json",
    variants: {
      unversioned: { basePath: "/api", includeReleaseEndpoints: true },
    },
    createResponse: (_context, options) =>
      createSiteIndexResponse({
        basePath: options?.basePath ?? "/api",
        includeReleaseEndpoints: options?.includeReleaseEndpoints,
        includeSnapshots: options?.includeSnapshots,
      }),
  },
  standards: {
    slug: "standards.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createStandardsResponse(),
  },
  standing: {
    slug: "standing.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createStandingResponse(),
  },
  "substrate-profiles": {
    slug: "substrate-profiles.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createSubstrateProfilesResponse(),
  },
  validators: {
    slug: "validators.json",
    variants: {
      unversioned: {},
    },
    createResponse: () => createValidatorsResponse(),
  },
};

export const getEndpointsForVariant = (variant: ApiVariant = "unversioned") =>
  Object.values(endpointConfig)
    .filter((config) => config.variants[variant] !== undefined)
    .map((config) => config.slug);

export const getEndpointRouteConfig = (
  id: EndpointId,
  variant: ApiVariant = "unversioned",
) => {
  const config = endpointConfig[id];
  const options = config.variants[variant];

  if (!options) {
    throw new Error(
      `Endpoint "${id}" is not configured for variant "${variant}".`,
    );
  }

  return {
    createResponse: config.createResponse,
    options,
  };
};
