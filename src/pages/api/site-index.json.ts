import type { APIRoute } from "astro";

import { createSiteIndexResponse } from "../../utils/api-responses";

export const GET: APIRoute = () =>
  createSiteIndexResponse({
    basePath: "/api",
    includeReleaseEndpoints: true,
  });
