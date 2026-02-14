import type { APIRoute } from "astro";

import { createAntiPatternsResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createAntiPatternsResponse();
