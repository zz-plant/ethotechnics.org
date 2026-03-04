import { chmodSync, existsSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const hooksDir = join(repoRoot, ".githooks");
const preCommitPath = join(hooksDir, "pre-commit");

if (!existsSync(preCommitPath)) {
  console.error("❌ Missing .githooks/pre-commit hook script.");
  process.exit(1);
}

chmodSync(preCommitPath, 0o755);

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
  "✅ Git hooks installed. pre-commit now runs staged review guardrails.",
);
