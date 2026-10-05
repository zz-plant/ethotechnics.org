import type { APIRoute } from "astro";

import { applyApiCaching } from "../../utils/api-responses";
import { apiRoutes } from "./manifest";

/**
 * One server route serves every read-only API endpoint. The path captured
 * here (for example "glossary.json") is looked up in the handler table in
 * manifest.ts; the endpoint list and its descriptions live in
 * src/utils/api-endpoints.ts. Static routes under /api that need their own
 * logic (subscribe, readouts, evals/batch, og images) take precedence over
 * this catch-all.
 *
 * Unknown paths answer 404 as JSON: this surface is for tools, not browsers.
 */
export const GET: APIRoute = async (context) => {
  const path = context.params.endpoint ?? "";
  const handler = apiRoutes[path];

  if (!handler) {
    return new Response(
      JSON.stringify({ error: `No such endpoint: /api/${path}` }, null, 2),
      {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }

  return applyApiCaching(context.request, handler(context));
};
