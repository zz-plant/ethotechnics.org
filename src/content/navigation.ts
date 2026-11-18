export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export interface NavSection {
  heading: string;
  /** The section's index page, linked from its heading. */
  href?: string;
  description: string;
  links: NavLink[];
}

// The bar and the menu both reach these five pages. Each is named and
// described once, here, so the two cannot call one page two things: the bar
// said "Diagnostics" while the menu heading for the same page said "Tools".
const METHOD_DESCRIPTION =
  "The framework on one page: its claim and how its parts fit together";
const STANDARDS_DESCRIPTION =
  "Draft clauses to cite or adopt, each a test a running system passes or fails";
const MECHANISMS_DESCRIPTION =
  "What to build: specifications for kill switches, appeal paths, and review triggers";
const DIAGNOSTICS_DESCRIPTION =
  "Ordered by what you bring: a workflow, workload ratings, a decision log, the decision your system makes, or a decision made about you.";
const CASEBOOK_DESCRIPTION =
  "Public failures a court or inquiry established, scored by which safeguard broke";

export const navPrimaryLinks: NavLink[] = [
  {
    href: "/method",
    label: "Method",
    description: METHOD_DESCRIPTION,
  },
  {
    href: "/standards",
    label: "Standards",
    description: STANDARDS_DESCRIPTION,
  },
  {
    href: "/mechanisms",
    label: "Mechanisms",
    description: MECHANISMS_DESCRIPTION,
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    description: DIAGNOSTICS_DESCRIPTION,
  },
  {
    href: "/casebook",
    label: "Casebook",
    description: CASEBOOK_DESCRIPTION,
  },
];

/**
 * The mega menu, in four sections: what must be true (Method), how it is
 * built and scored (Mechanisms and evals), what a reader can run on their own
 * material (Diagnostics), and what the rest rests on (Knowledge: terms, cases,
 * and the theory essays).
 *
 * Neighbors that sound alike each say what they are for: the laws give the
 * reasons and the standards hold the tests; evidence packs list what to show
 * for each standard, eval suites run cases against a deployed system,
 * measurement tiers name the numbers to report, and a validator is a form for
 * one user journey. Links that build on each other sit together: the laws,
 * the standards that test them, then the evidence each standard asks for.
 *
 * The sections are not the theory / method / instrument layers the search
 * corpus tags documents with. Validators and measurement tiers are
 * instruments there and sit under Mechanisms and evals here; theory has no
 * section of its own.
 *
 * The five-link ceiling stays. It is not a display constraint — it is the only
 * thing forcing a decision about what a section is for.
 */
export const navSections: NavSection[] = [
  {
    heading: "Method",
    description:
      "The reasoning first, then the clauses a system is held to and the evidence each one asks for.",
    links: [
      {
        href: "/method",
        label: "The method",
        description: METHOD_DESCRIPTION,
      },
      {
        href: "/standards/laws",
        label: "The laws",
        description:
          "The principles the standards are built on, and the reasoning for each",
      },
      {
        href: "/standards",
        label: "Standards",
        description: STANDARDS_DESCRIPTION,
      },
      {
        href: "/evidence-packs",
        label: "Evidence packs",
        description:
          "The records to show an auditor for each standard, and the questions they ask",
      },
      {
        href: "/low-leverage",
        label: "Low-leverage work",
        description:
          "Familiar projects that leave the rule in place, and what to do instead",
      },
    ],
  },
  {
    heading: "Mechanisms and evals",
    description:
      "What to build to meet a clause, then how to test, measure, and score what was built.",
    links: [
      {
        href: "/mechanisms",
        label: "Mechanisms",
        description: MECHANISMS_DESCRIPTION,
      },
      {
        href: "/evals",
        label: "Eval suites",
        description:
          "Test cases to run against a deployed system, scored by machine or a reviewer's rubric",
      },
      {
        href: "/measurement-tiers",
        label: "Measurement tiers",
        description:
          "Numbers to report, such as time to halt, the proof each needs, and how it is gamed",
      },
      // Last, beside the Diagnostics column: a validator is a form, like
      // the diagnostics, but it scores a user journey against clauses.
      {
        href: "/validators",
        label: "Validators",
        description:
          "Forms that rate one user journey's time, friction, and delay: red, yellow, or green",
      },
    ],
  },
  {
    // Ordered by what you have to bring, not by tool name. "Which one do I
    // want" is answerable from the input; it is not answerable from a list of
    // product names.
    //
    // Named as the bar names the same page. As "Tools" it read as a second
    // destination beside the bar's "Diagnostics".
    heading: "Diagnostics",
    // The heading carries the hub link so the five slots stay tools. Without
    // it a phone reaches /diagnostics from no menu: the bar's link to it is
    // desktop-only, and the footer no longer repeats this map.
    href: "/diagnostics",
    description: DIAGNOSTICS_DESCRIPTION,
    links: [
      {
        href: "/diagnostics/delegation-audit",
        label: "Delegation audit",
        description:
          "Bring a workflow: should this decision still be automated?",
      },
      {
        href: "/diagnostics/burden-modeler",
        label: "Workload modeler",
        description:
          "Bring workload ratings: where the work a system creates concentrates",
      },
      {
        href: "/diagnostics/record-conformance",
        label: "Record conformance checker",
        description: "Bring a decision log: does it meet the level it claims?",
      },
      {
        href: "/use-cases",
        label: "Which systems this is for",
        description:
          "Bring the decision it makes: the check to run first for that kind of system",
      },
      {
        href: "/diagnostics/self-defense-tools",
        label: "Self-defense checks",
        description:
          "Bring a decision made about you: can it be challenged, can the challenge change the outcome, and who can reverse it",
      },
    ],
  },
  {
    heading: "Knowledge",
    description:
      "Terms, scored public failures, and the theory behind the laws.",
    links: [
      {
        href: "/glossary",
        label: "Glossary",
        description: "Defined terms, each at a stable URL you can cite",
      },
      {
        href: "/casebook",
        label: "Casebook",
        description: CASEBOOK_DESCRIPTION,
      },
      {
        href: "/field-notes",
        label: "Field notes",
        description:
          "Dated notes on outside changes that bear on the standards",
      },
      {
        href: "/research/theory",
        label: "Theory",
        description:
          "Essays on why the laws hold, kept separate from the requirements",
      },
    ],
  },
];
