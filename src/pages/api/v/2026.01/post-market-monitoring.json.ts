import type { APIRoute } from "astro";

import { createPostMarketMonitoringResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createPostMarketMonitoringResponse();
