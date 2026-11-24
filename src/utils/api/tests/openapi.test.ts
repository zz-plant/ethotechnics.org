import { describe, expect, test } from "bun:test";

import { API_ENDPOINTS } from "../api-endpoints";
import { buildApiCatalog, buildReadApiOpenApi } from "../openapi";
import { apiRoutes } from "../../../pages/api/manifest";
import { GET } from "../../../pages/.well-known/api-catalog";

describe("read API OpenAPI", () => {
  test("describes every served endpoint except itself", () => {
    const paths = Object.keys(buildReadApiOpenApi().paths);
    const expected = API_ENDPOINTS.map(
      (endpoint) => `/${endpoint.path}`,
    ).filter((path) => path !== "/openapi.json");

    expect(new Set(paths)).toEqual(new Set(expected));
  });

  test("every path has a route handler", () => {
    for (const path of Object.keys(buildReadApiOpenApi().paths)) {
      expect(apiRoutes[path.slice(1)]).toBeDefined();
    }
  });

  test("operation ids are unique", () => {
    const ids = Object.values(buildReadApiOpenApi().paths).map(
      (item) => item.get.operationId,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("api-catalog", () => {
  test("serves an RFC 9727 linkset", async () => {
    const request = new Request(
      "https://ethotechnics.org/.well-known/api-catalog",
    );
    const response = await GET({ request } as Parameters<typeof GET>[0]);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toStartWith(
      "application/linkset+json",
    );
    expect(body).toEqual(buildApiCatalog("https://ethotechnics.org"));
    expect(body.linkset[0].anchor).toBe("https://ethotechnics.org/api");
    expect(body.linkset[0]["service-desc"][0].href).toBe(
      "https://ethotechnics.org/api/openapi.json",
    );
    expect(body.linkset[0]["service-doc"][0].href).toBe(
      "https://ethotechnics.org/api",
    );
  });
});
