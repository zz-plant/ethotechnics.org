import type { APIRoute } from "astro";

import { libraryContent } from "../../../../content/library";
import { researchContent } from "../../../../content/research";
import { standardsContent } from "../../../../content/standards";
import { validatorsContent } from "../../../../content/validators";
import { getStandardsForApi, getValidatorsForApi, releaseInfo } from "../../../../utils/api";

export const GET: APIRoute = () => {
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
    endpoints: [
      "/api/v/2026.01/site-index.json",
      "/api/v/2026.01/standards.json",
      "/api/v/2026.01/clauses.json",
      "/api/v/2026.01/mechanisms.json",
      "/api/v/2026.01/validators.json",
      "/api/v/2026.01/glossary.json",
      "/api/v/2026.01/anti-patterns.json",
      "/api/v/2026.01/evidence-packs.json",
      "/api/v/2026.01/findings.json",
      "/api/v/2026.01/diagnostic-results.json",
      "/api/v/2026.01/rag-corpus.jsonl",
    ],
    snapshots: {
      standards: `${standardsContent.permalink}`,
      validators: `${validatorsContent.permalink}`,
    },
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
