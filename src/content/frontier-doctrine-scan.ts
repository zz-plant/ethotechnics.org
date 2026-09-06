/**
 * Frontier doctrine scan, 2026-09.
 *
 * Scores the PUBLIC DOCTRINE AND PRODUCT ARCHITECTURE of ten frontier labs
 * against the twelve Laws for Engineering Delegated Intelligence. It does not
 * score safety performance, internal practice, or intent. A 0 means no
 * meaningful public analogue was found, not that the lab rejects the
 * principle. Per-cell sources are pending; see `sourcesNote`.
 */

export type LawNumeral =
  | "I"
  | "II"
  | "III"
  | "IV"
  | "V"
  | "VI"
  | "VII"
  | "VIII"
  | "IX"
  | "X"
  | "XI"
  | "XII";

export type DoctrineScore = 0 | 1 | 2 | 3 | 4;

export type DoctrineScaleLevel = {
  score: DoctrineScore;
  meaning: string;
};

export type LawSummary = {
  numeral: LawNumeral;
  index: number;
  statement: string;
};

export type LabScore = {
  id: string;
  name: string;
  overall: number;
  characterization: string;
  /** Twelve scores, index 0 is Law I and index 11 is Law XII. */
  scores: readonly [
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
    DoctrineScore,
  ];
};

export type LawAverage = {
  numeral: LawNumeral;
  average: number;
  generation: "first" | "second";
};

export type FrontierDoctrineScan = {
  id: string;
  title: string;
  permalink: string;
  scanDate: string;
  published: string;
  refreshCadence: string;
  staleAfter: string;
  scope: string;
  disclaimer: string[];
  scale: DoctrineScaleLevel[];
  laws: LawSummary[];
  labs: LabScore[];
  lawAverages: LawAverage[];
  convergence: {
    converged: LawNumeral[];
    uncovered: LawNumeral[];
    conclusion: string[];
  };
  sourcesNote: string;
};

export const LAW_NUMERALS: readonly LawNumeral[] = [
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
] as const;

const laws: LawSummary[] = [
  { numeral: "I", index: 1, statement: "Capability does not imply authority" },
  {
    numeral: "II",
    index: 2,
    statement: "Authority decays unless its justification is renewed",
  },
  {
    numeral: "III",
    index: 3,
    statement: "Evidence and authority must remain coupled",
  },
  {
    numeral: "IV",
    index: 4,
    statement: "Every consequential delegation creates a correction obligation",
  },
  {
    numeral: "V",
    index: 5,
    statement: "Dependence converts technical risk into structural risk",
  },
  {
    numeral: "VI",
    index: 6,
    statement: "Nominal reversibility is not operational reversibility",
  },
  {
    numeral: "VII",
    index: 7,
    statement:
      "Error-bearing parties require standing proportional to exposure",
  },
  {
    numeral: "VIII",
    index: 8,
    statement: "Observability without state transition is theater",
  },
  {
    numeral: "IX",
    index: 9,
    statement:
      "Human oversight is a control only if the human can alter system state",
  },
  {
    numeral: "X",
    index: 10,
    statement:
      "The relevant eval sits at the highest layer where harm can emerge",
  },
  {
    numeral: "XI",
    index: 11,
    statement: "Successful automation increases its own governance burden",
  },
  {
    numeral: "XII",
    index: 12,
    statement: "No system may erase the conditions of its own contestability",
  },
];

const labs: LabScore[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    overall: 6.9,
    characterization:
      "Strongest public doctrine on capability versus authority, observation, oversight, and evaluation layer; little on dependence, standing, or contestability preservation.",
    scores: [4, 3, 3, 3, 2, 2, 1, 4, 4, 4, 2, 1],
  },
  {
    id: "openai",
    name: "OpenAI",
    overall: 6.5,
    characterization:
      "Explicit permission and evaluation doctrine; renewal and coupling present but partial; dependence and standing largely absent.",
    scores: [4, 3, 3, 3, 1, 2, 1, 4, 3, 4, 2, 1],
  },
  {
    id: "google-deepmind",
    name: "Google DeepMind",
    overall: 6.5,
    characterization:
      "Strong observation and evaluation doctrine; oversight present; the only lab with a partial analogue to contestability preservation.",
    scores: [3, 3, 3, 3, 1, 2, 1, 4, 3, 4, 2, 2],
  },
  {
    id: "xai",
    name: "xAI / SpaceXAI",
    overall: 5.8,
    characterization:
      "Explicit on capability versus authority and observation; weaker on oversight and reversibility; dependence and standing absent.",
    scores: [4, 3, 3, 3, 1, 1, 1, 4, 2, 3, 2, 1],
  },
  {
    id: "meta-msl",
    name: "Meta MSL",
    overall: 4.8,
    characterization:
      "First-generation laws partially present; no public analogue to standing; second-generation laws weak or incidental.",
    scores: [3, 2, 2, 3, 1, 1, 0, 3, 2, 3, 2, 1],
  },
  {
    id: "mistral",
    name: "Mistral",
    overall: 4.0,
    characterization:
      "Capability boundaries and oversight present; renewal and coupling weak; no public analogue to expansion review.",
    scores: [3, 1, 1, 2, 1, 2, 1, 2, 3, 2, 0, 1],
  },
  {
    id: "alibaba-qwen",
    name: "Alibaba / Qwen",
    overall: 3.5,
    characterization:
      "Capability boundaries present; most other laws weak or narrow; no public analogue to dependence as risk.",
    scores: [3, 1, 1, 2, 0, 1, 1, 2, 2, 2, 1, 1],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    overall: 2.3,
    characterization:
      "Weak or incidental across most laws; a partial analogue to standing is the only score above 1 apart from evaluation layer.",
    scores: [1, 1, 1, 1, 0, 0, 2, 1, 1, 2, 1, 0],
  },
  {
    id: "z-ai",
    name: "Z.ai",
    overall: 1.7,
    characterization:
      "Capability boundaries strongly present; almost no public doctrine on any other law.",
    scores: [3, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0],
  },
  {
    id: "moonshot",
    name: "Moonshot",
    overall: 1.0,
    characterization:
      "Weak or incidental on capability, observation, oversight, and evaluation layer; no public analogue found elsewhere.",
    scores: [1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0],
  },
];

const lawAverages: LawAverage[] = [
  { numeral: "I", average: 2.9, generation: "first" },
  { numeral: "X", average: 2.8, generation: "first" },
  { numeral: "VIII", average: 2.6, generation: "first" },
  { numeral: "IX", average: 2.3, generation: "first" },
  { numeral: "IV", average: 2.0, generation: "first" },
  { numeral: "II", average: 1.7, generation: "second" },
  { numeral: "III", average: 1.7, generation: "second" },
  { numeral: "XI", average: 1.2, generation: "second" },
  { numeral: "VI", average: 1.1, generation: "second" },
  { numeral: "VII", average: 0.8, generation: "second" },
  { numeral: "XII", average: 0.8, generation: "second" },
  { numeral: "V", average: 0.7, generation: "second" },
];

export const frontierDoctrineScan: FrontierDoctrineScan = {
  id: "frontier-doctrine-scan-2026-09",
  title: "Frontier doctrine scan",
  permalink: "/research/frontier-doctrine-scan",
  scanDate: "2026-09",
  published: "2026-09-06",
  refreshCadence:
    "Refreshed every six months, or marked stale on this page if a refresh has not been published within nine months of the scan date.",
  staleAfter: "2027-06",
  scope:
    "Ten frontier labs scored against the twelve Laws for Engineering Delegated Intelligence on the basis of public doctrine and product architecture.",
  disclaimer: [
    "This scan scores public doctrine and product architecture. It does not score safety performance, internal practice, or intent.",
    "A score of 0 means no meaningful public analogue was found. It is not evidence that a lab rejects the principle.",
    "Scores are a reading of what has been published. A lab may hold a stronger internal position than its public material shows, or a weaker one.",
    "The scan is dated. It describes public doctrine as of the scan date and will age.",
  ],
  scale: [
    { score: 4, meaning: "Explicit and operational in public doctrine" },
    { score: 3, meaning: "Strongly present" },
    { score: 2, meaning: "Partial or narrow analogue" },
    { score: 1, meaning: "Weak or incidental" },
    { score: 0, meaning: "No meaningful public analogue found" },
  ],
  laws,
  labs,
  lawAverages,
  convergence: {
    converged: ["I", "X", "VIII", "IX", "IV"],
    uncovered: ["V", "VII", "XII", "VI", "XI", "II", "III"],
    conclusion: [
      "The first-generation laws are already being absorbed by the labs: capability versus authority, evaluation at the layer where harm emerges, observation that triggers state change, causally meaningful oversight, and correction obligations.",
      "The second-generation laws have almost no public doctrine anywhere: dependence as risk, standing for error-bearing parties, preservation of contestability, operational rather than nominal reversibility, success raising the governance burden, and authority renewal and evidence coupling.",
      "If Ethotechnics centers on permissions, containment, approval, and evals, it describes a layer the labs are already shipping. If it centers on the dynamics of delegated authority after deployment, it describes a layer nobody has built.",
    ],
  },
  sourcesNote:
    "Per-cell sources are pending. Each score will cite the public document or product surface it was read from. Until then the scan should be read as a structured reading by the Institute, not as a sourced dataset.",
};

export const getLawAverage = (numeral: LawNumeral): number | undefined =>
  frontierDoctrineScan.lawAverages.find((entry) => entry.numeral === numeral)
    ?.average;

export const getLabScoreForLaw = (
  labId: string,
  numeral: LawNumeral,
): DoctrineScore | undefined => {
  const lab = frontierDoctrineScan.labs.find((entry) => entry.id === labId);
  const index = LAW_NUMERALS.indexOf(numeral);
  if (!lab || index < 0) return undefined;
  return lab.scores[index];
};
