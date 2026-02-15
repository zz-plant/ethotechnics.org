import type { APIRoute } from "astro";

import { createCrosswalksResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createCrosswalksResponse();
