/**
 * Objections to a clause of a standard, filed as GitHub issues from the form
 * in .github/ISSUE_TEMPLATE/objection.yml.
 *
 * The rules are the site's own: an objection is answered in public within
 * ANSWER_WINDOW_DAYS of being opened, it is flagged as due soon from
 * DUE_SOON_AFTER_DAYS, and an upheld objection ends in a revised clause or a
 * recorded reason for keeping it. This module holds the pure parts of that:
 * reading the form, the clock, what the daily sweep does to an issue, and the
 * snapshot the record page reads. The scripts under scripts/presence/ do the
 * network calls; the site reads only the snapshot.
 */

export const ANSWER_WINDOW_DAYS = 30;
export const DUE_SOON_AFTER_DAYS = 21;

export const OBJECTION_LABELS = {
  objection: "objection",
  answered: "answered",
  upheld: "upheld",
  notUpheld: "not-upheld",
  dueSoon: "due-soon",
  overdue: "overdue",
} as const;

/** Hidden markers that keep each bot comment to one per issue. */
export const OBJECTION_MARKERS = {
  ack: "<!-- objection-ack -->",
  dueSoon: "<!-- objection-due-soon -->",
  overdue: "<!-- objection-overdue -->",
} as const;

export const RECORD_URL = "https://ethotechnics.org/record";

/** Field ids in the issue form, mapped to the labels GitHub renders as headings. */
export const OBJECTION_FORM_LABELS = {
  standard: "Standard",
  clause: "Clause",
  problem: "What the clause gets wrong",
  evidence: "Evidence",
  change: "Proposed change",
  standing: "Your standing",
} as const;

export type ObjectionField = keyof typeof OBJECTION_FORM_LABELS;
export type ObjectionForm = Record<ObjectionField, string | null>;

const NO_RESPONSE = "_No response_";
const DAY_MS = 86_400_000;

/** "std-02", "STD 02", "Std-02 — Contestability" → "STD-02". */
export const normalizeStandardId = (
  value: string | null | undefined,
): string | null => {
  const match = /\b(STD|MVC|PM)[-\s]?(\d{2})\b/i.exec(value ?? "");
  return match ? `${match[1].toUpperCase()}-${match[2]}` : null;
};

/** "§2.2", "2.2", "Section 2.2", "§ 2.2" → "§2.2". */
export const normalizeClauseId = (
  value: string | null | undefined,
): string | null => {
  const match = /(\d+)\.(\d+)/.exec(value ?? "");
  return match ? `§${match[1]}.${match[2]}` : null;
};

/** The key the snapshot and the register use for one clause: "STD-02 §2.2". */
export const clauseKey = (standardId: string, clauseId: string): string =>
  `${standardId} ${clauseId}`;

/** The label that files an objection under its standard: "std-02". */
export const standardLabel = (standardId: string): string =>
  standardId.toLowerCase();

/**
 * Read an issue-form body. GitHub renders each field as a `### Label`
 * heading followed by the answer, and an empty optional field as
 * `_No response_`. Headings it does not know are ignored.
 */
export const parseObjectionForm = (body: string | null): ObjectionForm => {
  const form: ObjectionForm = {
    standard: null,
    clause: null,
    problem: null,
    evidence: null,
    change: null,
    standing: null,
  };
  const fieldByLabel = new Map(
    (Object.entries(OBJECTION_FORM_LABELS) as [ObjectionField, string][]).map(
      ([field, label]) => [label.toLowerCase(), field],
    ),
  );

  let current: ObjectionField | null = null;
  let lines: string[] = [];
  const flush = () => {
    if (!current) return;
    const value = lines.join("\n").trim();
    form[current] = value && value !== NO_RESPONSE ? value : null;
  };

  for (const line of (body ?? "").replace(/\r\n/g, "\n").split("\n")) {
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      current = fieldByLabel.get(heading[1].toLowerCase()) ?? null;
      lines = [];
      continue;
    }
    if (current) lines.push(line);
  }
  flush();

  form.standard = normalizeStandardId(form.standard);
  form.clause = normalizeClauseId(form.clause);
  return form;
};

export interface ObjectionTarget {
  standard: string | null;
  clause: string | null;
}

/**
 * The standard and clause an issue objects to: from the form when it has
 * them, otherwise from a title such as "Objection: STD-02 §2.2".
 */
export const objectionTarget = (
  title: string,
  body: string | null,
): ObjectionTarget => {
  const form = parseObjectionForm(body);
  const fromTitle = title.replace(/^\s*objection:\s*/i, "");
  return {
    standard: form.standard ?? normalizeStandardId(fromTitle),
    // In a title, only a number marked with § is a clause: "v1.3" is not.
    clause:
      form.clause ?? normalizeClauseId(/§\s*\d+\.\d+/.exec(fromTitle)?.[0]),
  };
};

/** The UTC calendar date of an ISO timestamp, as YYYY-MM-DD. */
export const isoDate = (value: string | Date): string =>
  new Date(value).toISOString().slice(0, 10);

/** The date an objection opened at `openedAt` must be answered by. */
export const dueDate = (openedAt: string): string =>
  isoDate(
    new Date(Date.parse(isoDate(openedAt)) + ANSWER_WINDOW_DAYS * DAY_MS),
  );

/** Whole UTC calendar days from the day it was opened to `now`. */
export const daysOpen = (openedAt: string, now: Date): number =>
  Math.round(
    (Date.parse(isoDate(now)) - Date.parse(isoDate(openedAt))) / DAY_MS,
  );

export type ObjectionClock = "on-time" | "due-soon" | "overdue";

/** On time until day 21, due soon from day 21 to day 30, overdue after. */
export const objectionClock = (openedAt: string, now: Date): ObjectionClock => {
  const days = daysOpen(openedAt, now);
  if (days > ANSWER_WINDOW_DAYS) return "overdue";
  if (days >= DUE_SOON_AFTER_DAYS) return "due-soon";
  return "on-time";
};

export interface IssueSummary {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  labels: string[];
  createdAt: string;
  closedAt: string | null;
}

export interface BotComment {
  marker: string;
  body: string;
}

export interface SweepPlan {
  addLabels: string[];
  removeLabels: string[];
  /** Posted only if no comment on the issue already carries its marker. */
  comment: BotComment | null;
}

const describeTarget = ({ standard, clause }: ObjectionTarget): string =>
  standard && clause
    ? clauseKey(standard, clause)
    : (standard ?? "the clause named above");

export const acknowledgmentComment = (
  issue: Pick<IssueSummary, "title" | "body" | "createdAt">,
): BotComment => {
  const target = objectionTarget(issue.title, issue.body);
  const unreadable =
    target.standard && target.clause
      ? []
      : [
          "",
          "The standard or clause could not be read from the form. Edit the issue to name both, for example `STD-02` and `§2.2`.",
        ];
  return {
    marker: OBJECTION_MARKERS.ack,
    body: [
      OBJECTION_MARKERS.ack,
      `This objection to ${describeTarget(target)} is recorded. It is due an answer here by **${dueDate(issue.createdAt)}**, ${ANSWER_WINDOW_DAYS} days after it was opened.`,
      ...unreadable,
      "",
      "The answer says whether the objection is upheld:",
      "",
      "- **Upheld.** The clause is revised, or a reason for keeping it is recorded. Either is linked from this issue.",
      "- **Not upheld.** The answer gives the reason.",
      "",
      `The record at ${RECORD_URL} lists every objection, its due date, and its answer.`,
    ].join("\n"),
  };
};

const dueSoonComment = (createdAt: string): BotComment => ({
  marker: OBJECTION_MARKERS.dueSoon,
  body: [
    OBJECTION_MARKERS.dueSoon,
    `This objection has been open ${DUE_SOON_AFTER_DAYS} days or more. Its answer is due by **${dueDate(createdAt)}**.`,
  ].join("\n"),
});

const overdueComment = (createdAt: string): BotComment => ({
  marker: OBJECTION_MARKERS.overdue,
  body: [
    OBJECTION_MARKERS.overdue,
    `This objection was due an answer by **${dueDate(createdAt)}** and has none. It is marked overdue, and the public record counts it as overdue until it is answered.`,
  ].join("\n"),
});

export const isAnswered = (labels: string[]): boolean =>
  labels.includes(OBJECTION_LABELS.answered) ||
  labels.includes(OBJECTION_LABELS.upheld) ||
  labels.includes(OBJECTION_LABELS.notUpheld);

/**
 * What the daily sweep does to one issue. Only open objections without an
 * answer move; an answered or closed one is left as it is.
 */
export const planSweep = (issue: IssueSummary, now: Date): SweepPlan => {
  const plan: SweepPlan = { addLabels: [], removeLabels: [], comment: null };
  if (
    issue.state !== "open" ||
    !issue.labels.includes(OBJECTION_LABELS.objection) ||
    isAnswered(issue.labels)
  ) {
    return plan;
  }

  const clock = objectionClock(issue.createdAt, now);
  if (clock === "overdue") {
    if (!issue.labels.includes(OBJECTION_LABELS.overdue)) {
      plan.addLabels.push(OBJECTION_LABELS.overdue);
    }
    if (issue.labels.includes(OBJECTION_LABELS.dueSoon)) {
      plan.removeLabels.push(OBJECTION_LABELS.dueSoon);
    }
    plan.comment = overdueComment(issue.createdAt);
  } else if (clock === "due-soon") {
    if (!issue.labels.includes(OBJECTION_LABELS.dueSoon)) {
      plan.addLabels.push(OBJECTION_LABELS.dueSoon);
    }
    plan.comment = dueSoonComment(issue.createdAt);
  }
  return plan;
};

export type ObjectionOutcome = "upheld" | "not-upheld" | "open";

export interface ObjectionRecord {
  number: number;
  url: string;
  title: string;
  standard: string | null;
  clause: string | null;
  openedAt: string;
  dueAt: string;
  answeredAt: string | null;
  closedAt: string | null;
  state: "open" | "closed";
  outcome: ObjectionOutcome;
  /** null while unanswered and not yet due. */
  answeredOnTime: boolean | null;
}

export interface ObjectionTotals {
  received: number;
  open: number;
  answered: number;
  answeredOnTime: number;
  overdue: number;
  upheld: number;
  notUpheld: number;
}

export interface ClauseObjectionCounts {
  received: number;
  open: number;
  upheld: number;
  notUpheld: number;
}

export interface ObjectionSnapshot {
  generatedAt: string;
  totals: ObjectionTotals;
  perClause: Record<string, ClauseObjectionCounts>;
  objections: ObjectionRecord[];
}

export interface SnapshotIssue extends IssueSummary {
  url: string;
  /** When the answer was first recorded: the `answered` or outcome label. */
  answeredAt: string | null;
}

const outcomeOf = (labels: string[]): ObjectionOutcome => {
  if (labels.includes(OBJECTION_LABELS.upheld)) return "upheld";
  if (labels.includes(OBJECTION_LABELS.notUpheld)) return "not-upheld";
  return "open";
};

export const toObjectionRecord = (
  issue: SnapshotIssue,
  now: Date,
): ObjectionRecord => {
  const { standard, clause } = objectionTarget(issue.title, issue.body);
  const dueAt = dueDate(issue.createdAt);
  const answered = isAnswered(issue.labels);
  const answeredAt = answered ? (issue.answeredAt ?? issue.closedAt) : null;
  let answeredOnTime: boolean | null = null;
  if (answeredAt) {
    answeredOnTime = isoDate(answeredAt) <= dueAt;
  } else if (isoDate(now) > dueAt) {
    answeredOnTime = false;
  }
  return {
    number: issue.number,
    url: issue.url,
    title: issue.title,
    standard,
    clause,
    openedAt: issue.createdAt,
    dueAt,
    answeredAt,
    closedAt: issue.closedAt,
    state: issue.state,
    outcome: outcomeOf(issue.labels),
    answeredOnTime,
  };
};

/** Overdue: past its due date with no answer, whether open or closed. */
export const isOverdue = (record: ObjectionRecord): boolean =>
  record.answeredAt === null && record.answeredOnTime === false;

const sortKeys = <T>(record: Record<string, T>): Record<string, T> =>
  Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key) => [key, record[key]]),
  );

/** The whole record, sorted so the same issues always produce the same file. */
export const buildObjectionSnapshot = (
  issues: SnapshotIssue[],
  now: Date,
): ObjectionSnapshot => {
  const objections = issues
    .map((issue) => toObjectionRecord(issue, now))
    .sort((a, b) => a.number - b.number);

  const totals: ObjectionTotals = {
    received: objections.length,
    open: 0,
    answered: 0,
    answeredOnTime: 0,
    overdue: 0,
    upheld: 0,
    notUpheld: 0,
  };
  const perClause: Record<string, ClauseObjectionCounts> = {};

  for (const record of objections) {
    if (record.state === "open") totals.open += 1;
    if (record.answeredAt) totals.answered += 1;
    if (record.answeredAt && record.answeredOnTime) totals.answeredOnTime += 1;
    if (isOverdue(record)) totals.overdue += 1;
    if (record.outcome === "upheld") totals.upheld += 1;
    if (record.outcome === "not-upheld") totals.notUpheld += 1;

    if (record.standard && record.clause) {
      const key = clauseKey(record.standard, record.clause);
      const counts = (perClause[key] ??= {
        received: 0,
        open: 0,
        upheld: 0,
        notUpheld: 0,
      });
      counts.received += 1;
      if (record.state === "open") counts.open += 1;
      if (record.outcome === "upheld") counts.upheld += 1;
      if (record.outcome === "not-upheld") counts.notUpheld += 1;
    }
  }

  return {
    generatedAt: now.toISOString(),
    totals,
    perClause: sortKeys(perClause),
    objections,
  };
};

/**
 * Whether two snapshots record the same thing. The generation time is left
 * out, so a weekly run with nothing new does not rewrite the file.
 */
export const sameSnapshotData = (
  a: ObjectionSnapshot,
  b: ObjectionSnapshot,
): boolean =>
  JSON.stringify({ ...a, generatedAt: "" }) ===
  JSON.stringify({ ...b, generatedAt: "" });

/** "2 objections, 1 upheld" for the register; null when there are none. */
export const describeClauseObjections = (
  counts: ClauseObjectionCounts | undefined,
): string | null => {
  if (!counts || counts.received === 0) return null;
  const parts = [
    `${counts.received} ${counts.received === 1 ? "objection" : "objections"}`,
  ];
  if (counts.upheld > 0) parts.push(`${counts.upheld} upheld`);
  return parts.join(", ");
};

/** How the record page names an objection's status. */
export const objectionStatus = (record: ObjectionRecord): string => {
  if (record.answeredAt) {
    return record.answeredOnTime ? "Answered on time" : "Answered late";
  }
  if (isOverdue(record)) return "Overdue";
  return record.state === "open" ? "Awaiting answer" : "Closed unanswered";
};
