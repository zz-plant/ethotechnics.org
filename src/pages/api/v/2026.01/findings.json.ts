import type { APIRoute } from "astro";

import { findingsCatalog, releaseInfo } from "../../../../utils/api";

export const GET: APIRoute = () => {
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: findingsCatalog.length,
      release: releaseInfo,
    },
    findings: findingsCatalog,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
