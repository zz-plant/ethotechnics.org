import { chmodSync, existsSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const hooksDir = join(repoRoot, ".githooks");
const hooks = ["pre-commit", "commit-msg"] as const;

for (const hook of hooks) {
  const hookPath = join(hooksDir, hook);
  if (!existsSync(hookPath)) {
    console.error(`❌ Missing .githooks/${hook} hook script.`);
    process.exit(1);
  }
  chmodSync(hookPath, 0o755);
}

const processResult = Bun.spawnSync([
  "git",
  "config",
  "--local",
  "core.hooksPath",
  ".githooks",
]);

if (processResult.exitCode !== 0) {
  console.error("❌ Failed to configure Git hooks path.");
  console.error(new TextDecoder().decode(processResult.stderr));
  process.exit(processResult.exitCode ?? 1);
}

console.log(
  "✅ Git hooks installed. pre-commit runs staged review guardrails; commit-msg checks the subject line.",
);
