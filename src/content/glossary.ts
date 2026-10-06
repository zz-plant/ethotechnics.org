import type { PageWithPermalink, PublicationMetadata } from "./types";
import { glossaryContentData } from "./generated/glossary.generated";

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  appliesTo: string[];
};

export type GlossaryTerritory = {
  id: string;
  label: string;
  tooltip: string;
};

export type GlossaryResource = {
  label: string;
  href: string;
  type: string;
};

export type GlossaryDomain =
  | "temporal"
  | "visibility"
  | "agency"
  | "burden"
  | "patterns"
  | "measurable"
  | "structural"
  | "diagnostic";

export type GlossaryScale = "individual" | "organizational" | "systemic";

export type GlossaryPhase = "design" | "deployment" | "audit" | "repair";

export type GlossaryMeasurability =
  "qualitative" | "semi_quantitative" | "fully_measurable";

export type GlossaryMaturity =
  "core_concept" | "active_research" | "speculative";

export type GlossaryMinimumEvidence = {
  artifact?: string;
  behavior?: string;
  metric?: string;
  definition?: string;
  unit?: string;
  dataSource?: string;
  calculation?: string;
  threshold?: string;
};

export type GlossaryEntry = {
  id: string;
  title: string;
  status: string | null;
  classes?: string[];
  bodyHtml: string;
  domains?: GlossaryDomain[];
  scale?: GlossaryScale | null;
  phase?: GlossaryPhase[];
  measurability?: GlossaryMeasurability | null;
  maturity?: GlossaryMaturity | null;
  clusters?: string[];
  legacyTerritory?: string;
  termUpdated?: string;
  termVersion?: string;
  termChangelog?: string;
  scope?: string;
  adjacentTerms?: string[];
  presenceChecks?: string[];
  missingExpectations?: string[];
  operationalTests?: string[];
  commonCounterfeits?: string[];
  minimumEvidence?: GlossaryMinimumEvidence;
  genealogy?: string;
  references?: GlossaryResource[];
  examples?: string[];
  tags?: string[];
  resources?: GlossaryResource[];
  relatedPatterns?: string[];
};

export type GlossaryCategory = {
  id: string;
  heading: string;
  descriptionHtml: string;
  comingSoon: boolean;
  entries: GlossaryEntry[];
};

export type GlossaryContent = PageWithPermalink & {
  publication: PublicationMetadata;
  territoryMap: GlossaryTerritory[];
  categories: GlossaryCategory[];
  starterTerms: { id: string; label: string; description: string }[];
  categoryHighlights: { id: string; label: string; description: string }[];
};

export const glossaryContent: GlossaryContent =
  glossaryContentData as GlossaryContent;

const glossaryTermSeeds: GlossaryTerm[] = [
  {
    slug: "principle-of-non-expropriation-of-resilience",
    term: "Principle of non-expropriation of resilience",
    definition:
      "The normative principle that an institution loses the moral justification for demanding human compensatory resilience when that resilience serves as a permanent substitute for correctable institutional failure.",
    appliesTo: ["principles", "governance", "labor"],
  },
  {
    slug: "compensated-performance",
    term: "Compensated performance",
    definition:
      "An operational condition where an automated system or institution appears to meet service-level agreements and throughput targets only because human operators, caseworkers, or subjects exert unmeasured, uncredited compensatory labor to absorb system errors. The labor can fall on personal time, and its costs can reach the staff members' own households, outside any measure the institution keeps.",
    appliesTo: ["monitoring", "operations", "failure-modes"],
  },
  {
    slug: "intrinsic-performance",
    term: "Intrinsic performance",
    definition:
      "The baseline operational effectiveness of an automated system or procedure evaluated without reliance on uncredited human compensation, shadow workarounds, or downstream harm absorption.",
    appliesTo: ["measures", "evaluations", "benchmarking"],
  },
  {
    slug: "reciprocal-accommodation",
    term: "Reciprocal accommodation",
    definition:
      "The requirement that an institution fit its pace, procedures, and expectations to people's physical, cognitive, and social limits, instead of making people absorb the friction to keep running an operating model that would fail without them.",
    appliesTo: ["institutions", "workplace", "governance"],
  },
  {
    slug: "extractive-cannibalism",
    term: "Extractive cannibalism",
    definition:
      "A failure mode where an institution preserves apparent operational stability and output velocity by depleting the unrecorded human capacities—such as health, attention, relationships, and moral integrity—on which that stability fundamentally depends.",
    appliesTo: ["workplace", "hospitals", "platforms"],
  },
  {
    slug: "green-dashboard-trap",
    term: "Green dashboard trap",
    definition:
      "An operational condition where executive instrumentation registers nominal performance and throughput because human workers outside the machine ledger absorb system friction through unpaid labor, manual intervention, and exhaustion.",
    appliesTo: ["monitoring", "operations", "governance"],
  },
  {
    slug: "dual-ledger-evaluation",
    term: "Dual-ledger evaluation",
    definition:
      "An evaluation architecture that pairs visible operational metrics (throughput, resolution speed, and cost per interaction) with an independent audit ledger tracking unrecorded human labor, replenishment rates, and corrective standing.",
    appliesTo: ["auditing", "evaluations", "benchmarking"],
  },
  {
    slug: "systemic-refusal",
    term: "Systemic refusal",
    definition:
      "A collective decision by operators, caseworkers, or the people a system decides about to stop absorbing its failures, so the cost of its errors shows up in the institution's own records.",
    appliesTo: ["labor", "standing", "correction"],
  },
  {
    slug: "ethotechnics",
    term: "Ethotechnics",
    definition:
      "The engineering discipline that keeps capability, authority, evidence, dependency, standing, and correction coupled so increasing machine agency cannot silently become unreviewable institutional power. Where ethics asks \u201cWhat should we do?\u201d, Ethotechnics specifies the mechanisms meant to make it happen and the records that show whether they did.",
    appliesTo: ["hospitals", "platforms", "governance"],
  },
  {
    slug: "moral-behavior",
    term: "Moral behavior (of systems)",
    definition:
      "Observable patterns of system behavior that prevent harm, share burden fairly, and keep people able to contest and recover. Moral behavior is judged by measures such as time-to-halt, reversibility, and fair burden distribution, not by stated intent.",
    appliesTo: ["platforms", "finance", "safety"],
  },
  {
    slug: "ethical-load-path",
    term: "Ethical load path",
    definition:
      "The route responsibility for outcomes travels through a system, across automation, people, and institutions. A clear ethical load path shows who can stop, reverse, or repair harm at each stage, linking design authority, oversight horizons, and the repair log.",
    appliesTo: ["transit", "ops-teams", "oversight"],
  },
  {
    slug: "ethotechnic-audit",
    term: "Ethotechnic audit",
    definition:
      "A structured assessment of a system\u2019s capacity to stop harm, reverse it, distribute burden fairly, remain contestable, and enable accountability. Audits surface where stoppability or reversibility fail and guide remediation steps.",
    appliesTo: ["platforms", "audits", "sre"],
  },
  {
    slug: "conviviality",
    term: "Conviviality",
    definition:
      "The degree to which tools and institutions expand people\u2019s agency, cooperation, and right of refusal instead of enclosing them. Convivial systems keep permission surfaces wide and make opting out safe, so people can shape the service without being consumed by it.",
    appliesTo: ["community", "platforms", "mutual-aid"],
  },
  {
    slug: "ethotechnic-maturity",
    term: "Ethotechnic maturity",
    definition:
      "A developmental scale describing how fully a system embodies Ethotechnic capabilities. Early maturity focuses on stopping acute harms; later stages add graceful degradation, contestability, and regular care retrospectives. At the highest level, halt, reversal, and appeal are run as continuous operations, with published SLJs and funded maintenance.",
    appliesTo: ["rail", "sre", "maturity"],
  },
  {
    slug: "mechanism-first-analysis",
    term: "Mechanism-first analysis",
    definition:
      "An approach that prioritizes system mechanics—defaults, authority, clocks, reversibility—over declared values or intentions, because mechanics determine outcomes under load.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "architecture-over-values",
    term: "Architecture over values",
    definition:
      "The claim that “ethical” outcomes depend less on what institutions say they value and more on the enforceable structure of how decisions are made and reversed.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "state-plus-clocks-model",
    term: "State + clocks model",
    definition:
      "A way of seeing power as state transitions plus time: who can change state, how quickly, and whether reversal is time-bound.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "contestability-architecture",
    term: "Contestability architecture",
    definition:
      "The set of design features that make contestation real: decision objects, clock-start, binding authority, evidence parity, and guaranteed override paths.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "control-loops-constraints-framing",
    term: "Control loops (constraints framing)",
    definition:
      "A safety lens where governance is modeled as feedback: detect harm, trigger intervention, enforce constraints, and learn. Useful for translating Ethotechnics into engineering terms.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "moral-latency",
    term: "Moral latency",
    definition:
      "The delay between harm occurring and the system recognizing it. Automated systems create harms faster than human oversight can register, demanding velocity friction and ethical interrupts.",
    appliesTo: ["hospitals", "automation", "latency"],
  },
  {
    slug: "accountability-diffusion",
    term: "Accountability diffusion",
    definition:
      "Responsibility dissolves across teams, tools, and incentives until no one can intervene. It erodes design authority and leaves harm without an owner.",
    appliesTo: ["platforms", "governance", "hospitals"],
  },
  {
    slug: "extraction",
    term: "Extraction",
    definition:
      "When a system pulls value\u2014data, attention, labor, or social capital\u2014without returning care, consent, or repair. Extraction hides its costs through externalization and steep burden gradients, and it erodes trust.",
    appliesTo: ["labor", "platforms", "ai"],
  },
  {
    slug: "extraction-by-endurance",
    term: "Extraction by endurance",
    definition:
      "Systems that depend on workers or users absorbing fragility through burnout, emotional labor, or unpaid cognitive work\u2014often mislabeled as \u201cresilience.\u201d Ethotechnic practice aims to invert this burden with fair burden distribution.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "drift",
    term: "Drift (system drift)",
    definition:
      "The tendency of systems to drift toward harm over time unless constrained by protective friction and by halt, reversal, and appeal measures.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "externalization",
    term: "Externalization",
    definition:
      "Pushing risk, cost, or harm onto other teams, communities, or the future so metrics look clean. Externalization shows up as pollution, shadow labor, or brittle dependencies that live outside audits. Ethotechnics counters it with oversight horizons, burden and reversal measures, and transparent repair logs.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "brittleness",
    term: "Brittleness",
    definition:
      "When a system shatters under ordinary variance (unexpected inputs, refusals, or edge cases) and people have to absorb the impact. Brittleness signals missing soft edges, thin graceful degradation, and poor refusal tolerance.",
    appliesTo: ["aviation", "automation", "support"],
  },
  {
    slug: "optimization-myopia",
    term: "Optimization myopia",
    definition:
      "Metric-chasing that narrows attention to throughput or growth while ignoring halt, reversal, appeal, and burden measures. Myopic optimization erodes contestability, raises failure load, and often fuels extraction.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "precision-laundering",
    term: "Precision laundering",
    definition:
      "Using detailed metrics or probabilistic scores to disguise inequity as objectivity. Precision laundering hides burden gradients and externalization behind statistical gloss, undermining explainability for accountability.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "compliance-collapse",
    term: "Compliance collapse",
    definition:
      "When rigid policy checklists replace judgment, causing teams to follow rules while harm worsens. Compliance collapses occur when design authority is weak and contestability is low, leaving no path to pause or repair.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "unseen-harm",
    term: "Unseen harm",
    definition:
      "Harm that does not produce immediately legible signals—silence, withdrawal, dropout, dissociation—and is therefore misread as “no issue.”",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "ethics-debt",
    term: "Ethics debt",
    definition:
      "The accumulated gap between capability and governability, whose interest is paid as incidents, backlash, and legal constraint.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "capability-overhang",
    term: "Capability overhang",
    definition:
      "A precise mismatch where system power exceeds controls (brakes, owners, audits, reversibility, recourse).",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "stoppability",
    term: "Stoppability",
    definition:
      "A system\u2019s ability to halt harmful processes quickly and automatically\u2014without requiring heroism or escalation.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "reversibility",
    term: "Reversibility",
    definition:
      "The ease with which a system can undo a harmful state change\u2014restore access, correct a record, reverse a flag\u2014without extraordinary effort or power. Reversibility is a governance property: it determines whether mistakes are survivable.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "fair-burden-distribution",
    term: "Fair burden distribution",
    definition:
      "Failures do not fall hardest on the most vulnerable. Burden is treated as a design variable and measured via the user burden ratio.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "contestability",
    term: "Contestability",
    definition:
      "The property of a system that allows affected people to force a decision to become a contestable object: something with reasons, a clock, an accountable authority, and a pathway to reversal. A system has contestability when \u201cthat\u2019s wrong\u201d can reliably become \u201chere is the specific decision, here is who can change it, and here is when they must respond.\u201d",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "refusability",
    term: "Refusability",
    definition:
      "A system\u2019s ability to let people say \u201cno\u201d without punishment or degradation\u2014including refusing data extraction, risky defaults, or coercive workflows\u2014while still preserving basic access and dignity. Refusability is not \u201copt-out exists\u201d; it\u2019s whether refusal is treated as a legitimate state rather than an error condition.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "explainability-for-accountability",
    term: "Explainability for accountability",
    definition:
      "Explanations a person can act on, not decorative ones. They reveal who made a decision and how it can be corrected, enabling contestability and audits.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "human-refusal-tolerance",
    term: "Refusal-tolerant systems",
    definition:
      "The system remains usable when people opt out, are confused, make mistakes, or withdraw cooperation. Refusal tolerance prevents extraction by endurance by ensuring refusals do not silently convert into extra unpaid work. Called “human” because it protects humans from being turned into the crumple zone when they refuse.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "graceful-degradation",
    term: "Graceful degradation",
    definition:
      "A design principle where systems degrade safely under stress\u2014reduced capability rather than catastrophic denial\u2014especially under accessibility constraints.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "soft-edges",
    term: "Soft edges",
    definition:
      "Boundary conditions designed to cushion people instead of penalizing them\u2014graduated responses, warnings before lockouts, and reversible defaults. Soft edges reduce failure load and guard against brittleness.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "fail-safe",
    term: "Fail-safe mode",
    definition:
      "The system defaults to the safest possible behavior when uncertain, prioritizing stoppability.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-open",
    term: "Fail-open mode",
    definition:
      "The system defaults to permissiveness under failure\u2014sometimes necessary, sometimes dangerous. Must be paired with velocity friction.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-silent",
    term: "Fail-silent mode",
    definition:
      "A harmful state where a system fails without signaling it. It is the worst form of failure because it hides moral latency: harm accrues while every indicator reads normal.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "crumple-zone",
    term: "Crumple zone / human-as-crumple-zone",
    definition:
      "The person in an automated system who absorbs the blame and the cost when the system fails. Madeleine Clare Elish named the pattern the moral crumple zone (2019).",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "harm-visibility",
    term: "Harm visibility",
    definition:
      "How plainly a system exposes the human impact of its decisions in real time. High harm visibility pairs logs, narratives, and alerts so oversight horizons extend beyond dashboards and ethical interrupts trigger on effects on people as well as on technical anomalies.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "dead-zones",
    term: "Dead zones / moral dead zones",
    definition:
      "Places in a system where harm occurs but no one can see, trace, or intervene. Closing dead zones is a goal of oversight horizons.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "escalation-horizon",
    term: "Escalation Horizon",
    definition:
      "The predefined point where automated control must yield to human judgment because risk, ambiguity, or moral latency is rising. Escalation horizons activate ethical interrupts and route cases to accountable stewards before crossing an irreversible boundary.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "interaction-surface",
    term: "Interaction surface",
    definition:
      "The moments, interfaces, and channels where people experience system decisions and can intervene. Mapping the interaction surface reveals where to place dignity friction, widen the permission surface, and detect dead-user zones.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "bifurcation-by-contestability",
    term: "Bifurcation by contestability",
    definition:
      "Systems split into high-contestability (slower, trusted, deployable in high stakes) and low-contestability (fast, then blocked).",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "maintenance-window",
    term: "Maintenance window",
    definition:
      "A scheduled calm state where teams intentionally slow or stop throughput so inspections, upgrades, and rehearsals can happen without crisis pressure. Maintenance windows make stoppability routine instead of reactive. Each window is negotiated with the people impacted, includes published service guarantees, and documents which safeguards were tested so unfinished work rolls into the shared repair log.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "care-retrospective",
    term: "Care retrospective",
    definition:
      "A facilitated reflection held while the system is still in a warning band to examine how maintenance load, emotional labor, and unresolved incidents are accumulating. Care retrospectives combine telemetry with frontline testimony. They redistribute responsibilities before burnout or harm escalates, triggering new maintenance windows or policy fixes when the team cannot keep absorbing risk.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "repair-log",
    term: "Repair log",
    definition:
      "A living record of every mitigation, decision, and resource commitment made after a fault. Repair logs make accountability legible by linking people harmed, who intervened, and what evidence was used. They inform future care retrospectives, power audits, and service-level reports so follow-up work is traceable and burden does not drift back to the same communities.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "finitude",
    term: "Finitude",
    definition:
      "The bodily, cognitive, emotional, and temporal limits all humans share. Ethotechnics treats finitude as a design input, not an inconvenience.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "cognitive-saturation",
    term: "Cognitive saturation point",
    definition:
      "The load level at which human decision quality collapses\u2014too many alerts, too little time, or excessive context switching. Ethotechnic design lowers saturation by adding velocity friction, simplifying interaction surfaces, and staffing to real maintenance metabolism.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "compassion-bandwidth",
    term: "Compassion bandwidth",
    definition:
      "The sustainable amount of emotional labor a system asks of people\u2014care teams, moderators, frontline staff, or users. When compassion bandwidth is exceeded, dread work grows and extraction by endurance sets in.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "administrative-shame",
    term: "Administrative shame",
    definition:
      "The feeling of being personally at fault for harms produced by system design. Often a signal that moral overhead is too high.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "dread-work",
    term: "Dread work",
    definition:
      "Tasks people avoid because the system punishes mistakes or withholds relief. Dread work signals missing soft edges, low contestability, and declining compassion bandwidth.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "executive-function-class-axis",
    term: "Executive function (as a class axis)",
    definition:
      "The idea that modern systems sort people by their capacity to perform sustained administrative labor—tracking tasks, managing documentation, navigating ambiguity—making disability and burnout into structural disadvantage.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "human-factors",
    term: "Human factors",
    definition:
      "A discipline that studies how systems interact with real human limits—fatigue, confusion, stress—often revealing that “user error” is design failure.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "operator-centered",
    term: "Operator-centered",
    definition:
      "Design that treats front-line workers as safety components and ensures they have authority, tools, and non-punitive reporting to prevent harm.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "refusal-budget",
    term: "Refusal budget",
    definition:
      "The number of times a person can decline, pause, or question a request without retaliation. A refusal budget backed by refusal tolerance and rights of exit prevents coercion, and heat maps of refusal show where budgets are running out.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "burden-distribution",
    term: "Burden distribution",
    definition:
      "How a system allocates the cost of operation or failure\u2014time, attention, stress, and emotional labor.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-gradient",
    term: "Burden gradient",
    definition:
      "The slope of effort and risk across roles or communities. A steep burden gradient means those with the least power carry the heaviest operational load while decision-makers feel little friction. Mapping the gradient exposes where to redistribute work through fair burden distribution and reduce moral overhead.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "failure-load",
    term: "Failure load",
    definition:
      "The amount of harm generated when the system fails, and how many people it reaches. The aim is an architecture whose failures stay small, supported by graceful degradation.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-transfer-event",
    term: "Burden transfer event",
    definition:
      "Moments when system failure pushes labor onto humans, often triggering moral overhead.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "cost-assignment",
    term: "Cost assignment / burden shifting",
    definition:
      "A mechanism where systems offload the labor of safety, clarity, and follow-through onto individuals (forms, documentation, vigilance) while keeping institutional obligation low. It’s how “choice” becomes unpaid work.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "attention-tax",
    term: "Attention tax",
    definition:
      "The ongoing monitoring burden imposed on individuals to prevent harm: checking portals, tracking deadlines, resubmitting documents, watching for silent rule changes. Attention becomes a cost of staying eligible.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-metabolism",
    term: "Maintenance metabolism",
    definition:
      "The baseline flow of upkeep\u2014patching, cleaning, rehearsing, and caring\u2014that keeps a service alive when nothing is on fire. Healthy maintenance metabolism is budgeted, scheduled, and shared rather than squeezed between crises. Falling below it signals rising maintenance debt and invites maintenance windows before fragility compounds.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-debt",
    term: "Maintenance debt",
    definition:
      "Accumulated obligations from skipping basic upkeep. The interest is paid in slower recovery, brittle systems, and people burning out to keep things running. Paying it down requires restoring the maintenance metabolism, scheduling maintenance windows, and tracking work in the repair log.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-overhead",
    term: "Moral overhead",
    definition:
      "Extra work users or operators must do to behave ethically within a bad system.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "temporal-exaction",
    term: "Temporal exaction",
    definition:
      "Uncompensated seizure of life-hours (time, attention, opportunity cost) as the price of accessing a right or correction. Temporal exaction is a form of extraction that inflates the user burden ratio.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-index",
    term: "Burden index",
    definition:
      "A composite measure of how much effort, time, and emotional labor people expend to use or recover from a system. Inputs include the user burden ratio, human substitution index, and failure load; rising scores signal extraction or asymmetric sustaining.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-ceiling",
    term: "Burden ceiling",
    definition:
      "The maximum allowable procedural burden a system can impose on someone seeking safety, correction, or relief. Ceilings are defined per harm class and enforced through UI, staffing, and policy.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "asymmetric-sustaining",
    term: "Asymmetric sustaining",
    definition:
      "When one group continually absorbs the toil of keeping a system alive so another group can move fast or claim success. It often hides behind gratitude for \u201cresilience\u201d while masking extraction. Ethotechnic practice flattens this by lowering the burden gradient and designing for stoppability so resilience is institutional, not personal.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "fragility-subsidy",
    term: "Fragility subsidy",
    definition:
      "The unpaid labor, vigilance, or emotional buffering people contribute to keep brittle systems functioning. Fragility subsidies hide what a system costs to run, inflate success metrics, and deepen asymmetric sustaining.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-performance-indicators",
    term: "Moral performance indicators (MPIs)",
    definition:
      "Moral performance indicators (MPIs) is an older name for the five measures on the measurement tiers page: rule change after upheld challenges, appeal success rate, burden ratio, reversibility rate, and time-to-halt.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "service-level-indicators",
    term: "Service-level indicators of justice (SLJs)",
    definition:
      "Operational metrics tied directly to fairness, safety, and dignity. SLJs should sit alongside uptime and latency commitments.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "recourse-performance",
    term: "Recourse performance",
    definition:
      "How well a system delivers review \u2192 reversal \u2192 remedy under realistic load and stress.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "institutional-metabolism-mapping",
    term: "Institutional metabolism mapping",
    definition:
      "A diagnostic map of where labor, emotional labor, time, and money go inside an institution. It visualizes maintenance metabolism, burden gradients, and points of extraction. Teams use the map to set SLJs, redesign roles, and decide where to invest new maintenance windows.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-halt",
    term: "Time-to-halt (TTH)",
    definition:
      "Seconds between a harmful process beginning and the system stopping it. It is the measured side of stoppability.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-restore",
    term: "Time-to-restore (TTR)",
    definition:
      "How long it takes to reverse harm and return a person to their prior state. Low TTR is a signal of reversibility.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "appeal-passage-rate",
    term: "Appeal passage rate",
    definition:
      "The percentage of appeals resolved in favor of the user, a leading indicator of true contestability.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "irreversibility-index",
    term: "Irreversibility index",
    definition:
      "The share of system actions that cannot be undone. Aim to keep this as low as possible through reversibility and graceful degradation.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "irreversibility-budget",
    term: "Irreversibility budget",
    definition:
      "A predefined cap on the share of actions allowed to be effectively irreversible in a given system or workflow class. Budgets force designers to minimize irreversible boundaries and build rollback lanes for everything else.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "user-burden-ratio",
    term: "User burden ratio",
    definition:
      "How much work a user must perform to correct or navigate system errors. This metric feeds directly into fair burden distribution.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "human-substitution-index",
    term: "Human substitution index",
    definition:
      "A measure of how often humans must step in to compensate for system shortcomings\u2014manual reviews, ad-hoc patches, or empathy work. A rising index exposes heroism-dependent systems and motivates investment in graceful degradation.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "signal-credibility",
    term: "Signal credibility",
    definition:
      "The trustworthiness of alerts, metrics, and reports used to govern a system. High credibility pairs transparent sampling, explainability for accountability, and human testimony so warnings trigger action instead of alert fatigue or dismissal.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "reversal-cost",
    term: "Reversal cost",
    definition:
      "The time, money, emotional labor, documentation, and social risk required to undo an outcome. High reversal cost makes errors durable and turns “rights” into luxuries.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "durability-of-error",
    term: "Durability of error",
    definition:
      "How long a wrong state persists once created, and how far it propagates (downstream systems, eligibility, reputation). A system is dangerous when it can create durable errors quickly but correct them slowly.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "moral-debt",
    term: "Moral debt",
    definition:
      "The accumulated harm a system has caused but not repaired. Moral debt accrues interest as moral latency grows and people lose trust; it is paid down through pathways to restitution, transparent repair logs, and lowered time-to-restore.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "design-authority",
    term: "Design authority",
    definition:
      "The accountable power to set the constraints a system operates under, choose its safeguards, and fund their enforcement. Clear design authority aligns incentives, protects contestability, and prevents accountability diffusion.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "oversight-horizon",
    term: "Oversight Horizon",
    definition:
      "The distance regulators, auditors, or affected communities can see into a system\u2019s decisions and their effects. Extending the horizon through harm visibility, traceable models, and shared repair logs shrinks dead zones.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contestability-legitimacy-hinge",
    term: "Contestability as the legitimacy hinge",
    definition:
      "A system is legitimate insofar as affected parties have standing, voice, and remedy against its decisions/actions.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "maintenance-budgets-legitimacy-budgets",
    term: "Maintenance budgets are legitimacy budgets",
    definition:
      "The capacity to monitor, review, and repair is a political/organizational legitimacy input, not overhead.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "receipts-by-default",
    term: "Receipts-by-default as a legitimacy interface",
    definition:
      "People should automatically get “what happened” records: actions taken, permissions used, reasons, and accountable owners.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "sovereignty-constraint-imposition",
    term: "Sovereignty as constraint-imposition capacity",
    definition:
      "Sovereignty is the ability to impose enforceable constraints on infrastructure operating in your territory.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standards-wars-recourse-wars",
    term: "Standards wars as recourse wars",
    definition:
      "Global competition shifts to whose regimes for auditability, liability, and redress become default through supply chains and procurement.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "democratic-vs-coercive-governability",
    term: "Democratic vs coercive governability",
    definition:
      "Governance infrastructure can either enable rights-preserving contestability or scaled conduct control, depending on who has standing and remedy.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "permission-surface",
    term: "Permission surface",
    definition:
      "The set of authority grants in force for a system at a given moment, each carrying an evidence basis, a scope, a state, and an expiry. Contestability depends on each grant in it being open to challenge.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "earned-autonomy",
    term: "Earned autonomy",
    definition:
      "Agent autonomy is a conditional privilege granted only when monitoring, brakes, and recourse capacity are demonstrably adequate.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "right-of-exit",
    term: "Right of exit",
    definition:
      "Guaranteed, non-punitive ways to leave a system (or refuse a pathway) while preserving access to essentials, records, and future participation. Exit rights treat departure as a legitimate action, not a breach.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "externalized-harm-channels",
    term: "Externalized harm channels",
    definition:
      "The pathways an institution uses to push risk or cleanup onto others: contractors, users, bystanders, or future teams. Mapping these channels exposes externalization and informs fair burden distribution.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "stewardship-window",
    term: "Stewardship window",
    definition:
      "A negotiated period where teams pause growth work to do maintenance, close open repairs, and fix gaps in ownership. Stewardship windows bundle maintenance windows, publish SLJs for the pause, and commit to closing items in the repair log before resuming throughput.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "governance-by-suspension",
    term: "Governance by suspension",
    definition:
      "Control exercised by keeping matters unresolved long enough that time itself produces the outcome. Governance by suspension relies on non-decisions and exploits endurance asymmetry.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "endurance-asymmetry",
    term: "Endurance asymmetry",
    definition:
      "Institutions can persist indefinitely; humans cannot. This makes delay an allocation mechanism that underwrites continuity privilege and punitive friction.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-privilege",
    term: "Continuity privilege",
    definition:
      "Unequal access to enforceability produced by unequal capacity to maintain standing over time (attention, health, documentation, slack). Continuity privilege steepens the burden gradient for those without reserves.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "proxy-privilege",
    term: "Proxy privilege",
    definition:
      "Unequal enforceability produced by unequal ability to delegate persistence (agents, intermediaries, automation). Proxy privilege lets some parties bypass futility thresholds that others face alone.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "latency-as-action",
    term: "Latency-as-action",
    definition:
      "The principle that delay produced predictably by system rules (queues, resets, blocked escalation, absent deadlines) is attributable power, not mere inaction.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bounded-duration",
    term: "Bounded duration",
    definition:
      "A fixed maximum time-to-resolution; breach triggers an enforceable disposition. Bounded duration pairs with stable clocks and time transparency.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-of-state",
    term: "Continuity of state",
    definition:
      "A persistent cumulative record; no forced repetition of validated inputs. Continuity of state reduces temporal exaction and protects contestability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "safe-pause",
    term: "Safe pause / status quo during pendency",
    definition:
      "No adverse consequences while review is pending (except narrow, reviewable emergency exception). Safe pause preserves the utility window and keeps people whole during appeal.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "traceable-ownership",
    term: "Traceable ownership",
    definition:
      "A named responsible party with authority to override automation when bounds are breached. Traceable ownership clarifies design authority and accelerates time-to-restore.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "time-transparency",
    term: "Time transparency",
    definition:
      "Legible process state: current step, blocking condition, time remaining, next decision point, escalation triggers; no fake progress. Time transparency supports contestability and stable clocks.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bindingness",
    term: "Bindingness",
    definition:
      "The degree to which a system’s outputs create enforceable obligations—deadlines, duties, remedies, or reversals—rather than mere communications. Bindingness is the difference between “we received your request” and “we must decide by Friday or you win.”",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "non-bindingness",
    term: "Non-bindingness / nonbindingness",
    definition:
      "The condition where a system can interact, respond, and even apologize without being compelled to change state. Non-bindingness is power without accountability: activity without obligation.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standing-vs-belief",
    term: "Standing (vs belief)",
    definition:
      "Standing is the recognized right to make the system bind itself to engage, decide, and remedy—regardless of whether your story is believed, liked, or emotionally legible. “Belief” is narrative validation; standing is enforceable access to decision power.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "binding-authority",
    term: "Binding authority",
    definition:
      "A person or role that can change the underlying state and is obligated to respond. Binding authority is not “a human is involved”; it’s a human with power + duty + traceable accountability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "evidence-parity",
    term: "Evidence parity",
    definition:
      "A condition where affected people have a fair chance to meet the evidentiary burden—access to the relevant facts, rules, and records—rather than being asked to prove things the institution can’t or won’t disclose. Without evidence parity, appeals become theater.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-chain",
    term: "Authority chain",
    definition:
      "The mapping of who can change what state, at which stage, under what constraints. Authority chains determine whether escalation is real.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-mutation",
    term: "Authority mutation",
    definition:
      "A pattern where escalation changes how the institution speaks without changing who has power to reverse outcomes. Authority mutates when the channel upgrades (more polite, more official, more complex) but the underlying ability to bind remains absent.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "defaults-as-governance",
    term: "Defaults (as governance)",
    definition:
      "The idea that the baseline state—what happens if nobody intervenes—is a primary allocator of outcomes and costs. Defaults govern by deciding who must spend time, attention, and stamina to avoid harm.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-caste",
    term: "Procedural caste",
    definition:
      "A stratification system where people are divided by their ability to force binding action: who can start clocks, reach authorities, obtain reversals, and make claims legible. It’s a caste system of enforceability, not worth.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "escalation-without-authority",
    term: "Escalation (without authority)",
    definition:
      "A channel change that does not increase binding power—more forms, more tiers, more waiting—while the underlying decision remains unchangeable. It’s escalation as delay management, not remedy.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "redress",
    term: "Redress",
    definition:
      "The set of mechanisms that can correct harm: appeal, review, reversal, compensation, restoration. Redress is real when it is time-bound and reaches binding authority.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "override-path",
    term: "Override path",
    definition:
      "A defined mechanism that can supersede the default workflow when the default would cause harm: human escalation with real authority, emergency reversal, or exception handling with deadlines. Override paths are where a stated commitment to people becomes a mechanism.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "structured-exit",
    term: "Structured exit",
    definition:
      "An exit process designed to protect the leaver: clear steps, data portability, timelines, anti-retaliation constraints, and closure that doesn’t require ongoing performance. Structured exit turns leaving into a governed pathway instead of an endurance test.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "paywalled-rights",
    term: "Paywalled rights",
    definition:
      "When access to contestation, speed, or binding review is effectively purchased—through fees, premium support, lawyers, consultants, or time flexibility. Rights exist, but only for those who can pay in money or stamina.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "logs-as-power",
    term: "Logs-as-power",
    definition:
      "The idea that control over records—what is logged, who can see it, what counts as evidence—shapes who can contest outcomes. Recordkeeping is governance.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "audit-trail",
    term: "Audit trail",
    definition:
      "A trace of events and decisions—what happened, when, by whom, under what rule—used for accountability. Audit trails matter only if they connect to reversal power.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "administrative-reality",
    term: "Administrative reality",
    definition:
      "The world as the system recognizes it: what counts, what is recordable, what triggers action. Administrative reality often diverges from lived reality.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contract-of-adhesion",
    term: "Contract of adhesion",
    definition:
      "A take-it-or-leave-it contract offered by a more powerful party where negotiation is impossible; a common substrate for coerced “choice.”",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "nda-retaliation-narrative-erasure",
    term: "NDA retaliation / narrative erasure",
    definition:
      "Mechanisms that suppress exit stories—legal threats, informal retaliation, reputational control—preventing systems from being held accountable by shared evidence.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "protective-friction",
    term: "Protective friction",
    definition:
      "Friction that slows harmful processes and keeps moral latency within safe bounds.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "punitive-friction",
    term: "Punitive friction",
    definition:
      "Friction that punishes users\u2014often hidden in bureaucratic loops. Signals extraction by endurance.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "dignity-friction",
    term: "Dignity friction",
    definition:
      "Friction that preserves autonomy, such as double checks on irreversible actions.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "velocity-friction",
    term: "Velocity friction",
    definition:
      "Friction added specifically to prevent runaway system behaviors. Often implemented through ethical interrupts.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "safety-valve",
    term: "Safety valve",
    definition:
      "A deliberate release point that lets people slow, pause, or reroute automation before harm compounds. Safety valves pair stoppability with dignity friction so flows with serious consequences default to reversible states and route to humans without penalty.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "consent-journey",
    term: "Consent journey",
    definition:
      "The sequenced touchpoints where a person learns what a system will do, grants or denies permission, and can revise that choice over time. Strong consent journeys use anticipatory consent, visible permission surfaces, and healthy refusal budgets so pausing or exiting does not jeopardize access or service.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "coercive-consent",
    term: "Coercive consent",
    definition:
      "“Agreement” obtained through defaults, asymmetry, or threats of exclusion—consent produced by lack of viable refusal.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "humane-friction",
    term: "Humane friction",
    definition:
      "The combination of protective, dignity, and velocity friction across a workflow, placed so the process slows only where risk, irreversibility, or coercion pressure is high.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "appropriate-friction",
    term: "Appropriate friction",
    definition:
      "Deliberate slowdowns or checkpoints inserted where harm would be costly or irreversible, so fairness and safety survive speed and scale.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "frictionless-harm",
    term: "Frictionless harm",
    definition:
      "Harms that spread unchecked because safeguards or pauses were stripped away. Frictionless harm is the inverse of protective friction; it appears when velocity friction and dignity friction are absent.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "decision-edge",
    term: "Decision edge",
    definition:
      "The precise moment when a choice shifts from reversible to consequential. Making the decision edge visible enables dignity friction, clearer consent, and routing to ethical interrupts when risk spikes.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-surface",
    term: "Decision surface",
    definition:
      "The part of a system where decisions become visible, addressable, and contestable. Many systems minimize the decision surface to avoid accountability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-artifact",
    term: "Decision artifact",
    definition:
      "A discrete, attributable, contestable output: outcome + reason + timestamp + accountable owner. Decision artifacts anchor traceable ownership and make contestability measurable.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-object",
    term: "Decision object",
    definition:
      "A discrete, addressable unit of institutional action that can be challenged: what was decided, when, under which rule, by what authority, with what evidence. Decision objects are the “handles” that make contestation possible.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "object-formation",
    term: "Object formation",
    definition:
      "The process by which a complaint, harm, or request becomes a decision object—assigned an identifier, a category, an owner, a standard of review, and a clock. Systems often block accountability by preventing object formation (“nothing exists to appeal”).",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-decision",
    term: "Non-decision",
    definition:
      "A stable administrative disposition where a system withholds a contestable outcome (pending, in review) while consequences accrue. Non-decisions stretch moral latency and keep people in limbo.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "pendingness",
    term: "Pending / pendingness",
    definition:
      "A default state where nothing is decided and no one is obligated—often presented as neutral but functioning as an outcome allocator. Pendingness becomes harm when it lacks a clock, an owner, or a forced next step.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "settlement",
    term: "Settlement",
    definition:
      "The moment a claim becomes resolved in a way that changes the underlying state—approved, denied with appeal rights, remediated, reversed, paid, restored, or otherwise closed with consequences. Settlement is not closure in the CRM; it’s resolution that binds.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-settlement",
    term: "Non-settlement / nonsettlement",
    definition:
      "An institutional mode where claims are acknowledged and processed indefinitely without producing a binding resolution. The system offers intake, updates, and politeness while keeping obligation optional.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "stable-clock",
    term: "Stable clock",
    definition:
      "A non-resettable timeline for a case; the system cannot restart time via re-ticketing, re-verification, or channel switching. Stable clocks enforce bounded duration and keep timelines legible.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "clock-start-clock-mismatch",
    term: "Clock-start / clock mismatch",
    definition:
      "Clock-start: the moment a system becomes time-bound—deadlines begin, obligations attach, escalation becomes meaningful. Clock mismatch: when institutional execution is fast (instant flags, freezes, denials) but redress is slow (weeks-months-human review), making errors durable and contestation scarce.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "slow-redress-fast-execution",
    term: "Slow redress / fast execution",
    definition:
      "A governance asymmetry where harmful state changes are immediate but appeals are delayed, discretionary, and exhausting. This is one of the main engines of modern coercion.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-window",
    term: "Utility window",
    definition:
      "The time span during which relief can still prevent the relevant harm. Designing for a clear utility window keeps time-to-restore accountable.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-expiry",
    term: "Utility expiry",
    definition:
      "Crossing the utility window; relief arrives too late to matter. Utility expiry should trigger constructive denial or repair.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "futility-threshold",
    term: "Futility threshold",
    definition:
      "The point where time-on-task or repetition becomes so costly that valid claimants predictably abandon pursuit. Systems that hit the futility threshold signal punitive friction and low contestability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "constructive-denial",
    term: "Constructive denial",
    definition:
      "A legal state where delay is treated as refusal because it destroys utility or makes pursuit futile. Constructive denial recognizes utility expiry and forces accountable remedies.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "critical-action",
    term: "Critical action",
    definition:
      "Any system action that meaningfully alters a person\u2019s status, access, or trajectory. Critical actions require dignity friction.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "irreversibility",
    term: "Irreversibility",
    definition:
      "A state where reversal is practically unavailable (too slow, too expensive, too discretionary) even if it is theoretically possible. Irreversibility is often produced by missing clocks, missing authority, or asymmetric evidence demands.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "irreversible-boundary",
    term: "Irreversible boundary",
    definition:
      "A threshold the system cannot automatically undo\u2014account closures, public releases, or data publication. Crossing it demands heightened contestability, audited explanations, and explicit time-to-restore plans.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "backstop",
    term: "Backstop",
    definition:
      "A guaranteed fallback mechanism that triggers when the main process fails—timeouts, automatic approvals, emergency restoration, or external review.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "rollback",
    term: "Rollback",
    definition:
      "A designed ability to revert the system to a prior safe state—restoring access, undoing propagation, correcting records—ideally with minimal friction.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "auto-close-auto-renew-auto-share",
    term: "Auto-close / auto-renew / auto-share",
    definition:
      "Default state transitions that happen without active consent—closing claims, renewing contracts, expanding data use—often presented as convenience while functioning as governance by inertia.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "ethical-interrupts",
    term: "Ethical interrupts",
    definition:
      "Automatic system-level halts triggered by anomalies or harm indicators. Ethical interrupts operationalize stoppability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "heroism-dependent-systems",
    term: "Heroism-dependent systems",
    definition:
      "Systems that rely on extraordinary effort, unpaid care, or silent sacrifice to function. They mask poor stoppability and high failure load.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "empathy-surrogacy",
    term: "Empathy surrogacy",
    definition:
      "Simulated warmth\u2014chatbots, scripted apologies, tone guidelines\u2014used to mask structural harm or delay fixes. Empathy surrogacy diverts attention from repair and weakens contestability by substituting sentiment for remedy.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "error-cascades",
    term: "Error cascades",
    definition:
      "Small automated mistakes that amplify across the system. Prevented through ethical interrupts and SLJs.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "invisible-fallbacks",
    term: "Invisible fallbacks",
    definition:
      "Hidden behaviors that appear under stress\u2014shadow queues, silent throttling, or undocumented overrides. Invisible fallbacks obscure ethical load paths and should be surfaced through graceful rollback lanes and rehearsed in maintenance windows.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "dead-user-zones",
    term: "Dead-user zones",
    definition:
      "Places where people affected by decisions cannot contest, appeal, or exit\u2014opaque rankings, automated bans, or unmoderated queues. Closing dead-user zones requires widening the permission surface and raising appeal passage rates.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "moral-lock-in",
    term: "Moral lock-in",
    definition:
      "When harmful defaults become entrenched through dependencies, network effects, or contracts that block reform. Moral lock-in is prevented by moral feature gating, contestability, and continuous moral drift control.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "legitimacy-laundering",
    term: "Legitimacy laundering",
    definition:
      "The process of converting coercive or indifferent outcomes into reputational legitimacy through procedural signals—case IDs, polite updates, “in review”—without delivering binding resolution. The system looks responsible while staying unbound.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "polite-coercion",
    term: "Polite coercion",
    definition:
      "Coercion delivered through soothing language and “helpful” workflows that make refusal costly or stigmatized. Polite coercion is power that avoids looking like power.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "documentation-loop",
    term: "Documentation loop / resubmission loop",
    definition:
      "A repeating pattern where the system continually requests more evidence or re-uploads without moving toward a binding decision. Often used to shift labor onto claimants and to manufacture dropout.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "precision-demands",
    term: "Precision demands",
    definition:
      "Requests for ever-greater specificity that function less as truth-seeking and more as denial hooks—ways to keep a case non-objectified or non-decidable. Precision demands are a technique of delay.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "procedural-alibi",
    term: "Procedural alibi",
    definition:
      "A record of “process” used to defend outcomes (“we followed procedure”) even when the procedure cannot bind the institution to remedy. The alibi is the trace of activity, not accountability.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "tone-policing",
    term: "Tone policing (as governance technology)",
    definition:
      "The use of “appropriate tone” requirements to control access to remedy—penalizing anger, urgency, neurodivergent communication, or exhaustion. Tone policing converts distress into disqualification.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "dropout-as-legitimation",
    term: "Dropout-as-legitimation",
    definition:
      "When systems treat nonresponse, fatigue, or disappearance as consent or closure (“case closed—no reply”), laundering coercion into “resolved.” Dropout becomes the mechanism that protects the institution.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "churn-as-closure",
    term: "Churn (as closure mechanism)",
    definition:
      "The engineered cycling of people through forms, queues, and handoffs until they give up, miss a deadline, or become “inactive,” allowing the system to close without settlement.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "paper-compliance",
    term: "Paper compliance / checkbox governance",
    definition:
      "Compliance regimes focused on producing documentation of doing the right thing rather than mechanisms that can prevent harm or force remedy. The paperwork stands in for power.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "transparency-theater",
    term: "Transparency theater",
    definition:
      "Disclosures that do not increase contestability—more text, more dashboards, more “explanations”—without deadlines, authority, or reversal paths. Visibility substitutes for enforceability.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "explainability-decoy",
    term: "Explainability decoy",
    definition:
      "A focus on explaining model decisions that distracts from the harder question: can the decision be contested, reversed, and time-bounded? The decoy offers epistemics where governance is needed.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "human-in-the-loop-legitimacy",
    term: "Human-in-the-loop (as legitimacy artifact)",
    definition:
      "A human reviewer inserted to create legitimacy while lacking binding authority, deadlines, or meaningful discretion. The loop becomes a comfort signal, not a power shift.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "moral-drift-control",
    term: "Moral drift control",
    definition:
      "Instrumentation that detects when a system\u2019s behavior drifts from the baseline its authority was granted against, using halt, reversal, and appeal measures or reports from affected people, and automatically triggers interrupts or design changes.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "structural-gentleness-coefficients",
    term: "Structural gentleness coefficients",
    definition:
      "Measures of how much ordinary human variance an infrastructure tolerates before it fails someone: error tolerance, recovery time, and soft edges. Higher coefficients are expected to track lower failure load and safer degradation.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "burden-elasticity",
    term: "Burden elasticity",
    definition:
      "How effort and risk move between parties when conditions change, and whether they move back afterward. Mapping burden elasticity alongside the burden gradient shows whether a crisis will land on the people with the least power to refuse it.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "care-redundancy",
    term: "Care redundancy",
    definition:
      "Overlapping routes through people, automated checks, and policy guarantees, so that when one safeguard fails another still catches the person. Care redundancy pairs with graceful degradation to keep failure load low.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "meta-contestability",
    term: "Meta-contestability",
    definition:
      "Mechanisms that let people challenge the rules of challenge as well as its outcomes: who may appeal, what evidence counts, and who sits on review panels. Meta-contestability keeps contestability from ossifying.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "user-state-modeling",
    term: "User-state modeling for harm prevention",
    definition:
      "Inferring user states such as fatigue, distress, or inattention to slow the pace, add protective friction, or route to a person before harm compounds. The models must respect anticipatory consent and must not create new burden transfers.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethical-latency",
    term: "Design for ethical latency",
    definition:
      "Designing for the unavoidable delay between an action and its review: staging risky steps, adding velocity friction, or holding care floor guarantees in place until the fuller review is done.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "distributed-accountability-protocols",
    term: "Distributed accountability protocols",
    definition:
      "Coordination methods that keep a named owner attached to work as it moves across teams and automation: shared playbooks, auditable handoffs, and repair logs. The protocols prevent accountability diffusion at the handoff.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethotechnic-failure-taxonomy",
    term: "Ethotechnic failure taxonomy",
    definition:
      "A shared classification of failure modes, such as optimization myopia, brittleness, and extraction, so incidents can be compared across systems, learned from, and prevented.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "adaptive-refusal-pathways",
    term: "Adaptive refusal pathways",
    definition:
      "Flows that reroute a task when someone pauses or declines, keeping the case context and imposing no penalty. They let a person decline more than once without losing their place, and keep the system usable when people refuse.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "aftercare-automation",
    term: "Aftercare automation",
    definition:
      "Automated follow-up after an incident that checks on the people affected, schedules remedies, and prompts a named person to close the case. Done well, it lowers moral debt without adding moral overhead.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "alignment-dividend",
    term: "Alignment dividend",
    definition:
      "The measurable gains in trust, retention, and safety when a system serves the people it acts on as intended. Tracking the dividend is the budget argument for sustained funding of halt, reversal, and appeal measures and maintenance metabolism.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ambiguity-budgets",
    term: "Ambiguity budgets",
    definition:
      "Explicit allowances for uncertainty that hold back automation or strict enforcement until there is enough context. The budget reserves time, human review, or maintenance windows for the cases that need them.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "anticipatory-consent",
    term: "Anticipatory consent",
    definition:
      "Consent models that preview future data uses and let people pre-approve, defer, or block them. Anticipatory consent supports rights of exit and counters precision laundering of unclear terms.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "boundary-of-acceptable-harm",
    term: "Boundary of acceptable harm",
    definition:
      "Thresholds, revised as conditions change, that mark where harm exceeds the system\u2019s mandate and operations must halt or escalate. Boundaries are tied to SLJs and enforced through ethical circuit breakers.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "care-floor-guarantees",
    term: "Care floor guarantees",
    definition:
      "Baseline commitments a service keeps during outages or crises: live support, data export, or safe defaults. Care floors protect users while graceful degradation is active.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "compassion-telemetry",
    term: "Compassion telemetry",
    definition:
      "Signals about how people are treated in an interaction: response tone, wait times during distress, and whether follow-up happened. They sit beside technical metrics and protect compassion bandwidth.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "conflict-observability",
    term: "Conflict observability",
    definition:
      "Logging that records a conflict between values when it happens, for example when SLJs are traded against throughput or appeals spike. The record lets the conflict be reviewed before it escalates and lets moral drift control start sooner.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "counter-abuse-guardrails",
    term: "Counter-abuse guardrails",
    definition:
      "Limits that stop tools from being repurposed for harassment, exploitation, or coercion: rate limits, anomaly detection, and human override lanes tuned for abuse cases.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "crisis-rehearsal-loops",
    term: "Crisis rehearsal loops",
    definition:
      "Regular drills that test how a system responds to harm, as well as whether it stays up. They exercise ethical interrupts, check care floors, and record findings in the repair log.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "data-dignity-budgets",
    term: "Data dignity budgets",
    definition:
      "Caps on what data is collected and how it is used, set by context and purpose rather than by what a consent checkbox legally allows. Budgets align with anticipatory consent and guard against extraction.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "decision-debt-ledger",
    term: "Decision debt ledger",
    definition:
      "A register of deferred decisions and the harm each one accrues while it waits, reviewed before that harm compounds. The ledger feeds maintenance windows and informs halt, reversal, and appeal measures.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "downstream-equity-buffers",
    term: "Downstream equity buffers",
    definition:
      "Design slack that absorbs variance so marginalized groups do not pay first or most when errors occur. Buffers include staggered rollouts, rollback lanes, and targeted support funds.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethical-circuit-breakers",
    term: "Ethical circuit breakers",
    definition:
      "Automated stops that trip when a risk indicator crosses a set point: a surge in appeals, a bias metric, or rising moral debt. They are the safety counterpart to financial circuit breakers.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethical-load-testing",
    term: "Ethical load testing",
    definition:
      "Exercises that probe how a system behaves when its safeguards are under stress, such as simulated harassment, mass appeals, or outages, to check that ethical circuit breakers trip and care floors hold.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "exhaustion-triggers",
    term: "Exhaustion triggers",
    definition:
      "Signals that detect operator or user fatigue, such as error streaks, long queues, and late-night decisions, and automatically slow, pause, or hand off a flow before mistakes multiply. The triggers protect compassion bandwidth.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "friction-budgets",
    term: "Friction budgets",
    definition:
      "A planned allocation of protective and dignity friction across a workflow, set step by step according to risk, instead of removing friction wherever it slows things down.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "graceful-rollback-lanes",
    term: "Graceful rollback lanes",
    definition:
      "Prepared routes to revert harmful decisions while preserving dignity, evidence, and service continuity. Rollback lanes keep irreversibility indices low and shorten time-to-restore.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "harm-amnesty-windows",
    term: "Harm amnesty windows",
    definition:
      "Time-boxed periods where people can report or reverse harmful actions without penalty, encouraging disclosure and faster repair. Amnesty windows often follow rehearsal loops or incidents.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "heat-maps-of-refusal",
    term: "Heat maps of refusal",
    definition:
      "Maps of where people opt out, churn, or appeal, which show early where refusal is being made costly. They are used to tune refusal budgets and redesign interaction surfaces.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "human-override-lanes",
    term: "Human override lanes",
    definition:
      "Guaranteed routes for human judgment to supersede automation when stakes are high or context is missing. Override lanes accompany ethical interrupts and require clear ethical load paths.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "incident-memory-chains",
    term: "Incident memory chains",
    definition:
      "Linked records that attach the findings from past incidents to the workflows most like them, so the next team sees them before repeating the failure. Memory chains inform ethical load tests and prevent moral lock-in on bad patterns.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "moral-dry-runs",
    term: "Moral dry runs",
    definition:
      "Pre-launch walkthroughs that play out the hard cases a design will meet, such as conflicting obligations or a wrong decision nobody can reverse, before it reaches the public. Dry runs test circuit breakers, rollback lanes, and documentation.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "moral-feature-gating",
    term: "Moral feature gating",
    definition:
      "Controls that block a feature launch until readiness criteria are met: oversight plans, contestability pathways, and care floors.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "pathways-to-restitution",
    term: "Pathways to restitution",
    definition:
      "Documented steps a system must take to repair harm: acknowledgment, remedy, verification, and follow-up. Pathways reduce moral debt and belong in the repair log.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "refusal-aware-routing",
    term: "Refusal-aware routing",
    definition:
      "Routing logic that knows who can decline a task and makes sure a refusal is honored without retaliation or a silent penalty. It preserves refusal budgets so that declining stays a real option.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "relief-invariants",
    term: "Relief invariants",
    definition:
      "Guarantees that relief takes the same predictable effort and support whichever path a person comes in by. Relief invariants are tested in crisis rehearsals and anchored by care floors.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "repair-quorums",
    term: "Repair quorums",
    definition:
      "Minimum participation rules for authorizing fixes so impacted communities have a seat in deciding remedies. Repair quorums counter accountability diffusion and legitimize restitution.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "rest-cycle-enforcement",
    term: "Rest cycle enforcement",
    definition:
      "Built-in mechanisms that enforce rest and recovery\u2014rotation policies, cooldown timers, enforced downtime\u2014so fatigue does not translate into harm. Enforcement protects maintenance metabolism and compassion bandwidth.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "conservancy-principle",
    term: "The conservancy principle",
    definition:
      "Designers hold the people a system affects and the resources it draws on in trust, and must leave systems safer and easier to repair than they found them. Conservancy prioritizes repair, stoppability, and reducing moral debt.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "burden-inversion-rule",
    term: "The burden inversion rule",
    definition:
      "When harm occurs, the system shoulders effort before the person harmed does. Burden inversion lowers the user burden ratio and demands rapid restoration.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "stop-before-explain-rule",
    term: "The stop-before-explain rule",
    definition:
      "Halt harmful behavior first, then justify or refine it. Systems must trigger ethical interrupts before offering explanations, preserving reversibility.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "maintenance-doctrine",
    term: "The maintenance doctrine",
    definition:
      "A system stays safe to rely on only while it is maintained: funded maintenance metabolism, scheduled maintenance windows, and transparent logs.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "low-failure-load-principle",
    term: "The principle of low-failure-load design",
    definition:
      "Design so that when failures occur, human impact is contained. This principle motivates graceful degradation, care floors, and low irreversibility indices.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "reversibility-mandate",
    term: "The reversibility mandate",
    definition:
      "Critical actions must be undoable or paired with rollback lanes. The mandate aligns with time-to-restore targets and contestability.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "contestability-guarantee",
    term: "The contestability guarantee",
    definition:
      "People affected by system decisions can challenge, change, or overturn them, and can win. Guarantees include wide permission surfaces, high appeal passage rates, and transparent design authority.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "complexity-displacement",
    term: "Complexity displacement",
    definition:
      "Achieving internal process simplification by externalizing friction, edge cases, and ambiguity onto humans without accounting for the transfer. Diagnostic: ask whether the world became simpler or whether people were forced to become more adaptive.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "closure-without-remainder",
    term: "Closure without remainder",
    definition:
      "The technocratic fallacy that what a formal system cannot represent ceases to exist or requires no governance. Countered by the invariant: not represented implies unresolved.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "residual-complexity",
    term: "Residual complexity",
    definition:
      "The friction, ambiguity, and repair labor that remains unresolved after a formal model simplifies a workflow. Formal systems do not eliminate what they cannot represent; they redistribute the burden of dealing with it.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "falsified-denominator",
    term: "Falsified denominator",
    definition:
      "An accounting distortion that measures speed only inside the machine boundary and counts the human attention, troubleshooting, and dispute labor outside it as zero cost.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "constitutional-governance",
    term: "Constitutional governance",
    definition:
      "A governance discipline centered on authority grants, standing, and enforceable recourse rather than behavioral alignment. Focuses on what authority a system holds and what happens at the point of model failure.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "post-optimization-rigor",
    term: "Post-optimization rigor",
    definition:
      "The engineering discipline required after metric optimization reaches its boundary, focusing on independent review, measuring uncounted absorption, and failure-point standing.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "legibility",
    term: "Legibility",
    definition:
      "How understandable a system’s actions, reasoning, and ownership are to the people affected. Legibility lets people find who decided, why, and how to respond; it does not guarantee the decision can be changed.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "sociotechnical-alignment",
    term: "Sociotechnical alignment",
    definition:
      "Alignment achieved across tools, interfaces, incentives, workflows, and structures, as well as inside a model. Sociotechnical alignment keeps the ethical load path intact under pressure.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "delegated-agency",
    term: "Delegated agency",
    definition:
      "The capacity to act with consequence on an institution’s behalf, held by a machine, a human, or both. Delegated agency is created by an authority grant and exercised through a decision system, not a property of the model itself.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "consequential-decision",
    term: "Consequential decision",
    definition:
      "A decision that changes someone’s access, money, obligations, safety, or standing and that the institution must answer for. The consequential decision is the unit of governance in Ethotechnics.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "decision-system",
    term: "Decision system",
    definition:
      "The assembled machinery that produces a consequential decision: models, rules engines, queues, humans, policies, and the data they read. Ethotechnics governs the whole system, not any single component.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "justified-delegation",
    term: "Justified delegation",
    definition:
      "A delegation whose authority, evidence, and correction capacity are all currently in force. Justification is a present-tense test, not a fact about the launch review.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "unowned-harm",
    term: "Unowned harm",
    definition:
      "Negative outcomes for which no individual or role is accountable, even though the system caused them. Unowned harm signals accountability diffusion and weak traceable ownership.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "ethics-theater",
    term: "Ethics theater",
    definition:
      "Public displays of ethical concern without operational mechanisms that change system behavior. Ethics theater often masks compliance collapse and low contestability.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "authority-drift",
    term: "Authority drift",
    definition:
      "The gap that opens when what a system does moves away from what its authority grant permits or its evidence supports. Drift accumulates through steps that each look too small to review.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "automation-ratchet",
    term: "Automation ratchet",
    definition:
      "Scope growth by accretion, where each extension of an automated system is too small to trigger review and no single step widens the delegation. The ratchet turns one way only.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "institutional-capture",
    term: "Institutional capture",
    definition:
      "The state where a system has absorbed enough of an institution’s capability, staff, and decision paths that the institution can no longer evaluate, constrain, or replace it.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "rubber-stamp-review",
    term: "Rubber-stamp review",
    definition:
      "Review that approves at a rate and speed incompatible with real scrutiny. The artifact of review exists; the control does not.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "normalized-dependence",
    term: "Normalized dependence",
    definition:
      "Reliance on a system that has become invisible because it is ordinary: no one records it, no fallback is maintained, and withdrawal is no longer a question anyone asks.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "capacity-depreciation",
    term: "Capacity depreciation",
    definition:
      "The decay of correction capacity in the absence of replenishment: experts leave, alternatives lapse, rollback scripts stop being run. The institution becomes less able to correct without any decision causing it.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "jurisdictional-path-dependence",
    term: "Jurisdictional path dependence",
    definition:
      "The condition where the questions an institution asks about a system’s scope come to track the system’s own categories and vocabulary. The system’s answers shape the next question asked.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "exception-absorption",
    term: "Exception absorption",
    definition:
      "Handling an exception without changing the rule, category, workflow, or authority that produced it. Each case is closed and nothing upstream changes.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "workaround-presumption",
    term: "Workaround presumption",
    definition:
      "The rule that a recurring workaround raises a presumption of upstream design failure. The first reading of repeated improvisation is that the formal system does not fit the world it operates in.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "preserved-dependence",
    term: "Preserved dependence",
    definition:
      "An institution's continued reliance on compensatory work it knows about, kept because relying on it costs the institution less than ending it. It is a conflict of interest, not an information gap. Measuring the work more closely does not address it; authority over the conditions that produce the work does.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "discretion-migration",
    term: "Discretion migration",
    definition:
      "The pattern where automation relocates rather than removes judgment, reappearing in thresholds, categories, exception rules, and appeal routing—along with authority over it.",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "governability",
    term: "Governability",
    definition:
      "The degree to which a system can be steered, paused, audited, corrected, or shut down after deployment. High governability requires stoppability, reversibility, and durable contestability.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "incident-literacy",
    term: "Incident literacy",
    definition:
      "The ability to recognize failures as incidents rather than anomalies and respond with containment, logging, escalation, and repair.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "capability-discovery",
    term: "Capability discovery",
    definition:
      "The practice of finding out what an assembled decision system can do, including reachable tools, side effects, and action classes nobody intended to expose. The output is a catalog, not a permission.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "correction-capacity",
    term: "Correction capacity",
    definition:
      "The measured ability to intervene: which interventions exist, who may invoke them, how long they take, and how much load the institution can absorb. Counted in people, clocks, and rehearsals, not asserted in policy.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "technical-reversibility",
    term: "Technical reversibility",
    definition:
      "The first level of the reversibility ladder: the mechanism exists and works, proven on the running version. A floor rather than a finding—a working switch says nothing about the levels above it.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "operational-reversibility",
    term: "Operational reversibility",
    definition:
      "The second level of the reversibility ladder: people and processes can absorb the correction. Staff know the fallback, queues hold the load, and the manual path has been exercised recently enough to work.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "institutional-reversibility",
    term: "Institutional reversibility",
    definition:
      "The third level of the reversibility ladder: the organization survives having made the correction. Commitments, contracts, reputations, and budgets stay serviceable after withdrawal.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "intervention-specification",
    term: "Intervention specification",
    definition:
      "Who may intervene, on what signal, with what information and authority, on what timescale, and what happens on disagreement. It replaces “human in the loop” as a control name.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "prospective-auditability",
    term: "Prospective auditability",
    definition:
      "Designing a system so audit questions can be answered later by recording evidence, authority, and reasoning at decision time. It cannot be retrofitted onto decisions already made.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "evaluation-independence",
    term: "Evaluation independence",
    definition:
      "The property that no single provider is necessary to both execute and evaluate a consequential process. A system that grades its own homework has no detection component.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "exception-learning",
    term: "Exception learning",
    definition:
      "The modification of a system by its own exceptions: a recurring failure changes the rule, category, workflow, or authority that produced it. The counterpart of exception absorption.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "case-corrigibility",
    term: "Case corrigibility",
    definition:
      "The capacity to fix a particular bad decision: an appeal is heard, a reversal issued, a person restored. Locally corrigible, but the pattern may remain.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "structural-corrigibility",
    term: "Structural corrigibility",
    definition:
      "The capacity to modify the machinery that keeps producing failures: repeated exceptions change the rule, category, workflow, or authority generating them.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "institutional-learning",
    term: "Institutional learning",
    definition:
      "Learning that changes what an institution is permitted to do, as distinct from what a model predicts. The test is whether the failure altered the evidentiary rule, authority, or allocation of burden.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "corrective-debt",
    term: "Corrective debt",
    definition:
      "The accumulated gap between an institution’s capacity to act and its capacity to detect, contest, reverse, and repair errors. Grows as action capacity compounds while correction machinery stays fixed.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "abstention",
    term: "Abstention",
    definition:
      "A positive capability to decline to act in three forms: epistemic (evidence insufficient), jurisdictional (not mine to decide), and remedial (acting now would cause uncorrectable harm).",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "constitutional-debt",
    term: "Constitutional debt",
    definition:
      "The divergence between what a system can technically do and what any recorded justification permits. The automation ratchet is its engine and authority drift is its balance.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "restoration-completeness",
    term: "Restoration completeness",
    definition:
      "“Restored” means the person is back to the prior state in every downstream system, not only unblocked in the one that erred. Time-to-restore includes reconciliation with dependencies.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "downstream-harm-trace",
    term: "Downstream harm trace",
    definition:
      "A record of where a harmful decision propagated across vendors, data brokers, internal teams, and agencies, so remedies follow the harm.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "shadow-queue",
    term: "Shadow queue",
    definition:
      "A queue users cannot see—internal backlogs, vendor queues, or “pending review” pools—that still determines outcomes. Erodes time transparency and contestability.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "grant-state",
    term: "Grant state",
    definition:
      "The current status of an authority grant, drawn from a closed set such as allowed, review_required, suspended, and withdrawn. States are what triggers can move.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "capability-catalog",
    term: "Capability catalog",
    definition:
      "The record of what a decision system can do, maintained separately from what it is permitted to do. The catalog is what an authority grant is written against.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "dependency-state",
    term: "Dependency state",
    definition:
      "The current degree to which an institution relies on a system: who depends on it, what breaks without it, what expertise is retained, and how long substitution would take.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "substrate-profile",
    term: "Substrate profile",
    definition:
      "A nine-property classification of a deployment—access, control, update authority, stability, revocation, substitutability, observability, standing, and dependency—replacing the open-versus-closed question.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "virtue-as-access-control",
    term: "Virtue as access control",
    definition:
      "When composure, clarity, gratitude, or “professionalism” become requirements for baseline safety or remedy. Turns emotional labor into a gate.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "affect-invariance",
    term: "Affect-invariance",
    definition:
      "Baseline safety and remedy should not change based on distress, fatigue, disability, fear, or anger. The primary threat model is virtue as access control.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "behavioral-shaping",
    term: "Behavioral shaping",
    definition:
      "The way systems nudge, constrain, or normalize user behavior through defaults and design choices.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "error-bearing-party",
    term: "Error-bearing party",
    definition:
      "Anyone who absorbs the consequences of a system’s errors: the people its decisions fall on, and the staff whose corrective labor keeps it usable.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "adaptive-capacity",
    term: "Adaptive capacity",
    definition:
      "The finite human resource an arrangement consumes when it demands that people adapt to it: attention, memory, flexibility, time, health, and care.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "degradation-restoration-asymmetry",
    term: "Degradation/restoration asymmetry",
    definition:
      "It is cheap or fast to harm or change someone’s state, but slow and costly to reverse. Inflates time-to-restore and compounds moral debt.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "endurance-as-allocation",
    term: "Endurance-as-allocation",
    definition:
      "Who gets the right outcome is determined by who can survive the correction path, not who is substantively right. Weaponizes endurance asymmetry.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "stamina-pricing",
    term: "Stamina pricing",
    definition:
      "Rights exist in theory, but the option to claim them is priced in paperwork, waiting, and persistence.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "harm-internalization",
    term: "Harm internalization",
    definition:
      "Designing systems so creators and operators bear the costs of failures instead of externalizing them to users or society.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-ethics",
    term: "Maintenance ethics",
    definition:
      "Responsibility for a system continues after deployment through monitoring, updates, incident response, and repair.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "channel-switching-penalty",
    term: "Channel switching penalty",
    definition:
      "The hidden harm of being bounced between phone, email, chat, and portal channels, often resetting clocks or losing context.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "evidence-burden-ceiling",
    term: "Evidence burden ceiling",
    definition:
      "A hard cap on documentation demands placed on claimants for a given harm class, enforcing fair burden distribution during appeals.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "evidence-recycling",
    term: "Evidence recycling",
    definition:
      "Reusing previously verified information so people do not have to re-prove identity or harm repeatedly. Applies continuity of state to documentation.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "verification-harm",
    term: "Verification harm",
    definition:
      "When verification itself causes harm through delays, denials, exclusion, or stress spirals, increasing the burden index and eroding contestability.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "compensatory-adaptation",
    term: "Compensatory adaptation",
    definition:
      "Human effort required because an arrangement failed to accommodate foreseeable reality. Distinct from the productive adaptation that learning and care require.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "composed-latency",
    term: "Composed latency",
    definition:
      "The time a chain of delegations takes, measured from decision records rather than nominal per-hop promises. Hops compose additively and can consume the human’s intervention window.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "silent-harm-discovery",
    term: "Silent-harm discovery",
    definition:
      "The deployer-side duty to find harm nobody complained about, computed per affected population from records the operator already retains, on a declared cadence.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "identity-fragility-index",
    term: "Identity fragility index",
    definition:
      "A measure of how likely identity or eligibility checks are to fail under ordinary life variance. High fragility indicates brittle verification design, not user fault.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "consent-revocation-latency",
    term: "Consent revocation latency",
    definition:
      "The time from a person saying “I revoke consent” to behavior changing everywhere it should. Low latency keeps consent journeys credible.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "repair-debt-interest-rate",
    term: "Repair debt interest rate",
    definition:
      "The rate at which unrepaired harm compounds through financial penalties, health risk, displacement, or reputational spread. Converts moral debt into time-bound obligations.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "exposure-score",
    term: "Exposure score",
    definition:
      "A composite indicator of structural risk: dependency depth multiplied by substitution cost multiplied by correction latency, read as a trend rather than a single number.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "substitution-cost",
    term: "Substitution cost",
    definition:
      "What it would take to replace a system with an alternative meeting the same obligation: staff-weeks, retained expertise, exit terms, and elapsed time.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "evaluation-layer",
    term: "Evaluation layer",
    definition:
      "The level of the stack at which an evaluation holds—model, agent, delegation, institution, or consequence—so a clean result at one level is never read as another.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "exit-cost",
    term: "Exit cost",
    definition:
      "What it costs the dependent party to stop depending on a system: money, time, reconstructed records, and lost access. Measured from the side the decisions land on.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "challenge-density",
    term: "Challenge density",
    definition:
      "The rate at which challenges arrive against the capacity to answer them. Congestion is the point where the open circuit is usually lost.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "attestation",
    term: "Attestation",
    definition:
      "The signature binding a record to a named key holder at a point in time, so authority attributable to no one is distinguishable from authority nobody signed.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "liability-record",
    term: "Liability record",
    definition:
      "The object naming the party that accepts liability for a delegation’s latency and errors, the instrument binding them, and the carve-outs they claim.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "carve-out",
    term: "Carve-out",
    definition:
      "An exclusion, cap, or condition the accepting party claims against a recorded liability. Recorded before harm, in the issuer’s words, not assembled after.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "delegation-chain",
    term: "Delegation chain",
    definition:
      "A sequence of delegations that together produce one consequential decision. The chain is itself a delegation, governed at the layer where it fails.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bounded-autonomy",
    term: "Bounded autonomy",
    definition:
      "Autonomy granted only within explicit limits; approaching or crossing them triggers escalation to design authority or oversight. The limits live in an authority grant.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "scope-discipline",
    term: "Scope discipline",
    definition:
      "The practice of not exceeding one’s mandate, even when doing so appears helpful or efficient. Enforces the permission surface and respects bounded autonomy.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "stewardship",
    term: "Stewardship",
    definition:
      "An explicit, ongoing role responsible for system behavior over time, with authority to pause, fix, or retire it.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "obligation-continuity",
    term: "Obligation continuity",
    definition:
      "Whether responsibility stays attached across time, handoffs, and narrative resets instead of evaporating.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "delay-as-power",
    term: "Delay as power",
    definition:
      "The ability to remain wrong without consequence by stretching time (“pending,” “in review”). Operationalizes latency-as-action.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "performance-gated-remedy",
    term: "Performance-gated remedy",
    definition:
      "The correction path works only if someone performs well under stress; the system treats composure as eligibility.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bindingness-after-contact",
    term: "Bindingness after contact",
    definition:
      "The obligations that attach once harm is reported or help is requested, and whether they fall on the institution or on the claimant.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "recognition-as-solvent",
    term: "Recognition as solvent",
    definition:
      "Being “heard” is treated as if it discharges obligation, pressuring the claimant to stop escalating without repair.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "unowned-obligation",
    term: "Unowned obligation",
    definition:
      "Responsibility exists but no owner or time-bound state transition is attached; people are bounced between channels.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "closure-code-regime",
    term: "Closure-code regime",
    definition:
      "Person-level reason codes that convert structural scarcity into individual failure (“withdrew,” “no response,” “noncompliant”).",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "attrition-as-resolution",
    term: "Attrition-as-resolution",
    definition:
      "An anti-pattern where drop-off is counted as success and metrics improve when people give up. Hides unmet obligations behind completion dashboards.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "legitimacy-engineering",
    term: "Legitimacy engineering",
    definition:
      "Legitimacy treated as measurable requirements: standing and remedy for the people a system decides about, a named authority on stated evidence, a halt path, and time-bounded repair.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "exit-coercion",
    term: "Exit coercion",
    definition:
      "Consent and silence extracted under duress during departures, often via NDAs, retaliation risk, or narrative erasure.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "retaliation-surface",
    term: "Retaliation surface",
    definition:
      "Where the system can punish people for contesting, pausing, refusing, or exiting—throttling, stricter scrutiny, or service withdrawal.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "non-retaliation-guarantee",
    term: "Non-retaliation guarantee",
    definition:
      "A binding commitment that contesting, pausing, refusing, or exiting will not trigger adverse treatment.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "appeal-integrity",
    term: "Appeal integrity",
    definition:
      "Appeals are judged on merits with transparent criteria, named authority, and documented outcomes—not absorbed into procedural theater.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "escalation-reliability",
    term: "Escalation reliability",
    definition:
      "Escalation paths work under load, after hours, and for novices, as shown in drills rather than in documentation.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "decision-reversal-authority",
    term: "Decision reversal authority",
    definition:
      "A formally granted power to undo harmful decisions, not merely recommend reconsideration. Turns reversibility into an enforceable capability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "restitution-ladder",
    term: "Restitution ladder",
    definition:
      "A tiered remedy system moving from apology to reversal, compensation, repair service, and systemic fix triggers.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "remedy-equivalence",
    term: "Remedy equivalence",
    definition:
      "Manual and automated channels must offer equivalent remedy outcomes, timelines, and authority, so no one is penalized for choosing an accessible path.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "case-ownership-continuity",
    term: "Case ownership continuity",
    definition:
      "Cases do not become orphaned across handoffs; ownership persists through vacations, organizational changes, and vendor transfers.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "revisable-delegation",
    term: "Revisable delegation",
    definition:
      "Delegation that stays tied to the evidence that justified it, so the grant can be narrowed, suspended, or withdrawn when that evidence changes.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-grant",
    term: "Authority grant",
    definition:
      "The record permitting a named holder to take a bounded class of actions, for whom, under what conditions, and until when. What makes authority reviewable and withdrawable.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-lease",
    term: "Authority lease",
    definition:
      "The stance that authority is held for a term against a renewable justification rather than owned outright. It expires by default; renewal requires fresh evidence.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "policy-record",
    term: "Policy record",
    definition:
      "A versioned statement of the propositions a delegation rests on, each with an expiry. Grants cite policy records so assumptions decay visibly instead of silently.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "review-trigger",
    term: "Review trigger",
    definition:
      "A declared rule connecting an observation to a state change: when this threshold occurs, this grant moves to this state, answered by this owner, within this clock.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "correction-obligation",
    term: "Correction obligation",
    definition:
      "The duty an institution takes on when it delegates consequential action: to notice, stop, reverse, and repair what the delegate does.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "preserved-capacity",
    term: "Preserved capacity",
    definition:
      "Institutional capability deliberately maintained so the institution can still question, replace, or withdraw a system: retained expertise, manual paths, and independent records.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "corrective-standing",
    term: "Corrective standing",
    definition:
      "The recognized capacity of an error-bearing party to initiate correction: a challenge that must be received, answered, judged, and able to change state.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standing-mechanism",
    term: "Standing mechanism",
    definition:
      "The apparatus making standing real: who may challenge which decisions, with what evidence, responders, deadlines, and possible state transitions.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-force",
    term: "Procedural force",
    definition:
      "The property of a challenge that obliges a response and can change a state, as distinct from a veto that stops action outright.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "consent-depth",
    term: "Consent depth",
    definition:
      "The distinction between consenting to enter a dependency and consenting to every degree of dependency its operation later produces.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "corrigibility-rent",
    term: "Corrigibility rent",
    definition:
      "Power gained because others cannot cheaply make you answer for being wrong—through impossible complaints, proprietary evidence, or appeals that arrive after harm is irreversible.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "insulation",
    term: "Insulation",
    definition:
      "Whatever prevents the consequences of institutional decisions from traveling back to the actors who can revise the generating rules. Distance from corrective consequence.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "consequential-contradiction",
    term: "Consequential contradiction",
    definition:
      "The capacity of the governed world to force a system to reconsider—not merely to complain. Contradiction is consequential when it has state-changing force.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "halt-stratification",
    term: "Halt stratification",
    definition:
      "Halt authority tiered by blast radius: a frontline operator pausing one case, a supervisor halting a queue, a steward stopping a system.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "admission-gate",
    term: "Admission gate",
    definition:
      "The authorization decision preceding any grant: whether the system should act at all. Records the evidence, scope, and outcome—including deliberate non-use.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "dependence-reciprocity",
    term: "Dependence reciprocity",
    definition:
      "Dependence runs both ways. A population’s reliance on an institution’s system generates duties: notice, preservation of exit, and continuity at withdrawal.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "corrective-power",
    term: "Corrective power",
    definition:
      "The effective capacity of affected people to make an arrangement change when its demands become unreasonable—to force reconsideration or reversal, not merely complain.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-burden-as-price",
    term: "Procedural burden as price",
    definition:
      "Paperwork and friction are not incidental; they are rationing mechanisms that should be capped, disclosed, or penalized.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "binding-clock",
    term: "Binding clock",
    definition:
      "An enforceable timer governing system obligations once a decision enters a pending or contested state. Time itself becomes a governed surface.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "reversal-sla",
    term: "Reversal SLA",
    definition:
      "Specifies maximum time, authority, and procedure for undoing a contested or erroneous decision. Reversal performance is a reliability metric, not an exception.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "unearned-closure",
    term: "Unearned closure",
    definition:
      "The system marks something resolved without repairing the underlying harm; the residual cost remains with the person.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "actionability-threshold",
    term: "Actionability threshold",
    definition:
      "The level of confidence, authorization, and oversight required before information becomes action. Protects against low-signal decisions.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "normative-uncertainty",
    term: "Normative uncertainty",
    definition:
      "Situations where the right action is unclear, requiring caution, clarification, or human judgment rather than confident automation.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "harm-receipt",
    term: "Harm receipt",
    definition:
      "A claimant-facing artifact documenting what happened, what the system believes, and what it will do next, by when.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "access-cliff",
    term: "Access cliff",
    definition:
      "A threshold where small variance causes catastrophic loss of service—lockout, termination, or loss of benefits. Mitigated with soft edges and gradual ramps.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "expansion-decision",
    term: "Expansion decision",
    definition:
      "A separate authorization decision when a delegation is widened in scope, population, autonomy, or consequence. The direct block on the automation ratchet.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-finality",
    term: "Non-finality",
    definition:
      "The property that a decisive action does not close its own categories, evidence, or jurisdiction against revision. Appeal interrupts the conversion of decision into finality.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "withdrawal-rehearsal",
    term: "Withdrawal rehearsal",
    definition:
      "A scheduled exercise where a system is stood down and the fallback carries real work, producing timings and failures. Evidence, not a claim.",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "policy-as-state",
    term: "Policy as state",
    definition:
      "Policy is a state of the running system, not an input consumed at deployment. A policy record has a version, assumptions, an expiry, and a current status.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "meaningful-control",
    term: "Meaningful control",
    definition:
      "The condition where a human is part of the control system: they can see the problem, hold authority to act, have time, a path to disagree, and incentives permitting disagreement.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "non-conversion-principle",
    term: "The non-conversion principle",
    definition:
      "A fact about a system does not become a fact about its authority on its own. Capability and success are evidence, never a grant; authority changes only through recorded state transitions.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "human-non-substitutability",
    term: "Human non-substitutability",
    definition:
      "A model of a person is not the person. No representation acquires automatic authority to extinguish the represented person’s standing against it.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "safe-incompleteness",
    term: "Safe incompleteness",
    definition:
      "A system should improve its representation of people and preserve their contestation at once. An incomplete and contestable system is safer than a complete and final one.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "anti-conversion-rights",
    term: "Anti-conversion rights",
    definition:
      "Rights as interruptions of illegitimate conversions: privacy, due process, consent, appeal, and separation of powers each keep a capability from becoming an authorization.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "excluded-case",
    term: "The excluded case",
    definition:
      "The case a representation excludes is potentially evidence about the category, not merely noise. Dissent and standing are epistemic, not only political.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "feedback-proximity",
    term: "Feedback proximity",
    definition:
      "The causal distance between an institutional error and the actors who can revise the generating rule should stay short. Proximity is not visibility.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "asymmetric-capacity-restraint",
    term: "Asymmetric-capacity restraint",
    definition:
      "An institution’s obligations to remain contestable and revisable grow with its capacity to classify, monitor, automate, and scale. Capability may expand only as fast as correction checks it.",
    appliesTo: ["M. Foundational principles"],
  },
];

/**
 * Tooltips used to carry their own definitions, written apart from the
 * entries, and about 150 of 367 had drifted from the entry they link to: the
 * Contestability tooltip defined it as forcing "a decision to become a
 * contestable object" while the entry said a person can challenge the
 * decision and win. A tooltip now shows its entry's opening sentence, so the
 * two cannot disagree. The seed text is used only for a term with no entry.
 */
const LABEL_SENTENCE = /^(normative|informative) definition\.$/i;
const plainText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
const openingSentence = (html: string): string => {
  const sentences = (plainText(html).match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !LABEL_SENTENCE.test(sentence));
  let lead = "";
  for (const sentence of sentences) {
    lead = lead ? `${lead} ${sentence}` : sentence;
    if (lead.length >= 60) break;
  }
  return lead;
};
const entryLeadById = new Map(
  glossaryContent.categories
    .flatMap((category) => category.entries)
    .map((entry) => [entry.id, openingSentence(entry.bodyHtml)]),
);

export const glossaryTerms: GlossaryTerm[] = glossaryTermSeeds.map((term) => ({
  ...term,
  definition: entryLeadById.get(term.slug) || term.definition,
}));
