import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { type Browser, chromium } from "@playwright/test";

const ROOT = process.cwd();
const CLIENT_DIR = join(ROOT, "dist", "client");
const PAGEFIND_OUTPUT = join(CLIENT_DIR, "pagefind");
const CRAWL_DIR = join(ROOT, ".pagefind-crawl");
const WRANGLER_CONFIG = join(ROOT, "dist", "server", "wrangler.json");
const BASE_URL = "http://127.0.0.1:8788";

const CONCURRENCY = 4;
const SERVER_START_TIMEOUT_MS = 60_000;
const PAGE_LOAD_TIMEOUT_MS = 15_000;

async function fileExists(p: string): Promise<boolean> {
  try {
    await Bun.file(p);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startServer(): Promise<{
  process: { kill: () => void };
  url: string;
}> {
  console.log("  Starting preview server...");

  const proc = Bun.spawn(
    [
      "bunx",
      "wrangler",
      "dev",
      "--local",
      "--ip",
      "0.0.0.0",
      "--port",
      "8788",
      "--config",
      WRANGLER_CONFIG,
    ],
    { cwd: ROOT, stdout: "pipe", stderr: "pipe" },
  );

  const decoder = new TextDecoder();
  const reader = proc.stdout.getReader();
  (async () => {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      process.stdout.write(decoder.decode(value));
    }
  })().catch(() => {});

  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  let lastError = "";

  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        console.log("  Server ready.");
        return {
          process: { kill: () => proc.kill() },
          url: BASE_URL,
        };
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = String(err);
    }
    await sleep(1000);
  }

  proc.kill();
  throw new Error(
    `Server failed to start within ${SERVER_START_TIMEOUT_MS}ms. Last error: ${lastError}`,
  );
}

async function fetchUrlsFromSitemap(baseUrl: string): Promise<string[]> {
  const sitemaps = ["core", "glossary", "standards", "taxonomy"];
  const urls = new Set<string>();

  for (const section of sitemaps) {
    const sitemapUrl = `${baseUrl}/sitemaps/${section}.xml`;
    try {
      const res = await fetch(sitemapUrl);
      if (!res.ok) {
        console.warn(
          `  Warning: ${sitemapUrl} returned ${res.status}, skipping.`,
        );
        continue;
      }
      const xml = await res.text();
      const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
      let match: RegExpExecArray | null;
      while ((match = locRegex.exec(xml)) !== null) {
        urls.add(new URL(match[1]).pathname);
      }
    } catch (err) {
      console.warn(`  Warning: failed to fetch ${sitemapUrl}: ${err}`);
    }
  }

  const filtered = Array.from(urls).filter(
    (url) => !/^\/glossary\/entries\/[^/]+\/[^/]+\/?$/.test(url),
  );

  console.log(
    `  Found ${urls.size} URLs across ${sitemaps.length} sitemaps.` +
      ` ${urls.size - filtered.length} glossary section sub-pages excluded from crawl.`,
  );
  return filtered.sort();
}

async function crawlPage(
  browser: Browser,
  baseUrl: string,
  path: string,
  outputDir: string,
): Promise<boolean> {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const url = `${baseUrl}${path}`;
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: PAGE_LOAD_TIMEOUT_MS,
    });

    await page.waitForSelector("main", { timeout: 5000 }).catch(() => {});

    const html = await page.content();
    const filePath =
      path === "/"
        ? "index.html"
        : `${path.replace(/^\/|\/$/g, "").replace(/\//g, "-")}.html`;

    await writeFile(join(outputDir, filePath), html, "utf-8");
    return true;
  } catch (err) {
    console.warn(`  Failed to crawl ${path}: ${err}`);
    return false;
  } finally {
    await context.close();
  }
}

async function crawlAll(
  browser: Browser,
  baseUrl: string,
  paths: string[],
  outputDir: string,
  concurrency: number,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  let completed = 0;

  const crawlBatch = async (batch: string[]) => {
    await Promise.all(
      batch.map((path) =>
        crawlPage(browser, baseUrl, path, outputDir).then((ok) => {
          completed++;
          ok ? success++ : failed++;
          if (completed % 50 === 0 || completed === paths.length) {
            console.log(`  Crawled ${completed}/${paths.length} pages...`);
          }
        }),
      ),
    );
  };

  for (let i = 0; i < paths.length; i += concurrency) {
    await crawlBatch(paths.slice(i, i + concurrency));
  }

  return { success, failed };
}

async function runPagefind(crawlDir: string, outputDir: string): Promise<void> {
  console.log("  Running Pagefind...");

  const proc = Bun.spawn(
    ["npx", "pagefind", "--site", crawlDir, "--output-path", outputDir],
    { cwd: ROOT, stdout: "pipe", stderr: "pipe" },
  );

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Pagefind exited with code ${exitCode}`);
  }

  const pagefindJs = join(outputDir, "pagefind.js");
  if (!(await fileExists(pagefindJs))) {
    throw new Error(`Pagefind output missing: ${pagefindJs}`);
  }

  console.log(`  Pagefind index written to ${outputDir}`);
}

async function main(): Promise<void> {
  console.log("🔍 Building Pagefind search index...\n");

  if (!(await fileExists(WRANGLER_CONFIG))) {
    console.log(
      "  dist/server/wrangler.json not found — run `bun run build` first.",
    );
    process.exit(0);
  }

  try {
    await import("@playwright/test");
  } catch {
    console.log(
      "  @playwright/test not available — install with `bun add -d @playwright/test`.",
    );
    process.exit(0);
  }

  await rm(CRAWL_DIR, { recursive: true, force: true });
  await mkdir(CRAWL_DIR, { recursive: true });

  const server = await startServer();

  try {
    console.log("  Discovering URLs from sitemaps...");
    const urls = await fetchUrlsFromSitemap(BASE_URL);

    if (urls.length === 0) {
      console.log("  No URLs found in sitemaps — skipping index generation.");
      return;
    }

    console.log(
      `  Crawling ${urls.length} pages (concurrency: ${CONCURRENCY})...`,
    );
    const browser = await chromium.launch({ headless: true });
    try {
      const { success, failed } = await crawlAll(
        browser,
        BASE_URL,
        urls,
        CRAWL_DIR,
        CONCURRENCY,
      );
      console.log(`  Crawl complete: ${success} succeeded, ${failed} failed.`);

      if (success === 0) {
        console.log(
          "  No pages crawled successfully — skipping index generation.",
        );
        return;
      }
    } finally {
      await browser.close();
    }

    await rm(PAGEFIND_OUTPUT, { recursive: true, force: true });
    await runPagefind(CRAWL_DIR, PAGEFIND_OUTPUT);

    console.log(`\n  ✅ Search index ready at ${PAGEFIND_OUTPUT}\n`);
  } finally {
    server.process.kill();
    await rm(CRAWL_DIR, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("Search index generation failed:", err);
  process.exit(1);
});
