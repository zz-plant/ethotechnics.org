import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PAGEFIND_DIR = join(ROOT, "dist", "client", "pagefind");

// Astro 6 + @astrojs/cloudflare v13 generates head-only HTML for
// prerendered SSR pages. Pagefind needs full body content to index.
// Build the search index from the deployed site instead via CI.
if (existsSync(PAGEFIND_DIR)) {
  console.log("  Using existing Pagefind index from dist/client/pagefind/");
  process.exit(0);
}

console.log("  No Pagefind index found. Generate post-deploy via CI.");
