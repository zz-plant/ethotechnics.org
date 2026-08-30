import { evalTestCases } from "../content/eval-test-cases";
import { evalsContent } from "../content/evals";
import { glossaryContent } from "../content/glossary";
import { libraryContent } from "../content/library";
import { researchContent } from "../content/research";
import { standardsContent } from "../content/standards";
import { validatorsContent } from "../content/validators";

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
    },
    endpoints: endpointMap,
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
    },
    endpoints: buildEndpoints(options.basePath, {
      includeReleaseEndpoints: options.includeReleaseEndpoints,
    }),
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

export const createRagCorpusResponse = (limit?: number) => {
  const payload = getRagCorpusLines({ limit });
  return ndjsonResponse(payload);
};
