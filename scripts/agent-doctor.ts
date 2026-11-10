#!/usr/bin/env bun
import { join } from "node:path";
import { z } from "zod";
import { existsSync } from "node:fs";

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

const PackageJson = z.object({
  engines: z.object({ bun: z.string().optional() }).optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
});

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Compares each direct dependency's installed version with the version
 * bun.lock resolves it to. A worktree or a branch switch can leave
 * node_modules behind the lockfile; every check then runs against the wrong
 * packages and fails for reasons unrelated to the change under test.
 */
async function findStaleDependencies(
  packageJson: z.infer<typeof PackageJson>,
): Promise<string[]> {
  const lockPath = join(process.cwd(), "bun.lock");
  if (!existsSync(lockPath)) return [];
  const lock = await Bun.file(lockPath).text();
  const names = Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  });

  const stale: string[] = [];
  for (const name of names) {
    const escaped = escapeRegExp(name);
    const locked = lock.match(
      new RegExp(`^\\s*"${escaped}": \\["${escaped}@([^"]+)"`, "m"),
    )?.[1];
    // Workspace and non-registry entries have no single version to compare.
    if (!locked || !/^\d/.test(locked)) continue;

    const installedPath = join(
      process.cwd(),
      "node_modules",
      name,
      "package.json",
    );
    if (!existsSync(installedPath)) {
      stale.push(`${name} is not installed`);
      continue;
    }
    const installed = z
      .object({ version: z.string() })
      .parse(await Bun.file(installedPath).json()).version;
    if (installed !== locked) {
      stale.push(`${name} is ${installed}, lockfile has ${locked}`);
    }
  }
  return stale;
}

async function check() {
  console.log("🛠️  Agent Doctor: Checking repository health for agents...\n");
  let errors = 0;

  // 1. Bun version against the pin in package.json
  const packageJson = PackageJson.parse(
    await Bun.file(join(process.cwd(), "package.json")).json(),
  );
  const bunVersion = process.versions.bun;
  const bunRange = packageJson.engines?.bun;
  if (!bunVersion) {
    console.error("❌ Bun is not running this script!");
    errors++;
  } else if (bunRange && !Bun.semver.satisfies(bunVersion, bunRange)) {
    console.error(
      `❌ Bun ${bunVersion} does not satisfy ${bunRange} (package.json engines). An older Bun fails \`bun install --frozen-lockfile\` and builds a different conformance bundle. With mise: \`mise install\`, or prefix commands with MISE_BUN_VERSION=<pinned version>.`,
    );
    errors++;
  } else {
    console.log(`✅ Bun version: ${bunVersion}`);
  }

  // 1b. Installed dependencies against bun.lock
  const stale = await findStaleDependencies(packageJson);
  if (stale.length > 0) {
    console.error(
      `❌ node_modules does not match bun.lock (${stale.slice(0, 5).join("; ")}${stale.length > 5 ? `; and ${stale.length - 5} more` : ""}). Run \`bun install --frozen-lockfile\` before trusting any other check: stale dependencies make conformance:action:check report a bundle that is "out of date" when it is not.`,
    );
    errors++;
  } else {
    console.log("✅ node_modules matches bun.lock.");
  }

  // 2. AGENTS.md Hierarchy Check
  const coreAgents = join(process.cwd(), "AGENTS.md");
  if (existsSync(coreAgents)) {
    console.log("✅ Core AGENTS.md found.");
    const content = await Bun.file(coreAgents).text();
    const links = content.match(/docs\/agents\/[a-zA-Z0-9-]+\.md/g) || [];
    for (const link of links) {
      if (!existsSync(join(process.cwd(), link))) {
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

  // 3. Standards research freshness check
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
            `❌ Missing const lastUpdated="YYYY-MM-DD" in ${item.file}`,
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
