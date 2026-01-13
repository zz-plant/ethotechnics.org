import type { APIRoute } from "astro";

import { createRagCorpusResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const limitValue = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : undefined;

  return createRagCorpusResponse(limit);
};
