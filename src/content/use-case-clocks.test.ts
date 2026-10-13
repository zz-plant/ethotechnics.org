import { describe, expect, it } from "bun:test";
import decisionRecord from "../../public/standards/worked-examples/decision-model-gate/decision-record.json";
import {
  clockHoursPhrase,
  receiptClocks,
  receiptClocksText,
  useCaseClocks,
} from "./use-case-clocks";

describe("use-case clocks", () => {
  it("lists each page's clocks in deadline order", () => {
    for (const set of Object.values(useCaseClocks)) {
      const hours = set.clocks.map((clock) => clock.hours);
      expect(hours.every((value) => value > 0)).toBe(true);
      expect(hours).toEqual([...hours].sort((a, b) => a - b));
    }
  });

  it("draws the decision-model gate's clocks from its published record", () => {
    expect(receiptClocks(useCaseClocks["decision-model-gate"])).toEqual(
      decisionRecord.clocks,
    );
  });

  it("writes the receipt block and the description phrase from one source", () => {
    const set = useCaseClocks["fraud-hold-delayed-notice"];
    expect(receiptClocksText(set)).toBe(
      '{ "ack": { "hours": 1 }, "review": { "hours": 12 }, "remedy": { "hours": 48 } }',
    );
    expect(JSON.parse(receiptClocksText(set, 2))).toEqual(receiptClocks(set));
    expect(clockHoursPhrase(set)).toBe("1-, 12-, and 48-hour");
  });
});
