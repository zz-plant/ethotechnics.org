import type { APIRoute } from "astro";

import { diagnosticResultsCatalog, releaseInfo } from "../../utils/api";

export const GET: APIRoute = () => {
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: diagnosticResultsCatalog.length,
      release: releaseInfo,
    },
    results: diagnosticResultsCatalog,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
