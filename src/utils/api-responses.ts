import { libraryContent } from "../content/library";
import { researchContent } from "../content/research";
import { standardsContent } from "../content/standards";
import { validatorsContent } from "../content/validators";

import {
  getClausesForApi,
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

export const createClausesResponse = () => {
  const clauses = getClausesForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: clauses.length,
      permalink: standardsContent.permalink,
      release: releaseInfo,
    },
    clauses,
  };

  return jsonResponse(payload);
};

export const createStandardsResponse = () => {
  const standards = getStandardsForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: standards.length,
      permalink: standardsContent.permalink,
      release: releaseInfo,
    },
    standards,
  };

  return jsonResponse(payload);
};

const buildEndpoints = (
  basePath: string,
  options?: { includeReleaseEndpoints?: boolean },
) => {
  const normalizedBase = basePath.replace(/\/$/, "");
  const core = [
    "site-index.json",
    "standards.json",
    "clauses.json",
    "mechanisms.json",
    "validators.json",
    "glossary.json",
    "anti-patterns.json",
    "evidence-packs.json",
    "findings.json",
    "diagnostic-results.json",
    "rag-corpus.jsonl",
  ];
  const release = options?.includeReleaseEndpoints
    ? ["releases.json", "changelog.json"]
    : [];

  return [...core, ...release].map((endpoint) => `${normalizedBase}/${endpoint}`);
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
