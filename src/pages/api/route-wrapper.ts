import type { APIRoute } from "astro";

import type { ApiVariant, EndpointId } from "./endpoint-config";
import { getEndpointRouteConfig } from "./endpoint-config";

export const createConfiguredApiRoute = (
  endpointId: EndpointId,
  variant: ApiVariant,
): APIRoute => {
  const config = getEndpointRouteConfig(endpointId, variant);
  return (context) => config.createResponse(context, config.options);
};
