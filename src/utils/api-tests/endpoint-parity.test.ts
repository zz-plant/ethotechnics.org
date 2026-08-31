import { readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import { assertEndpointParity } from "../../pages/api/endpoint-parity";

const endpointFiles = (directory: string) =>
  readdirSync(directory)
    .filter((file) => file.endsWith(".json.ts") || file.endsWith(".jsonl.ts"))
    .map((file) => file.replace(/\.ts$/, ""));

describe("API endpoint parity", () => {
  test("shared config matches unversioned endpoint files", () => {
    const unversioned = endpointFiles(
      join(import.meta.dir, "..", "..", "pages", "api"),
    );

    expect(() =>
      assertEndpointParity({ unversioned }),
    ).not.toThrow();
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
