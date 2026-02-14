import type { APIRoute } from "astro";

import { createValidatorsResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createValidatorsResponse();
