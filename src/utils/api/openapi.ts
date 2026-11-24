/**
 * The OpenAPI description of the read-only API that ethotechnics.org serves
 * under /api, built from the API_ENDPOINTS manifest so the two cannot drift.
 * It is not the control-plane OpenAPI under /standards, which describes
 * endpoints an adopting institution would run, none of them here.
 *
 * The api-catalog at /.well-known/api-catalog (RFC 9727) points to this
 * document as the API's service-desc.
 */

import { API_ENDPOINTS } from "./api-endpoints";
import { releaseInfo } from "./api";

export const OPENAPI_PATH = "/api/openapi.json";
export const API_DOC_PATH = "/api";
export const API_CATALOG_PATH = "/.well-known/api-catalog";

const operationId = (path: string) =>
  `get${path
    .replace(/\.jsonl?$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}`;

const limitParameter = {
  name: "limit",
  in: "query",
  required: false,
  description: "Return at most this many lines.",
  schema: { type: "integer", minimum: 1 },
};

export const buildReadApiOpenApi = () => ({
  openapi: "3.1.0",
  info: {
    title: "Ethotechnics read API",
    version: releaseInfo.id,
    description:
      "Read-only JSON endpoints for the standards, clauses, mechanisms, casebook, validators, glossary, and evals published on ethotechnics.org. No authentication. Every response carries an ETag.",
    license: {
      name: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  servers: [{ url: "https://ethotechnics.org/api" }],
  externalDocs: { url: `https://ethotechnics.org${API_DOC_PATH}` },
  paths: Object.fromEntries(
    API_ENDPOINTS.filter((endpoint) => endpoint.path !== "openapi.json").map(
      (endpoint) => {
        const isJsonl = endpoint.path.endsWith(".jsonl");
        return [
          `/${endpoint.path}`,
          {
            get: {
              operationId: operationId(endpoint.path),
              summary: endpoint.description,
              ...(isJsonl ? { parameters: [limitParameter] } : {}),
              responses: {
                "200": {
                  description: endpoint.description,
                  content: isJsonl
                    ? {
                        "application/x-ndjson": {
                          schema: { type: "string" },
                        },
                      }
                    : { "application/json": { schema: {} } },
                },
                "304": {
                  description: "The If-None-Match ETag still matches.",
                },
              },
            },
          },
        ];
      },
    ),
  ),
});

/** The RFC 9727 linkset that /.well-known/api-catalog serves. */
export const buildApiCatalog = (origin: string) => ({
  linkset: [
    {
      anchor: `${origin}/api`,
      "service-desc": [
        {
          href: `${origin}${OPENAPI_PATH}`,
          type: "application/vnd.oai.openapi+json;version=3.1",
        },
      ],
      "service-doc": [{ href: `${origin}${API_DOC_PATH}`, type: "text/html" }],
    },
  ],
});
