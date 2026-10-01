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
    ],
    sees: "Warnings get reclassified as normal until they stop registering, and systems drift toward failure in steps that each look reasonable.",
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
        authors: "Madeleine Clare Elish",
        title: "Moral Crumple Zones",
        year: 2019,
        form: "article",
      },
    ],
    sees: "When an automated system fails, the blame lands on the nearest human operator.",
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
    ],
    sees: "The learning, compliance, and psychological costs a process imposes on the people it serves.",
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
      "It says what people are owed. It does not say how to test whether a running system delivers it.",
    essay: {
      title: "Democratic vs. coercive governability",
      href: "/research/theory/democratic-vs-coercive-governability",
    },
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
];
