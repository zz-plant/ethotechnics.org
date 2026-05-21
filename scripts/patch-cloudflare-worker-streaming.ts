import { Glob } from "bun";

const WORKER_GLOB = "dist/server/chunks/worker-entry_*.mjs";
const STREAMING_BOOTSTRAP = "const app = createApp();";
const BUFFERED_BOOTSTRAP = "const app = createApp({ streaming: false });";

export async function patchCloudflareWorkerStreaming(root = "."): Promise<string> {
  const glob = new Glob(WORKER_GLOB);
  const files = Array.from(glob.scanSync({ cwd: root, absolute: false }));

  if (files.length !== 1) {
    throw new Error(`Expected one generated Cloudflare worker entry matching ${WORKER_GLOB}, found ${files.length}.`);
  }

  const workerPath = `${root.replace(/\/$/, "")}/${files[0]}`;
  const worker = await Bun.file(workerPath).text();

  if (worker.includes(BUFFERED_BOOTSTRAP)) {
    return workerPath;
  }

  if (!worker.includes(STREAMING_BOOTSTRAP)) {
    throw new Error(`Could not find Cloudflare worker bootstrap in ${files[0]}.`);
  }

  await Bun.write(workerPath, worker.replace(STREAMING_BOOTSTRAP, BUFFERED_BOOTSTRAP));
  return workerPath;
}

if (import.meta.main) {
  const workerPath = await patchCloudflareWorkerStreaming();
  console.log(`Patched Cloudflare worker streaming mode: ${workerPath}`);
}
