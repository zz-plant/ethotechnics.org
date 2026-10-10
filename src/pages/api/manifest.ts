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
} from "../../utils/api/api-responses";

const parseLimit = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const limitValue = Number(searchParams.get("limit"));
  return Number.isFinite(limitValue) && limitValue > 0 ? limitValue : undefined;
};

/**
 * The handler for each path in the API_ENDPOINTS manifest
 * (src/utils/api/api-endpoints.ts). The catch-all route looks up the path it
 * captured and delegates to the handler here. A test in
 * src/utils/api/tests holds this table to the manifest.
 */
export const apiRoutes: Record<string, (context: APIContext) => Response> = {
  "agent-index.json": () =>
    createAgentIndexResponse({
      basePath: "/api",
      includeReleaseEndpoints: true,
    }),
  "site-index.json": () =>
    createSiteIndexResponse({
      basePath: "/api",
      includeReleaseEndpoints: true,
    }),
  "standards.json": () => createStandardsResponse(),
  "clauses.json": () => createClausesResponse(),
  "mechanisms.json": () => createMechanismsResponse(),
  "validators.json": () => createValidatorsResponse(),
  "glossary.json": () => createGlossaryResponse(),
  "anti-patterns.json": () => createAntiPatternsResponse(),
  "evidence-packs.json": () => createEvidencePacksResponse(),
  "crosswalks.json": () => createCrosswalksResponse(),
  "post-market-monitoring.json": () => createPostMarketMonitoringResponse(),
  "findings.json": () => createFindingsResponse(),
  "diagnostic-results.json": () => createDiagnosticResultsResponse(),
  "eval-test-cases.json": () => createEvalTestCasesResponse(),
  "evals.json": () => createEvalsResponse(),
  "rag-corpus.jsonl": (context) =>
    createRagCorpusResponse(parseLimit(context.request)),
  "research.json": () => createResearchResponse(),
  "capabilities.json": () => createCapabilitiesResponse(),
  "grants.json": () => createGrantsResponse(),
  "policies.json": () => createPoliciesResponse(),
  "dependencies.json": () => createDependenciesResponse(),
  "standing.json": () => createStandingResponse(),
  "interventions.json": () => createInterventionsResponse(),
  "substrate-profiles.json": () => createSubstrateProfilesResponse(),
  "releases.json": () => createReleasesResponse(),
  "changelog.json": () => createChangelogResponse(),
  "badges.json": () => createBadgesResponse(),
};
