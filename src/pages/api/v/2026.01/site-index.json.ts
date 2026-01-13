import type { APIRoute } from "astro";

import { createSiteIndexResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () =>
  createSiteIndexResponse({
    basePath: "/api/v/2026.01",
    includeSnapshots: true,
  });
