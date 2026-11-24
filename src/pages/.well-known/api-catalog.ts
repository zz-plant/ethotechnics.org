import type { APIRoute } from "astro";

import { applyApiCaching } from "../../utils/api/api-responses";
import { buildApiCatalog } from "../../utils/api/openapi";

/**
 * RFC 9727 API catalog: a linkset that names the read API under /api, its
 * OpenAPI description, and its reference page. Links are absolute on the
 * origin that served the request, so a preview deploy points at itself.
 */
export const GET: APIRoute = async (context) => {
  const { origin } = new URL(context.request.url);

  return applyApiCaching(
    context.request,
    new Response(JSON.stringify(buildApiCatalog(origin), null, 2), {
      headers: {
        "Content-Type":
          'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      },
    }),
  );
};

export const HEAD: APIRoute = async (context) => {
  const response = await GET(context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
};
