import { describe, expect, it } from "bun:test";

import { formatDate, formatDatesInText, formatMonth } from "./dates";

describe("formatDate", () => {
  it("writes compact dates with an abbreviated month and no period", () => {
    expect(formatDate("2026-10-02")).toBe("Oct 2, 2026");
    expect(formatDate("2026-09-06")).toBe("Sep 6, 2026");
  });

  it("writes prose dates with the full month in American order", () => {
    expect(formatDate("2020-08-17", "prose")).toBe("August 17, 2020");
  });

  it("reads a bare date as UTC, whatever the runner's time zone", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
    expect(formatDate("2026-10-06T00:00:00.000Z")).toBe("Oct 6, 2026");
    expect(formatDate(new Date(Date.UTC(2025, 11, 31)))).toBe("Dec 31, 2025");
  });

  it("returns a value that is not a date as passed", () => {
    expect(formatDate("TBD")).toBe("TBD");
    expect(formatDate("October 3, 2026")).toBe("October 3, 2026");
  });
});

describe("formatMonth", () => {
  it("formats a YYYY-MM value", () => {
    expect(formatMonth("2026-09")).toBe("Sep 2026");
    expect(formatMonth("2026-09", "prose")).toBe("September 2026");
  });

  it("formats the month of a full date", () => {
    expect(formatMonth("2027-06-30", "prose")).toBe("June 2027");
  });
});

describe("formatDatesInText", () => {
  it("rewrites each ISO date in free text", () => {
    expect(formatDatesInText("Withdrawn 2026-02-15")).toBe(
      "Withdrawn Feb 15, 2026",
    );
    expect(
      formatDatesInText("published 2026-09-18, revised 2026-10-01", "prose"),
    ).toBe("published September 18, 2026, revised October 1, 2026");
  });

  it("leaves IDs that only look like part of a date alone", () => {
    expect(formatDatesInText("DEC-2026-10-01")).toBe("DEC-2026-10-01");
  });
});
