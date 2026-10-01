/**
 * The short comparison the home page and the About page both show: what an
 * existing framework says, beside what these standards require. One source,
 * so a correction to a framework's wording or a clause reaches both pages.
 * The longer analysis lives at /standards#comparison.
 *
 * `says` paraphrases the framework in its own imperative; `source` names the
 * article or clause. `requires` is a noun phrase that reads after
 * "Ethotechnics requires".
 */
export type StandardsComparisonRow = {
  says: string;
  source: string;
  requires: string;
};

export const standardsComparisonRows: StandardsComparisonRow[] = [
  {
    says: "Contest the decision",
    source: "GDPR, Art. 22(3)",
    // STD-07 §4.2
    requires:
      "A revision or a reasoned refusal for every objection, on the record, within a set clock",
  },
  {
    says: "Review the management system at planned intervals",
    source: "ISO/IEC 42001, cl. 9.3",
    // STD-08 §1.1, §1.3
    requires:
      "A grant that expires unless someone renews it on evidence stated in advance, and a new authorization for every widening of scope",
  },
  {
    says: "Characterize impacts on individuals and communities",
    source: "NIST AI RMF, MAP 5",
    // STD-01 §7.1, STD-02 §8.4
    requires:
      "A published measure of the time the system costs people, and standing for whoever absorbs its errors",
  },
  {
    says: "Maintain human oversight",
    source: "EU AI Act, Art. 14",
    requires:
      "A named person with authority to halt it, a tested halt path, and a recovery deadline",
  },
  {
    says: "Implement responsible AI principles",
    source: "OECD AI Principles",
    requires:
      "Binding escalation: a named owner, a deadline, and a set action, or the system falls back to a safe mode",
  },
];
