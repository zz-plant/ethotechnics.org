import type { APIRoute } from "astro";

import { glossaryContent } from "../../content/glossary";
import { getGlossaryEntriesForApi, releaseInfo } from "../../utils/api";

export const GET: APIRoute = () => {
  const entries = getGlossaryEntriesForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: entries.length,
      permalink: glossaryContent.permalink,
      release: releaseInfo,
    },
    entries,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
