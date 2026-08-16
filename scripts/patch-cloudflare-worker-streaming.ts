import { Glob } from "bun";

const WORKER_GLOB = "dist/server/chunks/worker-entry_*.mjs";

export async function patchCloudflareWorkerStreaming(
  root = ".",
): Promise<string> {
  const cleanRoot = root.replace(/\/$/, "");
  const entryFile = `${cleanRoot}/dist/server/entry.mjs`;
  let targetPath: string;

  if (await Bun.file(entryFile).exists()) {
    targetPath = entryFile;
  } else {
    const glob = new Glob(WORKER_GLOB);
    const files = Array.from(glob.scanSync({ cwd: root, absolute: false }));
    if (files.length !== 1) {
      throw new Error(
        `Expected one generated Cloudflare worker entry matching ${WORKER_GLOB}, found ${files.length}.`,
      );
    }
    targetPath = `${cleanRoot}/${files[0]}`;
  }

  const worker = await Bun.file(targetPath).text();

  if (
    worker.includes("createApp({ streaming: false })") ||
    worker.includes("createApp$1({ streaming: false })")
  ) {
    return targetPath;
  }

  const patched = worker
    .replace(
      "const app = createApp();",
      "const app = createApp({ streaming: false });",
    )
    .replace(
      "var app = createApp();",
      "var app = createApp({ streaming: false });",
    );

  if (patched === worker) {
    throw new Error(
      `Could not find Cloudflare worker bootstrap in ${targetPath}.`,
    );
  }

  await Bun.write(targetPath, patched);
  return targetPath;
}

if (import.meta.main) {
  const workerPath = await patchCloudflareWorkerStreaming();
  console.warn(`Patched Cloudflare worker streaming mode: ${workerPath}`);
}
