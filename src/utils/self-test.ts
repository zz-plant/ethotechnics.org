import type { StateVariableId } from "../content/casebook";

/**
 * The home page self-test: the six state variables, each restated as one
 * question a team can answer about its own system in a few seconds. A "yes"
 * means the variable is still coupled; "no" and "not sure" both count as
 * drift, because a coupling nobody can vouch for is not holding anything.
 *
 * Answers round-trip through the URL hash (`#self-test=ynuyyn`) so a result
 * can be sent to the person who can fix it.
 */

export type SelfTestAnswer = "y" | "n" | "u";

export type SelfTestQuestion = {
  variable: StateVariableId;
  label: string;
  question: string;
  /** What a "no" means, in the reader's terms. */
  ifNo: string;
};

export const selfTestQuestions: SelfTestQuestion[] = [
  {
    variable: "correction",
    label: "Correction",
    question:
      "If it were harming people right now, could a named person halt it within a day?",
    ifNo: "Harm can be seen but not stopped.",
  },
  {
    variable: "standing",
    label: "Standing",
    question:
      "Can someone it decided about challenge the decision and get a human answer by a set date?",
    ifNo: "People are affected faster than anyone can object.",
  },
  {
    variable: "authority",
    label: "Authority",
    question:
      "Does its permission to act have a written end date or review trigger?",
    ifNo: "Its approval outlives the reasons for it.",
  },
  {
    variable: "evidence",
    label: "Evidence",
    question:
      "Could you produce today the evidence that justified switching it on, and is that evidence still true?",
    ifNo: "The rule no longer matches what is true.",
  },
  {
    variable: "capability",
    label: "Capability",
    question:
      "Was it re-approved the last time it got faster, broader, or more automated?",
    ifNo: "It does more than anyone approved.",
  },
  {
    variable: "dependency",
    label: "Dependency",
    question:
      "Could you switch it off tomorrow without the service it supports falling over?",
    ifNo: "It is too embedded to switch off in time.",
  },
];

const ANSWERS = new Set<SelfTestAnswer>(["y", "n", "u"]);

/** Parse `ynu…` into one answer per question, or undefined if malformed. */
export function decodeAnswers(
  encoded: string,
): (SelfTestAnswer | undefined)[] | undefined {
  if (encoded.length === 0 || encoded.length > selfTestQuestions.length) {
    return undefined;
  }
  const answers = selfTestQuestions.map((_, index) => {
    const char = encoded[index];
    return char && ANSWERS.has(char as SelfTestAnswer)
      ? (char as SelfTestAnswer)
      : undefined;
  });
  const recognized = [...encoded].every(
    (char) => ANSWERS.has(char as SelfTestAnswer) || char === "-",
  );
  return recognized ? answers : undefined;
}

export function encodeAnswers(
  answers: (SelfTestAnswer | undefined)[],
): string {
  return selfTestQuestions.map((_, index) => answers[index] ?? "-").join("");
}

export type SelfTestResult = {
  answered: number;
  holding: number;
  drifting: SelfTestQuestion[];
  complete: boolean;
};

export function scoreAnswers(
  answers: (SelfTestAnswer | undefined)[],
): SelfTestResult {
  const drifting: SelfTestQuestion[] = [];
  let answered = 0;
  let holding = 0;
  selfTestQuestions.forEach((question, index) => {
    const answer = answers[index];
    if (!answer) return;
    answered += 1;
    if (answer === "y") holding += 1;
    else drifting.push(question);
  });
  return {
    answered,
    holding,
    drifting,
    complete: answered === selfTestQuestions.length,
  };
}

/**
 * For each question, the public case that shows what a "no" costs. Prefers a
 * case where the variable failed outright, then one where it drifted, and
 * spreads the picks across the casebook so six answers do not all point at
 * the same case.
 */
export function caseForEachQuestion<
  C extends {
    slug: string;
    findings: { variable: StateVariableId; verdict: string }[];
  },
>(entries: C[]): Map<StateVariableId, C | undefined> {
  const used = new Set<string>();
  const picks = new Map<StateVariableId, C | undefined>();
  for (const question of selfTestQuestions) {
    const withVerdict = (verdict: string) =>
      entries.filter((entry) =>
        entry.findings.some(
          (finding) =>
            finding.variable === question.variable &&
            finding.verdict === verdict,
        ),
      );
    const candidates = [...withVerdict("failed"), ...withVerdict("drifted")];
    const pick =
      candidates.find((entry) => !used.has(entry.slug)) ?? candidates[0];
    if (pick) used.add(pick.slug);
    picks.set(question.variable, pick);
  }
  return picks;
}

/** One sentence that tells the reader where they stand. */
export function verdictLine(result: SelfTestResult): string {
  const total = selfTestQuestions.length;
  const drift = result.drifting.length;
  if (drift === 0) {
    return `All ${total} hold. Check that someone other than you would answer the same way.`;
  }
  if (drift === total) {
    return `None of the ${total} hold. Robodebt failed on four of these and ran for three years.`;
  }
  if (drift >= 4) {
    return `${drift} of ${total} are drifting. Four of the five public failures in the casebook drifted on at least four.`;
  }
  return `${drift} of ${total} ${drift === 1 ? "is" : "are"} drifting. Fix ${drift === 1 ? "it" : "them"} before the system grows.`;
}
