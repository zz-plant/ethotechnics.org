import type { APIRoute } from "astro";

import { createAgentIndexResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () =>
  createAgentIndexResponse({
    basePath: "/api/v/2026.01",
  });
