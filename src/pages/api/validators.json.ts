import type { APIRoute } from "astro";

import { createValidatorsResponse } from "../../utils/api-responses";

export const prerender = true;

export const GET: APIRoute = () => createValidatorsResponse();
