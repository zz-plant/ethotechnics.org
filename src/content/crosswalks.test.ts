import { describe, expect, test } from "bun:test";

import {
  euAiActArticleCoverage,
  governanceCrosswalks,
  resolveClause,
} from "./crosswalks";

// The control briefs and the EU AI Act table cite clauses by registry id and
// tell buyers to put them in contracts. A clause renumbered or withdrawn in
// src/content/standards.ts would leave a citation pointing at nothing.
describe("crosswalk clause citations", () => {
  const cited = [
    ...governanceCrosswalks.flatMap((control) =>
      control.clauseIds.map((id) => [control.controlId, id] as const),
    ),
    ...euAiActArticleCoverage.flatMap((row) =>
      row.clauseIds.map((id) => [row.article, id] as const),
    ),
  ];

  test.each(cited)("%s cites %s, which is in the clause register", (_, id) => {
    expect(resolveClause(id)).toBeDefined();
  });

  test("every control rests on at least one clause", () => {
    for (const control of governanceCrosswalks) {
      expect(control.clauseIds.length).toBeGreaterThan(0);
    }
  });
});
