import type { APIRoute } from "astro";

import { createResearchResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createResearchResponse();
