import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CLIENT_DIR = join(ROOT, "dist", "client");
const PAGEFIND_DIR = join(CLIENT_DIR, "pagefind");

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

  // Use CLI pagefind directly on static HTML — no browser crawl needed.
  console.log("  Running pagefind on static HTML...");
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(
      "bunx",
      ["pagefind", "--site", CLIENT_DIR, "--glob", "**/*.html"],
      {
        cwd: ROOT,
        stdio: "inherit",
      },
    );
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Pagefind exited with code ${code}`));
    });
    proc.on("error", reject);
  });
}

main().catch((err) => {
  console.error("Search index generation failed:", err);
  process.exit(1);
});
