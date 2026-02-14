import type { APIRoute } from "astro";

import { createGlossaryResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createGlossaryResponse();
