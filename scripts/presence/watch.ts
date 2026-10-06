/**
 * The weekly outside-uptake watch, run by .github/workflows/presence-watch.yml.
 * Notify only: it opens or updates one issue, "Presence watch: <ISO week>",
 * labeled presence-watch, and changes nothing else.
 *
 *   GITHUB_TOKEN=... bun run scripts/presence/watch.ts [--dry-run]
 *
 * --dry-run prints the issue body and writes nothing; without a token it
 * skips GitHub code search and reads the previous issue anonymously.
 * SEARCH_TOKEN, if set, is used for code search in place of GITHUB_TOKEN.
 *
 * The network calls are here and nowhere else; what they mean is decided in
 * src/utils/presence-watch.ts.
 */
import { standardClauses } from "../../src/content/standards";
import { isoDate } from "../../src/utils/objections";
import {
  CONSULTATION_TERMS,
  WATCH_LABEL,
  federalRegisterConsultationsUrl,
  federalRegisterMentionsUrl,
  githubMentionQuery,
  govUkConsultationsUrl,
  isoWeek,
  parseFederalRegisterConsultations,
  parseFederalRegisterMentions,
  parseGitHubCodeMentions,
  parseGovUkConsultations,
  planWatch,
  type Consultation,
  type Mention,
  type SourceId,
  type SourceResult,
} from "../../src/utils/presence-watch";
import {
  createGitHubClient,
  ensureLabels,
  repoFromEnv,
  repoPath,
  type RawIssue,
} from "./github";

const dryRun = process.argv.includes("--dry-run");
const repo = repoFromEnv();
const token = process.env.GITHUB_TOKEN;
if (!token && !dryRun) {
  console.error("GITHUB_TOKEN is not set.");
  process.exit(1);
}
const client = token ? createGitHubClient(token) : null;
const searchToken = process.env.SEARCH_TOKEN || token;
const searchClient = searchToken ? createGitHubClient(searchToken) : null;

const now = new Date();
const today = isoDate(now);
const week = isoWeek(now);

const getJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ethotechnics-presence-watch",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

/** Run one source; a failure becomes a note in the issue, not a failed run. */
const read = async <T>(
  source: SourceId,
  load: () => Promise<T[]>,
): Promise<SourceResult<T>> => {
  try {
    return { source, items: await load() };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`${source}: ${message}`);
    return { source, items: [], error: message.slice(0, 200) };
  }
};

const consultations: SourceResult<Consultation>[] = [
  await read("federal-register", async () =>
    parseFederalRegisterConsultations(
      await getJson(federalRegisterConsultationsUrl(today)),
    ),
  ),
  ...(await Promise.all(
    CONSULTATION_TERMS.map((term) =>
      read("gov-uk", async () =>
        parseGovUkConsultations(
          await getJson(govUkConsultationsUrl(term)),
          today,
        ),
      ),
    ),
  )),
];

const mentions: SourceResult<Mention>[] = [
  await read("github-code", async () => {
    if (!searchClient) throw new Error("no token for GitHub code search");
    const query = encodeURIComponent(githubMentionQuery(repo.owner));
    return parseGitHubCodeMentions(
      await searchClient.request("GET", `/search/code?q=${query}&per_page=100`),
      `${repo.owner}/${repo.repo}`,
    );
  }),
  await read("federal-register-mentions", async () =>
    parseFederalRegisterMentions(await getJson(federalRegisterMentionsUrl())),
  ),
];

const previousIssues = client
  ? await client.request<RawIssue[]>(
      "GET",
      repoPath(
        repo,
        `/issues?labels=${WATCH_LABEL}&state=all&sort=created&direction=desc&per_page=5`,
      ),
    )
  : ((await getJson(
      `https://api.github.com${repoPath(repo, `/issues?labels=${WATCH_LABEL}&state=all&sort=created&direction=desc&per_page=5`)}`,
    )) as RawIssue[]);
const previous = previousIssues.find((issue) => !issue.pull_request) ?? null;

const plan = planWatch({
  week,
  today,
  previous: previous ? { title: previous.title, body: previous.body } : null,
  consultations,
  mentions,
  clauses: Object.values(standardClauses).flat(),
  owner: repo.owner,
});

const listed = plan.consultations.length + plan.mentions.length;
console.log(
  `${plan.title}: ${plan.newCount} new, ${plan.consultations.length} consultations and ${plan.mentions.length} mentions listed.`,
);

if (dryRun || !client) {
  console.log(`\n${plan.body}`);
} else if (plan.sameWeek && previous) {
  if (previous.body !== plan.body) {
    await client.request(
      "PATCH",
      repoPath(repo, `/issues/${previous.number}`),
      {
        body: plan.body,
      },
    );
    console.log(`Updated #${previous.number}.`);
  } else {
    console.log(`#${previous.number} is up to date.`);
  }
} else if (listed > 0) {
  await ensureLabels(client, repo, [
    {
      name: WATCH_LABEL,
      color: "bfdadc",
      description: "Weekly list of open consultations and outside mentions",
    },
  ]);
  const created = await client.request<{ number: number }>(
    "POST",
    repoPath(repo, "/issues"),
    { title: plan.title, body: plan.body, labels: [WATCH_LABEL] },
  );
  console.log(`Opened #${created.number}.`);
} else {
  console.log("Nothing new this week; no issue opened.");
}
