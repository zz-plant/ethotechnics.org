/**
 * The theater test, Law VIII: name the observation, name the state it can
 * change. If nothing is named, the observation is decorative.
 *
 * The figure on the laws page draws a dashboard the way one is usually built
 * and then asks each tile the question. A tile that passes is one wired to a
 * grant transition, and the wire emits the record STD-07 §3.3 and the harness
 * expect: a reconsideration. The trigger kinds and the target states are
 * hardcoded here so the client bundle does not carry the schemas; the test on
 * this module holds them to reconsideration.schema.json and
 * authority-grant.schema.json.
 */
import type { DiagramState } from "./grant-states";

export type TileKind = "metric" | "stream" | "oversight";

export type Tile = {
  id: string;
  title: string;
  reading: string;
  detail: string;
  kind: TileKind;
};

/** Trigger kinds a reconsideration may cite (reconsideration.schema.json). */
export const TRIGGER_KINDS = [
  "challenge",
  "review_trigger",
  "evidence_changed",
  "elapsed_time",
  "incident",
  "expansion_request",
] as const;

export type TriggerKind = (typeof TRIGGER_KINDS)[number];

export const TRIGGER_LABELS: Record<TriggerKind, string> = {
  challenge: "a challenge is filed",
  review_trigger: "a policy review trigger fires",
  evidence_changed: "the evidence changes materially",
  elapsed_time: "a clock runs out",
  incident: "an incident is opened",
  expansion_request: "an expansion is requested",
};

/**
 * The states a wire may move the grant to. Both are states the grant schema
 * allows. Neither is `allowed`: a wire that can only reaffirm in-force
 * authority has not moved the burden of proof anywhere.
 */
export const WIRE_TARGETS = [
  "review_required",
  "suspended",
] as const satisfies readonly DiagramState[];

export type WireTarget = (typeof WIRE_TARGETS)[number];

export const TARGET_LABELS: Record<WireTarget, string> = {
  review_required: "review required",
  suspended: "suspended",
};

/** The grant every wire reconsiders. One system, so the tiles read as one dashboard. */
export const GRANT_REF = "grant:prior-auth-router#3";

/**
 * Six tiles from an ordinary AI-operations dashboard. None starts wired to a
 * state, which is the premise: as usually built, the dashboard records what
 * happened and controls nothing.
 */
export const TILES: Tile[] = [
  {
    id: "error-rate",
    title: "Error rate",
    reading: "1.8%",
    detail: "down 0.3 points on last month",
    kind: "metric",
  },
  {
    id: "escalations",
    title: "Escalations",
    reading: "42",
    detail: "this week, inside the usual band",
    kind: "metric",
  },
  {
    id: "latency",
    title: "p95 latency",
    reading: "840 ms",
    detail: "objective 1,200 ms",
    kind: "metric",
  },
  {
    id: "review-coverage",
    title: "Human review",
    reading: "100%",
    detail: "every decision approved by a reviewer",
    kind: "oversight",
  },
  {
    id: "audit-log",
    title: "Audit log",
    reading: "3,214 events",
    detail: "complete and hash-chained",
    kind: "stream",
  },
  {
    id: "appeals",
    title: "Appeals open",
    reading: "17",
    detail: "oldest 31 days",
    kind: "metric",
  },
];

export type Wire = {
  tileId: string;
  trigger: TriggerKind;
  to: WireTarget;
};

/** The rule a wire states, in the words the record carries. */
export function describeWire(tile: Tile, wire: Wire): string {
  return `When ${tile.title.toLowerCase()} moves outside its band and ${TRIGGER_LABELS[wire.trigger]}, open a reconsideration of ${GRANT_REF}; the grant moves to ${TARGET_LABELS[wire.to]} until it is decided.`;
}

export type Reconsideration = {
  schema_version: string;
  reconsideration_id: string;
  trigger: { kind: TriggerKind; ref: string };
  subject: { kind: "grant"; ref: string };
  opened_at: string;
  outcome: "pending";
  evidence_delta: string;
  decided_by: string;
  resulting_refs: string[];
};

/**
 * The record a wired tile emits when it fires. Opened, not decided: the wire's
 * job is to get the observation into the governing state, and the decision is
 * the issuer's.
 */
export function buildReconsideration(
  tile: Tile,
  wire: Wire,
  openedAt: string,
  sequence: number,
): Reconsideration {
  return {
    schema_version: "1.0.0",
    reconsideration_id: `rec-${tile.id}-${sequence}`,
    trigger: { kind: wire.trigger, ref: `${tile.id}@${openedAt}` },
    subject: { kind: "grant", ref: GRANT_REF },
    opened_at: openedAt,
    outcome: "pending",
    evidence_delta: `${tile.title} read ${tile.reading} (${tile.detail}). ${describeWire(tile, wire)}`,
    decided_by: "the issuing authority named on the grant",
    resulting_refs: [`${GRANT_REF}: allowed → ${wire.to}`],
  };
}

export function findTile(id: string): Tile | undefined {
  return TILES.find((tile) => tile.id === id);
}
