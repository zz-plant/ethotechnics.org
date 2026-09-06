import { describe, expect, it } from "bun:test";

import { auditRecords, durationMs, extractCandidates } from "./conformance";
import {
  hashRevisableDelegationRecord,
  type RevisableDelegationRecord,
} from "../../utils/revisable-delegation-record";

const base = {
  schema_version: "0.1.0" as const,
  system: { id: "test" },
  actor: { id: "test", kind: "service" as const },
  visibility: "internal" as const,
};

const at = (minutes: number) =>
  new Date(Date.UTC(2026, 8, 6, 12, minutes, 0)).toISOString();

/** A belief, an authorization resting on it, a discrepancy, and its revision. */
async function stream(
  overrides: {
    dropInvalidatedBy?: boolean;
    answerAt?: number | null;
    clock?: string;
    withStanding?: boolean;
    withObjection?: boolean;
  } = {},
): Promise<RevisableDelegationRecord[]> {
  const contest = overrides.withStanding
    ? { standing: "anyone the grant affects", reversal_clock: "P1D" }
    : undefined;

  const unsealed: Array<Omit<RevisableDelegationRecord, "integrity">> = [
    {
      ...base,
      record_id: "r:belief:1",
      kind: "belief",
      subject: "credential health",
      summary: "The credential is passing.",
      time: { as_of: at(0), recorded_at: at(0) },
      content: { proposition: "The credential is passing." },
      invalidated_by: overrides.dropInvalidatedBy
        ? []
        : [
            {
              condition: "the credential stops passing",
              clock: overrides.clock ?? "PT30M",
            },
          ],
      ...(contest ? { contest } : {}),
    },
    {
      ...base,
      record_id: "r:authorization:1",
      kind: "authorization",
      subject: "deploy/execute",
      summary: "Deploy may run unattended.",
      time: { as_of: at(1), recorded_at: at(1) },
      content: {
        scope: "everywhere",
        holder: "agent",
        granted_by: "operator",
        mode: "unattended",
        revocation_conditions: ["the credential stops passing"],
      },
      depends_on: ["r:belief:1"],
      invalidated_by: overrides.dropInvalidatedBy
        ? []
        : [
            {
              condition: "the credential stops passing",
              clock: overrides.clock ?? "PT30M",
            },
          ],
      ...(contest ? { contest } : {}),
    },
    {
      ...base,
      record_id: "r:discrepancy:1",
      kind: "discrepancy",
      subject: "credential health",
      summary: "The credential stopped passing.",
      time: { as_of: at(10), recorded_at: at(10) },
      content: {
        expected: "credential passing",
        observed: "credential broken",
        source: "declared check",
      },
      depends_on: ["r:belief:1"],
      ...(contest ? { contest } : {}),
    },
  ];

  if (overrides.answerAt !== null) {
    unsealed.push({
      ...base,
      record_id: "r:revision:1",
      kind: "revision",
      subject: "deploy/execute",
      summary: "The grant asks a person now.",
      time: {
        as_of: at(overrides.answerAt ?? 12),
        recorded_at: at(overrides.answerAt ?? 12),
      },
      content: {
        reason: "the credential is broken",
        triggered_by: ["r:discrepancy:1"],
      },
      depends_on: ["r:discrepancy:1"],
      supersedes: "r:authorization:1",
      ...(contest ? { contest } : {}),
    });
  }

  if (overrides.withObjection) {
    unsealed.push({
      ...base,
      record_id: "r:objection:1",
      kind: "objection",
      subject: "deploy/execute",
      summary: "An operator challenged the narrowing.",
      time: { as_of: at(13), recorded_at: at(13) },
      content: {
        challenges: "r:discrepancy:1",
        standing_basis: "the operator who holds the grant",
        requested: "reconsideration",
      },
      depends_on: ["r:discrepancy:1"],
      ...(contest ? { contest } : {}),
    });
  }

  const sealed: RevisableDelegationRecord[] = [];
  let prior: string | undefined;
  for (const record of unsealed) {
    const hash = await hashRevisableDelegationRecord(
      record as RevisableDelegationRecord,
    );
    sealed.push({
      ...record,
      integrity: {
        algorithm: "sha256",
        hash,
        ...(prior ? { prior_hash: prior } : {}),
      },
    } as RevisableDelegationRecord);
    prior = hash;
  }
  return sealed;
}

const ndjson = (records: RevisableDelegationRecord[]) =>
  records.map((record) => JSON.stringify(record)).join("\n");

/** Well after the last record, so a clock has genuinely run out. */
const LATER = new Date(Date.UTC(2026, 8, 7)).toISOString();

describe("reading a stream", () => {
  it("accepts ndjson, a JSON array, and an object with a records array", () => {
    expect(extractCandidates('{"a":1}\n{"a":2}')).toHaveLength(2);
    expect(extractCandidates('[{"a":1},{"a":2}]')).toHaveLength(2);
    expect(extractCandidates('{"records":[{"a":1}]}')).toHaveLength(1);
    expect(extractCandidates("   ")).toHaveLength(0);
  });

  it("rejects entries the published schema rejects, and says which", async () => {
    const report = await auditRecords('{"record_id":"x"}\nnot json', {
      asOf: LATER,
    });
    expect(report.parsed).toBe(0);
    expect(report.rejected).toHaveLength(2);
    expect(report.rejected[1].reason).toBe("not valid JSON");
    expect(report.earnedLevel).toBeNull();
    expect(report.findings.some((f) => f.id === "invalid-records")).toBe(true);
  });
});

describe("clocks", () => {
  it("parses the durations records actually carry", () => {
    expect(durationMs("PT0S")).toBe(0);
    expect(durationMs("P7D")).toBe(7 * 86400_000);
    expect(durationMs("PT30M")).toBe(30 * 60_000);
    expect(durationMs("P1W")).toBe(7 * 86400_000);
  });

  it("refuses years and months rather than approximating them", () => {
    // A clock is a promise about a deadline. Turning P1M into thirty days
    // would make this tool disagree with the emitter about whether one was met.
    expect(durationMs("P1M")).toBeNull();
    expect(durationMs("P1Y")).toBeNull();
    expect(durationMs("nonsense")).toBeNull();
    expect(durationMs(undefined)).toBeNull();
  });
});

describe("what a stream earns", () => {
  it("reaches level 2 when hashes hold, grants are grounded, and the discrepancy was answered", async () => {
    const report = await auditRecords(ndjson(await stream()), { asOf: LATER });
    expect(report.parsed).toBe(4);
    expect(report.earnedLevel).toBe(2);
    expect(
      report.findings.filter((f) => f.severity === "blocking"),
    ).toHaveLength(0);
    expect(report.kinds).toMatchObject({
      belief: 1,
      authorization: 1,
      discrepancy: 1,
      revision: 1,
    });
  });

  it("stops at level 3 because no objection is present to observe", async () => {
    const withStanding = await auditRecords(
      ndjson(await stream({ withStanding: true })),
      {
        asOf: LATER,
      },
    );
    expect(withStanding.earnedLevel).toBe(2);
    expect(withStanding.blockedFrom.at(-1)?.because).toContain("no objection");

    const withObjection = await auditRecords(
      ndjson(await stream({ withStanding: true, withObjection: true })),
      { asOf: LATER },
    );
    expect(withObjection.earnedLevel).toBe(3);
  });

  it("holds a stream at level 1 when nothing says what would end it", async () => {
    const report = await auditRecords(
      ndjson(await stream({ dropInvalidatedBy: true })),
      {
        asOf: LATER,
      },
    );
    expect(report.earnedLevel).toBe(1);
    expect(report.blockedFrom.some((entry) => entry.level === 2)).toBe(true);
    expect(report.findings.some((f) => f.id === "ungrounded")).toBe(true);
  });

  it("holds a stream at level 1 when a discrepancy was never answered", async () => {
    const report = await auditRecords(
      ndjson(await stream({ answerAt: null })),
      { asOf: LATER },
    );
    expect(report.earnedLevel).toBe(1);
    const finding = report.findings.find(
      (f) => f.id === "unanswered-discrepancy",
    );
    expect(finding?.severity).toBe("blocking");
    expect(finding?.clause).toBe("STD-07 §3.3");
  });

  it("does not fail an unanswered discrepancy whose clock has not run out yet", async () => {
    // Judging against "now" rather than against the export time would fail a
    // record for the reviewer's lateness.
    const report = await auditRecords(
      ndjson(await stream({ answerAt: null })),
      { asOf: at(11) },
    );
    expect(report.findings.some((f) => f.id === "unanswered-discrepancy")).toBe(
      false,
    );
    expect(report.earnedLevel).toBe(2);
  });

  it("reports an answer that arrived after the clock ran out", async () => {
    const report = await auditRecords(
      ndjson(await stream({ answerAt: 90, clock: "PT30M" })),
      {
        asOf: LATER,
      },
    );
    expect(report.findings.some((f) => f.id === "late-answer")).toBe(true);
    // Late is a finding, not a blocker: it was answered.
    expect(report.earnedLevel).toBe(2);
  });
});

describe("tamper evidence", () => {
  it("catches a record edited after it was sealed", async () => {
    const records = await stream();
    const edited = records.map((record) =>
      record.record_id === "r:belief:1"
        ? { ...record, summary: "nothing was wrong" }
        : record,
    );
    const report = await auditRecords(ndjson(edited), { asOf: LATER });
    const finding = report.findings.find((f) => f.id === "hash-mismatch");
    expect(finding?.records).toEqual(["r:belief:1"]);
    expect(report.earnedLevel).toBe(0);
  });

  it("catches a record removed from the middle of the chain", async () => {
    const records = await stream();
    const report = await auditRecords(
      ndjson(
        records.filter((record) => record.record_id !== "r:authorization:1"),
      ),
      { asOf: LATER },
    );
    expect(report.findings.some((f) => f.id === "chain-break")).toBe(true);
    expect(report.earnedLevel).toBe(0);
  });

  it("notes a reference that resolves to nothing without calling it a failure", async () => {
    const records = await stream();
    const report = await auditRecords(
      ndjson(records.filter((record) => record.record_id !== "r:belief:1")),
      { asOf: LATER },
    );
    const finding = report.findings.find((f) => f.id === "dangling-reference");
    expect(finding?.severity).toBe("note");
  });
});

describe("the declared level", () => {
  it("contradicts an emitter claiming more than the stream supports", async () => {
    const report = await auditRecords(
      ndjson(await stream({ dropInvalidatedBy: true })),
      {
        declaredLevel: 2,
        asOf: LATER,
      },
    );
    expect(report.findings[0].id).toBe("overclaimed");
    expect(report.findings[0].severity).toBe("blocking");
    expect(report.verdict).toContain("earns Level 1");
  });

  it("says nothing when the declaration is honest or absent", async () => {
    const honest = await auditRecords(ndjson(await stream()), {
      declaredLevel: 2,
      asOf: LATER,
    });
    expect(honest.findings.some((f) => f.id === "overclaimed")).toBe(false);

    const modest = await auditRecords(ndjson(await stream()), {
      declaredLevel: 1,
      asOf: LATER,
    });
    expect(modest.findings.some((f) => f.id === "overclaimed")).toBe(false);
    expect(modest.earnedLevel).toBe(2);

    const undeclared = await auditRecords(ndjson(await stream()), {
      asOf: LATER,
    });
    expect(undeclared.declaredLevel).toBeNull();
  });
});
