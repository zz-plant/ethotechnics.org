import { describe, expect, it } from "bun:test";

import {
  OBJECTION_LABELS,
  OBJECTION_MARKERS,
  acknowledgmentComment,
  buildObjectionSnapshot,
  daysOpen,
  describeClauseObjections,
  dueDate,
  normalizeClauseId,
  normalizeStandardId,
  objectionClock,
  objectionStatus,
  objectionTarget,
  parseObjectionForm,
  planSweep,
  sameSnapshotData,
  type IssueSummary,
  type SnapshotIssue,
} from "./objections";

// The body GitHub renders for a submitted issue form: one `### Label`
// heading per field, and `_No response_` for an optional field left empty.
const formBody = [
  "### Standard",
  "",
  "STD-02",
  "",
  "### Clause",
  "",
  "§2.2",
  "",
  "### What the clause gets wrong",
  "",
  "It names an appeal authority but not a deadline.",
  "",
  "Second paragraph of the problem.",
  "",
  "### Evidence",
  "",
  "Tribunal ruling, 2024.",
  "",
  "### Proposed change",
  "",
  "_No response_",
  "",
  "### Your standing",
  "",
  "I am affected by a system the clause covers",
].join("\n");

describe("parseObjectionForm", () => {
  it("reads every field of a submitted form", () => {
    expect(parseObjectionForm(formBody)).toEqual({
      standard: "STD-02",
      clause: "§2.2",
      problem:
        "It names an appeal authority but not a deadline.\n\nSecond paragraph of the problem.",
      evidence: "Tribunal ruling, 2024.",
      change: null,
      standing: "I am affected by a system the clause covers",
    });
  });

  it("accepts CRLF line endings and unknown headings", () => {
    const body =
      "### Standard\r\n\r\nSTD-08\r\n\r\n### Something else\r\n\r\nx";
    const form = parseObjectionForm(body);
    expect(form.standard).toBe("STD-08");
    expect(form.clause).toBeNull();
  });

  it("returns empty fields for an empty or missing body", () => {
    expect(parseObjectionForm(null).standard).toBeNull();
    expect(parseObjectionForm("").problem).toBeNull();
  });
});

describe("normalizers", () => {
  it("reads standard ids in the forms people type them", () => {
    expect(normalizeStandardId("std-02")).toBe("STD-02");
    expect(normalizeStandardId("STD 09 — Agent Chains")).toBe("STD-09");
    expect(normalizeStandardId("MVC-01")).toBe("MVC-01");
    expect(normalizeStandardId("this is 12 words")).toBeNull();
  });

  it("reads clause ids with or without the section sign", () => {
    expect(normalizeClauseId("§2.2")).toBe("§2.2");
    expect(normalizeClauseId("2.10")).toBe("§2.10");
    expect(normalizeClauseId("Section 8.6")).toBe("§8.6");
    expect(normalizeClauseId("§ 1.4")).toBe("§1.4");
    expect(normalizeClauseId("none")).toBeNull();
  });
});

describe("objectionTarget", () => {
  it("prefers the form and falls back to the title", () => {
    expect(objectionTarget("Objection: STD-01 §1.1", formBody)).toEqual({
      standard: "STD-02",
      clause: "§2.2",
    });
    expect(objectionTarget("Objection: STD-07 §3.2", null)).toEqual({
      standard: "STD-07",
      clause: "§3.2",
    });
  });

  it("does not read a version number in a title as a clause", () => {
    expect(objectionTarget("Objection: STD-02 v1.3 is wrong", "")).toEqual({
      standard: "STD-02",
      clause: null,
    });
  });
});

describe("the answer clock", () => {
  const opened = "2026-10-01T18:30:00Z";

  it("is due 30 calendar days after the day it opened", () => {
    expect(dueDate(opened)).toBe("2026-10-31");
    expect(dueDate("2026-12-15T00:00:00Z")).toBe("2027-01-14");
  });

  it("counts whole UTC calendar days", () => {
    expect(daysOpen(opened, new Date("2026-10-01T23:59:00Z"))).toBe(0);
    expect(daysOpen(opened, new Date("2026-10-02T00:01:00Z"))).toBe(1);
  });

  it("flags due soon from day 21 and overdue after day 30", () => {
    expect(objectionClock(opened, new Date("2026-10-21T12:00:00Z"))).toBe(
      "on-time",
    );
    expect(objectionClock(opened, new Date("2026-10-22T00:00:00Z"))).toBe(
      "due-soon",
    );
    expect(objectionClock(opened, new Date("2026-10-31T23:00:00Z"))).toBe(
      "due-soon",
    );
    expect(objectionClock(opened, new Date("2026-11-01T00:00:00Z"))).toBe(
      "overdue",
    );
  });
});

const issue = (overrides: Partial<IssueSummary> = {}): IssueSummary => ({
  number: 7,
  title: "Objection: STD-02 §2.2",
  body: formBody,
  state: "open",
  labels: [OBJECTION_LABELS.objection, "std-02"],
  createdAt: "2026-10-01T10:00:00Z",
  closedAt: null,
  ...overrides,
});

describe("planSweep", () => {
  it("does nothing before day 21", () => {
    expect(planSweep(issue(), new Date("2026-10-10T00:00:00Z"))).toEqual({
      addLabels: [],
      removeLabels: [],
      comment: null,
    });
  });

  it("adds due-soon with one marked comment from day 21", () => {
    const plan = planSweep(issue(), new Date("2026-10-25T00:00:00Z"));
    expect(plan.addLabels).toEqual([OBJECTION_LABELS.dueSoon]);
    expect(plan.removeLabels).toEqual([]);
    expect(plan.comment?.marker).toBe(OBJECTION_MARKERS.dueSoon);
    expect(plan.comment?.body).toContain("2026-10-31");
  });

  it("swaps due-soon for overdue after day 30", () => {
    const plan = planSweep(
      issue({ labels: ["objection", "due-soon"] }),
      new Date("2026-11-02T00:00:00Z"),
    );
    expect(plan.addLabels).toEqual([OBJECTION_LABELS.overdue]);
    expect(plan.removeLabels).toEqual([OBJECTION_LABELS.dueSoon]);
    expect(plan.comment?.marker).toBe(OBJECTION_MARKERS.overdue);
  });

  it("does not re-add a label the issue already has", () => {
    const plan = planSweep(
      issue({ labels: ["objection", "overdue"] }),
      new Date("2026-11-20T00:00:00Z"),
    );
    expect(plan.addLabels).toEqual([]);
    expect(plan.removeLabels).toEqual([]);
  });

  it("leaves answered and closed objections alone", () => {
    const late = new Date("2026-12-01T00:00:00Z");
    expect(
      planSweep(issue({ labels: ["objection", "answered"] }), late).comment,
    ).toBeNull();
    expect(
      planSweep(issue({ labels: ["objection", "not-upheld"] }), late).comment,
    ).toBeNull();
    expect(planSweep(issue({ state: "closed" }), late).comment).toBeNull();
    expect(planSweep(issue({ labels: [] }), late).comment).toBeNull();
  });
});

describe("acknowledgmentComment", () => {
  it("names the clause and the due date", () => {
    const comment = acknowledgmentComment(issue());
    expect(comment.marker).toBe(OBJECTION_MARKERS.ack);
    expect(comment.body.startsWith(OBJECTION_MARKERS.ack)).toBe(true);
    expect(comment.body).toContain("STD-02 §2.2");
    expect(comment.body).toContain("2026-10-31");
    expect(comment.body).not.toContain("could not be read");
  });

  it("asks for the standard and clause when it cannot read them", () => {
    const comment = acknowledgmentComment(
      issue({ title: "Objection: ", body: "free text" }),
    );
    expect(comment.body).toContain("could not be read");
  });
});

const snapshotIssue = (
  overrides: Partial<SnapshotIssue> = {},
): SnapshotIssue => ({
  ...issue(),
  url: "https://github.com/zz-plant/ethotechnics.org/issues/7",
  answeredAt: null,
  ...overrides,
});

describe("buildObjectionSnapshot", () => {
  const now = new Date("2026-11-15T00:00:00Z");

  it("records an empty history with zero totals", () => {
    const snapshot = buildObjectionSnapshot([], now);
    expect(snapshot.objections).toEqual([]);
    expect(snapshot.perClause).toEqual({});
    expect(Object.values(snapshot.totals).every((n) => n === 0)).toBe(true);
  });

  it("counts outcomes, timeliness, and clauses, sorted by issue number", () => {
    const snapshot = buildObjectionSnapshot(
      [
        // Upheld and closed within the window.
        snapshotIssue({
          number: 9,
          labels: ["objection", "answered", "upheld"],
          state: "closed",
          answeredAt: "2026-10-20T09:00:00Z",
          closedAt: "2026-10-21T09:00:00Z",
        }),
        // Open, no answer, past due.
        snapshotIssue({ number: 3 }),
        // Not upheld, answered after the due date.
        snapshotIssue({
          number: 12,
          title: "Objection: STD-08 §1.1",
          body: null,
          labels: ["objection", "not-upheld"],
          state: "closed",
          closedAt: "2026-11-05T00:00:00Z",
        }),
        // Opened recently: not yet due.
        snapshotIssue({
          number: 20,
          createdAt: "2026-11-10T00:00:00Z",
        }),
      ],
      now,
    );

    expect(snapshot.objections.map((record) => record.number)).toEqual([
      3, 9, 12, 20,
    ]);
    expect(snapshot.totals).toEqual({
      received: 4,
      open: 2,
      answered: 2,
      answeredOnTime: 1,
      overdue: 1,
      upheld: 1,
      notUpheld: 1,
    });
    expect(Object.keys(snapshot.perClause)).toEqual([
      "STD-02 §2.2",
      "STD-08 §1.1",
    ]);
    expect(snapshot.perClause["STD-02 §2.2"]).toEqual({
      received: 3,
      open: 2,
      upheld: 1,
      notUpheld: 0,
    });

    const [overdue, upheld, late, fresh] = snapshot.objections;
    expect(overdue!.answeredOnTime).toBe(false);
    expect(objectionStatus(overdue!)).toBe("Overdue");
    expect(upheld!.outcome).toBe("upheld");
    expect(objectionStatus(upheld!)).toBe("Answered on time");
    expect(late!.answeredAt).toBe("2026-11-05T00:00:00Z");
    expect(objectionStatus(late!)).toBe("Answered late");
    expect(fresh!.answeredOnTime).toBeNull();
    expect(fresh!.dueAt).toBe("2026-12-10");
    expect(objectionStatus(fresh!)).toBe("Awaiting answer");
  });

  it("is the same data whenever only the generation time differs", () => {
    const a = buildObjectionSnapshot([snapshotIssue()], now);
    const b = buildObjectionSnapshot(
      [snapshotIssue()],
      new Date("2026-11-15T08:00:00Z"),
    );
    expect(a.generatedAt).not.toBe(b.generatedAt);
    expect(sameSnapshotData(a, b)).toBe(true);
    expect(sameSnapshotData(a, buildObjectionSnapshot([], new Date(now)))).toBe(
      false,
    );
  });
});

describe("describeClauseObjections", () => {
  it("says nothing when a clause has no objections", () => {
    expect(describeClauseObjections(undefined)).toBeNull();
    expect(
      describeClauseObjections({
        received: 0,
        open: 0,
        upheld: 0,
        notUpheld: 0,
      }),
    ).toBeNull();
  });

  it("counts objections and upheld ones", () => {
    expect(
      describeClauseObjections({
        received: 1,
        open: 1,
        upheld: 0,
        notUpheld: 0,
      }),
    ).toBe("1 objection");
    expect(
      describeClauseObjections({
        received: 2,
        open: 0,
        upheld: 1,
        notUpheld: 1,
      }),
    ).toBe("2 objections, 1 upheld");
  });
});
