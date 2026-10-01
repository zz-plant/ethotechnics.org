/**
 * What the frameworks a reader already answers to ask for, beside what the
 * drafts here add. The home page and /about each used to carry their own copy
 * of this table, both saying the others never ask whether a system can be
 * stopped. That was wrong: the EU AI Act, the NIST AI RMF, and the OECD
 * principles each ask for a way to stop or override a system. What they leave
 * to the operator is who holds the stop, how fast it works, and what record
 * shows it worked. One list, so the two pages cannot drift apart again.
 */
export type FrameworkComparisonRow = {
  /** The framework and the provision paraphrased in `asks`. */
  source: string;
  asks: string;
  adds: string;
};

export const frameworkComparison: FrameworkComparisonRow[] = [
  {
    source: "EU AI Act, Art. 14(4)(e)",
    asks: "Oversight staff can interrupt a high-risk AI system through a stop button or a similar procedure.",
    adds: "A named person holds the stop, the halt path is drilled on production, and a recovery clock starts when it is used.",
  },
  {
    source: "NIST AI RMF, MANAGE 2.4",
    asks: "Mechanisms and assigned responsibilities exist to supersede, disengage, or deactivate a system that behaves outside its intended use.",
    adds: "A bound on how long harm can run before that happens, measured in drills rather than asserted in a policy.",
  },
  {
    source: "ISO/IEC 42001, clauses 9 and 10",
    asks: "The AI management system is audited, reviewed by management, and improved.",
    adds: "Evidence from the running system that a stop works mid-incident, not only that the management system passed its audit.",
  },
  {
    source: "OECD AI Principles, 1.4 (2024)",
    asks: "Systems that risk undue harm can be overridden, repaired, or decommissioned safely by human intervention.",
    adds: "Escalation with an owner, a timer, and an action, so the system degrades if nobody answers in time.",
  },
];
