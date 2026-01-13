import type { APIRoute } from "astro";

import { createStandardsResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createStandardsResponse();
