import type { APIRoute } from "astro";

import { libraryContent } from "../../content/library";
import { getAntiPatternsForApi, releaseInfo } from "../../utils/api";

export const GET: APIRoute = () => {
  const antiPatterns = getAntiPatternsForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: antiPatterns.length,
      permalink: libraryContent.permalink,
      release: releaseInfo,
    },
    antiPatterns,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
