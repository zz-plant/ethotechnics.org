import type { APIRoute } from "astro";

import { createEvidencePacksResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createEvidencePacksResponse();
