import type { APIRoute } from "astro";

import { createChangelogResponse } from "../../utils/api-responses";

export const GET: APIRoute = () => createChangelogResponse();
