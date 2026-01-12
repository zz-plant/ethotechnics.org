import type { APIRoute } from "astro";

import { validatorsContent } from "../../../../content/validators";
import { getValidatorsForApi, releaseInfo } from "../../../../utils/api";

export const GET: APIRoute = () => {
  const validators = getValidatorsForApi();

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: validators.length,
      permalink: validatorsContent.permalink,
      release: releaseInfo,
    },
    validators,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
