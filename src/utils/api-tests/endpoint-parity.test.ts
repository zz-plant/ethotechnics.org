import { readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import {
  endpointConfig,
  getEndpointsForVariant,
} from "../../pages/api/endpoint-config";
import { assertEndpointParity } from "../../pages/api/endpoint-parity";

const DELEGATION_ENDPOINTS = [
  "capabilities.json",
  "grants.json",
  "policies.json",
  "dependencies.json",
  "standing.json",
  "interventions.json",
  "substrate-profiles.json",
];

const endpointFiles = (directory: string) =>
  readdirSync(directory)
    .filter((file) => file.endsWith(".json.ts") || file.endsWith(".jsonl.ts"))
    .map((file) => file.replace(/\.ts$/, ""));

describe("API endpoint parity", () => {
  test("shared config matches unversioned endpoint files", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );

    expect(() => assertEndpointParity({ unversioned })).not.toThrow();
  });

  test("delegation state endpoints are registered and have route files", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );
    const configured = getEndpointsForVariant("unversioned");

    for (const endpoint of DELEGATION_ENDPOINTS) {
      expect(configured).toContain(endpoint);
      expect(unversioned).toContain(endpoint);
    }
  });

  test("every configured slug maps back to a unique endpoint id", () => {
    const slugs = Object.values(endpointConfig).map((config) => config.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("fails when an unversioned endpoint file is missing", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );

    const brokenUnversioned = unversioned.filter(
      (file) => file !== "research.json",
    );

    expect(() =>
      assertEndpointParity({ unversioned: brokenUnversioned }),
    ).toThrow(/Missing unversioned endpoints:\n- research\.json/);
  });
});
