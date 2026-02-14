import type { APIRoute } from "astro";

import { createReleasesResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createReleasesResponse();
