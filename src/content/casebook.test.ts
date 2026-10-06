import { describe, expect, it } from "bun:test";

import {
  cases,
  clauseHref,
  haltSpanDays,
  stateVariables,
  verdictTally,
} from "./casebook";
import { standardClauses, standardsContent } from "./standards";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Every year a `when` names: "2017–19" is 2017 and 2019. */
function yearsIn(when: string): string[] {
  const years: string[] = [];
  for (const match of when.matchAll(/\b(\d{4})(?:[–-](\d{2,4}))?\b/g)) {
    const [, start, end] = match;
    if (!start) continue;
    years.push(start);
    if (end) years.push(end.length === 2 ? `${start.slice(0, 2)}${end}` : end);
  }
  return years;
}

/** The start of a `when`, as a year and, where named, a month index. */
function startOf(when: string): { year: number; month?: number } {
  const match = /(?:\b([A-Z][a-z]{2}) )?(\d{4})/.exec(when);
  const month = match?.[1] ? months.indexOf(match[1]) : -1;
  return {
    year: Number(match?.[2]),
    ...(month >= 0 ? { month } : {}),
  };
}

const lawIds = new Set([
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
]);

describe("casebook", () => {
  it("scores every case on every state variable exactly once", () => {
    for (const entry of cases) {
      const scored = entry.findings.map((finding) => finding.variable);
      expect(new Set(scored).size).toBe(scored.length);
      expect(scored.sort()).toEqual(
        stateVariables.map((variable) => variable.id).sort(),
      );
    }
  });

  it("pins every clause reference to a clause in the register", () => {
    for (const entry of cases) {
      for (const finding of entry.findings) {
        expect(finding.clauses.length).toBeGreaterThan(0);
        for (const ref of finding.clauses) {
          const register = standardClauses[ref.standard];
          expect(
            register,
            `${entry.slug}: ${ref.standard} has no register`,
          ).toBeDefined();
          const clause = register?.find(
            (candidate) => candidate.displayId === ref.clause,
          );
          expect(
            clause,
            `${entry.slug}/${finding.variable}: ${ref.standard} ${ref.clause} is not in the register`,
          ).toBeDefined();
        }
      }
    }
  });

  it("cites only the twelve laws", () => {
    for (const entry of cases) {
      for (const finding of entry.findings) {
        expect(finding.laws.length).toBeGreaterThan(0);
        for (const law of finding.laws) expect(lawIds.has(law)).toBe(true);
      }
    }
  });

  it("links clauses to a standard that has a published page", () => {
    for (const entry of cases) {
      for (const finding of entry.findings) {
        for (const ref of finding.clauses) {
          const standard = standardsContent.standards.find(
            (candidate) => candidate.id === ref.standard,
          );
          expect(standard?.listedOnSite).not.toBe(false);
          expect(clauseHref(ref)).toBe(
            `/standards/${standard?.slug}#${ref.standard === "STD-02" ? "articles" : "clause-register"}`,
          );
        }
      }
    }
  });

  it("dates every source and keeps slugs unique", () => {
    const slugs = cases.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const entry of cases) {
      expect(entry.sources.length).toBeGreaterThan(0);
      for (const source of entry.sources) {
        expect(source.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (source.href) expect(source.href).toMatch(/^https:\/\//);
      }
    }
  });

  it("provides remediation guidance for every case with valid internal paths", () => {
    for (const entry of cases) {
      expect(entry.remediation).toBeDefined();
      expect(entry.remediation.diagnostic.name.length).toBeGreaterThan(0);
      expect(entry.remediation.diagnostic.href.startsWith("/")).toBe(true);
      expect(entry.remediation.diagnostic.purpose.length).toBeGreaterThan(0);

      expect(entry.remediation.standard.id).toMatch(/^(STD-\d+|MVC-\d+)$/);
      expect(entry.remediation.standard.name.length).toBeGreaterThan(0);
      expect(entry.remediation.standard.href).toMatch(/^\/standards\//);
      expect(entry.remediation.standard.requirement.length).toBeGreaterThan(0);

      expect(entry.remediation.theory.title.length).toBeGreaterThan(0);
      expect(entry.remediation.theory.href).toMatch(/^\/research\/theory\//);
      expect(entry.remediation.theory.question.length).toBeGreaterThan(0);
    }
  });

  it("tallies verdicts per variable", () => {
    const tally = verdictTally();
    for (const variable of stateVariables) {
      const counts = tally[variable.id];
      expect(counts.held + counts.drifted + counts.failed).toBe(cases.length);
    }
    // The casebook's own claim on the hub: standing has never held.
    expect(tally.standing.held).toBe(0);
  });

  it("names who carried the errors, with every number from the case's own record", () => {
    for (const entry of cases) {
      expect(entry.errorsCarriedBy.trim().length, entry.slug).toBeGreaterThan(
        0,
      );
      const record = [
        entry.scale,
        ...entry.narrative,
        ...entry.findings.map((finding) => finding.finding),
      ].join(" ");
      const numbers = entry.errorsCarriedBy.match(/\d[\d,.]*\d|\d/g) ?? [];
      for (const number of numbers) {
        expect(record, `${entry.slug}: ${number}`).toContain(number);
      }
    }
  });

  it("dates every timeline event from the case's own record, in order", () => {
    for (const entry of cases) {
      const events = entry.timeline ?? [];
      expect(events.length, entry.slug).toBeGreaterThanOrEqual(4);
      expect(events.length, entry.slug).toBeLessThanOrEqual(7);
      expect(events.filter((event) => event.turn).length).toBeLessThanOrEqual(
        1,
      );
      const record = [
        ...entry.narrative,
        ...entry.findings.map((finding) => finding.finding),
        entry.period,
        entry.timeToHalt,
        entry.haltedBy,
        ...entry.sources.flatMap((source) => [source.label, source.date]),
      ].join(" ");
      let previous: { year: number; month?: number } | undefined;
      for (const event of events) {
        const years = yearsIn(event.when);
        expect(years.length, `${entry.slug}: ${event.when}`).toBeGreaterThan(0);
        for (const year of years) {
          expect(record, `${entry.slug}: ${event.when}`).toContain(year);
        }
        const start = startOf(event.when);
        if (previous) {
          const label = `${entry.slug}: ${event.when} is out of order`;
          expect(start.year, label).toBeGreaterThanOrEqual(previous.year);
          if (
            start.year === previous.year &&
            start.month !== undefined &&
            previous.month !== undefined
          ) {
            expect(start.month, label).toBeGreaterThanOrEqual(previous.month);
          }
        }
        previous = start;
      }
    }
  });
});

const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  seventeen: 17,
  twenty: 20,
};

const daysPer: Record<string, number> = {
  day: 1,
  month: 365.25 / 12,
  year: 365.25,
};

/** "Three years and four months" as days, for a tolerance check. */
function proseDays(label: string): number {
  let total = 0;
  for (const match of label
    .toLowerCase()
    .matchAll(/\b([a-z]+) (day|month|year)s?\b/g)) {
    const [, word, unit] = match;
    const count = word ? numberWords[word] : undefined;
    if (count !== undefined && unit) total += count * (daysPer[unit] ?? 0);
  }
  return total;
}

type DateParts = { year: number; month?: number; day?: number };

/** A `when` ("2016", "Jul 2016", "13 Aug 2020") as the parts it names. */
function dateOf(when: string): DateParts {
  const match = /^(?:(\d{1,2}) )?(?:([A-Z][a-z]{2}) )?(\d{4})/.exec(when);
  const month = match?.[2] ? months.indexOf(match[2]) : -1;
  return {
    year: Number(match?.[3]),
    ...(month >= 0 ? { month } : {}),
    ...(match?.[1] ? { day: Number(match[1]) } : {}),
  };
}

/** A partial ISO date ("2016", "2016-07", "2016-07-15") in the same shape. */
function partsOf(value: string): DateParts {
  const [year, month, day] = value.split("-").map(Number);
  return {
    year: Number(year),
    ...(month !== undefined ? { month: month - 1 } : {}),
    ...(day !== undefined ? { day } : {}),
  };
}

/** Words that carry no claim, so a paraphrase may use them freely. */
const functionWords = new Set(["a", "the", "is", "are", "was", "it", "this"]);

function wordsOf(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]+/g) ?? []).filter(
    (word) => !functionWords.has(word),
  );
}

describe("casebook time to halt", () => {
  it("stores the day count its halt span gives", () => {
    for (const entry of cases) {
      expect(entry.haltSpan.from).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(entry.haltSpan.to).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(entry.timeToHaltDays, entry.slug).toBe(
        haltSpanDays(entry.haltSpan),
      );
      expect(entry.timeToHaltDays, entry.slug).toBeGreaterThan(0);
    }
  });

  it("starts each span in the case's period and its dated timeline", () => {
    for (const entry of cases) {
      const from = partsOf(entry.haltSpan.from);
      expect(entry.period, entry.slug).toContain(String(from.year));
      if (from.month === undefined) continue;
      const dated = (entry.timeline ?? []).map((event) => dateOf(event.when));
      expect(
        dated.some(
          (date) =>
            date.year === from.year &&
            date.month === from.month &&
            (from.day === undefined || date.day === from.day),
        ),
        `${entry.slug}: ${entry.haltSpan.from} is not a timeline date`,
      ).toBe(true);
    }
  });

  it("ends each span on a dated source or timeline event, at the halt", () => {
    for (const entry of cases) {
      const to = partsOf(entry.haltSpan.to);
      const onSource = entry.sources.some(
        (source) => source.date === entry.haltSpan.to,
      );
      const onTimeline = (entry.timeline ?? [])
        .map((event) => dateOf(event.when))
        .some(
          (date) =>
            date.year === to.year &&
            date.month === to.month &&
            (to.day === undefined ||
              date.day === undefined ||
              date.day === to.day),
        );
      expect(onSource || onTimeline, entry.slug).toBe(true);
      const halt = entry.timeline?.find((event) => event.halt);
      if (halt) {
        const date = dateOf(halt.when);
        expect(to.year, entry.slug).toBe(date.year);
        expect(to.month, entry.slug).toBe(date.month);
      }
    }
  });

  it("agrees with the prose label to within a tenth", () => {
    for (const entry of cases) {
      const prose = proseDays(entry.timeToHalt);
      expect(prose, entry.slug).toBeGreaterThan(0);
      expect(
        Math.abs(entry.timeToHaltDays - prose) / prose,
        `${entry.slug}: ${entry.timeToHaltDays} days against "${entry.timeToHalt}"`,
      ).toBeLessThan(0.1);
    }
  });
});

describe("casebook timeline voices", () => {
  it("restates only what the event and narrative say", () => {
    for (const entry of cases) {
      for (const event of entry.timeline ?? []) {
        const voice = event.voice;
        if (!voice) continue;
        const source = [event.what, ...entry.narrative].join(" ");
        const known = new Set(wordsOf(source));
        const label = `${entry.slug} ${event.when}`;
        expect(source.toLowerCase(), label).toContain(
          voice.speaker.replace(/^The /, "").toLowerCase(),
        );
        for (const word of wordsOf(`${voice.said} ${voice.after ?? ""}`)) {
          expect(known.has(word), `${label}: "${word}"`).toBe(true);
        }
        if (!voice.verbatim) {
          expect(voice.said, label).not.toMatch(/["“”]/);
        }
        if (voice.side === "institution") {
          expect(voice.answered, label).toBeUndefined();
        }
      }
    }
  });
});
