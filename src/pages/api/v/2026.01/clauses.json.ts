import type { APIRoute } from "astro";

import { createClausesResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createClausesResponse();
