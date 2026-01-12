import type { APIRoute } from "astro";

import { libraryContent } from "../../content/library";
import { getMechanismsForApi, releaseInfo } from "../../utils/api";

export const GET: APIRoute = () => {
  const patterns = getMechanismsForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: patterns.length,
      permalink: libraryContent.permalink,
      release: releaseInfo,
    },
    patterns,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
