/**
 * Builds the Pagefind index the header search dialog loads from
 * /pagefind/pagefind.js.
 *
 * Pagefind indexes HTML, and `astro build` writes none: every page on this site
 * is rendered by the Worker on request (docs/planning/prerender-finding-2026-09.md
 * says why they are not prerendered). So this script starts the built Worker
 * locally, requests every address in the sitemap, hands each response to
 * Pagefind, and writes the index into dist/client/pagefind, which deploys with
 * the other static assets.
 *
 * A plain request is enough. The Worker returns the whole page and Pagefind
 * does not run scripts, so no browser is involved.
 *
 * It exits non-zero when the Worker does not start, when a sitemap address does
 * not answer 200 with a page Pagefind can index, or when Pagefind reports an
 * error. A missing or partial index is otherwise silent: the dialog falls back
 * to a link to /search and no other check reports it.
 */

import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { createServer, type AddressInfo } from "node:net";
import { join } from "node:path";

import * as pagefind from "pagefind";

const ROOT = process.cwd();
const WRANGLER_CONFIG = join(ROOT, "dist", "server", "wrangler.json");
const OUTPUT_DIR = join(ROOT, "dist", "client", "pagefind");
const SITEMAP_INDEX = "/sitemap.xml";
const HOST = "127.0.0.1";

const CONCURRENCY = 8;
const SERVER_START_TIMEOUT_MS = 60_000;
const MAX_REPORTED = 25;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Asks the OS for an unused port. A fixed port can already belong to another
 * checkout's preview, and the crawl would index that site without complaint.
 */
const findFreePort = () =>
  new Promise<number>((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, HOST, () => {
      const { port } = probe.address() as AddressInfo;
      probe.close(() => resolve(port));
    });
  });

type LocalWorker = { baseUrl: string; output: () => string; stop: () => void };

const startWorker = async (): Promise<LocalWorker> => {
  const port = await findFreePort();
  const baseUrl = `http://${HOST}:${port}`;
  const chunks: string[] = [];

  // detached: wrangler starts workerd as a child, and stopping the whole
  // process group is the only way to take both down.
  const child: ChildProcess = spawn(
    "bunx",
    [
      "wrangler",
      "dev",
      "--local",
      "--ip",
      HOST,
      "--port",
      String(port),
      "--config",
      WRANGLER_CONFIG,
    ],
    { cwd: ROOT, detached: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  child.stdout?.on("data", (chunk: Buffer) => chunks.push(chunk.toString()));
  child.stderr?.on("data", (chunk: Buffer) => chunks.push(chunk.toString()));

  let exited = false;
  child.once("exit", () => {
    exited = true;
  });

  const stop = () => {
    if (exited || child.pid === undefined) return;
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      // The group is already gone.
    }
  };
  process.once("exit", stop);

  const output = () => chunks.join("");
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (exited) {
      throw new Error(`The Worker exited before it answered.\n${output()}`);
    }
    try {
      const response = await fetch(`${baseUrl}${SITEMAP_INDEX}`);
      if (response.ok) return { baseUrl, output, stop };
    } catch {
      // Not listening yet.
    }
    await sleep(250);
  }

  stop();
  throw new Error(
    `The Worker did not answer ${SITEMAP_INDEX} within ` +
      `${SERVER_START_TIMEOUT_MS / 1000}s.\n${output()}`,
  );
};

const readLocations = async (url: string): Promise<string[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} answered ${response.status}.`);
  }
  const xml = await response.text();
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
    match[1].trim(),
  );
};

/**
 * The sitemaps carry the production origin. Only the path is kept, so the
 * request goes to the local Worker and the index stores site-relative links.
 */
const readSitemapPaths = async (baseUrl: string): Promise<string[]> => {
  const sitemaps = await readLocations(`${baseUrl}${SITEMAP_INDEX}`);
  const paths = new Set<string>();

  for (const sitemap of sitemaps) {
    const pages = await readLocations(`${baseUrl}${new URL(sitemap).pathname}`);
    for (const page of pages) paths.add(new URL(page).pathname);
  }

  return Array.from(paths).sort();
};

const indexPages = async (
  baseUrl: string,
  paths: string[],
  index: pagefind.PagefindIndex,
): Promise<string[]> => {
  const failures: string[] = [];
  const queue = [...paths];

  const indexNext = async (): Promise<void> => {
    for (let path = queue.shift(); path; path = queue.shift()) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          redirect: "manual",
        });
        const html = await response.text();

        if (response.status !== 200) {
          failures.push(`${path}: answered ${response.status}.`);
        } else if (!html.includes("data-pagefind-body")) {
          // Once any page marks its body, Pagefind leaves out every page
          // that does not.
          failures.push(`${path}: no data-pagefind-body element.`);
        } else {
          const { errors } = await index.addHTMLFile({
            url: path,
            content: html,
          });
          for (const error of errors) failures.push(`${path}: ${error}`);
        }
      } catch (error) {
        failures.push(`${path}: ${String(error)}`);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, indexNext));
  return failures;
};

const main = async () => {
  const startedAt = performance.now();

  if (!existsSync(WRANGLER_CONFIG)) {
    throw new Error(
      "dist/server/wrangler.json is missing. Run `bun run build`, which " +
        "builds the Worker and then this index.",
    );
  }

  const worker = await startWorker();

  try {
    const paths = await readSitemapPaths(worker.baseUrl);
    if (paths.length === 0) {
      throw new Error("The sitemap lists no pages.");
    }

    const created = await pagefind.createIndex();
    if (!created.index) {
      throw new Error(`Pagefind did not start: ${created.errors.join("; ")}`);
    }

    const failures = await indexPages(worker.baseUrl, paths, created.index);
    if (failures.length > 0) {
      const shown = failures
        .slice(0, MAX_REPORTED)
        .map((line) => `  - ${line}`);
      if (failures.length > MAX_REPORTED) {
        shown.push(`  ... and ${failures.length - MAX_REPORTED} more.`);
      }
      throw new Error(
        `${failures.length} of ${paths.length} sitemap addresses could not ` +
          `be indexed:\n${shown.join("\n")}`,
      );
    }

    await rm(OUTPUT_DIR, { recursive: true, force: true });
    const written = await created.index.writeFiles({ outputPath: OUTPUT_DIR });
    if (written.errors.length > 0) {
      throw new Error(
        `Pagefind did not write the index: ${written.errors.join("; ")}`,
      );
    }

    const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
    console.log(
      `Search index built; ${paths.length} pages in ${seconds}s, written to dist/client/pagefind.`,
    );
  } finally {
    worker.stop();
    await pagefind.close();
  }
};

main().catch((error: unknown) => {
  console.error(
    `Search index build failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
