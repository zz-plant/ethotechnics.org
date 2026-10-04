import { describe, expect, it } from "bun:test";
import { mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EXAMPLE_MANIFEST,
  EXAMPLE_STREAM,
} from "../../../src/features/record-conformance/example";
import { auditRecords } from "../../../src/features/record-conformance/conformance";
import {
  formatGithub,
  formatText,
  isEntryPoint,
  parseArgs,
  shouldFail,
} from "./cli";

describe("parseArgs", () => {
  it("requires exactly one records file", () => {
    expect(parseArgs([])).toEqual({
      error: "exactly one records file is required",
    });
    expect(parseArgs(["a.jsonl", "b.jsonl"])).toEqual({
      error: "exactly one records file is required",
    });
  });

  it("reads every option and defaults the rest", () => {
    expect(
      parseArgs([
        "records.jsonl",
        "--manifest",
        "m.json",
        "--declared-level",
        "2",
        "--as-of",
        "2026-09-17T00:00:00Z",
        "--format",
        "github",
        "--fail-on",
        "finding",
      ]),
    ).toEqual({
      records: "records.jsonl",
      manifest: "m.json",
      declaredLevel: 2,
      asOf: "2026-09-17T00:00:00Z",
      format: "github",
      failOn: "finding",
    });
    expect(parseArgs(["records.jsonl"])).toEqual({
      records: "records.jsonl",
      format: "text",
      failOn: "overclaim",
    });
  });

  it("rejects bad values", () => {
    expect(parseArgs(["r", "--declared-level", "9"])).toHaveProperty("error");
    expect(parseArgs(["r", "--format", "xml"])).toHaveProperty("error");
    expect(parseArgs(["r", "--fail-on", "sometimes"])).toHaveProperty("error");
    expect(parseArgs(["r", "--wat"])).toHaveProperty("error");
    expect(parseArgs(["r", "--manifest"])).toHaveProperty("error");
  });
});

describe("shouldFail", () => {
  it("fails an overclaim and a blocking finding, and passes an honest stream", async () => {
    const honest = await auditRecords(EXAMPLE_STREAM, {
      manifest: EXAMPLE_MANIFEST,
    });
    expect(honest.earnedLevel).toBe(3);
    expect(shouldFail(honest, "overclaim")).toBe(false);
    expect(shouldFail(honest, "blocking")).toBe(false);

    const overclaimed = await auditRecords(
      EXAMPLE_STREAM.replace(
        /"hash":"[0-9a-f]{64}"/,
        `"hash":"${"0".repeat(64)}"`,
      ),
      { declaredLevel: 3 },
    );
    expect(overclaimed.earnedLevel).toBe(0);
    expect(shouldFail(overclaimed, "overclaim")).toBe(true);
    expect(shouldFail(overclaimed, "blocking")).toBe(true);
    expect(shouldFail(overclaimed, "never")).toBe(false);
  });

  it("fails on a non-blocking finding only when asked to", async () => {
    // Any edit to the example stream breaks a hash, which is blocking, so the
    // non-blocking case is a report with one finding-severity entry.
    const honest = await auditRecords(EXAMPLE_STREAM, {
      manifest: EXAMPLE_MANIFEST,
    });
    const report = {
      ...honest,
      findings: [
        {
          id: "missing-hash" as const,
          severity: "finding" as const,
          title: "",
          detail: "",
          records: [],
        },
      ],
    };
    expect(shouldFail(report, "finding")).toBe(true);
    expect(shouldFail(report, "blocking")).toBe(false);
    expect(shouldFail(report, "overclaim")).toBe(false);
  });
});

describe("output formats", () => {
  it("prints the earned level and each finding", async () => {
    const report = await auditRecords(EXAMPLE_STREAM, {
      manifest: EXAMPLE_MANIFEST,
    });
    const text = formatText(report);
    expect(text).toContain("6 records parsed");
    expect(text).toContain("Earned: Level 3");
    expect(text).toContain("Declared: Level 2");
  });

  it("emits one GitHub annotation per finding, escaped", async () => {
    const report = await auditRecords(
      EXAMPLE_STREAM.replace(
        /"hash":"[0-9a-f]{64}"/,
        `"hash":"${"0".repeat(64)}"`,
      ),
      { declaredLevel: 3 },
    );
    const output = formatGithub(report, "records.jsonl");
    const annotations = output
      .split("\n")
      .filter((line) => line.startsWith("::"));
    expect(annotations.length).toBe(report.findings.length);
    expect(annotations[0]).toMatch(/^::error file=records\.jsonl,title=/);
    for (const line of annotations) expect(line).not.toMatch(/[^%]\n/);
  });
});

describe("entry point", () => {
  const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));

  it("does not run when a test imports it", () => {
    expect(
      isEntryPoint(process.argv[1], new URL("./cli.ts", import.meta.url).href),
    ).toBe(false);
  });

  // npx and an installed bin reach the CLI through a symlink. A run that does
  // nothing and exits 0 is a passing CI job that checked no records.
  it("runs when started through a bin symlink", () => {
    const dir = mkdtempSync(join(tmpdir(), "conformance-bin-"));
    const bin = join(dir, "ethotechnics-conformance");
    symlinkSync(cliPath, bin);
    expect(isEntryPoint(bin, new URL("./cli.ts", import.meta.url).href)).toBe(
      true,
    );

    const result = Bun.spawnSync(["bun", bin]);
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("exactly one records file");
  });
});
