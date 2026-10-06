/**
 * The outside-uptake watch: open consultations the standards could answer,
 * and places outside this repository that cite the site. It notifies only.
 * scripts/presence/watch.ts fetches; this module builds the queries, reads
 * the responses, decides what is new, and writes the weekly issue.
 *
 * What counts as new: each issue body carries a hidden state block listing,
 * per source, a short hash of every item that source returned on the last
 * run. An item is new when its hash is not there. A source that fails keeps
 * its earlier hashes, so an outage does not make every item new again.
 */
import type { StandardClause } from "../content/standards";
import { clauseLabel, matchClauses } from "./clause-match";

export const WATCH_LABEL = "presence-watch";
export const CONSULTATION_TERMS = [
  "artificial intelligence",
  "automated decision",
] as const;
export const MENTION_TERM = "ethotechnics.org";
const TOPIC_PATTERN = /artificial intelligence|automated decision|algorithm/i;
const MAX_LISTED = 60;

export type SourceId =
  "federal-register" | "gov-uk" | "github-code" | "federal-register-mentions";

export const SOURCE_NAMES: Record<SourceId, string> = {
  "federal-register": "Federal Register",
  "gov-uk": "GOV.UK",
  "github-code": "GitHub code search",
  "federal-register-mentions": "Federal Register full text",
};

export interface Consultation {
  source: "federal-register" | "gov-uk";
  key: string;
  title: string;
  kind: string;
  agency: string;
  /** YYYY-MM-DD. */
  closesOn: string;
  url: string;
  summary: string;
  /** A search term is in the title or summary, not only in the full text. */
  namesTopic: boolean;
}

export interface Mention {
  source: "github-code" | "federal-register-mentions";
  key: string;
  title: string;
  url: string;
}

export interface SourceResult<T> {
  source: SourceId;
  items: T[];
  /** Set when the source could not be read this run. */
  error?: string;
}

// --- Queries -------------------------------------------------------------

const FEDERAL_REGISTER_API =
  "https://www.federalregister.gov/api/v1/documents.json";

/** Proposed rules and notices whose comment period is still open on `today`. */
export const federalRegisterConsultationsUrl = (today: string): string => {
  const params = new URLSearchParams();
  params.set(
    "conditions[term]",
    CONSULTATION_TERMS.map((term) => `"${term}"`).join(" | "),
  );
  params.append("conditions[type][]", "PRORULE");
  params.append("conditions[type][]", "NOTICE");
  params.set("conditions[comment_date][gte]", today);
  params.set("order", "newest");
  params.set("per_page", "100");
  for (const field of [
    "abstract",
    "agency_names",
    "comments_close_on",
    "document_number",
    "html_url",
    "title",
    "type",
  ]) {
    params.append("fields[]", field);
  }
  return `${FEDERAL_REGISTER_API}?${params.toString()}`;
};

/** Every Federal Register document whose full text names the site. */
export const federalRegisterMentionsUrl = (): string => {
  const params = new URLSearchParams();
  params.set("conditions[term]", "ethotechnics");
  params.set("order", "newest");
  params.set("per_page", "100");
  for (const field of ["document_number", "html_url", "title"]) {
    params.append("fields[]", field);
  }
  return `${FEDERAL_REGISTER_API}?${params.toString()}`;
};

/** GOV.UK consultations still open, matching one search term. */
export const govUkConsultationsUrl = (term: string): string => {
  const params = new URLSearchParams();
  params.set("filter_content_store_document_type", "open_consultation");
  params.set("q", term);
  params.set("count", "100");
  for (const field of [
    "description",
    "end_date",
    "link",
    "organisations",
    "title",
  ]) {
    params.append("fields[]", field);
  }
  return `https://www.gov.uk/api/search.json?${params.toString()}`;
};

/** GitHub code search for the site's domain, outside the owner's account. */
export const githubMentionQuery = (owner: string): string =>
  `"${MENTION_TERM}" NOT user:${owner}`;

// --- Responses -----------------------------------------------------------

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];
const asString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export const parseFederalRegisterConsultations = (
  json: unknown,
): Consultation[] =>
  asArray(asRecord(json).results)
    .map(asRecord)
    .filter((row) => asString(row.document_number) && asString(row.html_url))
    .map((row) => {
      const title = asString(row.title);
      const summary = asString(row.abstract);
      return {
        source: "federal-register",
        key: `fr:${asString(row.document_number)}`,
        title,
        kind: asString(row.type) || "Document",
        agency: asArray(row.agency_names)
          .map(asString)
          .filter(Boolean)
          .join("; "),
        closesOn: asString(row.comments_close_on).slice(0, 10),
        url: asString(row.html_url),
        summary,
        namesTopic: TOPIC_PATTERN.test(`${title} ${summary}`),
      };
    });

export const parseGovUkConsultations = (
  json: unknown,
  today: string,
): Consultation[] =>
  asArray(asRecord(json).results)
    .map(asRecord)
    .filter((row) => asString(row.link).startsWith("/"))
    .map((row): Consultation => {
      const title = asString(row.title);
      const summary = asString(row.description);
      return {
        source: "gov-uk",
        key: `uk:${asString(row.link)}`,
        title,
        kind: "Consultation",
        agency: asArray(row.organisations)
          .map((organisation) => asString(asRecord(organisation).title))
          .filter(Boolean)
          .join("; "),
        closesOn: asString(row.end_date).slice(0, 10),
        url: `https://www.gov.uk${asString(row.link)}`,
        summary,
        namesTopic: TOPIC_PATTERN.test(`${title} ${summary}`),
      };
    })
    .filter((row) => !row.closesOn || row.closesOn >= today);

export const parseGitHubCodeMentions = (
  json: unknown,
  ownRepository: string,
): Mention[] =>
  asArray(asRecord(json).items)
    .map(asRecord)
    .filter((item) => {
      const repository = asRecord(item.repository);
      const fullName = asString(repository.full_name);
      return (
        fullName &&
        asString(item.html_url) &&
        fullName.toLowerCase() !== ownRepository.toLowerCase() &&
        // A fork is a copy of someone's repository, not a use of the site.
        repository.fork !== true
      );
    })
    .map((item) => {
      const fullName = asString(asRecord(item.repository).full_name);
      const path = asString(item.path);
      return {
        source: "github-code",
        key: `gh:${fullName}/${path}`,
        title: `${fullName}: ${path}`,
        url: asString(item.html_url),
      };
    });

export const parseFederalRegisterMentions = (json: unknown): Mention[] =>
  asArray(asRecord(json).results)
    .map(asRecord)
    .filter((row) => asString(row.document_number) && asString(row.html_url))
    .map((row) => ({
      source: "federal-register-mentions",
      key: `frm:${asString(row.document_number)}`,
      title: asString(row.title),
      url: asString(row.html_url),
    }));

/** One list per key, soonest closing first. */
export const mergeConsultations = (lists: Consultation[][]): Consultation[] => {
  const byKey = new Map<string, Consultation>();
  for (const item of lists.flat()) {
    const known = byKey.get(item.key);
    byKey.set(
      item.key,
      known
        ? { ...known, namesTopic: known.namesTopic || item.namesTopic }
        : item,
    );
  }
  return [...byKey.values()].sort(
    (a, b) =>
      (a.closesOn || "9999").localeCompare(b.closesOn || "9999") ||
      a.title.localeCompare(b.title) ||
      a.key.localeCompare(b.key),
  );
};

// --- State ---------------------------------------------------------------

/** ISO 8601 week, "2026-W41": the run window one issue covers. */
export const isoWeek = (date: Date): string => {
  const day = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const weekday = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(day.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((day.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

export const watchIssueTitle = (week: string): string =>
  `Presence watch: ${week}`;

/** FNV-1a, base 36: a short stable fingerprint of an item's key. */
export const shortHash = (value: string): string => {
  let hash = 0x811c9dc5;
  for (const character of value) {
    hash ^= character.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
};

export interface WatchState {
  week: string;
  /** Per source, the hashes of every item it returned on the last run. */
  seen: Partial<Record<SourceId, string[]>>;
  /** Hashes of the items this week's issue lists. */
  reported: string[];
}

const STATE_PATTERN = /<!-- presence-watch-state (\{.*?\}) -->/s;

export const readWatchState = (
  body: string | null | undefined,
): WatchState | null => {
  const match = STATE_PATTERN.exec(body ?? "");
  if (!match) return null;
  try {
    const parsed = asRecord(JSON.parse(match[1]));
    const seen = asRecord(parsed.seen);
    return {
      week: asString(parsed.week),
      seen: Object.fromEntries(
        Object.entries(seen).map(([source, hashes]) => [
          source,
          asArray(hashes).map(asString).filter(Boolean),
        ]),
      ),
      reported: asArray(parsed.reported).map(asString).filter(Boolean),
    };
  } catch {
    return null;
  }
};

export const writeWatchState = (state: WatchState): string =>
  `<!-- presence-watch-state ${JSON.stringify(state)} -->`;

// --- The weekly issue ----------------------------------------------------

export interface WatchInput {
  week: string;
  today: string;
  /** The most recent presence-watch issue, if any. */
  previous: { title: string; body: string | null } | null;
  consultations: SourceResult<Consultation>[];
  mentions: SourceResult<Mention>[];
  clauses: StandardClause[];
  /** The GitHub account whose repositories are not outside mentions. */
  owner: string;
}

export interface ListedConsultation extends Consultation {
  clauses: string[];
}

export interface WatchPlan {
  title: string;
  body: string;
  state: WatchState;
  /** The latest issue is this week's; update it instead of opening one. */
  sameWeek: boolean;
  consultations: ListedConsultation[];
  mentions: Mention[];
  newCount: number;
}

const unique = (values: string[]): string[] => [...new Set(values)].sort();

export const planWatch = (input: WatchInput): WatchPlan => {
  const title = watchIssueTitle(input.week);
  const previousState = readWatchState(input.previous?.body);
  const sameWeek =
    input.previous?.title === title && previousState?.week === input.week;
  const previouslySeen = (source: SourceId) =>
    new Set(previousState?.seen[source] ?? []);
  const reportedBefore = new Set(sameWeek ? previousState.reported : []);

  const seen: WatchState["seen"] = {};
  const newHashes: string[] = [];
  const pick = <T extends { key: string }>(results: SourceResult<T>[]): T[] => {
    const listed: T[] = [];
    for (const result of results) {
      const before = previouslySeen(result.source);
      const hashes = result.items.map((item) => shortHash(item.key));
      seen[result.source] = unique([
        ...(seen[result.source] ?? []),
        ...(result.error ? [...before] : hashes),
      ]);
      result.items.forEach((item, index) => {
        const hash = hashes[index];
        const isNew = !before.has(hash);
        if (isNew) newHashes.push(hash);
        if (isNew || reportedBefore.has(hash)) listed.push(item);
      });
    }
    return listed;
  };

  const consultations = mergeConsultations([pick(input.consultations)])
    .sort((a, b) => Number(b.namesTopic) - Number(a.namesTopic))
    .map((item) => ({
      ...item,
      clauses: matchClauses(`${item.title} ${item.summary}`, input.clauses).map(
        (match) => clauseLabel(match.clause),
      ),
    }));
  const mentionsByKey = new Map(
    pick(input.mentions).map((item) => [item.key, item]),
  );
  const mentions = [...mentionsByKey.values()].sort((a, b) =>
    a.key.localeCompare(b.key),
  );

  const state: WatchState = {
    week: input.week,
    seen,
    reported: unique([...reportedBefore, ...newHashes]),
  };
  const failures = [...input.consultations, ...input.mentions].filter(
    (result) => result.error,
  );

  return {
    title,
    body: renderWatchBody({
      state,
      today: input.today,
      owner: input.owner,
      consultations,
      mentions,
      failures,
    }),
    state,
    sameWeek,
    consultations,
    mentions,
    newCount: new Set(newHashes).size,
  };
};

const capped = <T>(items: T[]): { shown: T[]; more: number } => ({
  shown: items.slice(0, MAX_LISTED),
  more: Math.max(0, items.length - MAX_LISTED),
});

const renderConsultation = (item: ListedConsultation): string =>
  [
    `- **[${item.title.replace(/[[\]]/g, "")}](${item.url})**`,
    `  ${[item.agency, item.kind, item.closesOn ? `comments close ${item.closesOn}` : "", SOURCE_NAMES[item.source]].filter(Boolean).join(" · ")}`,
    `  Clauses (keyword-matched): ${item.clauses.length > 0 ? item.clauses.join(", ") : "none"}`,
  ].join("\n");

export const renderWatchBody = ({
  state,
  today,
  owner,
  consultations,
  mentions,
  failures,
}: {
  state: WatchState;
  today: string;
  owner: string;
  consultations: ListedConsultation[];
  mentions: Mention[];
  failures: SourceResult<unknown>[];
}): string => {
  const named = capped(consultations.filter((item) => item.namesTopic));
  const fullText = capped(consultations.filter((item) => !item.namesTopic));
  const listedMentions = capped(mentions);
  const list = (group: { shown: ListedConsultation[]; more: number }) => [
    ...group.shown.map(renderConsultation),
    ...(group.more > 0 ? ["", `And ${group.more} more.`] : []),
  ];

  return [
    writeWatchState(state),
    `Updated ${today} by the presence-watch workflow. This issue lists only what no earlier run reported. It changes nothing on the site.`,
    "",
    `## Open consultations (${consultations.length})`,
    "",
    `Sources: US Federal Register proposed rules and notices with an open comment period, and GOV.UK open consultations, whose text matches ${CONSULTATION_TERMS.map((term) => `"${term}"`).join(" or ")}. Both search full text, so some results are not about automated decisions.`,
    "",
    "Clauses are keyword-matched against the clause register. They are a place to start reading, not a finding; check each against the standard's text. To draft a response: `bun run presence:brief -- <keywords>`.",
    "",
    ...(consultations.length === 0
      ? ["Nothing new.", ""]
      : [
          `### The topic is in the title or summary (${named.shown.length + named.more})`,
          "",
          ...(named.shown.length === 0 ? ["None."] : list(named)),
          "",
          ...(fullText.shown.length === 0
            ? []
            : [
                "<details>",
                `<summary>The topic is only in the full text (${fullText.shown.length + fullText.more}). Most of these are about something else.</summary>`,
                "",
                ...list(fullText),
                "",
                "</details>",
                "",
              ]),
        ]),
    `## Outside mentions to verify (${mentions.length})`,
    "",
    `Sources: GitHub code search for "${MENTION_TERM}" outside the ${owner} account, and Federal Register full text for "ethotechnics". Each needs a person to confirm it is a real use.`,
    "",
    ...(mentions.length === 0
      ? ["Nothing new."]
      : [
          ...listedMentions.shown.map(
            (item) =>
              `- [${item.title.replace(/[[\]]/g, "")}](${item.url}) · ${SOURCE_NAMES[item.source]}`,
          ),
          ...(listedMentions.more > 0
            ? ["", `And ${listedMentions.more} more.`]
            : []),
        ]),
    ...(failures.length === 0
      ? []
      : [
          "",
          "## Sources that failed this run",
          "",
          ...failures.map(
            (result) =>
              `- ${SOURCE_NAMES[result.source]}: ${result.error}. What it returned last time still counts as seen.`,
          ),
        ]),
    "",
  ].join("\n");
};
