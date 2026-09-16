/**
 * The kill switch you cannot throw, computed.
 *
 * A stop control has three levels of reversibility (STD-06 Article V, Law
 * VI): technical, the switch works; operational, the people on shift can run
 * without the system inside the correction window; institutional, the
 * organization survives having done it. The controls here are fields of the
 * dependency record, the exposure score is the record's own formula, and the
 * test on this module holds the names and enums to
 * dependency-record.schema.json.
 */

export const LEVELS = ["technical", "operational", "institutional"] as const;
export type Level = (typeof LEVELS)[number];

export const REHEARSAL_OUTCOMES = [
  "succeeded",
  "partial",
  "failed",
  "not_rehearsed",
] as const;
export type RehearsalOutcome = (typeof REHEARSAL_OUTCOMES)[number];

export const ALTERNATIVE_STATUSES = [
  "available",
  "degraded",
  "removed",
] as const;
export type AlternativeStatus = (typeof ALTERNATIVE_STATUSES)[number];

export const CAPACITY_STATUSES = ["retained", "degrading", "lost"] as const;
export type CapacityStatus = (typeof CAPACITY_STATUSES)[number];

export type Inputs = {
  /** Critical dependents: workflows, roles, customers, downstream software. */
  dependents: number;
  /** Person-weeks to replace the system with the alternative. */
  substitutionWeeks: number;
  /** Roles that still hold the skills to do the work without the system. */
  expertiseRoles: number;
  /** Months since that expertise was last used in practice. */
  expertiseMonthsSince: number;
  alternative: AlternativeStatus;
  /** Hours to detect and reverse a harmful decision, end to end. */
  correctionLatencyHours: number;
  rehearsal: RehearsalOutcome;
  rehearsalMonthsSince: number;
};

/** Year one: a fresh deployment, little depends on it, people remember the old way. */
export const YEAR_ONE: Inputs = {
  dependents: 2,
  substitutionWeeks: 4,
  expertiseRoles: 3,
  expertiseMonthsSince: 2,
  alternative: "available",
  correctionLatencyHours: 8,
  rehearsal: "not_rehearsed",
  rehearsalMonthsSince: 0,
};

/** Year three: the workflow has reorganized around it, and nobody has done the work by hand since. */
export const YEAR_THREE: Inputs = {
  dependents: 9,
  substitutionWeeks: 30,
  expertiseRoles: 1,
  expertiseMonthsSince: 18,
  alternative: "degraded",
  correctionLatencyHours: 72,
  rehearsal: "not_rehearsed",
  rehearsalMonthsSince: 0,
};

/** Months after which retained expertise or a rehearsal no longer counts as current. */
export const CURRENCY_MONTHS = 12;
/** The correction window the operational level is judged against, in hours. */
export const CORRECTION_WINDOW_HOURS = 48;
/** The exposure the safety case says the institution can carry. */
export const EXPOSURE_TOLERANCE = 1500;

/** What an alternative's state does to the cost of substitution. */
export const ALTERNATIVE_MULTIPLIER: Record<AlternativeStatus, number> = {
  available: 1,
  degraded: 1.5,
  removed: 2.5,
};

export type Feasibility = { feasible: boolean; evidence: string };

export type Condition = { holds: boolean; text: string };

export type LevelReport = Feasibility & {
  level: Level;
  conditions: Condition[];
};

export type ExposureScore = {
  dependency_depth: number;
  substitution_cost: number;
  correction_latency: number;
  score: number;
};

/** STD-06 §5: score = dependency_depth × substitution_cost × correction_latency. */
export function exposureScore(inputs: Inputs): ExposureScore {
  const substitution_cost =
    inputs.substitutionWeeks * ALTERNATIVE_MULTIPLIER[inputs.alternative];
  return {
    dependency_depth: inputs.dependents,
    substitution_cost,
    correction_latency: inputs.correctionLatencyHours,
    score:
      inputs.dependents * substitution_cost * inputs.correctionLatencyHours,
  };
}

const months = (n: number) => `${n} month${n === 1 ? "" : "s"}`;

export function technical(): LevelReport {
  return {
    level: "technical",
    feasible: true,
    evidence:
      "Halt receipt in 200 ms; the effects can be undone in the system itself.",
    conditions: [
      { holds: true, text: "The switch works when pressed." },
      { holds: true, text: "The system's own effects can be reversed." },
    ],
  };
}

export function operational(inputs: Inputs): LevelReport {
  const expertiseCurrent =
    inputs.expertiseRoles > 0 && inputs.expertiseMonthsSince <= CURRENCY_MONTHS;
  const rehearsed =
    (inputs.rehearsal === "succeeded" || inputs.rehearsal === "partial") &&
    inputs.rehearsalMonthsSince <= CURRENCY_MONTHS;
  const inWindow = inputs.correctionLatencyHours <= CORRECTION_WINDOW_HOURS;
  const conditions: Condition[] = [
    {
      holds: expertiseCurrent,
      text:
        inputs.expertiseRoles === 0
          ? "No role retains the expertise to do the work without the system."
          : `${inputs.expertiseRoles} role${inputs.expertiseRoles === 1 ? " retains" : "s retain"} the expertise, last exercised ${months(inputs.expertiseMonthsSince)} ago${
              inputs.expertiseMonthsSince > CURRENCY_MONTHS
                ? ", which is no longer current"
                : ""
            }.`,
    },
    {
      holds: rehearsed,
      text:
        inputs.rehearsal === "not_rehearsed"
          ? "Withdrawal has never been rehearsed. Untested withdrawal is a claim, not a capacity."
          : `Last rehearsal ${months(inputs.rehearsalMonthsSince)} ago: ${inputs.rehearsal}${
              inputs.rehearsalMonthsSince > CURRENCY_MONTHS
                ? ", no longer current"
                : ""
            }.`,
    },
    {
      holds: inWindow,
      text: `Correction latency ${inputs.correctionLatencyHours} h against a ${CORRECTION_WINDOW_HOURS} h window.`,
    },
  ];
  const feasible = conditions.every((condition) => condition.holds);
  return {
    level: "operational",
    feasible,
    evidence: feasible
      ? "The people on shift can run the process without the system, and have."
      : conditions
          .filter((condition) => !condition.holds)
          .map((condition) => condition.text)
          .join(" "),
    conditions,
  };
}

export function institutional(inputs: Inputs): LevelReport {
  const exposure = exposureScore(inputs);
  const within = exposure.score <= EXPOSURE_TOLERANCE;
  const conditions: Condition[] = [
    {
      holds: within,
      text: `Exposure ${Math.round(exposure.score).toLocaleString("en-US")} against a stated tolerance of ${EXPOSURE_TOLERANCE.toLocaleString("en-US")}: ${exposure.dependency_depth} critical dependents × ${exposure.substitution_cost} person-weeks × ${exposure.correction_latency} h.`,
    },
    {
      holds: inputs.alternative !== "removed",
      text:
        inputs.alternative === "removed"
          ? "The alternative has been removed. There is nothing to withdraw to."
          : `An alternative is ${inputs.alternative}.`,
    },
  ];
  const feasible = conditions.every((condition) => condition.holds);
  return {
    level: "institutional",
    feasible,
    evidence: feasible
      ? "The institution can carry the withdrawal at its stated tolerance."
      : "Throwing the switch would cost more than the institution has said it can carry. A correction that will not be exercised is not part of the control system.",
    conditions,
  };
}

export function report(inputs: Inputs): Record<Level, LevelReport> {
  return {
    technical: technical(),
    operational: operational(inputs),
    institutional: institutional(inputs),
  };
}

export type Verdict = {
  thrown: boolean;
  tone: "good" | "warn" | "bad";
  text: string;
};

export function verdict(levels: Record<Level, LevelReport>): Verdict {
  const failing = LEVELS.filter((level) => !levels[level].feasible);
  if (failing.length === 0) {
    return {
      thrown: true,
      tone: "good",
      text: "Yes. The control exists, the people can exercise it, and the institution can carry it. It is part of the control system.",
    };
  }
  if (failing.length === 1 && failing[0] === "operational") {
    return {
      thrown: false,
      tone: "warn",
      text: "Not today. The switch works and the institution could carry it, but the people on shift cannot run without the system inside the window. Rehearsal is what closes this gap.",
    };
  }
  return {
    thrown: false,
    tone: "bad",
    text: "No. The switch is green at the technical level and will not be thrown. A correction mechanism that cannot be exercised without unacceptable damage is not a correction mechanism (Law VI).",
  };
}

/** A rehearsal: the institution practices withdrawing. What it learns depends on what it kept. */
export function rehearse(inputs: Inputs): Inputs {
  const canRun = inputs.expertiseRoles > 0;
  return {
    ...inputs,
    rehearsal: canRun
      ? inputs.expertiseMonthsSince > CURRENCY_MONTHS
        ? "partial"
        : "succeeded"
      : "failed",
    rehearsalMonthsSince: 0,
    expertiseMonthsSince: canRun ? 0 : inputs.expertiseMonthsSince,
    correctionLatencyHours: canRun
      ? Math.max(4, Math.round(inputs.correctionLatencyHours * 0.6))
      : inputs.correctionLatencyHours,
  };
}

/** Replenishing, Law V: keep an alternative usable and the expertise exercised. */
export function replenishAlternative(inputs: Inputs): Inputs {
  return { ...inputs, alternative: "available" };
}

export function retainExpertise(inputs: Inputs): Inputs {
  return {
    ...inputs,
    expertiseRoles: Math.max(2, inputs.expertiseRoles),
    expertiseMonthsSince: 0,
  };
}

export type PreservedCapacity = {
  capacity: string;
  status: CapacityStatus;
  last_exercised: string;
};

/** Law XII: the capacities the institution keeps so it can still withdraw, read off the inputs. */
export function preservedCapacities(inputs: Inputs): PreservedCapacity[] {
  const expertise: CapacityStatus =
    inputs.expertiseRoles === 0
      ? "lost"
      : inputs.expertiseMonthsSince > CURRENCY_MONTHS
        ? "degrading"
        : "retained";
  const alternative: CapacityStatus =
    inputs.alternative === "removed"
      ? "lost"
      : inputs.alternative === "degraded"
        ? "degrading"
        : "retained";
  const procedure: CapacityStatus =
    inputs.rehearsal === "succeeded"
      ? "retained"
      : inputs.rehearsal === "partial"
        ? "degrading"
        : "lost";
  return [
    {
      capacity: "expertise to do the work without the system",
      status: expertise,
      last_exercised:
        inputs.expertiseRoles === 0
          ? "never"
          : `${months(inputs.expertiseMonthsSince)} ago`,
    },
    {
      capacity: "a usable alternative",
      status: alternative,
      last_exercised: inputs.alternative === "removed" ? "never" : "kept",
    },
    {
      capacity: "the withdrawal procedure, rehearsed",
      status: procedure,
      last_exercised:
        inputs.rehearsal === "not_rehearsed"
          ? "never"
          : `${months(inputs.rehearsalMonthsSince)} ago`,
    },
  ];
}

/** The dependency-record excerpt the figure emits. */
export function recordExcerpt(inputs: Inputs) {
  const levels = report(inputs);
  return {
    reversibility: Object.fromEntries(
      LEVELS.map((level) => [
        level,
        { feasible: levels[level].feasible, evidence: levels[level].evidence },
      ]),
    ),
    exposure_score: exposureScore(inputs),
    last_withdrawal_rehearsal: {
      outcome: inputs.rehearsal,
      months_ago: inputs.rehearsalMonthsSince,
    },
    preserved_capacities: preservedCapacities(inputs),
  };
}
