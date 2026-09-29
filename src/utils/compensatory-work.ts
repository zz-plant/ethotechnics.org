/**
 * The compensatory work ledger's two tests, as code.
 *
 * Classification separates compensation from discretion and craft using the
 * performer's answers to four questions. The intervention test separates
 * removing a demand from making it easier to absorb by counting how often the
 * trigger occurs, not how often the work is done. Both return "unresolved" or
 * "accommodation" when the evidence does not support a stronger reading.
 *
 * Proposed in docs/planning/compensatory-work-protocol-2026-09.md.
 */
export type Refusal =
  "falls_on_performer" | "falls_on_others" | "no_consequence" | "unknown";
export type Replacement =
  "would_use_formal_route" | "would_keep_doing" | "unknown";
export type Ownership =
  "controls_and_credited" | "controls_only" | "credited_only" | "neither";
export type TimeBasis = "paid" | "unpaid" | "personal" | "mixed";
export type Awareness = "yes" | "no" | "unknown";
export type FixDecision =
  "fix_funded" | "fix_declined" | "not_considered" | "unknown";
export type AuthorityOverConditions =
  | "management_only"
  | "management_after_consultation"
  | "shared_binding"
  | "performers";
export type Objective = "reduce_dependence" | "ease_or_sustain_burden";

export type ItemClassification =
  "compensation" | "discretion" | "craft" | "coerced_craft" | "unresolved";

export type InterventionOutcome =
  "removal" | "reduction_at_source" | "transfer" | "accommodation";

export type ClassificationTests = {
  refusal: Refusal;
  replacement: Replacement;
  ownership: Ownership;
  institution_depends: boolean;
  described_as_chosen: boolean;
};

export type LedgerItem = {
  item_id: string;
  time_basis: TimeBasis;
  tests: ClassificationTests;
  classification: ItemClassification;
  institution_position: { aware: Awareness; decision: FixDecision };
};

export type InterventionReview = {
  intervention_id: string;
  item_id: string;
  trigger_count_before: number;
  trigger_count_after: number;
  residue_item_ids: string[];
  reversal_result: "returned" | "stayed_away" | "not_tested";
  preservation: {
    performance: "improved" | "unchanged" | "worsened" | "not_measured";
    discretion_items_lost: number;
    surge_response: "improved" | "unchanged" | "worsened" | "not_measured";
  };
  outcome: InterventionOutcome;
  stated_objective: Objective;
};

export type Ledger = {
  authority: { over_conditions: AuthorityOverConditions };
  items: LedgerItem[];
  interventions?: InterventionReview[];
};

/** A trigger count at or below this share of baseline counts as near zero. */
export const REMOVAL_SHARE = 0.05;

export const classifyItem = (
  item: Pick<LedgerItem, "time_basis" | "tests">,
): ItemClassification => {
  const { refusal, replacement, ownership, institution_depends } = item.tests;

  // The refusal answer is the one people most often cannot give safely, and
  // replacement decides which side of the test the item falls on. Without
  // both, do not guess.
  if (refusal === "unknown" || replacement === "unknown") return "unresolved";

  // Reads as choice, but declining is penalized or the institution relies on
  // work done on the performer's own time.
  const unpaid = item.time_basis === "unpaid" || item.time_basis === "personal";
  if (
    item.tests.described_as_chosen &&
    (refusal === "falls_on_performer" || (unpaid && institution_depends))
  ) {
    return "coerced_craft";
  }

  // Compensation does not require that a metric count the work. An
  // institution can benefit from work it never formally relies on.
  if (replacement === "would_use_formal_route") {
    return ownership === "neither" && refusal !== "no_consequence"
      ? "compensation"
      : "unresolved";
  }

  if (!institution_depends) return "craft";
  return ownership === "controls_and_credited" ? "discretion" : "unresolved";
};

export const classifyIntervention = (
  review: Pick<
    InterventionReview,
    | "trigger_count_before"
    | "trigger_count_after"
    | "residue_item_ids"
    | "reversal_result"
  >,
): InterventionOutcome => {
  // Work that returns when the intervention is withdrawn means the
  // intervention was carrying the load.
  if (review.reversal_result === "returned") return "accommodation";
  if (review.residue_item_ids.length > 0) return "transfer";
  if (review.trigger_count_after >= review.trigger_count_before) {
    return "accommodation";
  }
  if (
    review.trigger_count_after <=
    review.trigger_count_before * REMOVAL_SHARE
  ) {
    return "removal";
  }
  return "reduction_at_source";
};

/**
 * Whether the outcome achieves what the intervention set out to do. Easing a
 * burden is not the same objective as removing the dependence on it, so an
 * accommodation meets the first and never the second.
 */
export const meetsStatedObjective = (
  review: Pick<InterventionReview, "outcome" | "stated_objective">,
): boolean =>
  review.stated_objective === "reduce_dependence"
    ? review.outcome === "removal" || review.outcome === "reduction_at_source"
    : review.outcome !== "transfer";

/** A redesign that lowers load while lowering any preserved quantity. */
export const hasTradeoff = (review: InterventionReview): boolean =>
  review.preservation.performance === "worsened" ||
  review.preservation.surge_response === "worsened" ||
  review.preservation.discretion_items_lost > 0;

export type LedgerSummary = {
  total: number;
  byClass: Record<ItemClassification, number>;
  /** Share left unresolved. Reported alongside, never folded into a side. */
  unresolvedShare: number;
  /** Items the institution knows about and has decided not to fix. */
  knownAndKept: number;
  /**
   * True when the institution knowingly keeps at least one item and the
   * people carrying the work do not hold binding authority. A signal that the
   * obstacle may be a conflict of interest rather than missing information.
   * It does not establish one.
   */
  conflictOfInterestSignal: boolean;
};

export const summarizeLedger = (
  ledger: Pick<Ledger, "items" | "authority">,
): LedgerSummary => {
  const byClass: Record<ItemClassification, number> = {
    compensation: 0,
    discretion: 0,
    craft: 0,
    coerced_craft: 0,
    unresolved: 0,
  };
  for (const item of ledger.items) byClass[item.classification] += 1;
  const total = ledger.items.length;
  const knownAndKept = ledger.items.filter(
    (item) =>
      item.institution_position.aware === "yes" &&
      item.institution_position.decision === "fix_declined",
  ).length;
  const performersBind =
    ledger.authority.over_conditions === "shared_binding" ||
    ledger.authority.over_conditions === "performers";
  return {
    total,
    byClass,
    unresolvedShare: total === 0 ? 0 : byClass.unresolved / total,
    knownAndKept,
    conflictOfInterestSignal: knownAndKept > 0 && !performersBind,
  };
};

/** Consistency problems the JSON schema cannot express. Empty when clean. */
export const checkLedger = (ledger: Ledger): string[] => {
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const item of ledger.items) {
    if (ids.has(item.item_id)) problems.push(`duplicate item ${item.item_id}`);
    ids.add(item.item_id);
    const derived = classifyItem(item);
    if (derived !== item.classification) {
      problems.push(
        `${item.item_id}: recorded ${item.classification}, tests give ${derived}`,
      );
    }
  }

  for (const review of ledger.interventions ?? []) {
    const label = review.intervention_id;
    if (!ids.has(review.item_id)) {
      problems.push(`${label}: unknown item ${review.item_id}`);
    }
    for (const residue of review.residue_item_ids) {
      if (!ids.has(residue))
        problems.push(`${label}: unknown residue ${residue}`);
    }
    if (!(review.trigger_count_before > 0)) {
      problems.push(`${label}: baseline trigger count must be above zero`);
      continue;
    }
    const derived = classifyIntervention(review);
    if (derived !== review.outcome) {
      problems.push(
        `${label}: recorded ${review.outcome}, tests give ${derived}`,
      );
    }
  }

  return problems;
};
