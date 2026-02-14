import type { APIRoute } from "astro";

import { createMechanismsResponse } from "../../../../utils/api-responses";

export const GET: APIRoute = () => createMechanismsResponse();
