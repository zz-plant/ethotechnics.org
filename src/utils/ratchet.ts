/**
 * The automation ratchet, Law XI: scope grows by accretion, each step too
 * small to trigger review, until the delegation bears no relation to what was
 * justified.
 *
 * Two grants grow by the same amount. One grows under a review that fires
 * when a single step is large enough, and the steps never are. The other
 * grows under STD-08 Part A, where every widening is its own authorization
 * and lands in state_history as an expansion transition. The transition
 * reason is hardcoded here so the figure does not carry the schema; the test
 * holds it to authority-grant.schema.json.
 */

export type RatchetParams = {
  months: number;
  /** Scope added each month, in percent. */
  stepPct: number;
  /** The smallest single step that opens a review, in percent. */
  reviewThresholdPct: number;
};

export const RATCHET: RatchetParams = {
  months: 36,
  stepPct: 2,
  reviewThresholdPct: 5,
};

/** The state_history reason STD-08 records for a widening. */
export const EXPANSION_REASON = "expansion";

export type Accretion = {
  /** Scope as a multiple of the original grant, month by month, from month 0. */
  scope: number[];
  /** Months in which a single step reached the review threshold. */
  reviewsFired: number;
  finalScope: number;
};

export function accrete(params: RatchetParams = RATCHET): Accretion {
  const scope: number[] = [1];
  let reviewsFired = 0;
  for (let month = 1; month <= params.months; month += 1) {
    scope.push(scope[month - 1] * (1 + params.stepPct / 100));
    if (params.stepPct >= params.reviewThresholdPct) reviewsFired += 1;
  }
  return { scope, reviewsFired, finalScope: scope[params.months] };
}

export type HistoryEntry = {
  from: "none" | "allowed";
  to: "allowed";
  reason: "issued" | typeof EXPANSION_REASON;
  note: string;
};

/** The history a grant keeps when every widening is a decision. */
export function authorizedHistory(
  params: RatchetParams = RATCHET,
): HistoryEntry[] {
  const entries: HistoryEntry[] = [
    { from: "none", to: "allowed", reason: "issued", note: "scope ×1.00" },
  ];
  const { scope } = accrete(params);
  for (let month = 1; month <= params.months; month += 1) {
    entries.push({
      from: "allowed",
      to: "allowed",
      reason: EXPANSION_REASON,
      note: `+${params.stepPct}%, scope ×${scope[month].toFixed(2)}, capacity re-checked`,
    });
  }
  return entries;
}
