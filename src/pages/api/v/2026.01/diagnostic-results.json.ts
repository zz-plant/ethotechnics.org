import type { APIRoute } from "astro";

import { createDiagnosticResultsResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createDiagnosticResultsResponse();
