import { readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import { assertEndpointParity } from "../../pages/api/endpoint-parity";

const endpointFiles = (directory: string) =>
  readdirSync(directory)
    .filter((file) => file.endsWith(".json.ts") || file.endsWith(".jsonl.ts"))
    .map((file) => file.replace(/\.ts$/, ""));

describe("API endpoint parity", () => {
  test("shared config matches unversioned and versioned endpoint files", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );
    const versioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api", "v", "2026.01"),
    );

    expect(() =>
      assertEndpointParity({ unversioned, versioned }),
    ).not.toThrow();
  });

  test("fails when a versioned endpoint file is missing", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );
    const versioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api", "v", "2026.01"),
    );

    const brokenVersioned = versioned.filter(
      (file) => file !== "findings.json",
    );

    expect(() =>
      assertEndpointParity({ unversioned, versioned: brokenVersioned }),
    ).toThrow(/Missing versioned endpoints:\n- findings\.json/);
  });

  test("fails when an unversioned endpoint file is missing", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );
    const versioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api", "v", "2026.01"),
    );

    const brokenUnversioned = unversioned.filter(
      (file) => file !== "research.json",
    );

    expect(() =>
      assertEndpointParity({ unversioned: brokenUnversioned, versioned }),
    ).toThrow(/Missing unversioned endpoints:\n- research\.json/);
  });
});
