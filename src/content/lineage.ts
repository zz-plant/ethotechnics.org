/**
 * Where the argument comes from, and why the ground it stands on was open.
 *
 * The About page and the essay "What Ethotechnics is not" both state the
 * lineage. They used to carry two copies that drifted: different wording for
 * the same traditions, four contribution items in one and five in the other.
 * Both now render this module through IntellectualLineage.astro.
 *
 * The argument runs in four steps:
 * 1. The moral propositions are inherited, not original.
 * 2. Each field closest to the mechanism sees part of it and stops at a
 *    different point; each stop is developed in one of the theory essays.
 * 3. Read together, the stops leave one question nobody asks.
 * 4. Three changes make that question urgent now.
 */

export type InheritedTradition = {
  name: string;
  finding: string;
};

/** The values the framework inherits. Not claimed as original. */
export const inheritedTraditions: InheritedTradition[] = [
  {
    name: "Post-work socialism and Marx",
    finding:
      "The distinction between the realm of necessity and the realm of freedom, establishing that technical productivity should reduce compulsory labor rather than intensify it.",
  },
  {
    name: "The social model of disability",
    finding:
      "Shifting attention away from demanding extraordinary individual coping toward altering disabling environments and institutional barriers.",
  },
  {
    name: "Relational egalitarianism (Elizabeth Anderson)",
    finding:
      "The principle that individuals are entitled to the social conditions of equal standing and ordinary dignity without having to prove exceptional merit or endurance.",
  },
  {
    name: "Feminist care ethics and social reproduction theory (Joan Tronto, Nancy Fraser, Eva Kittay, Alison Reiheld)",
    finding:
      'Analyzing how formal economic success depends on unpriced care labor and identifying "privileged irresponsibility": the systemic offloading of maintenance work onto others.',
  },
  {
    name: "Administrative burden theory (Pamela Herd, Donald Moynihan)",
    finding:
      "Empirical measurement of the learning, compliance, and psychological costs imposed on citizens by state and corporate processes.",
  },
  {
    name: "Republican political theory (Philip Pettit)",
    finding:
      "Freedom as non-domination, demonstrating that making lives easier does not make people free if they remain subject to unchecked, arbitrary institutional discretion.",
  },
  {
    name: "Resilience engineering (David Woods, Erik Hollnagel, Richard Cook)",
    finding:
      'Describing how human operators constantly adapt under resource constraints to bridge the gap between "work-as-imagined" and "work-as-done."',
  },
];

export type Work = {
  /** Empty for a law or a framework (an "instrument"), named by its title. */
  authors: string;
  title: string;
  year: number;
  form: "book" | "article" | "instrument";
};

export type NeighboringField = {
  field: string;
  works: Work[];
  /** What the field establishes about the mechanism. */
  sees: string;
  /** Where its unit of analysis or its remedy stops short. */
  stops: string;
  /** The theory essay that develops what lies past the stop. */
  essay: { title: string; href: string };
};

/** The fields closest to the mechanism, and where each one stops. */
export const neighboringFields: NeighboringField[] = [
  {
    field: "Safety science",
    works: [
      {
        authors: "Charles Perrow",
        title: "Normal Accidents",
        year: 1984,
        form: "book",
      },
      {
        authors: "Diane Vaughan",
        title: "The Challenger Launch Decision",
        year: 1996,
        form: "book",
      },
      {
        authors: "Sidney Dekker",
        title: "Drift into Failure",
        year: 2011,
        form: "book",
      },
      {
        authors: "Nancy Leveson",
        title: "Engineering a Safer World",
        year: 2012,
        form: "book",
      },
    ],
    sees: "Warnings get reclassified as normal until they stop registering, and systems drift toward failure in steps that each look reasonable. Tightly coupled, interactively complex systems propagate an upstream error faster than the people downstream can chase it.",
    stops:
      "It studies an organization's own operators and its rare catastrophes. Its remedy is a learning culture, not a duty owed to the people a system decides about.",
    essay: {
      title: "An engineering tradition",
      href: "/research/theory/an-engineering-tradition",
    },
  },
  {
    field: "Responsibility in automation",
    works: [
      {
        authors: "Raja Parasuraman and Dietrich Manzey",
        title: "Complacency and Bias in Human Use of Automation",
        year: 2010,
        form: "article",
      },
      {
        authors: "Madeleine Clare Elish",
        title: "Moral Crumple Zones",
        year: 2019,
        form: "article",
      },
    ],
    sees: "When an automated system fails, the blame lands on the nearest human operator, and trust in the automation grows precisely as vigilance over its output decays.",
    stops:
      "It follows the blame after a failure. It does not follow the evidence that the operator's everyday corrections keep from the rule.",
    essay: {
      title: "Dependence without standing",
      href: "/research/theory/dependence-without-standing",
    },
  },
  {
    field: "Hidden labor",
    works: [
      {
        authors: "Mary L. Gray and Siddharth Suri",
        title: "Ghost Work",
        year: 2019,
        form: "book",
      },
      {
        authors: "Hamid Ekbia and Bonnie Nardi",
        title: "Heteromation",
        year: 2017,
        form: "book",
      },
    ],
    sees: '"Automated" systems run on human work that goes unrecorded and is paid little or nothing.',
    stops:
      "It treats that work as a question of pay and recognition. It does not treat it as error signals the institution never receives.",
    essay: {
      title: "Absorption as concealment",
      href: "/research/theory/absorption-as-concealment",
    },
  },
  {
    field: "Administrative burden",
    works: [
      {
        authors: "Pamela Herd and Donald Moynihan",
        title: "Administrative Burden",
        year: 2018,
        form: "book",
      },
      {
        authors: "Cass Sunstein",
        title: "Sludge",
        year: 2021,
        form: "book",
      },
    ],
    sees: "The learning, compliance, and psychological costs a process imposes on the people it serves, with the waiting itself acting as a rationing device.",
    stops:
      "It measures the cost. It does not trace how the people paying it keep the rule that causes it from changing.",
    essay: {
      title: "What outcomes hide",
      href: "/research/theory/what-outcomes-hide",
    },
  },
  {
    field: "Due process and contestability",
    works: [
      {
        authors: "Danielle Keats Citron",
        title: "Technological Due Process",
        year: 2008,
        form: "article",
      },
      {
        authors: "Kars Alfrink and colleagues",
        title: "Contestable AI by Design",
        year: 2023,
        form: "article",
      },
      {
        authors: "",
        title: "GDPR, Article 22",
        year: 2016,
        form: "instrument",
      },
    ],
    sees: "A person decided about by a machine is owed notice, a hearing, and a way to contest the decision.",
    stops:
      "It attaches the remedy to one decision. The individual appeal then becomes the channel that absorbs the evidence: each case is fixed and the rule stays.",
    essay: {
      title: "Exception learning",
      href: "/research/theory/exception-learning",
    },
  },
  {
    field: "AI risk frameworks",
    works: [
      { authors: "", title: "EU AI Act", year: 2024, form: "instrument" },
      { authors: "", title: "NIST AI RMF", year: 2023, form: "instrument" },
      { authors: "", title: "ISO/IEC 42001", year: 2023, form: "instrument" },
    ],
    sees: "Risk assessed before deployment, human oversight required for high-risk systems, and the system monitored after it ships.",
    stops:
      "They assess a system before it runs and again after a major change. Monitoring after release is left to the organizations responsible for the system, which then produce the evidence that it still complies.",
    essay: {
      title: "Endogenous authorization",
      href: "/research/theory/endogenous-authorization",
    },
  },
  {
    field: "Republican political theory",
    works: [
      {
        authors: "Philip Pettit",
        title: "Republicanism",
        year: 1997,
        form: "book",
      },
    ],
    sees: "Power that is unchecked and arbitrary dominates people even when it is kind.",
    stops:
      "It focuses on arbitrary discretionary agents and constitutional status. It does not account for architectural domination where power is fragmented across systems and return paths are severed, nor does it measure the metabolic human capacity consumed to keep an arrangement functional.",
    essay: {
      title: "Democratic vs. coercive governability",
      href: "/research/theory/democratic-vs-coercive-governability",
    },
  },
  {
    field: "Social reproduction theory and care ethics",
    works: [
      {
        authors: "Nancy Fraser",
        title: "Contradictions of Capital and Care",
        year: 2016,
        form: "article",
      },
      {
        authors: "Joan Tronto",
        title: "Moral Boundaries",
        year: 1993,
        form: "book",
      },
    ],
    sees: "Formal systems depend parasitically on unpriced relational repair and reproductive labor that they externalize and exhaust.",
    stops:
      "It analyzes systemic extraction at the social and macroeconomic level. It does not construct engineering constraints, data schemas, or runtime records that force automated systems to account for the finite adaptive capacity they consume.",
    essay: {
      title: "The consumption of adaptive capacity",
      href: "/research/theory/the-consumption-of-adaptive-capacity",
    },
  },
  {
    field: "Labor process theory and organizational sociology",
    works: [
      {
        authors: "Michael Burawoy",
        title: "Manufacturing Consent",
        year: 1979,
        form: "book",
      },
      {
        authors: "Arlie Russell Hochschild",
        title: "The Managed Heart",
        year: 1983,
        form: "book",
      },
    ],
    sees: "Workplaces extract uncredited emotional, repair, and adaptive labor while manufacturing ideological consent that frames structural coping as individual virtue.",
    stops:
      "It critiques workplace exploitation and character deformation. It does not formalize how informal human compensation blinds institutional telemetry or engineer runtime mechanisms that force organizations to account for the subsidy.",
    essay: {
      title: "The human subsidy to institutional continuity",
      href: "/research/theory/the-human-subsidy",
    },
  },
];

/** One of the framework's claims, the strongest counter to it in the
 * counter-position's own terms, the answer, and the instrument on this site
 * that would settle the dispute empirically. */
export type Dispute = {
  claim: string;
  /** The field or literature that pushes back. */
  counterSource: string;
  counter: string;
  answer: string;
  instrument: string;
  instrumentHref: string;
};

/** What the established fields say back. The framework's claims are
 * falsifiable, and the strongest opposing positions deserve to be stated by
 * the site that holds the claims. Each entry names the measurement that would
 * settle the dispute, because the disagreements below are empirical ones. */
export const disputes: Dispute[] = [
  {
    claim:
      "Apparent institutional performance often rests on unmeasured human compensation.",
    counterSource:
      "IT productivity economics (Erik Brynjolfsson and colleagues)",
    counter:
      "Enterprise digitization yields genuine productivity gains once an adoption lag passes; workarounds are transient user adaptation, not permanent extraction.",
    answer:
      "Whether adaptation is transient or structural is an empirical question nobody can settle yet, because nothing measures the adaptation. A system that does not record the labor it consumes cannot tell a learning curve from a subsidy. The dispute is falsifiable; what is missing is the instrument.",
    instrument: "the burden dashboards",
    instrumentHref: "/mechanisms/patterns/burden-dashboards",
  },
  {
    claim:
      "Generated output shifts the cost of verifying truth onto its reader, and no metric that counts generation will ever see it.",
    counterSource: "Ambient clinical documentation trials",
    counter:
      "Trials report high clinician satisfaction, reduced subjective administrative burden, and low observed error rates in routine primary care encounters.",
    answer:
      "Satisfaction is self-reported and would not detect a cost paid after hours; low error rates in routine encounters bound the claim without touching high-ambiguity work. The honest response is measurement rather than rebuttal — instrument the verification cost and let the number decide.",
    instrument: "the claim-anchoring eval",
    instrumentHref: "/evals/explainability",
  },
  {
    claim:
      "Errors propagate through tightly coupled systems faster than correction can chase them, and nominal reversibility is not operational reversibility.",
    counterSource: "Medication-safety research on interception",
    counter:
      "Multi-tiered human redundancy intercepts a large share of prescribing and transcription errors before they reach the patient, so informal checks function as a resilient defense.",
    answer:
      "Interception is real, and it is the finding the framework starts from: safety that depends on unmeasured vigilance is the human subsidy, and the interceptors are unbilled. The question is not whether interception works but whether it is recorded as evidence about the system or absorbed as evidence about the people.",
    instrument: "the rescue register",
    instrumentHref: "/mechanisms/patterns/rescue-register",
  },
  {
    claim:
      "Delay functions as an unlegislated rationing device that suppresses claims more effectively than an explicit denial.",
    counterSource: "Health economics (moral hazard and demand management)",
    counter:
      "Prior authorization and review queues are legitimate cost control: they deter moral hazard and require providers to demonstrate medical necessity before funds are committed.",
    answer:
      "A queue may ration legitimately, but only as a declared policy with evidence, an owner, and a clock. Choosing not to fund is a decision with reasons and a date. What the framework refuses is rationing that arrives as friction nobody authored — and delay falls hardest on the least persistent, which makes undeclared rationing regressive.",
    instrument: "the expiry default and deliberate non-use",
    instrumentHref: "/research/theory/deliberate-non-use",
  },
  {
    claim:
      "Institutions enforce rules whose supersession they hold somewhere in the organization.",
    counterSource: "Evidence-based medicine and regulatory science",
    counter:
      "Slow adoption is an epistemological safeguard: many trial endpoints rely on surrogate markers that never translate to survival benefit, so conservatism protects patients from commercial overhype.",
    answer:
      "The clause forces the review, not the adoption. Held evidence fires a trigger, and a payer may reject the new evidence with recorded reasons and confirm the grant. What it forbids is skepticism nobody performed. Slow uptake with a record is judgment; slow uptake without one is an outdated rulebook.",
    instrument: "the unwired-evidence term",
    instrumentHref: "/glossary/unwired-evidence",
  },
  {
    claim:
      "Empathy displays substitute for structural repair and absorb the pressure to change.",
    counterSource:
      "Occupational health psychology (Christina Maslach, Michael Leiter)",
    counter:
      "Secondary interventions — peer support, mindfulness, institutional recognition — produce measurable reductions in exhaustion, depersonalization, and turnover intent.",
    answer:
      "The distinction is substitution, not existence. Peer support that complements redesign is not theater; a wellness program offered in place of changing the workload is. The test is whether the intervention alters the system that produces the burden or only helps people survive it.",
    instrument: "the ethics-theater term",
    instrumentHref: "/glossary/ethics-theater",
  },
];

/** Why the question is urgent now, not only open. */
export const whyNow: { label: string; text: string }[] = [
  {
    label: "Scale",
    text: "When Robodebt was automated, debt notices went from about 20,000 a year to 20,000 a week. At that volume, settling errors one case at a time cannot keep up with the rule that produces them.",
  },
  {
    label: "Records",
    text: "A decision log now costs almost nothing to keep. An obligation stated at the level of the record, such as a grant's expiry date or an objection's answer, is a reasonable thing to ask of any operator.",
  },
  {
    label: "Law",
    text: "The EU AI Act requires human oversight of high-risk systems. The GDPR requires a way to contest a solely automated decision with legal or similarly significant effects, where the decision is necessary for a contract or rests on the person's explicit consent. Neither law states a test a running system must pass to show the oversight or the contest works.",
  },
];

/** The theory's names for the mechanism, each in one plain sentence or two. */
export const theoryVocabulary: { term: string; text: string }[] = [
  {
    term: "Capacity turned into entitlement",
    text: "An institution notices that people can cover for its deficiencies, builds its operations on the assumption that they will, and turns a one-off act of endurance into a standing requirement.",
  },
  {
    term: "Non-expropriation of resilience",
    text: "That people can adapt to a deficiency does not entitle the institution to their adaptation. When a fixable deficiency is routinely covered by unrecorded effort, good outcomes do not show the arrangement works.",
  },
  {
    term: "Intrinsic and compensated performance",
    text: "Performance a system achieves on its own, set against performance that depends on unrecorded human correction. A monitored buffer that absorbs genuine uncertainty is resilience. Unrecorded work that covers a fixable defect is a subsidy.",
  },
  {
    term: "Masking",
    text: "When people cover for a broken system, its error rate looks low. The institution reads the low rate as health and fixes nothing.",
  },
  {
    term: "Evaluation by burdens removed",
    text: "A system or a reform is judged by whether it removes preventable correction work from people, not only by how much it produces.",
  },
  {
    term: "The tripartite invariant: non-domination, burden accounting, and error-correcting authority",
    text: "The three irreducible commitments of legitimate system design: relational independence from unchecked power, metabolic accounting of the finite human capacity consumed to keep an arrangement functional, and cybernetic return paths ensuring authority remains conditional on downstream error correction. None of the three reduces to the others.",
  },
  {
    term: "Corrective standing as epistemic admissibility",
    text: "Defining corrective standing not as an individual veto that risks coordination gridlock, but as formal epistemic admissibility: an institution loses the legitimacy of its claims and its operational warrants if it systematically insulates its decision-making from the counterevidence generated by the people who absorb its failures.",
  },
  {
    term: "Stewardship versus counterfeit buffering",
    text: "Differentiating legitimate human-in-the-loop engagement (voluntary, discretionary stewardship where humans have unpenalized override authority) from counterfeit buffering (coerced, unrecorded labor where frontline workers or users act as liability sponges and error-signal attenuators for an inflexible system).",
  },
];
