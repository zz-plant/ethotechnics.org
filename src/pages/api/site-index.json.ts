import type { APIRoute } from "astro";

import { libraryContent } from "../../content/library";
import { researchContent } from "../../content/research";
import { standardsContent } from "../../content/standards";
import { validatorsContent } from "../../content/validators";

export const GET: APIRoute = async () => {
  const standards = standardsContent.standards.map((standard) => ({
    id: standard.id,
    title: standard.title,
    status: standard.status,
    version: standard.version,
    effectiveDate: standard.effectiveDate,
    published: standard.published,
    href: `${standardsContent.permalink}/${standard.slug}`,
  }));

  const validators = validatorsContent.validators.map((validator) => ({
    id: validator.id,
    title: validator.title,
    description: validator.description,
    standardRef: validator.standardRef,
    href: `${validatorsContent.permalink}/${validator.slug}`,
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
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
