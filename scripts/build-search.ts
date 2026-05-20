import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CLIENT_DIR = join(ROOT, "dist", "client");
const PAGEFIND_DIR = join(CLIENT_DIR, "pagefind");

// Pagefind index generation from build output.
// Astro 6 with @astrojs/cloudflare v13 generates head-only prerendered HTML
// for SSR pages (no body content). Full indexing requires post-deploy crawling.
// If a cached index exists, use it. Otherwise, skip for CI to handle later.

async function findHtmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  function walk(d: string) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".html")) files.push(full);
    }
  }
  walk(dir);
  return files;
}

async function main() {
  console.log("🔍 Pagefind search index...");

  if (!existsSync(CLIENT_DIR)) {
    console.log("  dist/client/ not found — skipping.");
    process.exit(0);
  }

  if (existsSync(PAGEFIND_DIR)) {
    console.log("  Using cached index from dist/client/pagefind/");
    process.exit(0);
  }

  const htmlFiles = await findHtmlFiles(CLIENT_DIR);
  if (htmlFiles.length === 0) {
    console.log("  No prerendered pages found — skipping.");
    process.exit(0);
  }

  console.log(`  ${htmlFiles.length} prerendered pages found.`);
  console.log("  Run 'bun run build:search:full' post-deploy for complete index.");
  process.exit(0);
}

main().catch(() => process.exit(0));
