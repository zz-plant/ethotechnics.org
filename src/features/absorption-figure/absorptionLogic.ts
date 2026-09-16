/**
 * Absorption as concealment, simulated.
 *
 * A system errs at a rate that barely moves. Around it, competent people
 * catch errors before any instrument counts them, and they catch more as the
 * system becomes central: more of them are positioned to, and a visible
 * failure costs more to report. The instrument therefore improves as the
 * dependence deepens. Nothing here is random. The wobble on the true rate is
 * a fixed function of the month, so the reveal is the same for every reader
 * and the arithmetic can be tested.
 */
import type { EvalLayer } from "../../content/evals";

export const MONTHS = 36;

/** The month at which the events happen, when the reader triggers them. */
export const EVENT_MONTH = 24;

export type Params = {
  /** Share of errors a colleague catches when positioned to, 0 to 1. */
  competence: number;
  /** The system is extended to a second site with no absorbers. */
  extend: boolean;
  /** Thirty percent of the absorbing staff are cut. */
  cut: boolean;
  /** The institution shadows its staff for a month and counts what they fix. */
  shadow: boolean;
};

export const DEFAULT_PARAMS: Params = {
  competence: 0.7,
  extend: false,
  cut: false,
  shadow: false,
};

export type MonthPoint = {
  month: number;
  /** How central the system has become, 0 to 1. */
  dependence: number;
  /** The rate the system actually errs at. */
  trueRate: number;
  /** The share of those errors caught before an instrument sees them. */
  absorbed: number;
  /** The rate the instrument reports. */
  reported: number;
  /** Decisions that month, which grow with dependence. */
  volume: number;
  /** Errors caught by staff and counted by nobody. */
  uncounted: number;
};

const BASE_TRUE_RATE = 0.08;

/** A fixed wobble, so the true rate reads as measured rather than drawn. */
export function trueRate(month: number): number {
  return (
    BASE_TRUE_RATE +
    0.004 * Math.sin(month * 1.7) +
    0.003 * Math.sin(month * 0.45 + 1)
  );
}

/** Dependence rises along a logistic curve: slow adoption, then the workflow reorganizes around the system. */
export function dependence(month: number): number {
  return 0.1 + 0.8 / (1 + Math.exp(-(month - 14) / 5));
}

export function volume(month: number): number {
  return Math.round(200 + 40 * month);
}

/**
 * The absorbed share: competence, scaled by how many people are positioned
 * around the system and how much a visible failure now costs. Both rise with
 * dependence, so absorption does too.
 */
export function absorbedShare(
  month: number,
  competence: number,
  params: Pick<Params, "extend" | "cut">,
): number {
  const effectiveCompetence =
    params.cut && month >= EVENT_MONTH ? competence * 0.7 : competence;
  const local = effectiveCompetence * (0.35 + 0.65 * dependence(month));
  // Extension: half the volume now comes from a site where nobody has
  // learned to catch this system's errors, so nothing is absorbed there.
  const coverage = params.extend && month >= EVENT_MONTH ? 0.5 : 1;
  return Math.min(0.97, local * coverage);
}

export function simulate(params: Params): MonthPoint[] {
  const points: MonthPoint[] = [];
  for (let month = 0; month <= MONTHS; month += 1) {
    const rate = trueRate(month);
    const absorbed = absorbedShare(month, params.competence, params);
    const reported = rate * (1 - absorbed);
    const monthVolume = volume(month);
    points.push({
      month,
      dependence: dependence(month),
      trueRate: rate,
      absorbed,
      reported,
      volume: monthVolume,
      uncounted: Math.round(monthVolume * rate * absorbed),
    });
  }
  return points;
}

/** The change in the reported rate across the event month, in points. */
export function eventJump(points: MonthPoint[]): number {
  const before = points[EVENT_MONTH - 1];
  const after = points[EVENT_MONTH];
  return (after.reported - before.reported) * 100;
}

/** What each evaluation layer can see of absorption. Keys are the eval stack's layer ids; the test holds them there. */
export const LAYER_SEES: Record<EvalLayer, string> = {
  model:
    "The true rate, on a held-out set. It says nothing about who is catching the errors in production, so a clean result here is read as evidence about a deployment it never saw.",
  agent:
    "Whether the assembled agent respects its constraints while running. Absorption happens after the agent has acted, in the hands of the people around it.",
  delegation:
    "Whether the grant was valid when the agent acted. The grant can be valid and the instrument that justifies renewing it can still be biased to silence.",
  institution:
    "The absorbed share, if it looks for it: shadow the staff, compare sites with different absorbing capacity, remove the absorbers from a bounded sample. This is the layer where absorption happens and the only one whose evaluation can be designed to find it.",
  consequence:
    "The burden on the people doing the absorbing, which is where the uncounted labor lands.",
};

/** The layer whose evaluation is placed where absorption happens. */
export const ABSORPTION_LAYER: EvalLayer = "institution";
