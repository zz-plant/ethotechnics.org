import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "bun:test";

import {
  checkLedger,
  classifyIntervention,
  classifyItem,
  hasTradeoff,
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
