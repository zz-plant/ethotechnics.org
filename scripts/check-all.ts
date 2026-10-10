/**
 * Runs every `bun run check` step concurrently.
 *
 * The steps are independent read-only checks (lint, typecheck, astro:check,
 * tests, content drift, validators, asset/icon/guardrail checks). The old
 * sequential chain paid the sum of every step's wall time; this pays roughly
 * the slowest one. CI runs the same command, so local and CI parity holds.
 *
 * Output is prefixed per step so concurrent output stays attributable, and a
 * summary at the end names every failing step before exiting non-zero.
 */

const STEPS = [
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

const streamWithPrefix = async (stream: ReadableStream<Uint8Array>, prefix: string) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) console.log(`${prefix} ${line}`);
    }
  }
  if (buffer.trim()) console.log(`${prefix} ${buffer}`);
};

const runStep = async (name: string): Promise<StepResult> => {
  const prefix = `[${name}]`;
  const start = performance.now();
  const proc = Bun.spawn({
    cmd: [process.execPath, "run", name],
    stdout: "pipe",
    stderr: "pipe",
  });

  await Promise.all([
    streamWithPrefix(proc.stdout, prefix),
    streamWithPrefix(proc.stderr, prefix),
  ]);
  const exitCode = await proc.exited;
  const seconds = ((performance.now() - start) / 1000).toFixed(0);
  console.log(`${prefix} ${exitCode === 0 ? "passed" : "FAILED"} in ${seconds}s`);
  return { name, exitCode };
};

const results = await Promise.all(STEPS.map(runStep));
const failures = results.filter((result) => result.exitCode !== 0);

console.log("");
for (const result of results.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(`${result.exitCode === 0 ? "✅" : "❌"} ${result.name}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${STEPS.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${STEPS.length} checks passed.`);
