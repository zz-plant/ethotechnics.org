import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "bun:test";

import {
  checkLedger,
  classifyIntervention,
  classifyItem,
  followTheGain,
  hasTradeoff,
  meetsStatedObjective,
  summarizeLedger,
  type ClassificationTests,
  type InterventionReview,
  type Ledger,
  type TimeBasis,
} from "./compensatory-work";

const example = JSON.parse(
  readFileSync(
    join(
      import.meta.dir,
      "..",
      "..",
      "public",
      "standards",
      "examples",
      "compensatory-work-ledger.example.json",
    ),
    "utf8",
  ),
) as Ledger;

const base: ClassificationTests = {
  refusal: "falls_on_others",
  replacement: "would_use_formal_route",
  ownership: "neither",
  institution_depends: true,
  described_as_chosen: false,
};

const classify = (
  tests: Partial<ClassificationTests>,
  time_basis: TimeBasis = "paid",
) => classifyItem({ time_basis, tests: { ...base, ...tests } });

describe("classifyItem", () => {
  it("calls work compensation when the institution depends on it and nobody chose it", () => {
    expect(classify({})).toBe("compensation");
  });

  it("calls work compensation without requiring a metric to count it", () => {
    expect(classify({ institution_depends: false })).toBe("compensation");
  });

  it("does not guess when the refusal answer is missing", () => {
    expect(classify({ refusal: "unknown" })).toBe("unresolved");
  });

  it("does not guess when the replacement answer is missing", () => {
    expect(classify({ replacement: "unknown" })).toBe("unresolved");
  });

  it("keeps work the performer controls, is credited for, and would keep", () => {
    expect(
      classify({
        replacement: "would_keep_doing",
        ownership: "controls_and_credited",
        described_as_chosen: true,
      }),
    ).toBe("discretion");
  });

  it("calls chosen work no one depends on craft", () => {
    expect(
      classify({
        replacement: "would_keep_doing",
        ownership: "controls_and_credited",
        institution_depends: false,
        refusal: "no_consequence",
        described_as_chosen: true,
      }),
    ).toBe("craft");
  });

  it("treats a penalized refusal as coerced even when described as chosen", () => {
    expect(
      classify({ refusal: "falls_on_performer", described_as_chosen: true }),
    ).toBe("coerced_craft");
  });

  it("treats relied-on work done on personal time as coerced", () => {
    expect(
      classify(
        {
          replacement: "would_keep_doing",
          ownership: "controls_and_credited",
          described_as_chosen: true,
        },
        "personal",
      ),
    ).toBe("coerced_craft");
  });

  it("leaves partial ownership unresolved instead of choosing a side", () => {
    expect(classify({ ownership: "controls_only" })).toBe("unresolved");
  });
});

describe("classifyIntervention", () => {
  const review = (
    over: Partial<InterventionReview> = {},
  ): Pick<
    InterventionReview,
    | "trigger_count_before"
    | "trigger_count_after"
    | "residue_item_ids"
    | "reversal_result"
  > => ({
    trigger_count_before: 100,
    trigger_count_after: 100,
    residue_item_ids: [],
    reversal_result: "not_tested",
    ...over,
  });

  it("calls an unchanged trigger count accommodation", () => {
    expect(classifyIntervention(review())).toBe("accommodation");
  });

  it("calls a trigger count near zero removal", () => {
    expect(classifyIntervention(review({ trigger_count_after: 5 }))).toBe(
      "removal",
    );
  });

  it("calls a partial drop reduction at source", () => {
    expect(classifyIntervention(review({ trigger_count_after: 30 }))).toBe(
      "reduction_at_source",
    );
  });

  it("calls work that appears elsewhere a transfer, whatever the count", () => {
    expect(
      classifyIntervention(
        review({ trigger_count_after: 0, residue_item_ids: ["ITEM-009"] }),
      ),
    ).toBe("transfer");
  });

  it("calls work that returns on withdrawal accommodation", () => {
    expect(
      classifyIntervention(
        review({ trigger_count_after: 10, reversal_result: "returned" }),
      ),
    ).toBe("accommodation");
  });
});

describe("meetsStatedObjective", () => {
  it("does not count an accommodation as reducing dependence", () => {
    expect(
      meetsStatedObjective({
        outcome: "accommodation",
        stated_objective: "reduce_dependence",
      }),
    ).toBe(false);
  });

  it("counts an accommodation as easing a burden, and a transfer as neither", () => {
    expect(
      meetsStatedObjective({
        outcome: "accommodation",
        stated_objective: "ease_or_sustain_burden",
      }),
    ).toBe(true);
    expect(
      meetsStatedObjective({
        outcome: "transfer",
        stated_objective: "ease_or_sustain_burden",
      }),
    ).toBe(false);
  });

  it("counts removal and reduction at source as reducing dependence", () => {
    for (const outcome of ["removal", "reduction_at_source"] as const) {
      expect(
        meetsStatedObjective({
          outcome,
          stated_objective: "reduce_dependence",
        }),
      ).toBe(true);
    }
  });
});

describe("hasTradeoff", () => {
  const preserved: InterventionReview["preservation"] = {
    performance: "unchanged",
    discretion_items_lost: 0,
    surge_response: "unchanged",
  };
  const withPreservation = (
    over: Partial<InterventionReview["preservation"]>,
  ) =>
    hasTradeoff({
      ...example.interventions![0]!,
      preservation: { ...preserved, ...over },
    });

  it("is false when nothing preserved got worse", () => {
    expect(withPreservation({})).toBe(false);
  });

  it("flags lower performance, lower surge response, or lost discretion", () => {
    expect(withPreservation({ performance: "worsened" })).toBe(true);
    expect(withPreservation({ surge_response: "worsened" })).toBe(true);
    expect(withPreservation({ discretion_items_lost: 1 })).toBe(true);
  });
});

describe("the published example ledger", () => {
  it("passes the consistency check", () => {
    expect(checkLedger(example)).toEqual([]);
  });

  it("reports the unresolved share without folding it into a side", () => {
    const summary = summarizeLedger(example);
    expect(summary.total).toBe(5);
    expect(summary.byClass.unresolved).toBe(1);
    expect(summary.unresolvedShare).toBeCloseTo(0.2);
  });

  it("signals a possible conflict of interest when a known item is kept and management holds authority", () => {
    const summary = summarizeLedger(example);
    expect(summary.knownAndKept).toBe(1);
    expect(summary.conflictOfInterestSignal).toBe(true);
  });

  it("drops the signal when the people carrying the work hold binding authority", () => {
    const summary = summarizeLedger({
      ...example,
      authority: { over_conditions: "shared_binding" },
    });
    expect(summary.knownAndKept).toBe(1);
    expect(summary.conflictOfInterestSignal).toBe(false);
  });

  it("does not signal when the institution funded the fix or did not know", () => {
    const summary = summarizeLedger({
      ...example,
      items: example.items.map((item) => ({
        ...item,
        institution_position: { aware: "no", decision: "unknown" },
      })),
    });
    expect(summary.conflictOfInterestSignal).toBe(false);
  });

  it("flags a recorded classification the tests do not support", () => {
    const ledger: Ledger = {
      ...example,
      items: example.items.map((item, index) =>
        index === 0 ? { ...item, classification: "craft" } : item,
      ),
    };
    expect(checkLedger(ledger)[0]).toContain("recorded craft");
  });

  it("flags an intervention that points at an unknown item", () => {
    const ledger: Ledger = {
      ...example,
      interventions: [{ ...example.interventions![0]!, item_id: "ITEM-404" }],
    };
    expect(checkLedger(ledger).join("\n")).toContain("unknown item ITEM-404");
  });
});

describe("followTheGain", () => {
  it("names who would pay if extracted work stopped being free", () => {
    const gain = followTheGain(example);
    // ITEM-001 (compensation) and ITEM-004 (coerced craft) both book to the
    // operating budget; discretion, craft and unresolved items do not count.
    expect(gain.wouldPayIfReturned.operating_budget).toBe(2);
    expect(gain.wouldPayIfReturned.public_budget).toBe(1);
    expect(gain.wouldPayIfReturned.management_targets).toBe(1);
    expect(gain.wouldPayIfReturned.clients).toBeUndefined();
  });

  it("counts extracted items whose return is blocked", () => {
    expect(followTheGain(example).returnBlocked).toBe(2);
  });

  it("reports items whose gain side was not established", () => {
    expect(followTheGain(example).gainSideUnknown).toBe(1);
  });
});

describe("checkLedger on the gain side", () => {
  it("flags 'nothing' listed alongside a real blocker", () => {
    const ledger: Ledger = {
      ...example,
      items: example.items.map((item, index) =>
        index === 0
          ? {
              ...item,
              gain_capture: {
                ...item.gain_capture,
                send_back_blocked_by: ["nothing", "contract"],
              },
            }
          : item,
      ),
    };
    expect(checkLedger(ledger).join("\n")).toContain(
      'blocked by "nothing" alongside',
    );
  });
});
