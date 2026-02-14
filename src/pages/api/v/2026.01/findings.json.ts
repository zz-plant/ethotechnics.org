import type { APIRoute } from "astro";

import { createFindingsResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createFindingsResponse();
