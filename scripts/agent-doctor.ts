#!/usr/bin/env bun
import { join } from "node:path";
import { existsSync } from "node:fs";
import { lstat } from "node:fs/promises";

async function check() {
  console.log("🛠️  Agent Doctor: Checking repository health for agents...\n");
  let errors = 0;

  // 1. Bun Check
  const bunVersion = process.versions.bun;
  if (bunVersion) {
    console.log(`✅ Bun version: ${bunVersion}`);
  } else {
    console.error("❌ Bun is not running this script!");
    errors++;
  }

  // 2. MCP Check
  const mcpPath = join(process.cwd(), "scripts", "mcp-server.ts");
  if (existsSync(mcpPath)) {
    console.log("✅ MCP server script found.");
    // Try to compile it without running
    try {
      const proc = Bun.spawn(["bun", "build", mcpPath, "--target=bun", "--minify-whitespace"], {
        stdout: "ignore",
        stderr: "pipe",
      });
      const stderr = await Bun.readableStreamToText(proc.stderr);
      await proc.exited;
      if (proc.exitCode === 0) {
        console.log("✅ MCP server compiles successfully.");
      } else {
        console.error("❌ MCP server has compilation errors:");
        console.error(stderr);
        errors++;
      }
    } catch (e) {
      console.error(`❌ Failed to run build check on MCP server: ${e}`);
      errors++;
    }
  } else {
    console.error("❌ MCP server script not found at scripts/mcp-server.ts");
    errors++;
  }

  // 3. AGENTS.md Hierarchy Check
  const coreAgents = join(process.cwd(), "AGENTS.md");
  if (existsSync(coreAgents)) {
    console.log("✅ Core AGENTS.md found.");
    const content = await Bun.file(coreAgents).text();
    const links = content.match(/docs\/agents\/[a-zA-Z0-9-]+\.md/g) || [];
    for (const link of links) {
      if (existsSync(join(process.cwd(), link))) {
        // console.log(`  ✅ Documentation link OK: ${link}`);
      } else {
        console.error(`❌ Broken link in AGENTS.md: ${link}`);
        errors++;
      }
    }
    if (links.length > 0) console.log(`✅ Verified ${links.length} documentation links in AGENTS.md.`);
  } else {
    console.error("❌ Core AGENTS.md missing.");
    errors++;
  }

  // 4. Workflow Check
  const workflowsDir = join(process.cwd(), ".agent", "workflows");
  if (existsSync(workflowsDir)) {
    const stats = await lstat(workflowsDir);
    if (stats.isDirectory()) {
      const workflows = (await Bun.file(join(workflowsDir, "qa.md")).exists()) ? 1 : 0;
      if (workflows > 0) {
        console.log("✅ Agent workflows found (qa.md exists).");
      } else {
        console.warn("⚠️  Optional: qa.md workflow missing from .agent/workflows/");
      }
    }
  } else {
    console.warn("⚠️  .agent/workflows/ directory missing.");
  }

  console.log(`\n🏁 Check complete. Total errors: ${errors}`);
  if (errors > 0) {
    process.exit(1);
  }
}

check().catch((err) => {
  console.error("Fatal error during agent-doctor check:", err);
  process.exit(1);
});
