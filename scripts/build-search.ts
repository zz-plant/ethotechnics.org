import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CLIENT_DIR = join(ROOT, "dist", "client");
const PAGEFIND_DIR = join(CLIENT_DIR, "pagefind");
const CRAWL_SCRIPT = join(ROOT, "scripts", "build-search-crawl.ts");

async function main() {
  console.log("🔍 Pagefind search index...");

  if (!existsSync(CLIENT_DIR)) {
    console.log("  dist/client/ not found — skipping.");
    process.exit(0);
  }

  if (existsSync(join(PAGEFIND_DIR, "pagefind.js"))) {
    console.log("  Using cached index from dist/client/pagefind/");
    process.exit(0);
  }

  if (!existsSync(CRAWL_SCRIPT)) {
    console.log("  Crawl script not found — run `bun run build:search:full` post-deploy.");
    process.exit(0);
  }

  console.log("  Running crawl-based index generation...");
  await new Promise<void>((resolve, reject) => {
    const proc = spawn("bun", ["run", CRAWL_SCRIPT], {
      cwd: ROOT,
      stdio: "inherit",
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Crawl script exited with code ${code}`));
    });
    proc.on("error", reject);
  });
}

main().catch((err) => {
  console.error("Search index generation failed:", err);
  process.exit(1);
});
