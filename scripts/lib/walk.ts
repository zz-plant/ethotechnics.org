/**
 * Shared directory walking for the check-* scripts.
 *
 * check-reachability inventories routes from src/pages, check-external-links
 * scans source files for link findings, and check-heading-hierarchy walks
 * rendered output. Same tree, same walk.
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Every file under a directory, in stable (path-sorted) order. When
 * `extensions` is given, only files ending in one of them are returned
 * (dot included, e.g. `.astro`).
 */
export async function walkFiles(
  dir: string,
  extensions?: readonly string[],
): Promise<string[]> {
  const files: string[] = [];

  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (
        !extensions ||
        extensions.some((extension) => entry.name.endsWith(extension))
      ) {
        files.push(full);
      }
    }
  }

  await walk(dir);
  return files.sort();
}
