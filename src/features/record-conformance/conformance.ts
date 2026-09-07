import {
  CONFORMANCE_LEVELS,
  RECORD_KINDS,
  hashRevisableDelegationRecord,
  parseRevisableDelegationRecord,
  type RevisableDelegationRecord,
} from "../../utils/revisable-delegation-record";

import {
  compareDeclaration,
  readManifest,
  type DelegationDeclaration,
} from "./manifest";

/**
 * Grading a stream of STD-07 records against the level its emitter claims.
 *
 * Every system that emits the record shape declares its own conformance level
 * in its own manifest, and until something reads the records back nothing can
 * contradict that. The standard already says declaring a level the log has not
 * earned is not conformance; this is the part that makes the claim falsifiable
 * rather than polite.
 *
 * Deliberately mechanical. Nothing here judges whether a belief was correct or
 * an authorization wise — that is not checkable from a stream and pretending
 * otherwise would make the tool exactly the kind of nominal safeguard it is
 * meant to catch. It checks what the records say about each other: whether the
 * hashes hold, whether references resolve, whether anything says what would
 * change its mind, and whether a discrepancy was ever answered.
 *
 * Runs entirely in the browser. These records are internal or private by
 * design, and an audit tool that uploaded them somewhere would be a
 * data-collection surface wearing an auditor's coat.
 */

export type Severity = "blocking" | "finding" | "note";

export type ConformanceFinding = {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  clause?: string;
  records: string[];
};

export type EarnedLevel = 0 | 1 | 2 | 3;

export type ConformanceReport = {
  parsed: number;
  rejected: Array<{ at: string; reason: string }>;
  kinds: Partial<Record<(typeof RECORD_KINDS)[number], number>>;
  findings: ConformanceFinding[];
  earnedLevel: EarnedLevel | null;
  earnedLabel: string;
  declaredLevel: number | null;
  /** Present when a manifest was supplied and carried exactly one declaration. */
  declaration: DelegationDeclaration | null;
  /** Why a supplied manifest could not be read, if it could not. */
  manifestError: string | null;
  blockedFrom: Array<{ level: EarnedLevel; because: string }>;
  verdict: string;
  asOf: string;
};

const LEVEL_ORDER: EarnedLevel[] = [0, 1, 2, 3];

/** Kinds the standard asks to carry `depends_on` and `invalidated_by` (§3.1, §3.2). */
const GROUNDED_KINDS = new Set(["belief", "authorization", "action"]);

/**
 * An ISO 8601 duration in milliseconds.
 *
 * Years and months are refused rather than approximated. A clock is a promise
 * about when someone will answer, and turning "P1M" into thirty days would
 * make this tool disagree with the emitter about whether a deadline was met.
 */
export function durationMs(value?: string): number | null {
  if (!value) return null;
  const match =
    /^P(?!$)(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?!$)(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(
      value.trim(),
    );
  if (!match) return null;
  const [, weeks, days, hours, minutes, seconds] = match;
  return (
    (Number(weeks ?? 0) * 7 * 86400 +
      Number(days ?? 0) * 86400 +
      Number(hours ?? 0) * 3600 +
      Number(minutes ?? 0) * 60 +
      Number(seconds ?? 0)) *
    1000
  );
}

/** NDJSON, a JSON array, or an object with a `records` array. */
export function extractCandidates(
  text: string,
): Array<{ at: string; value: unknown }> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  try {
    const whole: unknown = JSON.parse(trimmed);
    if (Array.isArray(whole)) {
      return whole.map((value: unknown, index: number) => ({
        at: `item ${index + 1}`,
        value,
      }));
    }
    if (
      whole &&
      typeof whole === "object" &&
      Array.isArray((whole as { records?: unknown }).records)
    ) {
      return (whole as { records: unknown[] }).records.map((value, index) => ({
        at: `records[${index}]`,
        value,
      }));
    }
    return [{ at: "the document", value: whole }];
  } catch {
    // Not one JSON value, so read it as newline-delimited.
  }

  return trimmed
    .split("\n")
    .map((line, index) => ({ line: line.trim(), index }))
    .filter((entry) => entry.line.length > 0)
    .map((entry) => {
      try {
        const value: unknown = JSON.parse(entry.line);
        return { at: `line ${entry.index + 1}`, value };
      } catch {
        return {
          at: `line ${entry.index + 1}`,
          value: undefined,
          broken: true,
        };
      }
    })
    .map((entry) => ({ at: entry.at, value: entry.value }));
}

const idsIn = (record: RevisableDelegationRecord): string[] => {
  const triggered = record.content?.triggered_by;
  return [
    ...(record.depends_on ?? []),
    ...(record.supersedes ? [record.supersedes] : []),
    ...(record.authority?.authorization_record
      ? [record.authority.authorization_record]
      : []),
    ...(Array.isArray(triggered)
      ? (triggered as unknown[]).filter(
          (v): v is string => typeof v === "string",
        )
      : []),
  ];
};

/** Records that answer a discrepancy: a revision or an objection naming it. */
const answersTo = (
  records: RevisableDelegationRecord[],
  discrepancyId: string,
) =>
  records.filter(
    (record) =>
      (record.kind === "revision" || record.kind === "objection") &&
      idsIn(record).includes(discrepancyId),
  );

/** The tightest clock any record declares for a condition, if one is declared. */
const clockFor = (
  records: RevisableDelegationRecord[],
  discrepancy: RevisableDelegationRecord,
): { ms: number; source: string } | null => {
  const linked = new Set(idsIn(discrepancy));
  const candidates: Array<{ ms: number; source: string }> = [];
  for (const record of records) {
    const relevant =
      linked.has(record.record_id) ||
      (record.depends_on ?? []).some((id) => linked.has(id)) ||
      record.subject === discrepancy.subject;
    if (!relevant) continue;
    for (const condition of record.invalidated_by ?? []) {
      const ms = durationMs(condition.clock);
      if (ms !== null) candidates.push({ ms, source: record.record_id });
    }
  }
  if (!candidates.length) return null;
  return candidates.reduce((tightest, next) =>
    next.ms < tightest.ms ? next : tightest,
  );
};

/**
 * Audits a stream and returns the level it actually earns.
 *
 * `asOf` exists so a stream can be graded against the moment it was exported
 * rather than against whenever someone happens to open this page. Judging a
 * clock against "now" would fail a record for the reviewer's lateness.
 */
export async function auditRecords(
  text: string,
  options: {
    declaredLevel?: number | null;
    asOf?: string;
    /**
     * The emitter's own manifest. When it carries a declaration, it supplies the
     * level instead of `declaredLevel`, because the point is to check the
     * artifact the emitter publishes rather than a number a reviewer typed.
     */
    manifest?: string;
  } = {},
): Promise<ConformanceReport> {
  const asOf =
    options.asOf && !Number.isNaN(Date.parse(options.asOf))
      ? options.asOf
      : new Date().toISOString();
  const asOfMs = Date.parse(asOf);
  const manifestRead = options.manifest?.trim()
    ? readManifest(options.manifest)
    : null;
  const declaration = manifestRead?.ok ? manifestRead.declaration : null;
  const manifestError =
    manifestRead && !manifestRead.ok ? manifestRead.reason : null;

  const claimed = declaration
    ? declaration.conformanceLevel
    : options.declaredLevel;
  const declaredLevel =
    typeof claimed === "number" && LEVEL_ORDER.includes(claimed as EarnedLevel)
      ? claimed
      : null;

  const candidates = extractCandidates(text);
  const rejected: ConformanceReport["rejected"] = [];
  const records: RevisableDelegationRecord[] = [];

  for (const candidate of candidates) {
    if (candidate.value === undefined) {
      rejected.push({ at: candidate.at, reason: "not valid JSON" });
      continue;
    }
    const result = parseRevisableDelegationRecord(candidate.value);
    if (result.success) records.push(result.data);
    else {
      rejected.push({
        at: candidate.at,
        reason: result.error.issues
          .slice(0, 3)
          .map(
            (issue) => `${issue.path.join(".") || "record"}: ${issue.message}`,
          )
          .join("; "),
      });
    }
  }

  const findings: ConformanceFinding[] = [];
  const kinds: ConformanceReport["kinds"] = {};
  for (const record of records)
    kinds[record.kind] = (kinds[record.kind] ?? 0) + 1;

  if (rejected.length) {
    findings.push({
      id: "invalid-records",
      severity: "blocking",
      title: `${rejected.length} ${rejected.length === 1 ? "entry does" : "entries do"} not validate against the schema`,
      detail:
        "A stream containing records the published schema rejects does not reach Level 0, whatever its emitter declares. Structure and format are both part of validity: a serializer can be right about every field and wrong about one of them.",
      clause: "STD-07 §5.3",
      records: rejected.map((entry) => entry.at),
    });
  }

  // ── Level 1: nothing edited, hashes hold, the chain links ──────────────────
  const unhashed = records.filter((record) => !record.integrity?.hash);
  if (unhashed.length) {
    findings.push({
      id: "missing-hash",
      severity: "finding",
      title: `${unhashed.length} ${unhashed.length === 1 ? "record carries" : "records carry"} no integrity hash`,
      detail:
        "Without a hash there is nothing to recompute, so the log is append-only by assertion rather than by evidence.",
      clause: "STD-07 §5.1",
      records: unhashed.map((record) => record.record_id),
    });
  }

  const tampered: string[] = [];
  for (const record of records) {
    if (!record.integrity?.hash) continue;
    const recomputed = await hashRevisableDelegationRecord(record);
    if (recomputed !== record.integrity.hash) tampered.push(record.record_id);
  }
  if (tampered.length) {
    findings.push({
      id: "hash-mismatch",
      severity: "blocking",
      title: `${tampered.length} ${tampered.length === 1 ? "record does not hash to the value stored on it" : "records do not hash to the values stored on them"}`,
      detail:
        "The record's content was changed after it was sealed, or it was serialized differently from the canonical form in §5.1. Either way the log cannot be read as append-only.",
      clause: "STD-07 §5.1",
      records: tampered,
    });
  }

  const chainBreaks: string[] = [];
  const chained = records.filter((record) => record.integrity?.hash);
  for (let index = 1; index < chained.length; index += 1) {
    const previous = chained[index - 1].integrity?.hash;
    const declared = chained[index].integrity?.prior_hash;
    if (declared && declared !== previous)
      chainBreaks.push(chained[index].record_id);
  }
  if (chainBreaks.length) {
    findings.push({
      id: "chain-break",
      severity: "blocking",
      title: `The chain does not link at ${chainBreaks.length} ${chainBreaks.length === 1 ? "record" : "records"}`,
      detail:
        "A record's prior_hash does not match the hash of the record before it. Something between them was removed or reordered, which is exactly what the chain exists to make visible. A partial export can also cause this; if so, export the whole stream.",
      clause: "STD-07 §5.2",
      records: chainBreaks,
    });
  }

  const unlinked = chained
    .slice(1)
    .filter((record) => !record.integrity?.prior_hash);
  if (unlinked.length) {
    findings.push({
      id: "unchained",
      severity: "finding",
      title: `${unlinked.length} ${unlinked.length === 1 ? "record is" : "records are"} hashed but not chained`,
      detail:
        "Each record verifies on its own and nothing ties them in order, so a deleted record leaves no trace.",
      clause: "STD-07 §5.2",
      records: unlinked.map((record) => record.record_id),
    });
  }

  // ── References resolve ────────────────────────────────────────────────────
  const known = new Set(records.map((record) => record.record_id));
  const dangling = records
    .map((record) => ({
      record,
      missing: idsIn(record).filter((id) => !known.has(id)),
    }))
    .filter((entry) => entry.missing.length > 0);
  if (dangling.length) {
    findings.push({
      id: "dangling-reference",
      severity: "note",
      title: `${dangling.length} ${dangling.length === 1 ? "record references" : "records reference"} an id not in this stream`,
      detail:
        "Expected when auditing an export that does not include everything it points at. A finding only if the stream was meant to be complete: a depends_on that resolves to nothing cannot be followed back to a justification.",
      clause: "STD-07 §3.1",
      records: dangling.map(
        (entry) => `${entry.record.record_id} → ${entry.missing.join(", ")}`,
      ),
    });
  }

  // ── Level 2: says what would change its mind, and answers what did ────────
  const grounded = records.filter((record) => GROUNDED_KINDS.has(record.kind));
  const ungrounded = grounded.filter(
    (record) => !(record.invalidated_by ?? []).length,
  );
  if (ungrounded.length) {
    findings.push({
      id: "ungrounded",
      severity: "finding",
      title: `${ungrounded.length} of ${grounded.length} ${ungrounded.length === 1 ? "record states" : "records state"} nothing that would end ${ungrounded.length === 1 ? "it" : "them"}`,
      detail:
        "A belief, authorization or action with an empty invalidated_by cannot be revised, only replaced. This is the single most common way a log satisfies every other rule and still describes a system that cannot change its mind.",
      clause: "STD-07 §3.2",
      records: ungrounded.map((record) => record.record_id),
    });
  }

  const noDependence = grounded.filter(
    (record) => !(record.depends_on ?? []).length,
  );
  if (noDependence.length) {
    findings.push({
      id: "no-dependence",
      severity: "note",
      title: `${noDependence.length} ${noDependence.length === 1 ? "record rests" : "records rest"} on nothing recorded`,
      detail:
        "Legitimate for a root belief that rests only on outside evidence. Worth checking on an authorization, where an empty depends_on means the grant does not say what justified it.",
      clause: "STD-07 §3.1",
      records: noDependence.map((record) => record.record_id),
    });
  }

  const discrepancies = records.filter(
    (record) => record.kind === "discrepancy",
  );
  const unanswered: string[] = [];
  const late: string[] = [];
  const unclocked: string[] = [];
  for (const discrepancy of discrepancies) {
    const answers = answersTo(records, discrepancy.record_id);
    const clock = clockFor(records, discrepancy);
    const raisedMs = Date.parse(discrepancy.time.recorded_at);
    if (!answers.length) {
      const elapsed = Number.isNaN(raisedMs) ? 0 : asOfMs - raisedMs;
      if (clock === null || elapsed > clock.ms)
        unanswered.push(discrepancy.record_id);
      continue;
    }
    if (clock === null) {
      unclocked.push(discrepancy.record_id);
      continue;
    }
    const earliest = Math.min(
      ...answers
        .map((answer) => Date.parse(answer.time.recorded_at))
        .filter((ms) => !Number.isNaN(ms)),
    );
    if (
      Number.isFinite(earliest) &&
      !Number.isNaN(raisedMs) &&
      earliest - raisedMs > clock.ms
    ) {
      late.push(discrepancy.record_id);
    }
  }

  if (unanswered.length) {
    findings.push({
      id: "unanswered-discrepancy",
      severity: "blocking",
      title: `${unanswered.length} ${unanswered.length === 1 ? "discrepancy was" : "discrepancies were"} never answered`,
      detail:
        "A discrepancy matching an invalidation condition owes a revision or an objection within the condition's clock. This is the only obligation in the standard carrying a deadline, and it is what separates a system that notices from a system that acts.",
      clause: "STD-07 §3.3",
      records: unanswered,
    });
  }
  if (late.length) {
    findings.push({
      id: "late-answer",
      severity: "finding",
      title: `${late.length} ${late.length === 1 ? "discrepancy was" : "discrepancies were"} answered after the clock ran out`,
      detail: "Answered, but outside the window the record itself declared.",
      clause: "STD-07 §3.3",
      records: late,
    });
  }
  if (unclocked.length) {
    findings.push({
      id: "no-clock",
      severity: "note",
      title: `${unclocked.length} answered ${unclocked.length === 1 ? "discrepancy has" : "discrepancies have"} no clock to be judged against`,
      detail:
        "Answered, and nothing in the stream says by when it should have been. A condition without a clock cannot be late.",
      clause: "STD-07 §3.2",
      records: unclocked,
    });
  }

  // ── Level 3: standing declared, and objections actually answered ──────────
  const noStanding = records.filter((record) => !record.contest?.standing);
  const objections = records.filter((record) => record.kind === "objection");

  // ── What the stream earns ─────────────────────────────────────────────────
  const blockedFrom: ConformanceReport["blockedFrom"] = [];
  let earnedLevel: EarnedLevel | null = null;

  if (!records.length) {
    // Nothing parsed: no level is earned and none is blocked.
  } else if (rejected.length) {
    earnedLevel = null;
    blockedFrom.push({
      level: 0,
      because: "some entries do not validate against the schema",
    });
  } else {
    earnedLevel = 0;
    const level1Broken =
      tampered.length > 0 ||
      chainBreaks.length > 0 ||
      unhashed.length > 0 ||
      unlinked.length > 0;
    if (level1Broken) {
      blockedFrom.push({
        level: 1,
        because: tampered.length
          ? "a record does not hash to the value stored on it"
          : chainBreaks.length
            ? "the chain does not link"
            : "not every record is hashed and chained",
      });
    } else {
      earnedLevel = 1;
      const level2Broken = ungrounded.length > 0 || unanswered.length > 0;
      if (level2Broken) {
        blockedFrom.push({
          level: 2,
          because: ungrounded.length
            ? "a belief, authorization or action states nothing that would end it"
            : "a discrepancy was never answered",
        });
      } else {
        earnedLevel = 2;
        if (noStanding.length) {
          blockedFrom.push({
            level: 3,
            because: `${noStanding.length} records declare no standing to object`,
          });
        } else if (!objections.length) {
          blockedFrom.push({
            level: 3,
            because:
              "no objection appears in this stream, so acceptance from outside cannot be observed",
          });
        } else {
          earnedLevel = 3;
        }
      }
    }
  }

  if (manifestError) {
    findings.push({
      id: "manifest-unreadable",
      severity: "finding",
      title: "The manifest could not be read",
      detail: `${manifestError}. The stream was audited on its own; nothing was checked against a declaration.`,
      clause: "STD-07 §6",
      records: [],
    });
  }

  if (declaration) {
    findings.push(
      ...compareDeclaration(declaration, { parsed: records.length, kinds }),
    );
  }

  if (
    declaredLevel !== null &&
    earnedLevel !== null &&
    declaredLevel > earnedLevel
  ) {
    findings.unshift({
      id: "overclaimed",
      severity: "blocking",
      title: `Declared Level ${declaredLevel}, earned Level ${earnedLevel}`,
      detail:
        "The standard's own adoption note is that declaring a level honestly is conformance and claiming one the log has not earned is not. Lower the declaration or fix what blocks the level.",
      clause: "STD-07 §6",
      records: [],
    });
  }

  const earnedLabel =
    earnedLevel === null
      ? "No level: the stream does not validate"
      : `Level ${earnedLevel} — ${CONFORMANCE_LEVELS[earnedLevel]}`;

  const blocking = findings.filter(
    (finding) => finding.severity === "blocking",
  ).length;
  const verdict = !records.length
    ? "Nothing to audit yet."
    : declaredLevel !== null &&
        earnedLevel !== null &&
        declaredLevel > earnedLevel
      ? `This stream earns Level ${earnedLevel} and its emitter claims Level ${declaredLevel}.`
      : blocking
        ? `${blocking} blocking ${blocking === 1 ? "finding" : "findings"} in ${records.length} records.`
        : `${records.length} records, no blocking findings.`;

  return {
    parsed: records.length,
    rejected,
    kinds,
    findings,
    earnedLevel,
    earnedLabel,
    declaredLevel,
    declaration,
    manifestError,
    blockedFrom,
    verdict,
    asOf,
  };
}
