#!/usr/bin/env bun
import { join } from "node:path";
import { z } from "zod";
import { existsSync } from "node:fs";
import { lstat, readdir } from "node:fs/promises";

async function streamToText(
  stream: ReadableStream<Uint8Array> | null,
): Promise<string> {
  if (!stream) return "";
  return new Response(stream).text();
}

const ResearchWatchItem = z.object({
  name: z.string().min(1),
  file: z.string().min(1),
  maxAgeDays: z.number().int().positive(),
});

const ResearchWatchlist = z.array(ResearchWatchItem);

function parseLastUpdatedDate(fileContent: string): string | null {
  const match = fileContent.match(
    /const\s+lastUpdated\s*=\s*"(\d{4}-\d{2}-\d{2})"/,
  );
  return match?.[1] ?? null;
}

function ageInDays(isoDate: string): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const updatedAt = new Date(`${isoDate}T00:00:00Z`);
  const elapsed = now.getTime() - updatedAt.getTime();
  return Math.floor(elapsed / millisecondsPerDay);
}

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
      const proc = Bun.spawn(
        ["bun", "build", mcpPath, "--target=bun", "--minify-whitespace"],
        {
          stdout: "ignore",
          stderr: "pipe",
        },
      );
      const stderr = await streamToText(proc.stderr);
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
    if (links.length > 0) {
      console.log(
        `✅ Verified ${links.length} documentation links in AGENTS.md.`,
      );
    }
  } else {
    console.error("❌ Core AGENTS.md missing.");
    errors++;
  }

  // 4. Skill Check
  const skillsDir = join(process.cwd(), ".agent", "skills");
  if (existsSync(skillsDir)) {
    const stats = await lstat(skillsDir);
    if (stats.isDirectory()) {
      const entries = await readdir(skillsDir, { withFileTypes: true });
      const skillDirs = entries.filter((entry) => entry.isDirectory());
      let skillCount = 0;
      for (const entry of skillDirs) {
        const skillPath = join(skillsDir, entry.name, "SKILL.md");
        if (await Bun.file(skillPath).exists()) {
          skillCount += 1;
        }
      }
      if (skillCount > 0) {
        console.log(`✅ Agent skills found (${skillCount} SKILL.md files).`);
      } else {
        console.warn(
          "⚠️  Optional: SKILL.md files missing from .agent/skills/",
        );
      }
    }
  } else {
    console.warn("⚠️  .agent/skills/ directory missing.");
  }

  // 5. Standards research freshness check
  const researchWatchlistPath = join(
    process.cwd(),
    "scripts",
    "research-watchlist.json",
  );
  if (existsSync(researchWatchlistPath)) {
    try {
      const watchlistJson = await Bun.file(researchWatchlistPath).json();
      const watchlist = ResearchWatchlist.parse(watchlistJson);

      let staleCount = 0;
      for (const item of watchlist) {
        const targetPath = join(process.cwd(), item.file);
        if (!existsSync(targetPath)) {
          console.error(`❌ Research target missing: ${item.file}`);
          errors++;
          continue;
        }

        const content = await Bun.file(targetPath).text();
        const lastUpdated = parseLastUpdatedDate(content);
        if (!lastUpdated) {
          console.error(
            `❌ Missing const lastUpdated=\"YYYY-MM-DD\" in ${item.file}`,
          );
          errors++;
          continue;
        }

        const daysOld = ageInDays(lastUpdated);
        if (daysOld > item.maxAgeDays) {
          console.error(
            `❌ Stale research: ${item.name} is ${daysOld} days old (limit ${item.maxAgeDays}).`,
          );
          staleCount += 1;
          errors++;
          continue;
        }

        console.log(
          `✅ Research freshness OK: ${item.name} (updated ${lastUpdated}, ${daysOld} days old).`,
        );
      }

      if (watchlist.length > 0 && staleCount === 0) {
        console.log(
          `✅ Research watchlist checked (${watchlist.length} items).`,
        );
      }
    } catch (e) {
      console.error(`❌ Failed research watchlist check: ${e}`);
      errors++;
    }
  } else {
    console.warn(
      "⚠️  Optional: scripts/research-watchlist.json not found; skipping freshness checks.",
    );
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
