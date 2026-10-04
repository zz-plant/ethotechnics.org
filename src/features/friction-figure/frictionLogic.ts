/**
 * Friction as accidental governance, computed.
 *
 * A consequential decision passes four steps. Each is done by a person in a
 * distinct role or by the agent, which is one party however many steps it
 * performs. The five properties the essay names fall out of that
 * arrangement: review and diversity from the boundaries between distinct
 * parties, latency and stoppability from the steps a person must actively
 * take, renewal from the steps at which a person must choose to continue.
 * Rebuilding a property on purpose restores it without restoring the steps.
 */

export const STEP_IDS = ["gather", "draft", "check", "execute"] as const;
export type StepId = (typeof STEP_IDS)[number];

export type Party = "human" | "agent";

export type Step = { id: StepId; title: string; role: string };

export const STEPS: Step[] = [
  { id: "gather", title: "Gather the facts", role: "Analyst" },
  { id: "draft", title: "Draft the decision", role: "Reviewer" },
  { id: "check", title: "Check it against the rules", role: "Approver" },
  { id: "execute", title: "Execute it", role: "Operator" },
];

export const PROPERTY_IDS = [
  "review",
  "latency",
  "diversity",
  "stoppability",
  "renewal",
] as const;
export type PropertyId = (typeof PROPERTY_IDS)[number];

/** What the essay says about each property, passed in from the essay itself. */
export type PropertyCopy = {
  id: PropertyId;
  title: string;
  provided: string;
  removed: string;
  rebuilt: string;
  rebuiltRef: { label: string; href: string };
};

export type Chain = Record<StepId, Party>;
export type Rebuilt = Record<PropertyId, boolean>;

export type FrictionState = { chain: Chain; rebuilt: Rebuilt };

/** Hours a decision waits at a human step: a queue, a read, a signature. */
export const HOURS_PER_HUMAN_STEP = 24;
/** Minutes the agent takes for the whole chain in one pass. */
export const AGENT_PASS_MINUTES = 6;

export const allHuman = (): Chain => ({
  gather: "human",
  draft: "human",
  check: "human",
  execute: "human",
});

export const allAgent = (): Chain => ({
  gather: "agent",
  draft: "agent",
  check: "agent",
  execute: "agent",
});

export const nothingRebuilt = (): Rebuilt => ({
  review: false,
  latency: false,
  diversity: false,
  stoppability: false,
  renewal: false,
});

export const createState = (): FrictionState => ({
  chain: allHuman(),
  rebuilt: nothingRebuilt(),
});

/**
 * Each party in the chain, in step order. People are distinct from each
 * other; the agent is one party wherever it appears.
 */
function parties(chain: Chain): string[] {
  return STEP_IDS.map((id) =>
    chain[id] === "human" ? `human:${id}` : "agent",
  );
}

function humanSteps(chain: Chain): number {
  return STEP_IDS.filter((id) => chain[id] === "human").length;
}

/** Fractions in [0, 1] for the five properties, from the chain alone. */
export function fromChain(chain: Chain): Record<PropertyId, number> {
  const order = parties(chain);
  const humans = humanSteps(chain);
  const boundaries = order.filter(
    (party, index) => index > 0 && party !== order[index - 1],
  ).length;
  const distinct = new Set(order).size;
  // Renewal is re-granted at the steps that continue the process, so the
  // first step does not count; a person there still has to pass it on, but
  // the question is whether anyone after them must choose to keep going.
  const continuing = STEP_IDS.slice(1).filter(
    (id) => chain[id] === "human",
  ).length;
  return {
    review: boundaries / (STEP_IDS.length - 1),
    latency: humans / STEP_IDS.length,
    diversity: (distinct - 1) / (STEP_IDS.length - 1),
    stoppability: humans / STEP_IDS.length,
    renewal: continuing / (STEP_IDS.length - 1),
  };
}

/** The properties as the reader has them: from the chain, or rebuilt in full. */
export function properties(state: FrictionState): Record<PropertyId, number> {
  const base = fromChain(state.chain);
  return Object.fromEntries(
    PROPERTY_IDS.map((id) => [id, state.rebuilt[id] ? 1 : base[id]]),
  ) as Record<PropertyId, number>;
}

export type Speed = {
  cycleHours: number;
  /** Decisions the chain completes in a working day. */
  perDay: number;
  label: string;
};

export function speed(chain: Chain): Speed {
  const humans = humanSteps(chain);
  const cycleHours = humans * HOURS_PER_HUMAN_STEP + AGENT_PASS_MINUTES / 60;
  const perDay = 24 / cycleHours;
  const label =
    humans === 0
      ? `${AGENT_PASS_MINUTES} minutes, one pass`
      : `about ${humans} day${humans === 1 ? "" : "s"}`;
  return { cycleHours, perDay, label };
}

export function setParty(
  state: FrictionState,
  step: StepId,
  party: Party,
): FrictionState {
  return { ...state, chain: { ...state.chain, [step]: party } };
}

export function toggleRebuilt(
  state: FrictionState,
  property: PropertyId,
): FrictionState {
  return {
    ...state,
    rebuilt: { ...state.rebuilt, [property]: !state.rebuilt[property] },
  };
}

/**
 * The essay declares the copy for the five properties next to its prose.
 * This checks that the copy names exactly the properties the figure computes,
 * so an essay edit that renames or drops one fails the build instead of
 * rendering a meter with no words.
 */
export function assertPropertyCopy(copy: PropertyCopy[]): PropertyCopy[] {
  const given = copy.map((entry) => entry.id).sort();
  const expected = [...PROPERTY_IDS].sort();
  if (JSON.stringify(given) !== JSON.stringify(expected)) {
    throw new Error(
      `Friction figure: essay declares [${given.join(", ")}], figure computes [${expected.join(", ")}]`,
    );
  }
  return PROPERTY_IDS.map(
    (id) => copy.find((entry) => entry.id === id) as PropertyCopy,
  );
}
