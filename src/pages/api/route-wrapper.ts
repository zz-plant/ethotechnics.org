import type { APIRoute } from "astro";

import type { ApiVariant, EndpointId } from "./endpoint-config";
import { getEndpointRouteConfig } from "./endpoint-config";
import { applyApiCaching } from "../../utils/api-responses";

export const createConfiguredApiRoute = (
  endpointId: EndpointId,
  variant: ApiVariant = "unversioned",
): APIRoute => {
  const config = getEndpointRouteConfig(endpointId, variant);
  return async (context) => {
    const response = config.createResponse(context, config.options);
    return applyApiCaching(context.request, response);
  };
};
