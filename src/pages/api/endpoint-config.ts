import type { APIContext } from "astro";

import {
  createAgentIndexResponse,
  createAntiPatternsResponse,
  createBadgesResponse,
  createChangelogResponse,
  createClausesResponse,
  createCrosswalksResponse,
  createDiagnosticResultsResponse,
  createEvalTestCasesResponse,
  createEvalsResponse,
  createEvidencePacksResponse,
  createFindingsResponse,
  createGlossaryResponse,
  createMechanismsResponse,
  createPostMarketMonitoringResponse,
  createRagCorpusResponse,
  createReleasesResponse,
  createResearchResponse,
  createSiteIndexResponse,
  createStandardsResponse,
  createValidatorsResponse,
} from "../../utils/api-responses";

export type ApiVariant = "unversioned" | "versioned";

export type EndpointId =
  | "agent-index"
  | "anti-patterns"
  | "badges"
  | "changelog"
  | "clauses"
  | "crosswalks"
  | "diagnostic-results"
  | "eval-test-cases"
  | "evals"
  | "evidence-packs"
  | "findings"
  | "glossary"
  | "mechanisms"
  | "post-market-monitoring"
  | "rag-corpus"
  | "releases"
  | "research"
  | "site-index"
  | "standards"
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
      versioned: { basePath: "/api/v/2026.01" },
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
      versioned: {},
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
      versioned: {},
    },
    createResponse: () => createClausesResponse(),
  },
  crosswalks: {
    slug: "crosswalks.json",
    variants: {
      unversioned: {},
      versioned: {},
    },
    createResponse: () => createCrosswalksResponse(),
  },
  "diagnostic-results": {
    slug: "diagnostic-results.json",
    variants: {
      unversioned: {},
      versioned: {},
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
      versioned: {},
    },
    createResponse: () => createEvidencePacksResponse(),
  },
  findings: {
    slug: "findings.json",
    variants: {
      unversioned: {},
      versioned: {},
    },
    createResponse: () => createFindingsResponse(),
  },
  glossary: {
    slug: "glossary.json",
    variants: {
      unversioned: {},
      versioned: {},
    },
    createResponse: () => createGlossaryResponse(),
  },
  mechanisms: {
    slug: "mechanisms.json",
    variants: {
      unversioned: {},
      versioned: {},
    },
    createResponse: () => createMechanismsResponse(),
  },
  "post-market-monitoring": {
    slug: "post-market-monitoring.json",
    variants: {
      unversioned: {},
      versioned: {},
    },
    createResponse: () => createPostMarketMonitoringResponse(),
  },
  "rag-corpus": {
    slug: "rag-corpus.jsonl",
    variants: {
      unversioned: {},
      versioned: {},
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
      versioned: { basePath: "/api/v/2026.01", includeSnapshots: true },
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
      versioned: {},
    },
    createResponse: () => createStandardsResponse(),
  },
  validators: {
    slug: "validators.json",
    variants: {
      unversioned: {},
      versioned: {},
    },
    createResponse: () => createValidatorsResponse(),
  },
};

export const getEndpointsForVariant = (variant: ApiVariant) =>
  Object.values(endpointConfig)
    .filter((config) => config.variants[variant] !== undefined)
    .map((config) => config.slug);

export const getEndpointRouteConfig = (id: EndpointId, variant: ApiVariant) => {
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
