import type { APIRoute } from "astro";

import { standardsContent } from "../../../../content/standards";
import { getEvidencePacksForApi, releaseInfo } from "../../../../utils/api";

export const GET: APIRoute = () => {
  const evidencePacks = getEvidencePacksForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: evidencePacks.length,
      permalink: standardsContent.permalink,
      release: releaseInfo,
    },
    evidencePacks,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
