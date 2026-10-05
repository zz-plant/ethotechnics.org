import { describe, expect, test } from "bun:test";

import { API_ENDPOINTS } from "../api-endpoints";
import { apiRoutes } from "../../pages/api/manifest";

describe("API manifest", () => {
  test("every endpoint path is unique", () => {
    const paths = API_ENDPOINTS.map((endpoint) => endpoint.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  test("every manifest path has a route handler, and vice versa", () => {
    const manifestPaths = API_ENDPOINTS.map((endpoint) => endpoint.path);
    const routePaths = Object.keys(apiRoutes);

    expect(new Set(routePaths)).toEqual(new Set(manifestPaths));
  });
});
