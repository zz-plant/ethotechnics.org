#!/usr/bin/env bun
/* eslint-disable no-console */
import { spawn } from "bun";

const commands = [
  { name: "Lint", cmd: ["bun", "run", "lint"] },
  { name: "Unit Tests", cmd: ["bun", "run", "test:unit:ci"] },
  { name: "Typecheck", cmd: ["bun", "run", "typecheck"] },
  { name: "Astro Check", cmd: ["bun", "run", "astro:check"] },
  { name: "Validate JSON", cmd: ["bun", "run", "validate:json"] },
  { name: "Validate Glossary", cmd: ["bun", "run", "validate:glossary"] },
];

console.log(`🚀 Starting ${commands.length} checks in parallel...\n`);

const results = await Promise.all(
  commands.map(async ({ name, cmd }) => {
    const start = Date.now();
    const proc = spawn(cmd, {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await Bun.readableStreamToText(proc.stdout);
    const stderr = await Bun.readableStreamToText(proc.stderr);
    await proc.exited;

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    const success = proc.exitCode === 0;

    const icon = success ? "✅" : "❌";
    console.log(`${icon} Finished ${name} (${duration}s)`);

    return { name, success, duration, stdout, stderr };
  }),
);

console.log("--------------------------------------------------");
let hasError = false;
for (const { name, success, duration, stdout, stderr } of results) {
  const icon = success ? "✅" : "❌";
  const status = success ? "PASS" : "FAIL";
  console.log(`${icon} ${name.padEnd(20)} ${status.padEnd(6)} (${duration}s)`);
  if (!success) {
    hasError = true;
    console.error(`\nError in ${name}:\n${stderr || stdout}`);
  }
}
console.log("--------------------------------------------------");

if (hasError) {
  console.error("\n❌ Some checks failed. Tighten your loop and try again!");
  process.exit(1);
} else {
  console.log("\n✨ All checks passed! Ready to ship.");
}
