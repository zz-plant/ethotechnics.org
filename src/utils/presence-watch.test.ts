import { describe, expect, it } from "bun:test";

import type { StandardClause } from "../content/standards";
import {
  federalRegisterConsultationsUrl,
  federalRegisterMentionsUrl,
  githubMentionQuery,
  govUkConsultationsUrl,
  isoWeek,
  mergeConsultations,
  parseFederalRegisterConsultations,
  parseFederalRegisterMentions,
  parseGitHubCodeMentions,
  parseGovUkConsultations,
  planWatch,
  readWatchState,
  shortHash,
  writeWatchState,
  type Consultation,
  type Mention,
  type SourceResult,
  type WatchInput,
} from "./presence-watch";

describe("query builders", () => {
  it("asks the Federal Register for open comment periods on either term", () => {
    const url = new URL(federalRegisterConsultationsUrl("2026-10-06"));
    expect(url.origin + url.pathname).toBe(
      "https://www.federalregister.gov/api/v1/documents.json",
    );
    expect(url.searchParams.get("conditions[term]")).toBe(
      '"artificial intelligence" | "automated decision"',
    );
    expect(url.searchParams.getAll("conditions[type][]")).toEqual([
      "PRORULE",
      "NOTICE",
    ]);
    expect(url.searchParams.get("conditions[comment_date][gte]")).toBe(
      "2026-10-06",
    );
    expect(url.searchParams.getAll("fields[]")).toContain("comments_close_on");
  });

  it("asks the Federal Register for any document naming the site", () => {
    const url = new URL(federalRegisterMentionsUrl());
    expect(url.searchParams.get("conditions[term]")).toBe("ethotechnics");
    expect(url.searchParams.has("conditions[comment_date][gte]")).toBe(false);
  });

  it("asks GOV.UK for open consultations only", () => {
    const url = new URL(govUkConsultationsUrl("artificial intelligence"));
    expect(url.origin + url.pathname).toBe(
      "https://www.gov.uk/api/search.json",
    );
    expect(url.searchParams.get("filter_content_store_document_type")).toBe(
      "open_consultation",
    );
    expect(url.searchParams.get("q")).toBe("artificial intelligence");
    expect(url.searchParams.getAll("fields[]")).toContain("end_date");
  });

  it("leaves the owner's own repositories out of code search", () => {
    expect(githubMentionQuery("zz-plant")).toBe(
      '"ethotechnics.org" NOT user:zz-plant',
    );
  });
});

describe("response parsers", () => {
  it("reads Federal Register documents and marks those naming the topic", () => {
    const parsed = parseFederalRegisterConsultations({
      count: 2,
      results: [
        {
          document_number: "2026-1",
          html_url: "https://www.federalregister.gov/d/2026-1",
          title: "Automated decision systems in benefit claims",
          abstract: "",
          agency_names: ["Social Security Administration"],
          comments_close_on: "2026-11-30",
          type: "Proposed Rule",
        },
        {
          document_number: "2026-2",
          html_url: "https://www.federalregister.gov/d/2026-2",
          title: "Custody rules",
          abstract: null,
          agency_names: ["Securities and Exchange Commission", "Treasury"],
          comments_close_on: "2026-12-07",
          type: "Notice",
        },
        { title: "No document number" },
      ],
    });
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({
      key: "fr:2026-1",
      closesOn: "2026-11-30",
      kind: "Proposed Rule",
      namesTopic: true,
    });
    expect(parsed[1]!.agency).toBe(
      "Securities and Exchange Commission; Treasury",
    );
    expect(parsed[1]!.namesTopic).toBe(false);
  });

  it("returns nothing for an empty or malformed response", () => {
    expect(parseFederalRegisterConsultations({ count: 0 })).toEqual([]);
    expect(parseFederalRegisterConsultations(null)).toEqual([]);
    expect(parseGovUkConsultations("oops", "2026-10-06")).toEqual([]);
    expect(parseGitHubCodeMentions(undefined, "a/b")).toEqual([]);
    expect(parseFederalRegisterMentions({ count: 0 })).toEqual([]);
  });

  it("reads GOV.UK consultations and drops any already closed", () => {
    const parsed = parseGovUkConsultations(
      {
        results: [
          {
            title: "AI in public services",
            link: "/government/consultations/ai",
            description: "Artificial intelligence in benefits.",
            end_date: "2026-11-01T23:59:00.000+00:00",
            organisations: [{ title: "Cabinet Office" }],
          },
          {
            title: "Closed",
            link: "/government/consultations/closed",
            end_date: "2026-10-01T23:59:00.000+01:00",
          },
        ],
      },
      "2026-10-06",
    );
    expect(parsed).toEqual([
      {
        source: "gov-uk",
        key: "uk:/government/consultations/ai",
        title: "AI in public services",
        kind: "Consultation",
        agency: "Cabinet Office",
        closesOn: "2026-11-01",
        url: "https://www.gov.uk/government/consultations/ai",
        summary: "Artificial intelligence in benefits.",
        namesTopic: true,
      },
    ]);
  });

  it("drops this repository and forks from code search mentions", () => {
    const parsed = parseGitHubCodeMentions(
      {
        items: [
          {
            path: "README.md",
            html_url: "https://github.com/a/b/blob/x/README.md",
            repository: { full_name: "a/b", fork: false },
          },
          {
            path: "README.md",
            html_url: "https://github.com/zz-plant/ethotechnics.org/blob/x",
            repository: { full_name: "zz-plant/ethotechnics.org" },
          },
          {
            path: "README.md",
            html_url: "https://github.com/c/fork/blob/x",
            repository: { full_name: "c/fork", fork: true },
          },
        ],
      },
      "zz-plant/ethotechnics.org",
    );
    expect(parsed).toEqual([
      {
        source: "github-code",
        key: "gh:a/b/README.md",
        title: "a/b: README.md",
        url: "https://github.com/a/b/blob/x/README.md",
      },
    ]);
  });
});

describe("mergeConsultations", () => {
  const item = (key: string, closesOn: string, namesTopic = false) =>
    ({
      source: "gov-uk",
      key,
      title: key,
      kind: "Consultation",
      agency: "",
      closesOn,
      url: `https://www.gov.uk/${key}`,
      summary: "",
      namesTopic,
    }) satisfies Consultation;

  it("keeps one of each, soonest closing first", () => {
    expect(
      mergeConsultations([
        [item("b", "2026-12-01"), item("a", "2026-11-01")],
        [item("b", "2026-12-01", true), item("c", "")],
      ]).map((entry) => [entry.key, entry.namesTopic]),
    ).toEqual([
      ["a", false],
      ["b", true],
      ["c", false],
    ]);
  });
});

describe("isoWeek", () => {
  it("numbers weeks the ISO way, including at year ends", () => {
    expect(isoWeek(new Date("2026-10-06T12:00:00Z"))).toBe("2026-W41");
    expect(isoWeek(new Date("2026-01-01T00:00:00Z"))).toBe("2026-W01");
    expect(isoWeek(new Date("2027-01-01T00:00:00Z"))).toBe("2026-W53");
    expect(isoWeek(new Date("2024-12-30T00:00:00Z"))).toBe("2025-W01");
  });
});

describe("watch state", () => {
  it("round-trips through the hidden block in the issue body", () => {
    const state = {
      week: "2026-W41",
      seen: { "gov-uk": ["abc", "def"] },
      reported: ["abc"],
    };
    expect(readWatchState(`${writeWatchState(state)}\nText`)).toEqual(state);
    expect(readWatchState("no state")).toBeNull();
    expect(readWatchState("<!-- presence-watch-state {broken} -->")).toBeNull();
  });

  it("hashes keys stably and briefly", () => {
    expect(shortHash("fr:2026-1")).toBe(shortHash("fr:2026-1"));
    expect(shortHash("fr:2026-1")).not.toBe(shortHash("fr:2026-2"));
    expect(shortHash("uk:/government/consultations/a-long-path")).toMatch(
      /^[0-9a-z]{1,7}$/,
    );
  });
});

const register: StandardClause[] = [
  {
    id: "STD-02.2.1",
    standardId: "STD-02",
    displayId: "§2.1",
    type: "right",
    requirementLevel: "MUST",
    condition: "a benefit claim is denied by an automated decision",
    obligation: "publish an appeal path",
    evidenceRequired: [],
    timeBound: "on demand",
    relatedMechanisms: [],
    relatedValidators: [],
  },
];

const consultation = (key: string, title: string): Consultation => ({
  source: "federal-register",
  key,
  title,
  kind: "Proposed Rule",
  agency: "Agency",
  closesOn: "2026-11-30",
  url: `https://www.federalregister.gov/d/${key}`,
  summary: "",
  namesTopic: true,
});

const mention: Mention = {
  source: "github-code",
  key: "gh:a/b/README.md",
  title: "a/b: README.md",
  url: "https://github.com/a/b",
};

const input = (overrides: Partial<WatchInput> = {}): WatchInput => ({
  week: "2026-W41",
  today: "2026-10-06",
  previous: null,
  consultations: [
    {
      source: "federal-register",
      items: [
        consultation("fr:1", "Automated decision appeals for benefit claims"),
      ],
    },
  ],
  mentions: [{ source: "github-code", items: [mention] }],
  clauses: register,
  owner: "zz-plant",
  ...overrides,
});

describe("planWatch", () => {
  it("lists everything on the first run, with keyword-matched clauses", () => {
    const plan = planWatch(input());
    expect(plan.title).toBe("Presence watch: 2026-W41");
    expect(plan.sameWeek).toBe(false);
    expect(plan.newCount).toBe(2);
    expect(plan.consultations[0]!.clauses).toEqual(["STD-02 §2.1"]);
    expect(plan.body).toContain("Clauses (keyword-matched): STD-02 §2.1");
    expect(plan.body).toContain("a/b: README.md");
    expect(readWatchState(plan.body)?.reported).toHaveLength(2);
  });

  it("does not repeat items a previous week reported", () => {
    const first = planWatch(input());
    const next = planWatch(
      input({
        week: "2026-W42",
        previous: { title: first.title, body: first.body },
        consultations: [
          {
            source: "federal-register",
            items: [
              consultation("fr:1", "Automated decision appeals"),
              consultation("fr:2", "A new automated decision rule"),
            ],
          },
        ],
      }),
    );
    expect(next.sameWeek).toBe(false);
    expect(next.newCount).toBe(1);
    expect(next.consultations.map((item) => item.key)).toEqual(["fr:2"]);
    expect(next.mentions).toEqual([]);
    expect(next.body).toContain("Nothing new.");
  });

  it("keeps this week's items listed when the same week runs again", () => {
    const first = planWatch(input());
    const rerun = planWatch(
      input({ previous: { title: first.title, body: first.body } }),
    );
    expect(rerun.sameWeek).toBe(true);
    expect(rerun.newCount).toBe(0);
    expect(rerun.consultations.map((item) => item.key)).toEqual(["fr:1"]);
    expect(rerun.mentions.map((item) => item.key)).toEqual([mention.key]);
    expect(rerun.body).toBe(first.body);
  });

  it("keeps a failed source's earlier items as seen", () => {
    const first = planWatch(input());
    const failed: SourceResult<Mention> = {
      source: "github-code",
      items: [],
      error: "HTTP 403",
    };
    const outage = planWatch(
      input({
        week: "2026-W42",
        previous: { title: first.title, body: first.body },
        mentions: [failed],
      }),
    );
    expect(outage.state.seen["github-code"]).toEqual(
      first.state.seen["github-code"],
    );
    expect(outage.body).toContain("GitHub code search: HTTP 403");

    const recovered = planWatch(
      input({
        week: "2026-W43",
        previous: { title: outage.title, body: outage.body },
      }),
    );
    expect(recovered.mentions).toEqual([]);
  });
});
