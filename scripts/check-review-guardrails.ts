import { execSync } from "node:child_process";

const STAGED_FLAG = "--staged";
const guardrails = [
  "scripts/check-external-links.ts",
  "scripts/check-heading-hierarchy.ts",
] as const;

function getStagedFiles(): string[] {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMR", {
    encoding: "utf8",
  });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => file.startsWith("src/") || file.startsWith("docs/"));
}

function runGuardrail(scriptPath: string, files: string[]): void {
  const args =
    files.length > 0
      ? ` ${files.map((file) => JSON.stringify(file)).join(" ")}`
      : "";
  execSync(`bun run ${scriptPath}${args}`, { stdio: "inherit" });
}

const useStaged = process.argv.includes(STAGED_FLAG);
const stagedFiles = useStaged ? getStagedFiles() : [];

if (useStaged && stagedFiles.length === 0) {
  console.log("No staged src/docs files detected; skipping review guardrails.");
  process.exit(0);
}

for (const guardrail of guardrails) {
  runGuardrail(guardrail, stagedFiles);
}

console.log(
  useStaged
    ? `Review guardrails passed for ${stagedFiles.length} staged files.`
    : "Review guardrails passed for full repository scan.",
);
