import { afterEach, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { patchCloudflareWorkerStreaming } from "./patch-cloudflare-worker-streaming";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function makeWorker(source: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "et3-worker-"));
  tempRoots.push(root);

  const workerPath = join(root, "dist/server/chunks/worker-entry_test.mjs");
  await mkdir(join(root, "dist/server/chunks"), { recursive: true });
  await Bun.write(workerPath, source);
  return root;
}

describe("patchCloudflareWorkerStreaming", () => {
  it("forces the generated Cloudflare worker to render buffered HTML", async () => {
    const root = await makeWorker(
      "const app = createApp();\nasync function handle() {}",
    );

    await patchCloudflareWorkerStreaming(root);

    const worker = await Bun.file(
      join(root, "dist/server/chunks/worker-entry_test.mjs"),
    ).text();
    expect(worker).toContain("const app = createApp({ streaming: false });");
  });

  it("is safe to run more than once", async () => {
    const root = await makeWorker(
      "const app = createApp({ streaming: false });\nasync function handle() {}",
    );

    await expect(patchCloudflareWorkerStreaming(root)).resolves.toContain(
      "worker-entry_test.mjs",
    );
  });
});
