import type { APIRoute } from "astro";

import { standardsContent } from "../../content/standards";

export const GET: APIRoute = async () => {
  const standards = standardsContent.standards.map((standard) => ({
    id: standard.id,
    title: standard.title,
    description: standard.description,
    status: standard.status,
    version: standard.version,
    effectiveDate: standard.effectiveDate,
    published: standard.published,
    href: `/standards/${standard.slug}`,
  }));

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: standards.length,
      permalink: standardsContent.permalink,
    },
    standards,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
