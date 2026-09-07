import { execFileSync } from "node:child_process";

import { expect, test } from "@playwright/test";

/**
 * Runs the reachability check against the served site.
 *
 * The check itself lives in scripts/check-reachability.ts so it can be run by
 * hand against any base URL. This wires it into the suite that already has a
 * server running, because a page nobody can click to is a defect a reader
 * meets and no unit test can see.
 *
 * Spawned through node:child_process rather than Bun.spawnSync: Playwright
 * runs its tests under Node, where the Bun global does not exist.
 */

test("every linkable static route is reachable from the homepage", () => {
  const baseURL = test.info().project.use.baseURL ?? "http://127.0.0.1:4321";

  let output: string;
  try {
    output = execFileSync(
      "bun",
      ["run", "scripts/check-reachability.ts", baseURL],
      { encoding: "utf-8", stdio: "pipe" },
    );
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    throw new Error(
      `Reachability check failed:\n${failure.stdout ?? ""}${failure.stderr ?? ""}`,
    );
  }

  expect(output).toContain("Reachability check passed");
});
