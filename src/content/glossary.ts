import type { PageWithPermalink, PublicationMetadata } from "./types";
import glossaryData from "./glossary.json";

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

export type GlossaryEntry = {
  id: string;
  title: string;
  status: string | null;
  classes?: string[];
  bodyHtml: string;
  scope?: string;
  adjacentTerms?: string[];
  operationalTests?: string[];
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
  glossaryData[0] as GlossaryContent;

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "ethotechnics",
    term: "Ethotechnics",
    definition:
      "The craft of designing systems that can behave morally. Where ethics asks \u201cWhat should I do?\u201d and systems theory asks \u201cHow does it behave?\u201d, Ethotechnics asks: How can it behave well? Moral behavior is treated as an architectural capability, not a personal virtue.",
    appliesTo: ["hospitals", "platforms", "governance"],
  },
  {
    slug: "moral-behavior",
    term: "Moral Behavior (of Systems)",
    definition:
      "Observable patterns of system behavior that prevent harm, share burden fairly, and keep people contestable and whole. Moral behavior is evaluated through MPIs such as time-to-halt , reversibility , and fair burden distribution \u2014not by stated intent.",
    appliesTo: ["platforms", "finance", "safety"],
  },
  {
    slug: "ethical-load-path",
    term: "Ethical Load Path",
    definition:
      "The route moral responsibility travels through a system\u2014across automation, humans, and institutions. A clear ethical load path shows who can stop, reverse, or repair harm at each stage, linking design authority , oversight horizons , and the repair log .",
    appliesTo: ["transit", "ops-teams", "oversight"],
  },
  {
    slug: "ethotechnic-audit",
    term: "Ethotechnic Audit",
    definition:
      "A structured assessment of a system\u2019s capacity to stop harm, reverse it, distribute burden fairly, remain contestable, and enable accountability. Audits surface where stoppability or reversibility fail and guide concrete remediation steps.",
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
    term: "Ethotechnic Maturity",
    definition:
      "A developmental scale describing how fully a system embodies Ethotechnic capabilities. Early maturity focuses on stopping acute harms; later stages add graceful degradation , contestability , and regular care retrospectives . The highest level treats ethics as continuous operations, with published SLJs and funded maintenance practice.",
    appliesTo: ["rail", "sre", "maturity"],
  },
  {
    slug: "mechanism-first-analysis",
    term: "Mechanism-first Analysis",
    definition:
      "An approach that prioritizes system mechanics—defaults, authority, clocks, reversibility—over declared values or intentions, because mechanics determine outcomes under load.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "architecture-over-values",
    term: "Architecture over Values",
    definition:
      "The claim that “ethical” outcomes depend less on what institutions say they value and more on the enforceable structure of how decisions are made and reversed.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "state-plus-clocks-model",
    term: "State + Clocks Model",
    definition:
      "A way of seeing power as state transitions plus time: who can change state, how quickly, and whether reversal is time-bound.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "contestability-architecture",
    term: "Contestability Architecture",
    definition:
      "The set of design features that make contestation real: decision objects, clock-start, binding authority, evidence parity, and guaranteed override paths.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "control-loops-constraints-framing",
    term: "Control Loops (Constraints Framing)",
    definition:
      "A safety lens where governance is modeled as feedback: detect harm, trigger intervention, enforce constraints, and learn. Useful for translating Ethotechnics into engineering terms.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "moral-latency",
    term: "Moral Latency",
    definition:
      "The delay between harm occurring and the system recognizing it. Automated systems create harms faster than human oversight can register, demanding velocity friction and ethical interrupts .",
    appliesTo: ["hospitals", "automation", "latency"],
  },
  {
    slug: "accountability-diffusion",
    term: "Accountability Diffusion",
    definition:
      "Responsibility dissolves across teams, tools, and incentives until no one can intervene. A defining pattern of modern institutions and a direct threat to clear design authority .",
    appliesTo: ["platforms", "governance", "hospitals"],
  },
  {
    slug: "extraction",
    term: "Extraction",
    definition:
      "When a system pulls value\u2014data, attention, labor, or social capital\u2014without returning care, consent, or repair. Extraction hides true costs through externalization and steep burden gradients , hollowing trust.",
    appliesTo: ["labor", "platforms", "ai"],
  },
  {
    slug: "extraction-by-endurance",
    term: "Extraction by Endurance",
    definition:
      "Systems that depend on workers or users absorbing fragility through burnout, emotional labor, or unpaid cognitive work\u2014often mislabeled as \u201cresilience.\u201d Ethotechnic practice aims to invert this burden with fair burden distribution .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "drift",
    term: "Drift (System Drift)",
    definition:
      "The natural tendency of systems to externalize harm over time unless constrained by protective friction and moral performance indicators .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "externalization",
    term: "Externalization",
    definition:
      "Pushing risk, cost, or harm onto other teams, communities, or the future so metrics look clean. Externalization shows up as pollution, shadow labor, or brittle dependencies that live outside audits. Ethotechnics counters it with oversight horizons , MPIs , and transparent repair logs .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "brittleness",
    term: "Brittleness",
    definition:
      "When a system shatters under real-world variance\u2014unexpected inputs, refusals, or edge cases\u2014forcing humans to absorb impact. Brittleness signals missing soft edges , thin graceful degradation , and poor refusal tolerance .",
    appliesTo: ["aviation", "automation", "support"],
  },
  {
    slug: "optimization-myopia",
    term: "Optimization Myopia",
    definition:
      "Metric-chasing that narrows attention to throughput or growth while ignoring MPIs . Myopic optimization erodes contestability , raises failure load , and often fuels extraction .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "precision-laundering",
    term: "Precision Laundering",
    definition:
      "Using detailed metrics or probabilistic scores to disguise inequity as objectivity. Precision laundering hides burden gradients and externalization behind statistical gloss, undermining explainability for accountability .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "compliance-collapse",
    term: "Compliance Collapse",
    definition:
      "When rigid policy checklists replace judgment, causing teams to follow rules while harm worsens. Compliance collapses occur when design authority is weak and contestability is low, leaving no path to pause or repair.",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "unseen-harm",
    term: "Unseen Harm",
    definition:
      "Harm that does not produce immediately legible signals—silence, withdrawal, dropout, dissociation—and is therefore misread as “no issue.”",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "ethics-debt",
    term: "Ethics Debt",
    definition:
      "The accumulated gap between capability and governability, whose interest is paid as incidents, backlash, and legal constraint.",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "capability-overhang",
    term: "Capability Overhang",
    definition:
      "A precise mismatch where system power exceeds controls (brakes, owners, audits, reversibility, recourse).",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "stoppability",
    term: "Stoppability",
    definition:
      "A system\u2019s ability to halt harmful processes quickly and automatically\u2014without requiring heroism or escalation. Stoppability diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "reversibility",
    term: "Reversibility",
    definition:
      "The ease with which a system can undo a harmful state change\u2014restore access, correct a record, reverse a flag\u2014without extraordinary effort or power. Reversibility is a governance property: it determines whether mistakes are survivable. Reversibility diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "fair-burden-distribution",
    term: "Fair Burden Distribution",
    definition:
      "Failures do not fall hardest on the most vulnerable. Burden is treated as a design variable and measured via the user burden ratio . Fair burden distribution diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "contestability",
    term: "Contestability",
    definition:
      "The property of a system that allows affected people to force a decision to become a contestable object: something with reasons, a clock, an accountable authority, and a pathway to reversal. A system has contestability when \u201cthat\u2019s wrong\u201d can reliably become \u201chere is the specific decision, here is who can change it, and here is when they must respond.\u201d Contestability diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "refusability",
    term: "Refusability",
    definition:
      "A system\u2019s ability to let people say \u201cno\u201d without punishment or degradation\u2014including refusing data extraction, risky defaults, or coercive workflows\u2014while still preserving basic access and dignity. Refusability is not \u201copt-out exists\u201d; it\u2019s whether refusal is treated as a legitimate state rather than an error condition.",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "explainability-for-accountability",
    term: "Explainability for Accountability",
    definition:
      "Explanations that are actionable, not decorative. They reveal who made a decision and how it can be corrected, enabling contestability and audits . Explainability diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "human-refusal-tolerance",
    term: "Human Refusal-Tolerance",
    definition:
      "The system remains usable when people opt out, are confused, make mistakes, or withdraw cooperation. Refusal tolerance prevents extraction by endurance by ensuring refusals do not silently convert into extra unpaid work.",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "graceful-degradation",
    term: "Fail-soft / Graceful Degradation",
    definition:
      "A design principle where systems degrade safely under stress\u2014reduced capability rather than catastrophic denial\u2014especially under accessibility constraints.",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "soft-edges",
    term: "Soft Edges",
    definition:
      "Boundary conditions designed to cushion people instead of penalizing them\u2014graduated responses, warnings before lockouts, and reversible defaults. Soft edges reduce failure load and guard against brittleness .",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "fail-safe",
    term: "Fail-Safe Mode",
    definition:
      "The system defaults to the safest possible behavior when uncertain, prioritizing stoppability .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-open",
    term: "Fail-Open Mode",
    definition:
      "The system defaults to permissiveness under failure\u2014sometimes necessary, sometimes dangerous. Must be paired with velocity friction .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-silent",
    term: "Fail-Silent Mode",
    definition:
      "A harmful state where systems fail without signaling it; the worst possible form of failure because it hides moral latency .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "crumple-zone",
    term: "Crumple Zone / Human-as-Crumple-Zone",
    definition:
      "Originally: machines absorb force so people survive. Digitally: people absorb system failures so machines stay smooth. Ethotechnics reverses this direction of impact.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "harm-visibility",
    term: "Harm Visibility",
    definition:
      "How plainly a system exposes the human impact of its decisions in real time. High harm visibility pairs logs, narratives, and alerts so oversight horizons extend beyond dashboards and ethical interrupts trigger on lived effects, not just technical anomalies.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "dead-zones",
    term: "Dead Zones / Moral Dead Zones",
    definition:
      "Places in a system where harm occurs but no one can see, trace, or intervene. Closing dead zones is a goal of oversight horizons .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "escalation-horizon",
    term: "Escalation Horizon",
    definition:
      "The predefined point where automated control must yield to human judgment because risk, ambiguity, or moral latency is rising. Escalation horizons activate ethical interrupts and route cases to accountable stewards before crossing an irreversible boundary .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "interaction-surface",
    term: "Interaction Surface",
    definition:
      "The moments, interfaces, and channels where people experience system decisions and can intervene. Mapping the interaction surface reveals where to place dignity friction , widen the permission surface , and detect dead-user zones .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "bifurcation-by-contestability",
    term: "Bifurcation by Contestability",
    definition:
      "Systems split into high-contestability (slower, trusted, deployable in high stakes) and low-contestability (fast, then blocked).",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "maintenance-window",
    term: "Maintenance Window",
    definition:
      "A scheduled calm state where teams intentionally slow or stop throughput so inspections, upgrades, and rehearsals can happen without crisis pressure. Maintenance windows make stoppability routine instead of reactive. Each window is negotiated with the people impacted, includes published service guarantees, and documents which safeguards were tested so unfinished work rolls into the shared repair log .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "care-retrospective",
    term: "Care Retrospective",
    definition:
      "A facilitated reflection held while the system is still in a warning band to examine how maintenance load, emotional labor, and unresolved incidents are accumulating. Care retrospectives combine telemetry with frontline testimony. They redistribute responsibilities before burnout or harm escalates, triggering new maintenance windows or policy fixes when the team cannot keep absorbing risk.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "repair-log",
    term: "Repair Log",
    definition:
      "A living record of every mitigation, decision, and resource commitment made after a fault. Repair logs make accountability legible by linking people harmed, who intervened, and what evidence was used. They inform future care retrospectives , power audits, and service-level reports so follow-up work is traceable and burden does not drift back to the same communities.",
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
    term: "Cognitive Saturation Point",
    definition:
      "The load level at which human decision quality collapses\u2014too many alerts, too little time, or excessive context switching. Ethotechnic design lowers saturation by adding velocity friction , simplifying interaction surfaces , and staffing to real maintenance metabolism .",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "compassion-bandwidth",
    term: "Compassion Bandwidth",
    definition:
      "The sustainable amount of emotional labor a system asks of people\u2014care teams, moderators, frontline staff, or users. When compassion bandwidth is exceeded, dread work grows and extraction by endurance sets in.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "administrative-shame",
    term: "Administrative Shame",
    definition:
      "The feeling of being personally at fault for harms produced by system design. Often a signal that moral overhead is too high.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "dread-work",
    term: "Dread Work",
    definition:
      "Tasks people avoid because the system punishes mistakes or withholds relief. Dread work signals missing soft edges , low contestability , and declining compassion bandwidth .",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "executive-function-class-axis",
    term: "Executive Function (as a Class Axis)",
    definition:
      "The idea that modern systems sort people by their capacity to perform sustained administrative labor—tracking tasks, managing documentation, navigating ambiguity—making disability and burnout into structural disadvantage.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "human-factors",
    term: "Human Factors",
    definition:
      "A discipline that studies how systems interact with real human limits—fatigue, confusion, stress—often revealing that “user error” is actually design failure.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "operator-centered",
    term: "Operator-centered",
    definition:
      "Design that treats front-line workers as key safety components and ensures they have authority, tools, and non-punitive reporting to prevent harm.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "legibility-illegibility",
    term: "Legibility / Illegibility",
    definition:
      "Legibility: being representable in the system’s categories and workflows. Illegibility: being real but not representable, leading to churn, delay, or denial.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "refusal-budget",
    term: "Refusal Budget",
    definition:
      "The number of times a person can decline, pause, or question a request without retaliation. Healthy refusal budgets, backed by refusal tolerance and rights of exit , prevent coercion and surface heat maps of refusal .",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "burden-distribution",
    term: "Burden Distribution",
    definition:
      "How a system allocates the cost of operation or failure\u2014time, attention, stress, and emotional labor.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-gradient",
    term: "Burden Gradient",
    definition:
      "The slope of effort and risk across roles or communities. A steep burden gradient means those with the least power carry the heaviest operational load while decision-makers feel little friction. Mapping the gradient exposes where to redistribute work through fair burden distribution and reduce moral overhead .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "failure-load",
    term: "Failure Load",
    definition:
      "The amount of harm generated when the system fails. Ethotechnics seeks low-failure-load architectures supported by graceful degradation .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-transfer-event",
    term: "Burden Transfer Event",
    definition:
      "Moments when system failure pushes labor onto humans, often triggering moral overhead .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "cost-assignment",
    term: "Cost Assignment / Burden Shifting",
    definition:
      "A mechanism where systems offload the labor of safety, clarity, and follow-through onto individuals (forms, documentation, vigilance) while keeping institutional obligation low. It’s how “choice” becomes unpaid work.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "attention-tax",
    term: "Attention Tax",
    definition:
      "The ongoing monitoring burden imposed on individuals to prevent harm: checking portals, tracking deadlines, resubmitting documents, watching for silent rule changes. Attention becomes a cost of staying eligible.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-metabolism",
    term: "Maintenance Metabolism",
    definition:
      "The baseline flow of upkeep\u2014patching, cleaning, rehearsing, and caring\u2014that keeps a service alive when nothing is on fire. Healthy maintenance metabolism is budgeted, scheduled, and shared rather than squeezed between crises. Falling below it signals rising maintenance debt and invites maintenance windows before fragility compounds.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-debt",
    term: "Maintenance Debt",
    definition:
      "Accumulated obligations from skipping basic upkeep. The interest is paid in slower recovery, brittle systems, and people burning out to keep things running. Paying it down requires restoring the maintenance metabolism , scheduling maintenance windows , and tracking work in the repair log .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-overhead",
    term: "Moral Overhead",
    definition:
      "Extra work users or operators must do to behave ethically within a bad system.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "temporal-exaction",
    term: "Temporal Exaction",
    definition:
      "Uncompensated seizure of life-hours (time, attention, opportunity cost) as the price of accessing a right or correction. Temporal exaction is a form of extraction that inflates the user burden ratio.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-index",
    term: "Burden Index",
    definition:
      "A composite measure of how much effort, time, and emotional labor people expend to use or recover from a system. Inputs include the user burden ratio , human substitution index , and failure load ; rising scores signal extraction or asymmetric sustaining .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "asymmetric-sustaining",
    term: "Asymmetric Sustaining",
    definition:
      "When one group continually absorbs the toil of keeping a system alive so another group can move fast or claim success. It often hides behind gratitude for \u201cresilience\u201d while masking extraction . Ethotechnic practice flattens this by lowering the burden gradient and designing for stoppability so resilience is institutional, not personal.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "fragility-subsidy",
    term: "Fragility Subsidy",
    definition:
      "The unpaid labor, vigilance, or emotional buffering people contribute to keep brittle systems functioning. Fragility subsidies hide true costs, inflate success metrics, and deepen asymmetric sustaining .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-performance-indicators",
    term: "Moral Performance Indicators (MPIs)",
    definition:
      "Key metrics that show a system\u2019s ethical functioning: time-to-halt (TTH), reversibility rate, appeal success rate, burden ratios, and more. MPIs complement traditional KPIs by tracking how safely and fairly a system operates, not just how fast it grows. Moral performance indicators diagram",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "service-level-indicators",
    term: "Service-Level Indicators of Justice (SLJs)",
    definition:
      "Operational metrics tied directly to fairness, safety, and dignity. SLJs should sit alongside uptime and latency commitments.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "recourse-performance",
    term: "Recourse Performance",
    definition:
      "How well a system delivers review \u2192 reversal \u2192 remedy under realistic load and stress.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "institutional-metabolism-mapping",
    term: "Institutional Metabolism Mapping",
    definition:
      "A diagnostic mapping of where energy, care, time, and money circulate inside an institution. It visualizes maintenance metabolism, burden gradients , and points of extraction . Teams use the map to set SLJs , redesign roles, and decide where to invest new maintenance windows .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-halt",
    term: "Time-to-Halt (TTH)",
    definition:
      "Seconds between a harmful process beginning and the system stopping it\u2014an essential complement to stoppability . Time to halt diagram",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-restore",
    term: "Time-to-Restore (TTR)",
    definition:
      "How long it takes to reverse harm and return a person to their prior state. Low TTR is a signal of effective reversibility .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "appeal-passage-rate",
    term: "Appeal Passage Rate",
    definition:
      "The percentage of appeals resolved in favor of the user , a leading indicator of true contestability .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "irreversibility-index",
    term: "Irreversibility Index",
    definition:
      "The share of system actions that cannot be undone. Aim to keep this as low as possible through reversibility and graceful degradation .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "user-burden-ratio",
    term: "User Burden Ratio",
    definition:
      "How much work a user must perform to correct or navigate system errors. This metric feeds directly into fair burden distribution .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "human-substitution-index",
    term: "Human Substitution Index",
    definition:
      "A measure of how often humans must step in to compensate for system shortcomings\u2014manual reviews, ad-hoc patches, or empathy work. A rising index exposes heroism-dependent systems and motivates investment in graceful degradation .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "signal-credibility",
    term: "Signal Credibility",
    definition:
      "The trustworthiness of alerts, metrics, and reports used to govern a system. High credibility pairs transparent sampling, explainability for accountability , and human testimony so warnings trigger action instead of alert fatigue or dismissal.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "reversal-cost",
    term: "Reversal Cost",
    definition:
      "The time, money, emotional labor, documentation, and social risk required to undo an outcome. High reversal cost makes errors durable and turns “rights” into luxuries.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "durability-of-error",
    term: "Durability of Error",
    definition:
      "How long a wrong state persists once created, and how far it propagates (downstream systems, eligibility, reputation). A system is dangerous when it can create durable errors quickly but correct them slowly.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "moral-debt",
    term: "Moral Debt",
    definition:
      "The accumulated harm a system has caused but not repaired. Moral debt accrues interest as moral latency grows and people lose trust; it is paid down through pathways to restitution , transparent repair logs , and lowered time-to-restore .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "design-authority",
    term: "Design Authority",
    definition:
      "The accountable power to set moral constraints, choose safeguards, and fund enforcement. Clear design authority aligns incentives, protects contestability , and prevents accountability diffusion .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "oversight-horizon",
    term: "Oversight Horizon",
    definition:
      "The distance regulators, auditors, or affected communities can see into a system\u2019s decisions and their effects. Extending the horizon\u2014through harm visibility , traceable models, and shared repair logs \u2014shrinks dead zones .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contestability-legitimacy-hinge",
    term: "Contestability as the Legitimacy Hinge",
    definition:
      "A system is legitimate insofar as affected parties have standing, voice, and remedy against its decisions/actions.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "maintenance-budgets-legitimacy-budgets",
    term: "Maintenance Budgets are Legitimacy Budgets",
    definition:
      "The practical capacity to monitor, review, and repair is a political/organizational legitimacy input, not overhead.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "receipts-by-default",
    term: "Receipts-by-Default as a Legitimacy Interface",
    definition:
      "People should automatically get “what happened” records: actions taken, permissions used, reasons, and accountable owners.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "sovereignty-constraint-imposition",
    term: "Sovereignty as Constraint-Imposition Capacity",
    definition:
      "Sovereignty is the ability to impose enforceable constraints on infrastructure operating in your territory.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standards-wars-recourse-wars",
    term: "Standards Wars as Recourse Wars",
    definition:
      "Global competition shifts to whose regimes for auditability, liability, and redress become default through supply chains and procurement.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "democratic-vs-coercive-governability",
    term: "Democratic vs Coercive Governability",
    definition:
      "Governance infrastructure can either enable rights-preserving contestability or scaled conduct control, depending on who has standing and remedy.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "permission-surface",
    term: "Permission Surface",
    definition:
      "What users can do without institutional approval \u2014 a measure of autonomy and a prerequisite for contestability .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "earned-autonomy",
    term: "Earned Autonomy",
    definition:
      "Agent autonomy is a conditional privilege granted only when monitoring, brakes, and recourse capacity are demonstrably adequate.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "right-of-exit",
    term: "Exit Rights",
    definition:
      "Guaranteed, non-punitive ways to leave a system (or refuse a pathway) while preserving access to essentials, records, and future participation. Exit rights treat departure as a legitimate action, not a breach.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "externalized-harm-channels",
    term: "Externalized Harm Channels",
    definition:
      "The pathways an institution uses to push risk or cleanup onto others: contractors, users, bystanders, or future teams. Mapping these channels exposes externalization and informs fair burden distribution .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "stewardship-window",
    term: "Stewardship Window",
    definition:
      "A negotiated period where teams pause growth work to focus on care, maintenance, and accountability. Stewardship windows bundle maintenance windows , publish SLJs for the pause, and commit to closing items in the repair log before resuming throughput.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "governance-by-suspension",
    term: "Governance by Suspension",
    definition:
      "Control exercised by keeping matters unresolved long enough that time itself produces the outcome. Governance by suspension relies on non-decisions and exploits endurance asymmetry.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "endurance-asymmetry",
    term: "Endurance Asymmetry",
    definition:
      "Institutions can persist indefinitely; humans cannot. This makes delay an allocation mechanism that underwrites continuity privilege and punitive friction.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-privilege",
    term: "Continuity Privilege",
    definition:
      "Unequal access to enforceability produced by unequal capacity to maintain standing over time (attention, health, documentation, slack). Continuity privilege steepens the burden gradient for those without reserves.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "proxy-privilege",
    term: "Proxy Privilege",
    definition:
      "Unequal enforceability produced by unequal ability to delegate persistence (agents, intermediaries, automation). Proxy privilege lets some parties bypass futility thresholds that others face alone.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "latency-as-action",
    term: "Latency-as-Action",
    definition:
      "The principle that delay produced predictably by system rules (queues, resets, blocked escalation, absent deadlines) is attributable power, not mere inaction.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bounded-duration",
    term: "Bounded Duration",
    definition:
      "A fixed maximum time-to-resolution; breach triggers an enforceable disposition. Bounded duration pairs with stable clocks and time transparency.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-of-state",
    term: "Continuity of State",
    definition:
      "A persistent cumulative record; no forced repetition of validated inputs. Continuity of state reduces temporal exaction and protects contestability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "safe-pause",
    term: "Safe Pause / Status Quo During Pendency",
    definition:
      "No adverse consequences while review is pending (except narrow, reviewable emergency exception). Safe pause preserves the utility window and keeps people whole during appeal.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "traceable-ownership",
    term: "Traceable Ownership",
    definition:
      "A named responsible party with authority to override automation when bounds are breached. Traceable ownership clarifies design authority and accelerates time-to-restore.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "time-transparency",
    term: "Time Transparency",
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
    term: "Non-bindingness / Nonbindingness",
    definition:
      "The condition where a system can interact, respond, and even apologize without being compelled to change state. Non-bindingness is power without accountability: activity without obligation.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standing-vs-belief",
    term: "Standing (vs Belief)",
    definition:
      "Standing is the recognized right to make the system bind itself to engage, decide, and remedy—regardless of whether your story is believed, liked, or emotionally legible. “Belief” is narrative validation; standing is enforceable access to decision power.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "binding-authority",
    term: "Binding Authority",
    definition:
      "A person or role that can change the underlying state and is obligated to respond. Binding authority is not “a human is involved”; it’s a human with power + duty + traceable accountability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "evidence-parity",
    term: "Evidence Parity",
    definition:
      "A condition where affected people have a fair chance to meet the evidentiary burden—access to the relevant facts, rules, and records—rather than being asked to prove things the institution can’t or won’t disclose. Without evidence parity, appeals become theater.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-chain",
    term: "Authority Chain",
    definition:
      "The mapping of who can change what state, at which stage, under what constraints. Authority chains determine whether escalation is real.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-mutation",
    term: "Authority Mutation",
    definition:
      "A pattern where escalation changes how the institution speaks without changing who has power to reverse outcomes. Authority mutates when the channel upgrades (more polite, more official, more complex) but the underlying ability to bind remains absent.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "defaults-as-governance",
    term: "Defaults (as Governance)",
    definition:
      "The idea that the baseline state—what happens if nobody intervenes—is a primary allocator of outcomes and costs. Defaults govern by deciding who must spend time, attention, and stamina to avoid harm.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-caste",
    term: "Procedural Caste",
    definition:
      "A stratification system where people are divided by their ability to force binding action: who can start clocks, reach authorities, obtain reversals, and make claims legible. It’s a caste system of enforceability, not worth.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "escalation-without-authority",
    term: "Escalation (without Authority)",
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
    term: "Override Path",
    definition:
      "A clearly defined mechanism that can supersede the default workflow when the default would cause harm—e.g., human escalation with real authority, emergency reversal, exception handling with deadlines. Override paths are where “care” becomes material.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "structured-exit",
    term: "Structured Exit",
    definition:
      "An exit process designed to protect the leaver: clear steps, data portability, timelines, anti-retaliation constraints, and closure that doesn’t require ongoing performance. Structured exit turns leaving into a governed pathway instead of an endurance test.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "paywalled-rights",
    term: "Paywalled Rights",
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
    term: "Audit Trail",
    definition:
      "A trace of events and decisions—what happened, when, by whom, under what rule—used for accountability. Audit trails matter only if they connect to reversal power.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "administrative-reality",
    term: "Administrative Reality",
    definition:
      "The world as the system recognizes it: what counts, what is recordable, what triggers action. Administrative reality often diverges from lived reality.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contract-of-adhesion",
    term: "Contract of Adhesion",
    definition:
      "A take-it-or-leave-it contract offered by a more powerful party where negotiation is impossible; a common substrate for coerced “choice.”",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "nda-retaliation-narrative-erasure",
    term: "NDA Retaliation / Narrative Erasure",
    definition:
      "Mechanisms that suppress exit stories—legal threats, informal retaliation, reputational control—preventing systems from being held accountable by shared evidence.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "protective-friction",
    term: "Protective Friction",
    definition:
      "Friction that slows harmful processes and keeps moral latency within safe bounds.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "punitive-friction",
    term: "Punitive Friction",
    definition:
      "Friction that punishes users\u2014often hidden in bureaucratic loops. Signals extraction by endurance .",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "dignity-friction",
    term: "Dignity Friction",
    definition:
      "Friction that preserves autonomy, such as double checks on irreversible actions.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "velocity-friction",
    term: "Velocity Friction",
    definition:
      "Friction added specifically to prevent runaway system behaviors. Often implemented through ethical interrupts .",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "safety-valve",
    term: "Safety Valve",
    definition:
      "A deliberate release point that lets people slow, pause, or reroute automation before harm compounds. Safety valves pair stoppability with dignity friction so high-stakes flows default to reversible states and route to humans without penalty.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "consent-journey",
    term: "Consent Journey",
    definition:
      "The sequenced touchpoints where a person learns what a system will do, grants or denies permission, and can revise that choice over time. Strong consent journeys use anticipatory consent , visible permission surfaces , and healthy refusal budgets so pausing or exiting does not jeopardize access or care.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "coercive-consent",
    term: "Coercive Consent",
    definition:
      "“Agreement” obtained through defaults, asymmetry, or threats of exclusion—consent produced by lack of viable refusal.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "humane-friction",
    term: "Humane Friction",
    definition:
      "The calibrated blend of protective, dignity, and velocity frictions.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "appropriate-friction",
    term: "Appropriate Friction",
    definition:
      "Add checkpoints where stakes are high so that fairness and safety survive speed and scale.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "frictionless-harm",
    term: "Frictionless Harm",
    definition:
      "Harms that spread unchecked because safeguards or pauses were stripped away. Frictionless harm is the inverse of protective friction ; it appears when velocity friction and dignity friction are absent.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "decision-edge",
    term: "Decision Edge",
    definition:
      "The precise moment when a choice shifts from reversible to consequential. Making the decision edge visible enables dignity friction , clearer consent, and routing to ethical interrupts when risk spikes.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-surface",
    term: "Decision Surface",
    definition:
      "The part of a system where decisions become visible, addressable, and contestable. Many systems minimize the decision surface to avoid accountability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-artifact",
    term: "Decision Artifact",
    definition:
      "A discrete, attributable, contestable output: outcome + reason + timestamp + accountable owner. Decision artifacts anchor traceable ownership and make contestability measurable.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-object",
    term: "Decision Object",
    definition:
      "A discrete, addressable unit of institutional action that can be challenged: what was decided, when, under which rule, by what authority, with what evidence. Decision objects are the “handles” that make contestation possible.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "object-formation",
    term: "Object Formation",
    definition:
      "The process by which a complaint, harm, or request becomes a decision object—assigned an identifier, a category, an owner, a standard of review, and a clock. Systems often block accountability by preventing object formation (“nothing exists to appeal”).",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-decision",
    term: "Non-Decision",
    definition:
      "A stable administrative disposition where a system withholds a contestable outcome (pending, in review) while consequences accrue. Non-decisions stretch moral latency and keep people in limbo.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "pendingness",
    term: "Pending / Pendingness",
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
    term: "Non-settlement / Nonsettlement",
    definition:
      "An institutional mode where claims are acknowledged and processed indefinitely without producing a binding resolution. The system offers intake, updates, and politeness while keeping obligation optional.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "stable-clock",
    term: "Stable Clock",
    definition:
      "A non-resettable timeline for a case; the system cannot restart time via re-ticketing, re-verification, or channel switching. Stable clocks enforce bounded duration and keep timelines legible.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "clock-start-clock-mismatch",
    term: "Clock-start / Clock mismatch",
    definition:
      "Clock-start: the moment a system becomes time-bound—deadlines begin, obligations attach, escalation becomes meaningful. Clock mismatch: when institutional execution is fast (instant flags, freezes, denials) but redress is slow (weeks-months-human review), making errors durable and contestation scarce.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "slow-redress-fast-execution",
    term: "Slow Redress / Fast Execution",
    definition:
      "A governance asymmetry where harmful state changes are immediate but appeals are delayed, discretionary, and exhausting. This is one of the main engines of modern coercion.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-window",
    term: "Utility Window",
    definition:
      "The time span during which relief can still prevent the relevant harm. Designing for a clear utility window keeps time-to-restore accountable.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-expiry",
    term: "Utility Expiry",
    definition:
      "Crossing the utility window; relief arrives too late to matter. Utility expiry should trigger constructive denial or repair.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "futility-threshold",
    term: "Futility Threshold",
    definition:
      "The point where time-on-task or repetition becomes so costly that valid claimants predictably abandon pursuit. Systems that hit the futility threshold signal punitive friction and low contestability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "constructive-denial",
    term: "Constructive Denial",
    definition:
      "A legal state where delay is treated as refusal because it destroys utility or makes pursuit futile. Constructive denial recognizes utility expiry and forces accountable remedies.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "critical-action",
    term: "Critical Action",
    definition:
      "Any system action that meaningfully alters a person\u2019s status, access, or trajectory. Critical actions require dignity friction .",
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
    term: "Irreversible Boundary",
    definition:
      "A threshold the system cannot automatically undo\u2014account closures, public releases, or data publication. Crossing it demands heightened contestability , audited explanations , and explicit time-to-restore plans.",
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
    term: "Auto-close / Auto-renew / Auto-share",
    definition:
      "Default state transitions that happen without active consent—closing claims, renewing contracts, expanding data use—often presented as convenience while functioning as governance by inertia.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "ethical-interrupts",
    term: "Ethical Interrupts",
    definition:
      "Automatic system-level halts triggered by anomalies or harm indicators. Ethical interrupts operationalize stoppability .",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "heroism-dependent-systems",
    term: "Heroism-Dependent Systems",
    definition:
      "Systems that rely on extraordinary effort, unpaid care, or silent sacrifice to function. They mask poor stoppability and high failure load .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "empathy-surrogacy",
    term: "Empathy Surrogacy",
    definition:
      "Simulated warmth\u2014chatbots, scripted apologies, tone guidelines\u2014used to mask structural harm or delay fixes. Empathy surrogacy diverts attention from repair and weakens contestability by substituting sentiment for remedy.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "error-cascades",
    term: "Error Cascades",
    definition:
      "Small automated mistakes that amplify across the system. Prevented through ethical interrupts and SLJs .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "invisible-fallbacks",
    term: "Invisible Fallbacks",
    definition:
      "Hidden behaviors that appear under stress\u2014shadow queues, silent throttling, or undocumented overrides. Invisible fallbacks obscure ethical load paths and should be surfaced through graceful rollback lanes and rehearsed in maintenance windows .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "dead-user-zones",
    term: "Dead-User Zones",
    definition:
      "Places where people affected by decisions cannot contest, appeal, or exit\u2014opaque rankings, automated bans, or unmoderated queues. Closing dead-user zones requires widening the permission surface and raising appeal passage rates .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "moral-lock-in",
    term: "Moral Lock-In",
    definition:
      "When harmful defaults become entrenched through dependencies, network effects, or contracts that block reform. Moral lock-in is prevented by moral feature gating , contestability , and vigilant moral drift control .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "legitimacy-laundering",
    term: "Legitimacy Laundering",
    definition:
      "The process of converting coercive or indifferent outcomes into reputational legitimacy through procedural signals—case IDs, polite updates, “in review”—without delivering binding resolution. The system looks responsible while staying unbound.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "polite-coercion",
    term: "Polite Coercion",
    definition:
      "Coercion delivered through soothing language and “helpful” workflows that make refusal costly or stigmatized. Polite coercion is power that avoids looking like power.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "documentation-loop",
    term: "Documentation Loop / Resubmission Loop",
    definition:
      "A repeating pattern where the system continually requests more evidence or re-uploads without moving toward a binding decision. Often used to shift labor onto claimants and to manufacture dropout.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "precision-demands",
    term: "Precision Demands",
    definition:
      "Requests for ever-greater specificity that function less as truth-seeking and more as denial hooks—ways to keep a case non-objectified or non-decidable. Precision demands are a technique of delay.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "procedural-alibi",
    term: "Procedural Alibi",
    definition:
      "A record of “process” used to defend outcomes (“we followed procedure”) even when the procedure cannot bind the institution to remedy. The alibi is the trace of activity, not accountability.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "tone-policing",
    term: "Tone Policing (as Governance Technology)",
    definition:
      "The use of “appropriate tone” requirements to control access to remedy—penalizing anger, urgency, neurodivergent communication, or exhaustion. Tone policing converts distress into disqualification.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "dropout-as-legitimation",
    term: "Dropout-as-legitimation",
    definition:
      "When systems treat nonresponse, fatigue, or disappearance as consent or closure (“case closed—no reply”), laundering coercion into “resolved.” Dropout becomes the mechanism that protects the institution.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "churn-as-closure",
    term: "Churn (as Closure Mechanism)",
    definition:
      "The engineered cycling of people through forms, queues, and handoffs until they give up, miss a deadline, or become “inactive,” allowing the system to close without settlement.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "paper-compliance",
    term: "Paper Compliance / Checkbox Governance",
    definition:
      "Compliance regimes focused on producing documentation of doing the right thing rather than mechanisms that can actually prevent harm or force remedy. The paperwork stands in for power.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "transparency-theater",
    term: "Transparency Theater",
    definition:
      "Disclosures that do not increase contestability—more text, more dashboards, more “explanations”—without deadlines, authority, or reversal paths. Visibility substitutes for enforceability.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "explainability-decoy",
    term: "Explainability Decoy",
    definition:
      "A focus on explaining model decisions that distracts from the harder question: can the decision be contested, reversed, and time-bounded? The decoy offers epistemics where governance is needed.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "human-in-the-loop-legitimacy",
    term: "Human-in-the-loop (as Legitimacy Artifact)",
    definition:
      "A human reviewer inserted to create legitimacy while lacking binding authority, deadlines, or meaningful discretion. The loop becomes a comfort signal, not a power shift.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "procedural-realism",
    term: "Procedural Realism",
    definition:
      "A style of analysis (and sometimes art) that treats procedures, channels, and workflows as the real plot—where power is shown through process.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "intake-cinema",
    term: "Intake Cinema",
    definition:
      "A label for stories where the drama is the intake/eligibility channel—forms, interviews, caseworkers, waiting rooms—rather than a single decisive confrontation.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "moral-drift-control",
    term: "Moral Drift Control",
    definition:
      "Instrumentation and controls that detect when system behavior drifts from ethical baselines\u2014through MPIs or user testimony\u2014and automatically trigger interrupts or design changes.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "structural-gentleness-coefficients",
    term: "Structural Gentleness Coefficients",
    definition:
      "Measures of how forgiving an infrastructure is to human variance: error tolerance, recovery time, and soft edges . Higher coefficients correlate with lower failure load and safer degradation .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "burden-elasticity",
    term: "Burden Elasticity",
    definition:
      "How effort and risk stretch or rebound between actors when conditions change. Mapping burden elasticity alongside the burden gradient prevents crises from snapping back onto the least powerful.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "care-redundancy",
    term: "Care Redundancy",
    definition:
      "Overlapping care pathways\u2014humans, automation, and policy\u2014that ensure someone is caught when another safeguard fails. Care redundancy pairs with graceful degradation to keep failure load low.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "meta-contestability",
    term: "Meta-Contestability",
    definition:
      "Mechanisms that let people challenge not just outcomes but the rules of challenge themselves\u2014who may appeal, what evidence counts, and who sits on review panels. Meta-contestability keeps contestability from ossifying.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "user-state-modeling",
    term: "User-State Modeling for Harm Prevention",
    definition:
      "Inferring user states\u2014fatigue, distress, inattention\u2014to adapt pacing, add protective friction , or route to humans before harm compounds. Models must respect anticipatory consent and avoid new burden transfers .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethical-latency",
    term: "Design for Ethical Latency",
    definition:
      "Designing for unavoidable delay between action and ethical evaluation by staging risky steps, adding velocity friction , or seeking care floor guarantees while fuller review occurs.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "distributed-accountability-protocols",
    term: "Distributed Accountability Protocols",
    definition:
      "Coordination methods that keep responsibility legible across teams and automation: shared playbooks, auditable handoffs, and repair logs . Protocols prevent accountability diffusion when work moves.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethotechnic-failure-taxonomy",
    term: "Ethotechnic Failure Taxonomy",
    definition:
      "A common vocabulary for classifying moral failure modes\u2014 optimization myopia , brittleness , extraction , and more\u2014so incidents can be compared, learned from, and prevented.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "adaptive-refusal-pathways",
    term: "Adaptive Refusal Pathways",
    definition:
      "Dynamic flows that reroute tasks when someone pauses or declines, preserving context and avoiding retaliation. Adaptive pathways extend refusal budgets and strengthen refusal tolerance .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "aftercare-automation",
    term: "Aftercare Automation",
    definition:
      "Automated follow-up that checks on impacted people after incidents, schedules remedies, and prompts humans to close the loop. Done well, it lowers moral debt without creating new moral overhead .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "alignment-dividend",
    term: "Alignment Dividend",
    definition:
      "The measurable upside\u2014trust, retention, safety\u2014generated when systems align with human values. Tracking the dividend builds the business case for sustained investment in MPIs and maintenance metabolism .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ambiguity-budgets",
    term: "Ambiguity Budgets",
    definition:
      "Explicit allowances for uncertainty that prevent premature automation or brittle enforcement. Ambiguity budgets reserve time, human review, or maintenance windows until context is sufficient.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "anticipatory-consent",
    term: "Anticipatory Consent",
    definition:
      "Consent models that preview future data uses and let people pre-approve, defer, or block them. Anticipatory consent supports rights of exit and counters precision laundering of unclear terms.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "boundary-of-acceptable-harm",
    term: "Boundary of Acceptable Harm",
    definition:
      "Dynamic thresholds defining when moral risk exceeds the system\u2019s mandate and operations must halt or escalate. Boundaries are tied to SLJs and enforced through ethical circuit breakers .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "care-floor-guarantees",
    term: "Care Floor Guarantees",
    definition:
      "Baseline commitments a service maintains even during outages or crises\u2014live support, data export, or safe defaults. Care floors protect users when graceful degradation activates.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "compassion-telemetry",
    term: "Compassion Telemetry",
    definition:
      "Signals that show whether interactions feel humane\u2014response tone, wait times during distress, quality of follow-up. Compassion telemetry complements technical metrics to protect compassion bandwidth .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "conflict-observability",
    term: "Conflict Observability",
    definition:
      "Instrumentation that makes value conflicts visible in logs and dashboards before they erupt\u2014flagging when SLJs trade off against throughput or when appeals spike. High observability enables earlier moral drift control .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "counter-abuse-guardrails",
    term: "Counter-Abuse Guardrails",
    definition:
      "Limits that prevent tools from being repurposed for harassment, exploitation, or coercion\u2014rate limits, anomaly detection, and human override lanes tuned for abuse scenarios.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "crisis-rehearsal-loops",
    term: "Crisis Rehearsal Loops",
    definition:
      "Regular drills that stress-test moral responses, not just uptime. They practice ethical interrupts , validate care floors , and update repair logs with lessons.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "data-dignity-budgets",
    term: "Data Dignity Budgets",
    definition:
      "Caps on data collection and use that respect personhood and context, not just legal checkbox consent. Budgets align with anticipatory consent and guard against extraction .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "decision-debt-ledger",
    term: "Decision Debt Ledger",
    definition:
      "A register of deferred decisions and their moral interest, reviewed before debt compounds into harm. The ledger feeds maintenance windows and informs MPIs .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "downstream-equity-buffers",
    term: "Downstream Equity Buffers",
    definition:
      "Design slack that absorbs variance so marginalized groups do not pay first or most when errors occur. Buffers include staggered rollouts, rollback lanes , and targeted support funds.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethical-circuit-breakers",
    term: "Ethical Circuit Breakers",
    definition:
      "Automated stops that trip when moral risk indicators cross predefined set points\u2014surges in appeals, bias metrics, or moral debt . They are the safety counterpart to financial circuit breakers.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethical-load-testing",
    term: "Ethical Load Testing",
    definition:
      "Deliberate exercises that probe how systems behave under moral stress\u2014simulated harassment, mass appeals, or outage scenarios\u2014to validate ethical circuit breakers and care floors .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "exhaustion-triggers",
    term: "Exhaustion Triggers",
    definition:
      "Signals that detect operator or user fatigue\u2014error streaks, long queues, late-night decisions\u2014and automatically slow, pause, or hand off flows before mistakes multiply. Triggers protect compassion bandwidth .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "friction-budgets",
    term: "Friction Budgets",
    definition:
      "Planned allocations of protective and dignity frictions across journeys to balance safety with usability, rather than defaulting to speed.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "graceful-rollback-lanes",
    term: "Graceful Rollback Lanes",
    definition:
      "Prepared routes to revert harmful decisions while preserving dignity, evidence, and service continuity. Rollback lanes keep irreversibility indices low and shorten time-to-restore .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "harm-amnesty-windows",
    term: "Harm Amnesty Windows",
    definition:
      "Time-boxed periods where people can report or reverse harmful actions without penalty, encouraging disclosure and faster repair . Amnesty windows often follow rehearsal loops or incidents.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "heat-maps-of-refusal",
    term: "Heat Maps of Refusal",
    definition:
      "Visualizations showing where users opt out, churn, or appeal\u2014revealing coercion hotspots early. Heat maps help tune refusal budgets and redesign interaction surfaces .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "human-override-lanes",
    term: "Human Override Lanes",
    definition:
      "Guaranteed routes for human judgment to supersede automation when stakes are high or context is missing. Override lanes accompany ethical interrupts and require clear ethical load paths .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "incident-memory-chains",
    term: "Incident Memory Chains",
    definition:
      "Linked records that keep lessons from past incidents attached to similar workflows so knowledge stays actionable. Memory chains inform ethical load tests and prevent moral lock-in on bad patterns.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "moral-dry-runs",
    term: "Moral Dry Runs",
    definition:
      "Pre-launch walkthroughs that simulate ethical dilemmas to harden designs before they reach the public. Dry runs test circuit breakers , rollback lanes , and documentation.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "moral-feature-gating",
    term: "Moral Feature Gating",
    definition:
      "Controls that block feature launch until moral readiness criteria\u2014oversight plans, contestability pathways, and care floors \u2014are met.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "pathways-to-restitution",
    term: "Pathways to Restitution",
    definition:
      "Documented steps a system must take to repair harm: acknowledgement, remedy, verification, and follow-up. Pathways reduce moral debt and belong in the repair log .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "refusal-aware-routing",
    term: "Refusal-Aware Routing",
    definition:
      "Routing logic that accounts for who can decline tasks and ensures refusals are respected without retaliation or silent penalization. It preserves refusal budgets and keeps workflows humane.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "relief-invariants",
    term: "Relief Invariants",
    definition:
      "Assurances that regardless of pathway, people can access relief with predictable effort and support. Relief invariants are tested in crisis rehearsals and anchored by care floors .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "repair-quorums",
    term: "Repair Quorums",
    definition:
      "Minimum participation rules for authorizing fixes so impacted communities have a seat in deciding remedies. Repair quorums counter accountability diffusion and legitimize restitution .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "rest-cycle-enforcement",
    term: "Rest Cycle Enforcement",
    definition:
      "Built-in mechanisms that enforce rest and recovery\u2014rotation policies, cooldown timers, enforced downtime\u2014so fatigue does not translate into harm. Enforcement protects maintenance metabolism and compassion bandwidth .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "conservancy-principle",
    term: "The Conservancy Principle",
    definition:
      "Designers steward human dignity and collective resources; they must leave systems safer and more reparable than they found them. Conservancy prioritizes repair , stoppability , and minimizing moral debt .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "burden-inversion-rule",
    term: "The Burden Inversion Rule",
    definition:
      "When harm occurs, the system shoulders effort before the person harmed does. Burden inversion lowers the user burden ratio and demands rapid restoration .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "stop-before-explain-rule",
    term: "The Stop-Before-Explain Rule",
    definition:
      "Halt harmful behavior first, then justify or refine it. Systems must trigger ethical interrupts before offering explanations, preserving reversibility .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "maintenance-doctrine",
    term: "The Maintenance Doctrine",
    definition:
      "Ethical performance depends on continuous upkeep\u2014funded maintenance metabolism , scheduled maintenance windows , and transparent logs .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "low-failure-load-principle",
    term: "The Principle of Low-Failure-Load Design",
    definition:
      "Design so that when failures occur, human impact is contained. This principle motivates graceful degradation , care floors , and low irreversibility indices .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "reversibility-mandate",
    term: "The Reversibility Mandate",
    definition:
      "Critical actions must be undoable or paired with rollback lanes . The mandate aligns with time-to-restore targets and contestability .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "contestability-guarantee",
    term: "The Contestability Guarantee",
    definition:
      "People affected by system decisions can challenge, change, or overturn them\u2014and win. Guarantees include wide permission surfaces , high appeal passage rates , and transparent design authority .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
];

const glossaryIndex = glossaryTerms.reduce<Record<string, GlossaryTerm>>(
  (index, term) => {
    index[term.slug] = term;
    return index;
  },
  {},
);

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const getGlossaryLabel = (slug: string) =>
  glossaryIndex[slug]?.term ?? formatSlug(slug);
