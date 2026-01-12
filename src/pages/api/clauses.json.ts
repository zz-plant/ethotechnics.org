import type { APIRoute } from "astro";

import { standardsContent } from "../../content/standards";
import { getClausesForApi, releaseInfo } from "../../utils/api";

export const GET: APIRoute = () => {
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

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
