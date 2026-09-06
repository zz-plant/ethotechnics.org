import { evalTestCases } from "../content/eval-test-cases";
import { evalsContent } from "../content/evals";
import { glossaryContent } from "../content/glossary";
import { libraryContent } from "../content/library";
import { researchContent } from "../content/research";
import { standardsContent } from "../content/standards";
import { validatorsContent } from "../content/validators";
import agentSafetyObjectModelExample from "../../public/standards/examples/agent-safety-object-model.example.json";
import authorityGrantExample from "../../public/standards/examples/authority-grant.example.json";
import capabilityCatalogExample from "../../public/standards/examples/capability-catalog.example.json";
import challengeExample from "../../public/standards/examples/challenge.example.json";
import dependencyRecordExample from "../../public/standards/examples/dependency-record.example.json";
import interventionSpecExample from "../../public/standards/examples/intervention-spec.example.json";
import policyRecordExample from "../../public/standards/examples/policy-record.example.json";
import reconsiderationExample from "../../public/standards/examples/reconsideration.example.json";
import standingRegisterExample from "../../public/standards/examples/standing-register.example.json";
import substrateProfileExample from "../../public/standards/examples/substrate-profile.example.json";

import {
  diagnosticResultsCatalog,
  findingsCatalog,
  getAntiPatternsForApi,
  getClausesForApi,
  getCrosswalksForApi,
  getEvalTestCasesForApi,
  getEvalsForApi,
  getEvidencePacksForApi,
  getGlossaryEntriesForApi,
  getMechanismsForApi,
  getPostMarketMonitoringForApi,
  getRagCorpusLines,
  getStandardsForApi,
  getValidatorsForApi,
  releaseInfo,
} from "./api";
import {
  buildApiEndpointList as buildEndpointListFromPaths,
  buildApiEndpointMap as buildEndpointMapFromPaths,
  buildReleaseEndpoints as buildReleaseEndpointsFromPaths,
} from "./api-endpoints";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
};

const ndjsonHeaders = {
  "Content-Type": "application/x-ndjson; charset=utf-8",
};

const API_GENERATED_AT = `${releaseInfo.date}T00:00:00.000Z`;

export const applyApiCaching = async (
  request: Request,
  response: Response,
  immutable = false,
) => {
  const body = await response.clone().arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", body);
  const etag = `"${Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")}"`;
  const cacheControl = immutable
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

  if (
    request.headers
      .get("If-None-Match")
      ?.split(",")
      .map((value) => value.trim())
      .includes(etag)
  ) {
    return new Response(null, {
      status: 304,
      headers: { "Cache-Control": cacheControl, ETag: etag },
    });
  }

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", cacheControl);
  headers.set("ETag", etag);
  return new Response(response.body, { status: response.status, headers });
};

const jsonResponse = (payload: unknown) =>
  new Response(JSON.stringify(payload, null, 2), {
    headers: jsonHeaders,
  });

const ndjsonResponse = (payload: string) =>
  new Response(payload, {
    headers: ndjsonHeaders,
  });

const repoSlug = "zz-plant/ethotechnics.org";

const changelogEntries = [
  ...libraryContent.publication.changelog.map((entry) => ({
    source: "Mechanisms",
    version: entry.version,
    date: entry.date,
    summary: entry.summary,
    href: libraryContent.permalink,
  })),
  ...researchContent.publication.changelog.map((entry) => ({
    source: "Research",
    version: entry.version,
    date: entry.date,
    summary: entry.summary,
    href: researchContent.permalink,
  })),
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const releases = [
  {
    id: releaseInfo.id,
    label: releaseInfo.label,
    date: releaseInfo.date,
    href: releaseInfo.permalink,
    endpoints: buildReleaseEndpointsFromPaths(releaseInfo.permalink),
  },
];

const createCollectionResponse = <T>(options: {
  key: string;
  items: T[];
  permalink?: string;
  release?: typeof releaseInfo;
}) => {
  const payload = {
    meta: {
      generatedAt: API_GENERATED_AT,
      count: options.items.length,
      ...(options.permalink ? { permalink: options.permalink } : {}),
      ...(options.release ? { release: options.release } : {}),
    },
    [options.key]: options.items,
  };

  return jsonResponse(payload);
};

const buildEndpointMap = buildEndpointMapFromPaths;

const LAWS_PERMALINK = "/standards/laws";
const METHOD_PERMALINK = "/method";

/**
 * Delegation state endpoints (object model v2). These serve the worked
 * example under public/standards/examples so tools can see one coherent
 * scenario across the six state variables.
 */
export const DELEGATION_ENDPOINT_PATHS = [
  "capabilities.json",
  "grants.json",
  "policies.json",
  "dependencies.json",
  "standing.json",
  "interventions.json",
  "substrate-profiles.json",
] as const;

export const DELEGATION_SCHEMA_PATHS = {
  capabilityCatalog: "/standards/capability-catalog.schema.json",
  authorityGrant: "/standards/authority-grant.schema.json",
  policyRecord: "/standards/policy-record.schema.json",
  dependencyRecord: "/standards/dependency-record.schema.json",
  standingRegister: "/standards/standing-register.schema.json",
  challenge: "/standards/challenge.schema.json",
  interventionSpec: "/standards/intervention-spec.schema.json",
  reconsideration: "/standards/reconsideration.schema.json",
  substrateProfile: "/standards/substrate-profile.schema.json",
  agentSafetyObjectModel: "/standards/agent-safety-object-model.schema.json",
  decisionRecord: "/standards/decision-record.schema.json",
} as const;

const toEndpointKey = (endpointPath: string) =>
  endpointPath
    .replace(/\.jsonl?$/, "")
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

const buildDelegationEndpointMap = (basePath: string) => {
  const normalizedBase = basePath.replace(/\/$/, "");
  return Object.fromEntries(
    DELEGATION_ENDPOINT_PATHS.map((endpointPath) => [
      toEndpointKey(endpointPath),
      `${normalizedBase}/${endpointPath}`,
    ]),
  ) as Record<string, string>;
};

const buildDelegationEndpointList = (basePath: string) =>
  Object.values(buildDelegationEndpointMap(basePath));

export const createCapabilitiesResponse = () =>
  createCollectionResponse({
    key: "catalogs",
    items: [capabilityCatalogExample],
    permalink: LAWS_PERMALINK,
    release: releaseInfo,
  });

export const createGrantsResponse = () =>
  createCollectionResponse({
    key: "grants",
    items: [authorityGrantExample],
    permalink: LAWS_PERMALINK,
    release: releaseInfo,
  });

export const createPoliciesResponse = () =>
  createCollectionResponse({
    key: "policies",
    items: [policyRecordExample],
    permalink: LAWS_PERMALINK,
    release: releaseInfo,
  });

export const createDependenciesResponse = () =>
  createCollectionResponse({
    key: "dependencies",
    items: [dependencyRecordExample],
    permalink: LAWS_PERMALINK,
    release: releaseInfo,
  });

export const createStandingResponse = () =>
  createCollectionResponse({
    key: "registers",
    items: [
      {
        ...standingRegisterExample,
        challenges: [challengeExample],
        reconsiderations: [reconsiderationExample],
      },
    ],
    permalink: LAWS_PERMALINK,
    release: releaseInfo,
  });

export const createInterventionsResponse = () =>
  createCollectionResponse({
    key: "interventions",
    items: [interventionSpecExample],
    permalink: LAWS_PERMALINK,
    release: releaseInfo,
  });

export const createSubstrateProfilesResponse = () =>
  createCollectionResponse({
    key: "profiles",
    items: [
      {
        ...substrateProfileExample,
        agent_safety_object_model: agentSafetyObjectModelExample,
      },
    ],
    permalink: METHOD_PERMALINK,
    release: releaseInfo,
  });

export const createAntiPatternsResponse = () =>
  createCollectionResponse({
    key: "antiPatterns",
    items: getAntiPatternsForApi(),
    permalink: libraryContent.permalink,
    release: releaseInfo,
  });

export const createClausesResponse = () =>
  createCollectionResponse({
    key: "clauses",
    items: getClausesForApi(),
    permalink: standardsContent.permalink,
    release: releaseInfo,
  });

export const createDiagnosticResultsResponse = () =>
  createCollectionResponse({
    key: "results",
    items: diagnosticResultsCatalog,
    release: releaseInfo,
  });

export const createEvidencePacksResponse = () =>
  createCollectionResponse({
    key: "evidencePacks",
    items: getEvidencePacksForApi(),
    permalink: standardsContent.permalink,
    release: releaseInfo,
  });

export const createCrosswalksResponse = () =>
  createCollectionResponse({
    key: "controls",
    items: getCrosswalksForApi(),
    permalink: "/standards/enforceable-governance-crosswalks",
    release: releaseInfo,
  });

export const createFindingsResponse = () =>
  createCollectionResponse({
    key: "findings",
    items: findingsCatalog,
    release: releaseInfo,
  });

export const createPostMarketMonitoringResponse = () =>
  createCollectionResponse({
    key: "stages",
    items: getPostMarketMonitoringForApi(),
    permalink: "/incidents",
    release: releaseInfo,
  });

export const createGlossaryResponse = () =>
  createCollectionResponse({
    key: "entries",
    items: getGlossaryEntriesForApi(),
    permalink: glossaryContent.permalink,
    release: releaseInfo,
  });

export const createMechanismsResponse = () =>
  createCollectionResponse({
    key: "patterns",
    items: getMechanismsForApi(),
    permalink: libraryContent.permalink,
    release: releaseInfo,
  });

export const createStandardsResponse = () =>
  createCollectionResponse({
    key: "standards",
    items: getStandardsForApi(),
    permalink: standardsContent.permalink,
    release: releaseInfo,
  });

export const createValidatorsResponse = () =>
  createCollectionResponse({
    key: "validators",
    items: getValidatorsForApi(),
    permalink: validatorsContent.permalink,
    release: releaseInfo,
  });

export const createBadgesResponse = () => {
  const payload = {
    meta: {
      generatedAt: API_GENERATED_AT,
      repo: repoSlug,
    },
    badges: {
      siteChecks: {
        label: "Site checks",
        image: `https://github.com/${repoSlug}/actions/workflows/site-checks.yml/badge.svg`,
        href: `https://github.com/${repoSlug}/actions/workflows/site-checks.yml`,
      },
      license: {
        label: "CC BY-SA 4.0",
        image: "https://licensebuttons.net/l/by-sa/4.0/88x31.png",
        href: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
    },
  };

  return jsonResponse(payload);
};

export const createChangelogResponse = () =>
  createCollectionResponse({
    key: "entries",
    items: changelogEntries,
  });

export const createReleasesResponse = () =>
  createCollectionResponse({
    key: "releases",
    items: releases,
  });

export const createResearchResponse = () => {
  const payload = {
    meta: {
      generatedAt: API_GENERATED_AT,
      permalink: researchContent.permalink,
      updated: researchContent.updated,
    },
    orientation: researchContent.orientationCards,
    bridgeArtifacts: researchContent.bridgeArtifacts,
    agenda: researchContent.agenda,
    focusAreas: researchContent.focusAreas,
    publications: researchContent.publications,
    standardsTimeline: researchContent.standardsTimeline,
  };

  return jsonResponse(payload);
};

const buildEndpoints = buildEndpointListFromPaths;

export const createAgentIndexResponse = (options: {
  basePath: string;
  includeReleaseEndpoints?: boolean;
}) => {
  const endpointMap = buildEndpointMap(options.basePath, {
    includeReleaseEndpoints: options.includeReleaseEndpoints,
  });
  const delegationEndpointMap = buildDelegationEndpointMap(options.basePath);

  const payload = {
    meta: {
      generatedAt: API_GENERATED_AT,
      release: releaseInfo,
      permalink: endpointMap.agentIndex,
    },
    discovery: {
      sitemap: "/sitemap.xml",
      robots: "/robots.txt",
    },
    docs: {
      apiReference: "/api",
      agentObjectModel: "/agents/spec",
      agentObjectSchema: "/agents/spec.json",
      agentObjectModelSchema: DELEGATION_SCHEMA_PATHS.agentSafetyObjectModel,
      controlPlaneOpenApi: "/standards/ethotechnics-control-plane.openapi.yaml",
      eventsAsyncApi: "/standards/ethotechnics-events.asyncapi.yaml",
      revisableDelegationRecord:
        "/standards/std-07-revisable-delegation-record",
      revisableDelegationRecordSchema:
        "/api/schema/revisable-delegation-record.schema.json",
    },
    recommended: {
      quickStart: [
        endpointMap.siteIndex,
        endpointMap.standards,
        endpointMap.clauses,
        endpointMap.mechanisms,
        endpointMap.validators,
        endpointMap.glossary,
        endpointMap.research,
        endpointMap.crosswalks,
        endpointMap.postMarketMonitoring,
      ],
      ragCorpusPreview: `${endpointMap.ragCorpus}?limit=200`,
      delegationState: Object.values(delegationEndpointMap),
    },
    endpoints: { ...endpointMap, ...delegationEndpointMap },
  };

  return jsonResponse(payload);
};

export const createSiteIndexResponse = (options: {
  basePath: string;
  includeReleaseEndpoints?: boolean;
  includeSnapshots?: boolean;
}) => {
  const standards = getStandardsForApi().map((standard) => ({
    id: standard.id,
    title: standard.title,
    status: standard.status,
    version: standard.version,
    effectiveDate: standard.effectiveDate,
    published: standard.published,
    href: standard.href,
    type: standard.type,
    refs: standard.refs,
  }));

  const validators = getValidatorsForApi().map((validator) => ({
    id: validator.id,
    title: validator.title,
    description: validator.description,
    standardRef: validator.standardRef,
    href: validator.href,
    type: validator.type,
    refs: validator.refs,
  }));

  const publications = researchContent.publications.map((publication) => ({
    title: publication.title,
    type: publication.type,
    summary: publication.summary,
    tags: publication.tags,
    href: publication.href,
  }));

  const payload = {
    meta: {
      generatedAt: API_GENERATED_AT,
      standardsCount: standards.length,
      validatorsCount: validators.length,
      publicationsCount: publications.length,
      release: releaseInfo,
      repo: {
        href: "https://github.com/zz-plant/ethotechnics.org",
        issues: "https://github.com/zz-plant/ethotechnics.org/issues",
        discussions: "https://github.com/zz-plant/ethotechnics.org/discussions",
        releases: "https://github.com/zz-plant/ethotechnics.org/releases",
      },
    },
    standards,
    validators,
    research: {
      permalink: researchContent.permalink,
      lastUpdated: researchContent.lastUpdated,
      publications,
    },
    mechanisms: {
      permalink: libraryContent.permalink,
      version: libraryContent.publication.version,
      updated: libraryContent.updated,
      quickStart: libraryContent.quickStart,
    },
    schemas: {
      siteIndex: "/api/schema/site-index.schema.json",
      standards: "/api/schema/standards.schema.json",
      clauses: "/api/schema/clauses.schema.json",
      mechanisms: "/api/schema/mechanisms.schema.json",
      validators: "/api/schema/validators.schema.json",
      crosswalks: "/api/schema/crosswalks.schema.json",
      postMarketMonitoring: "/api/schema/post-market-monitoring.schema.json",
      findings: "/api/schema/findings.schema.json",
      diagnosticResults: "/api/schema/diagnostic-results.schema.json",
      ...DELEGATION_SCHEMA_PATHS,
    },
    endpoints: [
      ...buildEndpoints(options.basePath, {
        includeReleaseEndpoints: options.includeReleaseEndpoints,
      }),
      ...buildDelegationEndpointList(options.basePath),
    ],
    ...(options.includeSnapshots
      ? {
          snapshots: {
            standards: standardsContent.permalink,
            validators: validatorsContent.permalink,
          },
        }
      : {}),
  };

  return jsonResponse(payload);
};

export const createEvalsResponse = () =>
  createCollectionResponse({
    key: "suites",
    items: getEvalsForApi().map((suite) => ({
      id: suite.id,
      type: "eval-suite",
      slug: suite.slug,
      title: suite.title,
      description: suite.description,
      version: suite.version,
      status: suite.status,
      category: suite.category,
      layer: suite.layer,
      standardRefs: suite.standardRefs,
      glossaryRefs: suite.glossaryRefs,
      scoringMethod: {
        type: suite.scoringMethod.type,
        passingScore: suite.scoringMethod.passingScore,
        failureThreshold: suite.scoringMethod.failureThreshold,
      },
      estimatedTime: suite.estimatedTime,
      deliverables: suite.deliverables,
      href: `/evals/${suite.slug}`,
      testCount: evalTestCases.filter((tc) => tc.suiteId === suite.id).length,
      refs: [...suite.standardRefs, ...suite.glossaryRefs],
      deprecated_by: null,
      supersedes: [],
    })),
    permalink: evalsContent.permalink,
    release: releaseInfo,
  });

export const createEvalTestCasesResponse = () =>
  createCollectionResponse({
    key: "testCases",
    items: getEvalTestCasesForApi().map((tc) => ({
      id: tc.id,
      type: "eval-test-case",
      suiteId: tc.suiteId,
      title: tc.title,
      description: tc.description,
      category: tc.category,
      layer: tc.layer,
      severity: tc.severity,
      status: tc.status,
      scoringRubric: tc.scoringRubric,
      estimatedRunTime: tc.estimatedRunTime,
      relatedStandardRefs: tc.relatedStandardRefs,
      relatedGlossaryTerms: tc.relatedGlossaryTerms,
      href: `/evals/${evalsContent.suites.find((s) => s.id === tc.suiteId)?.slug ?? ""}`,
      refs: [...tc.relatedStandardRefs, ...tc.relatedGlossaryTerms],
      deprecated_by: null,
      supersedes: [],
    })),
    permalink: evalsContent.permalink,
    release: releaseInfo,
  });

const INSTRUMENT_PREFIXES = [
  "/diagnostics/",
  "/diagnostics",
  "/validators/",
  "/validators",
  "/tools/",
  "/tools",
  "/agent-toolkit/",
  "/agent-toolkit",
];

/**
 * Retrieval layer for a corpus document, per the three content layers:
 * theory motivates, method requires, instruments apply.
 */
export const resolveCorpusLayer = (
  href?: string,
): "theory" | "instrument" | "method" => {
  if (!href) return "method";

  const path = href.split(/[?#]/, 1)[0] ?? href;

  if (path === "/research/theory" || path.startsWith("/research/theory/")) {
    return "theory";
  }

  if (
    INSTRUMENT_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    )
  ) {
    return "instrument";
  }

  return "method";
};

const withCorpusLayer = (payload: string) =>
  payload
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
      const doc = JSON.parse(line) as Record<string, unknown> & {
        href?: string;
      };
      return JSON.stringify({ ...doc, layer: resolveCorpusLayer(doc.href) });
    })
    .join("\n");

export const createRagCorpusResponse = (limit?: number) => {
  const payload = withCorpusLayer(getRagCorpusLines({ limit }));
  return ndjsonResponse(payload);
};
