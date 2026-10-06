/**
 * A thin GitHub REST client for the presence scripts: fetch, a token from the
 * environment, and Link-header pagination. No dependencies, so a workflow can
 * run these scripts without installing the site's packages.
 *
 * The token is sent only to the GitHub API and never printed.
 */
import {
  OBJECTION_LABELS,
  standardLabel,
  type IssueSummary,
} from "../../src/utils/objections";
import { standardClauses } from "../../src/content/standards";

export interface Repo {
  owner: string;
  repo: string;
}

export class GitHubError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const repoFromEnv = (): Repo => {
  const [owner, repo] = (
    process.env.GITHUB_REPOSITORY ?? "zz-plant/ethotechnics.org"
  ).split("/");
  if (!owner || !repo) throw new Error("GITHUB_REPOSITORY must be owner/repo");
  return { owner, repo };
};

export const tokenFromEnv = (): string => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set.");
  return token;
};

const nextLink = (header: string | null): string | null => {
  for (const part of (header ?? "").split(",")) {
    const match = /<([^>]+)>;\s*rel="next"/.exec(part);
    if (match) return match[1]!;
  }
  return null;
};

export const createGitHubClient = (token: string) => {
  const apiUrl = process.env.GITHUB_API_URL ?? "https://api.github.com";
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ethotechnics-presence",
  };

  const send = async (
    method: string,
    pathOrUrl: string,
    body?: unknown,
  ): Promise<Response> => {
    const url = pathOrUrl.startsWith("http") ? pathOrUrl : apiUrl + pathOrUrl;
    const response = await fetch(url, {
      method,
      headers:
        body === undefined
          ? headers
          : { ...headers, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new GitHubError(
        response.status,
        `${method} ${new URL(url).pathname} failed with ${response.status}: ${text.slice(0, 300)}`,
      );
    }
    return response;
  };

  return {
    async request<T>(method: string, path: string, body?: unknown): Promise<T> {
      const response = await send(method, path, body);
      return (response.status === 204 ? null : await response.json()) as T;
    },

    /** Every page of a list endpoint, following the Link header. */
    async paginate<T>(path: string): Promise<T[]> {
      const items: T[] = [];
      let next: string | null =
        path + (path.includes("?") ? "&" : "?") + "per_page=100";
      while (next) {
        const response = await send("GET", next);
        items.push(...((await response.json()) as T[]));
        next = nextLink(response.headers.get("link"));
      }
      return items;
    },
  };
};

export type GitHubClient = ReturnType<typeof createGitHubClient>;

export const repoPath = ({ owner, repo }: Repo, suffix: string): string =>
  `/repos/${owner}/${repo}${suffix}`;

type RawLabel = string | { name?: string };

export interface RawIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  closed_at: string | null;
  labels: RawLabel[];
  pull_request?: unknown;
}

export interface RawComment {
  id: number;
  body?: string | null;
}

export interface RawIssueEvent {
  event: string;
  created_at: string;
  label?: { name?: string };
}

export const labelNames = (labels: RawLabel[]): string[] =>
  labels
    .map((label) => (typeof label === "string" ? label : (label.name ?? "")))
    .filter(Boolean);

export const toIssueSummary = (raw: RawIssue): IssueSummary => ({
  number: raw.number,
  title: raw.title,
  body: raw.body,
  state: raw.state === "closed" ? "closed" : "open",
  labels: labelNames(raw.labels),
  createdAt: raw.created_at,
  closedAt: raw.closed_at,
});

/** Issues (not pull requests) carrying a label, oldest first. */
export const listLabeledIssues = async (
  client: GitHubClient,
  repo: Repo,
  label: string,
  state: "open" | "all",
): Promise<RawIssue[]> =>
  (
    await client.paginate<RawIssue>(
      repoPath(
        repo,
        `/issues?labels=${encodeURIComponent(label)}&state=${state}&sort=created&direction=asc`,
      ),
    )
  ).filter((issue) => !issue.pull_request);

export interface LabelDefinition {
  name: string;
  color: string;
  description: string;
}

/** Every label the objection workflow uses, with one per standard that has clauses. */
export const objectionLabelDefinitions = (): LabelDefinition[] => [
  {
    name: OBJECTION_LABELS.objection,
    color: "5319e7",
    description: "An objection to a clause of a standard",
  },
  {
    name: OBJECTION_LABELS.answered,
    color: "0e8a16",
    description: "The objection has a public answer",
  },
  {
    name: OBJECTION_LABELS.upheld,
    color: "1d76db",
    description:
      "Upheld: the clause is revised or a reason for keeping it is recorded",
  },
  {
    name: OBJECTION_LABELS.notUpheld,
    color: "c5def5",
    description: "Not upheld, with the reason given in the answer",
  },
  {
    name: OBJECTION_LABELS.dueSoon,
    color: "fbca04",
    description: "Open 21 days or more without an answer",
  },
  {
    name: OBJECTION_LABELS.overdue,
    color: "d93f0b",
    description: "Past its 30-day answer date without an answer",
  },
  ...Object.keys(standardClauses)
    .filter((id) => (standardClauses[id] ?? []).length > 0)
    .sort()
    .map((id) => ({
      name: standardLabel(id),
      color: "ededed",
      description: `Objections to ${id}`,
    })),
];

/** Create the labels that do not exist yet; leave existing ones as they are. */
export const ensureLabels = async (
  client: GitHubClient,
  repo: Repo,
  definitions: LabelDefinition[],
): Promise<string[]> => {
  const existing = new Set(
    (await client.paginate<{ name: string }>(repoPath(repo, "/labels"))).map(
      (label) => label.name.toLowerCase(),
    ),
  );
  const created: string[] = [];
  for (const definition of definitions) {
    if (existing.has(definition.name.toLowerCase())) continue;
    try {
      await client.request("POST", repoPath(repo, "/labels"), definition);
      created.push(definition.name);
    } catch (error) {
      // 422: created by a concurrent run since the list was read.
      if (!(error instanceof GitHubError && error.status === 422)) throw error;
    }
  }
  return created;
};

/** Post a comment unless one on the issue already carries its marker. */
export const commentOnce = async (
  client: GitHubClient,
  repo: Repo,
  issueNumber: number,
  comment: { marker: string; body: string },
): Promise<boolean> => {
  const comments = await client.paginate<RawComment>(
    repoPath(repo, `/issues/${issueNumber}/comments`),
  );
  if (comments.some((existing) => existing.body?.includes(comment.marker))) {
    return false;
  }
  await client.request(
    "POST",
    repoPath(repo, `/issues/${issueNumber}/comments`),
    { body: comment.body },
  );
  return true;
};
