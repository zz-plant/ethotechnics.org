/**
 * Picks the casebook case and the law that close a deep page.
 *
 * A reader who lands on a glossary entry, an explainer, or a failure page
 * from search has read one idea. The page should end by showing where that
 * idea broke in public and naming the law it maps to. The choice has to be
 * deterministic, so the same page always shows the same case.
 *
 * Two steps:
 * 1. Map the page's topic to one of the six state variables by keyword stems.
 * 2. Among cases where that variable failed, take the one with the fewest
 *    failed variables: the case where this variable is the clearest cause.
 *    Ties go to casebook order. No failed case, or no topic match, falls
 *    back to Robodebt.
 */
import {
  cases,
  type Case,
  type Finding,
  type LawId,
  type StateVariableId,
} from "../content/casebook";

export const FALLBACK_CASE_SLUG = "robodebt";

/**
 * Word stems per variable. A token matches when it starts with the stem.
 * Order matters only for ties: earlier variables win.
 */
export const variableStems: Record<StateVariableId, readonly string[]> = {
  capability: [
    "capabilit",
    "capacity",
    "model",
    "automat",
    "accura",
    "predict",
    "algorithm",
  ],
  authority: [
    "authorit",
    "delegat",
    "permission",
    "mandate",
    "owner",
    "accountab",
    "lease",
    "grant",
    "legitima",
    "oversight",
  ],
  evidence: [
    "evidence",
    "record",
    "audit",
    "trace",
    "proof",
    "memory",
    "receipt",
    "metric",
    "measur",
    "verif",
  ],
  dependency: [
    "dependen",
    "lock",
    "exit",
    "substitut",
    "capture",
    "ratchet",
    "vendor",
    "extract",
    "relian",
    "debris",
  ],
  standing: [
    "standing",
    "contest",
    "appeal",
    "recourse",
    "redress",
    "challeng",
    "grievance",
    "explain",
    "notice",
    "consent",
    "language",
    "right",
    "complain",
    "burden",
  ],
  correction: [
    "correct",
    "repair",
    "remed",
    "revers",
    "rollback",
    "halt",
    "stop",
    "interrupt",
    "pause",
    "undo",
    "safety",
    "valve",
    "harm",
    "freeze",
    "stuck",
    "escalat",
  ],
};

const variableOrder = Object.keys(variableStems) as StateVariableId[];

/** The state variable a page's topic text points at, or undefined. */
export function variableForTopic(
  ...parts: (string | undefined | null)[]
): StateVariableId | undefined {
  const tokens = parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

  let best: StateVariableId | undefined;
  let bestScore = 0;
  for (const variable of variableOrder) {
    const stems = variableStems[variable];
    const score = tokens.filter((token) =>
      stems.some((stem) => token.startsWith(stem)),
    ).length;
    if (score > bestScore) {
      best = variable;
      bestScore = score;
    }
  }
  return best;
}

export type NextStepPick = {
  entry: Case;
  finding: Finding;
  /** The law the finding cites first: the page's single next action. */
  law: LawId;
};

const failedCount = (entry: Case) =>
  entry.findings.filter((finding) => finding.verdict === "failed").length;

function toPick(entry: Case, finding: Finding): NextStepPick {
  return { entry, finding, law: finding.laws[0] ?? "I" };
}

/** The case and finding to show for a state variable. */
export function pickCase(
  variable: StateVariableId | undefined,
  source: readonly Case[] = cases,
): NextStepPick {
  const fallback =
    source.find((entry) => entry.slug === FALLBACK_CASE_SLUG) ?? source[0];
  if (!fallback) throw new Error("The casebook has no cases");

  if (variable) {
    const candidates = source
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) =>
        entry.findings.some(
          (finding) =>
            finding.variable === variable && finding.verdict === "failed",
        ),
      )
      .sort(
        (a, b) =>
          failedCount(a.entry) - failedCount(b.entry) || a.index - b.index,
      );
    const chosen = candidates[0]?.entry ?? fallback;
    const finding = chosen.findings.find((item) => item.variable === variable);
    if (finding) return toPick(chosen, finding);
  }

  const finding =
    fallback.findings.find((item) => item.verdict === "failed") ??
    fallback.findings[0];
  if (!finding) throw new Error(`${fallback.slug} has no findings`);
  return toPick(fallback, finding);
}

/** Topic text in, case and law out. */
export function pickNextStep(
  ...topic: (string | undefined | null)[]
): NextStepPick {
  return pickCase(variableForTopic(...topic));
}
