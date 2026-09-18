import { describe, expect, it } from "bun:test";

import { glossaryContent } from "../content/glossary";
import { findGlossaryFiller } from "./glossary-filler";

describe("glossary filler detection", () => {
  it("names the generated string and the field it sits in", () => {
    expect(
      findGlossaryFiller({
        operationalTests: [
          "Auditors replay a denied request and confirm the appeal reaches a named owner.",
          "Teams can point to a concrete example that demonstrates consent latency in practice.",
        ],
        genealogy:
          "Ethotechnics uses Consent Latency to extend the g. measures & indicators vocabulary and connect governance, design, and policy teams.",
        minimumEvidence: {
          metric:
            "Metric tracked to monitor consent latency performance over time.",
        },
      }),
    ).toEqual([
      "operationalTests[1]: operational test generated from the term",
      "genealogy: genealogy generated from the category",
      "minimumEvidence.metric: minimum-evidence metric generated from the term",
    ]);
  });

  it("leaves written content alone", () => {
    expect(
      findGlossaryFiller({
        operationalTests: [
          "A revoked consent stops downstream processing within the stated clock.",
        ],
        genealogy:
          "Adapts engineering load paths to accountability so responsibility stays traceable across handoffs.",
        minimumEvidence: {
          metric: "Median hours from revocation to last use.",
        },
      }),
    ).toEqual([]);
  });

  it("finds none in the shipped glossary", () => {
    const findings = glossaryContent.categories.flatMap((category) =>
      category.entries.flatMap((entry) =>
        findGlossaryFiller(entry).map((finding) => `${entry.id} — ${finding}`),
      ),
    );

    expect(findings).toEqual([]);
  });
});
