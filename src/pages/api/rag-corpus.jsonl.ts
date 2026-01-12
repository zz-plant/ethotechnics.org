import type { APIRoute } from "astro";

import { getRagCorpusLines } from "../../utils/api";

export const GET: APIRoute = () => {
  const payload = getRagCorpusLines();

  return new Response(payload, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
    },
  });
};
