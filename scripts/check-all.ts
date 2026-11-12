/**
 * Runs every `bun run check` step concurrently.
 *
 * The steps are independent read-only checks (formatting, lint, typecheck,
 * astro:check, tests, content drift, validators, asset/icon/guardrail
 * checks). The old sequential chain paid the sum of every step's wall time;
 * this pays roughly the slowest one. CI runs the same command, so local and
 * CI parity holds.
 *
 * format:check was CI's alone until 2026-11-12. A change that passed this
 * script merged seven unformatted files, and main failed CI on every run
 * after it, including runs for pull requests that never touched them.
 *
 * A passing step prints one line. A failing step prints the tail of its
 * output, so a green run costs a reader a dozen lines and a red run shows only
 * what broke. Pass `--verbose` (`bun run check -- --verbose`) to see every
 * step's full output, or run the step on its own: `bun run <step>`.
 */

const STEPS = [
  "format:check",
  "assets:check",
  "icons:check",
  "agent:doctor",
  "content:check",
  "conformance:action:check",
  "lint",
  "typecheck",
  "astro:check",
  "check:review-guardrails",
  "validate:json",
  "validate:glossary",
  "test:unit",
] as const;

type StepResult = { name: string; exitCode: number };

export {};

const VERBOSE = process.argv.includes("--verbose");
const MAX_LINES = 150;
const MAX_LINE_LENGTH = 400;

const clip = (line: string) =>
  line.length > MAX_LINE_LENGTH
    ? `${line.slice(0, MAX_LINE_LENGTH)} … [${line.length - MAX_LINE_LENGTH} more characters]`
    : line;

const printOutput = (name: string, output: string) => {
  const lines = output.split("\n").filter((line) => line.trim());
  const shown = VERBOSE ? lines : lines.slice(-MAX_LINES);
  if (shown.length < lines.length) {
    console.log(
      `[${name}] … ${lines.length - shown.length} earlier lines hidden; run \`bun run ${name}\` for all of it`,
    );
  }
  for (const line of shown) {
    console.log(`[${name}] ${VERBOSE ? line : clip(line)}`);
  }
};

const runStep = async (name: string): Promise<StepResult> => {
  const start = performance.now();
  const proc = Bun.spawn({
    cmd: [process.execPath, "run", name],
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  const seconds = ((performance.now() - start) / 1000).toFixed(0);
  if (exitCode !== 0 || VERBOSE) printOutput(name, `${stdout}\n${stderr}`);
  console.log(`${exitCode === 0 ? "✅" : "❌"} ${name} (${seconds}s)`);
  return { name, exitCode };
};

const results = await Promise.all(STEPS.map(runStep));
const failures = results.filter((result) => result.exitCode !== 0);

if (failures.length > 0) {
  console.error(
    `\n${failures.length} of ${STEPS.length} checks failed: ${failures.map((failure) => failure.name).join(", ")}.`,
  );
  process.exit(1);
}
console.log(`\nAll ${STEPS.length} checks passed.`);
