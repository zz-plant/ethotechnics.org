import { describe, expect, it } from "bun:test";

import { readReviewWindow, todayIso } from "./review-window";

describe("readReviewWindow", () => {
  it("reads the closing date out of the stated window", () => {
    expect(readReviewWindow("2026-02-03 → 2026-02-24", "2026-02-10")).toEqual({
      closesOn: "2026-02-24",
      lapsed: false,
    });
  });

  it("calls a window lapsed once its closing date has passed", () => {
    expect(readReviewWindow("2026-02-03 → 2026-02-24", "2026-09-17")).toEqual({
      closesOn: "2026-02-24",
      lapsed: true,
    });
  });

  it("treats the closing day itself as still open", () => {
    expect(
      readReviewWindow("2026-02-03 → 2026-02-24", "2026-02-24").lapsed,
    ).toBe(false);
  });

  it("accepts the hyphen and dash forms the content uses", () => {
    for (const separator of ["→", "->", "–", "—"]) {
      expect(
        readReviewWindow(`2026-01-28 ${separator} 2026-02-20`, "2026-01-30")
          .closesOn,
      ).toBe("2026-02-20");
    }
  });

  it("says nothing about a window it cannot read", () => {
    expect(readReviewWindow("rolling", "2026-09-17")).toEqual({
      closesOn: null,
      lapsed: false,
    });
  });

  it("reports the date in UTC so a build does not depend on the runner", () => {
    expect(todayIso(new Date("2026-09-17T23:30:00Z"))).toBe("2026-09-17");
  });
});
