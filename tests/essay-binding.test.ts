import { describe, expect, it } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const script = resolve("scripts/check-essay-binding.ts");
describe("essay binding guardrail", () => {
  it("rejects metadata-only links and scopes checks to supplied essays", () => {
    const cwd = mkdtempSync(`${tmpdir()}/essay-binding-`);
    try {
      mkdirSync(`${cwd}/src/content/theory`, { recursive: true });
      const unbound = "src/content/theory/unbound.mdx";
      const bound = "src/content/theory/bound.mdx";
      writeFileSync(
        `${cwd}/${unbound}`,
        '---\nlawRefs: ["law-i"]\ndescription: "[law](/standards/laws)"\n---\nNo body link.',
      );
      writeFileSync(
        `${cwd}/${bound}`,
        '---\nlawRefs: ["law-i"]\n---\n[law](/standards/laws)',
      );
      const run = (...files: string[]) =>
        Bun.spawnSync([process.execPath, script, ...files], { cwd });
      expect(run(unbound).exitCode).toBe(1);
      expect(run(bound).exitCode).toBe(0);
      expect(run("src/pages/index.astro").exitCode).toBe(0);
      expect(run().exitCode).toBe(1);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
