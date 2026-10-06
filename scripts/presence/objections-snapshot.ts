/**
 * Writes src/content/generated/objections.json from every issue labeled
 * `objection`, for the record page and the clause register.
 *
 *   GITHUB_TOKEN=... bun run scripts/presence/objections-snapshot.ts \
 *     [--out <path>] [--previous <path>]
 *
 * The file is rewritten only when the record changed. A run that finds the
 * same objections in the same states as the previous file keeps that file
 * exactly, generation time included, so the weekly workflow opens no pull
 * request. The previous file is the output path unless --previous names
 * another, such as the copy on the bot's pull request branch. The rules are
 * in src/utils/objections.ts.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import {
  OBJECTION_LABELS,
  buildObjectionSnapshot,
  isAnswered,
  sameSnapshotData,
  type ObjectionSnapshot,
  type SnapshotIssue,
} from "../../src/utils/objections";
import {
  createGitHubClient,
  listLabeledIssues,
  repoFromEnv,
  repoPath,
  toIssueSummary,
  tokenFromEnv,
  type RawIssueEvent,
} from "./github";

const option = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index > -1 ? process.argv[index + 1] : undefined;
};
const outPath = option("--out") ?? "src/content/generated/objections.json";
const previousPath = option("--previous") ?? outPath;

const repo = repoFromEnv();
const client = createGitHubClient(tokenFromEnv());

const answerLabels = new Set<string>([
  OBJECTION_LABELS.answered,
  OBJECTION_LABELS.upheld,
  OBJECTION_LABELS.notUpheld,
]);

/** When an answer label was first put on the issue. */
const firstAnsweredAt = async (issueNumber: number): Promise<string | null> => {
  const events = await client.paginate<RawIssueEvent>(
    repoPath(repo, `/issues/${issueNumber}/events`),
  );
  const times = events
    .filter(
      (event) =>
        event.event === "labeled" && answerLabels.has(event.label?.name ?? ""),
    )
    .map((event) => event.created_at)
    .sort();
  return times[0] ?? null;
};

const rawIssues = await listLabeledIssues(
  client,
  repo,
  OBJECTION_LABELS.objection,
  "all",
);

const issues: SnapshotIssue[] = [];
for (const raw of rawIssues) {
  const summary = toIssueSummary(raw);
  issues.push({
    ...summary,
    url: raw.html_url,
    answeredAt: isAnswered(summary.labels)
      ? await firstAnsweredAt(raw.number)
      : null,
  });
}

const snapshot = buildObjectionSnapshot(issues, new Date());

const previousText = existsSync(previousPath)
  ? readFileSync(previousPath, "utf8")
  : null;
const previous = previousText
  ? (JSON.parse(previousText) as ObjectionSnapshot)
  : null;

if (previousText && previous && sameSnapshotData(previous, snapshot)) {
  if (previousPath !== outPath) writeFileSync(outPath, previousText);
  console.log(
    `${outPath}: unchanged since ${previous.generatedAt} (${snapshot.totals.received} objections).`,
  );
} else {
  writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `${outPath}: written (${snapshot.totals.received} objections, ${snapshot.totals.open} open, ${snapshot.totals.overdue} overdue).`,
  );
}
