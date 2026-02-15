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
  getEvidencePacksForApi,
  getGlossaryEntriesForApi,
  getMechanismsForApi,
  getPostMarketMonitoringForApi,
  getRagCorpusLines,
  getStandardsForApi,
  getValidatorsForApi,
  releaseInfo,
} from "./api";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
};

const ndjsonHeaders = {
  "Content-Type": "application/x-ndjson; charset=utf-8",
};

const jsonResponse = (payload: unknown) =>
  new Response(JSON.stringify(payload, null, 2), {
    headers: jsonHeaders,
  });

const ndjsonResponse = (payload: string) =>
  new Response(payload, {
    headers: ndjsonHeaders,
  });

const repoSlug = "zz-plant/ethotechnics";

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
    endpoints: {
      siteIndex: `${releaseInfo.permalink}/site-index.json`,
      standards: `${releaseInfo.permalink}/standards.json`,
      clauses: `${releaseInfo.permalink}/clauses.json`,
      mechanisms: `${releaseInfo.permalink}/mechanisms.json`,
      validators: `${releaseInfo.permalink}/validators.json`,
      glossary: `${releaseInfo.permalink}/glossary.json`,
      findings: `${releaseInfo.permalink}/findings.json`,
      diagnosticResults: `${releaseInfo.permalink}/diagnostic-results.json`,
      antiPatterns: `${releaseInfo.permalink}/anti-patterns.json`,
      evidencePacks: `${releaseInfo.permalink}/evidence-packs.json`,
      crosswalks: `${releaseInfo.permalink}/crosswalks.json`,
      postMarketMonitoring: `${releaseInfo.permalink}/post-market-monitoring.json`,
      ragCorpus: `${releaseInfo.permalink}/rag-corpus.jsonl`,
    },
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
      generatedAt: new Date().toISOString(),
      count: options.items.length,
      ...(options.permalink ? { permalink: options.permalink } : {}),
      ...(options.release ? { release: options.release } : {}),
    },
    [options.key]: options.items,
  };

  return jsonResponse(payload);
};

const buildEndpointMap = (
  basePath: string,
  options?: { includeReleaseEndpoints?: boolean },
) => {
  const normalizedBase = basePath.replace(/\/$/, "");

  return {
    agentIndex: `${normalizedBase}/agent-index.json`,
    siteIndex: `${normalizedBase}/site-index.json`,
    standards: `${normalizedBase}/standards.json`,
    clauses: `${normalizedBase}/clauses.json`,
    mechanisms: `${normalizedBase}/mechanisms.json`,
    validators: `${normalizedBase}/validators.json`,
    glossary: `${normalizedBase}/glossary.json`,
    antiPatterns: `${normalizedBase}/anti-patterns.json`,
    evidencePacks: `${normalizedBase}/evidence-packs.json`,
    crosswalks: `${normalizedBase}/crosswalks.json`,
    postMarketMonitoring: `${normalizedBase}/post-market-monitoring.json`,
    findings: `${normalizedBase}/findings.json`,
    diagnosticResults: `${normalizedBase}/diagnostic-results.json`,
    ragCorpus: `${normalizedBase}/rag-corpus.jsonl`,
    research: `${normalizedBase}/research.json`,
    ...(options?.includeReleaseEndpoints
      ? {
          releases: `${normalizedBase}/releases.json`,
          changelog: `${normalizedBase}/changelog.json`,
        }
      : {}),
  };
};

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
      generatedAt: new Date().toISOString(),
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
      generatedAt: new Date().toISOString(),
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

const buildEndpoints = (
  basePath: string,
  options?: { includeReleaseEndpoints?: boolean },
) => {
  const core = [
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
    "rag-corpus.jsonl",
    "research.json",
  ];
  const release = options?.includeReleaseEndpoints
    ? ["releases.json", "changelog.json"]
    : [];

  const normalizedBase = basePath.replace(/\/$/, "");

  return [...core, ...release].map(
    (endpoint) => `${normalizedBase}/${endpoint}`,
  );
};

export const createAgentIndexResponse = (options: {
  basePath: string;
  includeReleaseEndpoints?: boolean;
}) => {
  const endpointMap = buildEndpointMap(options.basePath, {
    includeReleaseEndpoints: options.includeReleaseEndpoints,
  });

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
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
      generatedAt: new Date().toISOString(),
      standardsCount: standards.length,
      validatorsCount: validators.length,
      publicationsCount: publications.length,
      release: releaseInfo,
      repo: {
        href: "https://github.com/zz-plant/ethotechnics",
        issues: "https://github.com/zz-plant/ethotechnics/issues",
        discussions: "https://github.com/zz-plant/ethotechnics/discussions",
        releases: "https://github.com/zz-plant/ethotechnics/releases",
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

export const createRagCorpusResponse = (limit?: number) => {
  const payload = getRagCorpusLines({ limit });
  return ndjsonResponse(payload);
};
