import type { APIRoute } from "astro";

import { standardsContent } from "../../content/standards";
import { getStandardsForApi, releaseInfo } from "../../utils/api";

export const GET: APIRoute = () => {
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

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
