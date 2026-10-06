/**
 * The objection bot, run by .github/workflows/objections.yml.
 *
 *   bun run scripts/presence/objections-bot.ts acknowledge <issue-number>
 *     Files a new objection under its standard's label and posts one comment
 *     with the date its answer is due.
 *
 *   bun run scripts/presence/objections-bot.ts sweep
 *     For each open, unanswered objection: due-soon from day 21, overdue
 *     after day 30, each with one comment.
 *
 * Needs GITHUB_TOKEN with issues: write. GITHUB_REPOSITORY defaults to
 * zz-plant/ethotechnics.org. The rules themselves are in
 * src/utils/objections.ts.
 */
import {
  OBJECTION_LABELS,
  acknowledgmentComment,
  objectionTarget,
  planSweep,
  standardLabel,
} from "../../src/utils/objections";
import {
  commentOnce,
  createGitHubClient,
  ensureLabels,
  listLabeledIssues,
  objectionLabelDefinitions,
  repoFromEnv,
  repoPath,
  toIssueSummary,
  tokenFromEnv,
  type RawIssue,
} from "./github";

const repo = repoFromEnv();
const client = createGitHubClient(tokenFromEnv());

const addLabels = (issueNumber: number, labels: string[]) =>
  labels.length === 0
    ? Promise.resolve()
    : client.request("POST", repoPath(repo, `/issues/${issueNumber}/labels`), {
        labels,
      });

const removeLabel = (issueNumber: number, label: string) =>
  client.request(
    "DELETE",
    repoPath(
      repo,
      `/issues/${issueNumber}/labels/${encodeURIComponent(label)}`,
    ),
  );

const acknowledge = async (issueNumber: number) => {
  const raw = await client.request<RawIssue>(
    "GET",
    repoPath(repo, `/issues/${issueNumber}`),
  );
  const issue = toIssueSummary(raw);
  if (!issue.labels.includes(OBJECTION_LABELS.objection)) {
    console.log(`#${issueNumber} has no objection label; nothing to do.`);
    return;
  }

  await ensureLabels(client, repo, objectionLabelDefinitions());

  const { standard } = objectionTarget(issue.title, issue.body);
  const known = new Set(objectionLabelDefinitions().map((label) => label.name));
  if (
    standard &&
    known.has(standardLabel(standard)) &&
    !issue.labels.includes(standardLabel(standard))
  ) {
    await addLabels(issueNumber, [standardLabel(standard)]);
  }

  const posted = await commentOnce(
    client,
    repo,
    issueNumber,
    acknowledgmentComment(issue),
  );
  console.log(
    posted
      ? `#${issueNumber}: acknowledged.`
      : `#${issueNumber}: already acknowledged.`,
  );
};

const sweep = async () => {
  await ensureLabels(client, repo, objectionLabelDefinitions());
  const now = new Date();
  const issues = await listLabeledIssues(
    client,
    repo,
    OBJECTION_LABELS.objection,
    "open",
  );

  for (const raw of issues) {
    const issue = toIssueSummary(raw);
    const plan = planSweep(issue, now);
    await addLabels(issue.number, plan.addLabels);
    for (const label of plan.removeLabels) {
      await removeLabel(issue.number, label);
    }
    const posted = plan.comment
      ? await commentOnce(client, repo, issue.number, plan.comment)
      : false;
    if (plan.addLabels.length || plan.removeLabels.length || posted) {
      console.log(
        `#${issue.number}: +[${plan.addLabels.join(", ")}] -[${plan.removeLabels.join(", ")}]${posted ? ", commented" : ""}`,
      );
    }
  }
  console.log(`Swept ${issues.length} open objections.`);
};

const [command, argument] = process.argv.slice(2);

if (command === "acknowledge") {
  const issueNumber = Number(argument);
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    console.error("Usage: objections-bot.ts acknowledge <issue-number>");
    process.exit(2);
  }
  await acknowledge(issueNumber);
} else if (command === "sweep") {
  await sweep();
} else {
  console.error("Usage: objections-bot.ts acknowledge <issue-number> | sweep");
  process.exit(2);
}
