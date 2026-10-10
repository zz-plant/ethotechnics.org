import { describe, expect, test } from "bun:test";

import {
  createAgentIndexResponse,
  createCapabilitiesResponse,
  createDependenciesResponse,
  createGrantsResponse,
  createInterventionsResponse,
  createPoliciesResponse,
  createSiteIndexResponse,
  createStandingResponse,
  createSubstrateProfilesResponse,
  DELEGATION_ENDPOINT_PATHS,
} from "../api-responses";

const parse = async (response: Response) =>
  (await response.json()) as Record<string, any>;

describe("delegation state endpoints", () => {
  const cases: Array<[string, () => Response, string, string]> = [
    ["capabilities", createCapabilitiesResponse, "catalogs", "/standards/laws"],
    ["grants", createGrantsResponse, "grants", "/standards/laws"],
    ["policies", createPoliciesResponse, "policies", "/standards/laws"],
    [
      "dependencies",
      createDependenciesResponse,
      "dependencies",
      "/standards/laws",
    ],
    ["standing", createStandingResponse, "registers", "/standards/laws"],
    [
      "interventions",
      createInterventionsResponse,
      "interventions",
      "/standards/laws",
    ],
    [
      "substrate-profiles",
      createSubstrateProfilesResponse,
      "profiles",
      "/method",
    ],
  ];

  for (const [name, create, key, permalink] of cases) {
    test(`${name}.json wraps the example under "${key}"`, async () => {
      const response = create();
      expect(response.headers.get("Content-Type")).toBe(
        "application/json; charset=utf-8",
      );
      const payload = await parse(response);
      expect(payload.meta.permalink).toBe(permalink);
      expect(payload.meta.count).toBe(1);
      expect(Array.isArray(payload[key])).toBe(true);
      expect(payload[key]).toHaveLength(1);
    });
  }

  test("grants.json serves GRANT-2026-0142 in state allowed", async () => {
    const payload = await parse(createGrantsResponse());
    expect(payload.grants[0].grant_id).toBe("GRANT-2026-0142");
    expect(payload.grants[0].state).toBe("allowed");
  });

  test("standing.json attaches the challenge and reconsideration", async () => {
    const payload = await parse(createStandingResponse());
    const register = payload.registers[0];
    expect(register.challenges[0].register_ref).toBe(register.register_id);
    expect(register.reconsiderations[0].trigger.ref).toBe(
      register.challenges[0].challenge_id,
    );
  });

  test("site index lists the delegation endpoints and schemas", async () => {
    const payload = await parse(
      createSiteIndexResponse({
        basePath: "/api",
        includeReleaseEndpoints: true,
      }),
    );
    for (const endpoint of DELEGATION_ENDPOINT_PATHS) {
      expect(payload.endpoints).toContain(`/api/${endpoint}`);
    }
    expect(payload.schemas.authorityGrant).toBe(
      "/standards/authority-grant.schema.json",
    );
    expect(payload.schemas.agentSafetyObjectModel).toBe(
      "/standards/agent-safety-object-model.schema.json",
    );
  });

  test("agent index exposes the delegation endpoints", async () => {
    const payload = await parse(
      createAgentIndexResponse({
        basePath: "/api",
        includeReleaseEndpoints: true,
      }),
    );
    expect(payload.endpoints.grants).toBe("/api/grants.json");
    expect(payload.endpoints.substrateProfiles).toBe(
      "/api/substrate-profiles.json",
    );
    expect(payload.recommended.delegationState).toContain(
      "/api/dependencies.json",
    );
    expect(payload.docs.agentObjectModelSchema).toBe(
      "/standards/agent-safety-object-model.schema.json",
    );
  });
});
