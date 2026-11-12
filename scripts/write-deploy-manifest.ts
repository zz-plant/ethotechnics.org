/**
 * Writes dist/client/deploy-manifest.json, `{"commit": "<sha>"}`, so a check
 * outside the build can ask the live site which commit it is serving and
 * compare it with main. A merge whose deploy failed or never started otherwise
 * looks the same as one that shipped: the old pages keep returning 200.
 *
 * Workers Builds sets WORKERS_CI_COMMIT_SHA; a local build falls back to the
 * checkout's HEAD. The file is served as a static asset, like robots.txt.
 *
 * Run: bun run scripts/write-deploy-manifest.ts
 */

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const SHA = /^[0-9a-f]{40}$/i;

export function deployCommit(
  env: Record<string, string | undefined>,
  gitHead: () => string,
): string {
  const commit = (env.WORKERS_CI_COMMIT_SHA?.trim() || gitHead()).toLowerCase();
  if (!SHA.test(commit)) {
    throw new Error(`Not a full commit SHA: "${commit}"`);
  }
  return commit;
}

function gitHead(): string {
  const result = Bun.spawnSync(["git", "rev-parse", "HEAD"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    throw new Error(
      `git rev-parse HEAD failed: ${result.stderr.toString().trim()}`,
    );
  }
  return result.stdout.toString().trim();
}

if (import.meta.main) {
  const commit = deployCommit(process.env, gitHead);
  const target = join("dist", "client", "deploy-manifest.json");
  await writeFile(target, `${JSON.stringify({ commit })}\n`);
  process.stdout.write(`${target}: ${commit}\n`);
}
