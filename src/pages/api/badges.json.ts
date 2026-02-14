import type { APIRoute } from "astro";

import { createBadgesResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createBadgesResponse();
