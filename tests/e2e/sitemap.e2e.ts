import { execFileSync } from "node:child_process";

import { expect, test } from "@playwright/test";

/**
 * Runs the sitemap check against the served site.
 *
 * The check itself lives in scripts/check-sitemap.ts so it can be run by hand
 * against any base URL. This wires it into the suite that already has a server
 * running, because a sitemap that lists URLs the site does not serve is a
 * defect only a request can see: the builder's unit tests know what it emits,
 * not what answers.
 *
 * Spawned through node:child_process rather than Bun.spawnSync: Playwright
 * runs its tests under Node, where the Bun global does not exist.
 */

test("every URL in the section sitemaps answers 200", () => {
  const baseURL = test.info().project.use.baseURL ?? "http://127.0.0.1:4321";

  let output: string;
  try {
    output = execFileSync("bun", ["run", "scripts/check-sitemap.ts", baseURL], {
      encoding: "utf-8",
      stdio: "pipe",
    });
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    throw new Error(
      `Sitemap check failed:\n${failure.stdout ?? ""}${failure.stderr ?? ""}`,
    );
  }

  expect(output).toContain("Sitemap check passed");
});
