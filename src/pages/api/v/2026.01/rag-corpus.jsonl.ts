import type { APIRoute } from "astro";

import { getRagCorpusLines } from "../../../../utils/api";

export const GET: APIRoute = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const limitValue = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : undefined;
  const payload = getRagCorpusLines({ limit });

  return new Response(payload, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
    },
  });
};
