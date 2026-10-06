/**
 * Prints Markdown release notes from the change feed (src/utils/changes-feed.ts),
 * for .github/workflows/release.yml.
 *
 *   bun run scripts/presence/release-notes.ts [--since YYYY-MM-DD]
 *
 * With --since, the notes list every change dated on or after that day
 * (the previous release's date). Without it, the 20 most recent changes.
 */
import { changeSources } from "../../src/content/changes";
import {
  collectChanges,
  renderReleaseNotes,
} from "../../src/utils/changes-feed";

const sinceIndex = process.argv.indexOf("--since");
const since = sinceIndex > -1 ? process.argv[sinceIndex + 1] : undefined;
if (since !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(since)) {
  console.error("--since takes a date: YYYY-MM-DD");
  process.exit(2);
}

process.stdout.write(
  renderReleaseNotes(
    collectChanges(changeSources),
    new URL("https://ethotechnics.org"),
    since,
  ),
);
