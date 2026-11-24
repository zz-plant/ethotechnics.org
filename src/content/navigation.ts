export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export interface NavSection {
  id: string;
  heading: string;
  /** The section's index page, linked from its panel header and drawer. */
  href?: string;
  description: string;
  links: NavLink[];
}

/**
 * The site's four sections, shared across the desktop bar, the mobile drawer,
 * the home page's published map, and site search:
 *
 * 1. What must be true (Method),
 * 2. How it is built and scored (Mechanisms and evals),
 * 3. What a reader can run on their own material (Diagnostics),
 * 4. What the rest rests on (Knowledge: terms, cases, notes, and theory).
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
    id: "method",
    heading: "Method",
    description:
      "The reasoning first, then the clauses a system is held to and the evidence each one asks for.",
    links: [
      {
        href: "/method",
        label: "The method",
        description:
          "The framework on one page: its claim and how its parts fit together",
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
        description:
          "Draft clauses to cite or adopt, each a test a running system passes or fails",
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
    id: "mechanisms",
    heading: "Mechanisms and evals",
    description:
      "What to build to meet a clause, and how to check what was built.",
    links: [
      {
        href: "/mechanisms",
        label: "Mechanisms",
        description:
          "What to build: specifications for kill switches, appeal paths, and review triggers",
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
    id: "diagnostics",
    heading: "Diagnostics",
    // The hub link sits at the top of the Diagnostics panel and drawer list so
    // the five slots stay tools while /diagnostics stays one click away.
    href: "/diagnostics",
    description:
      "Ordered by what you bring: a workflow, workload ratings, a decision log, the decision your system makes, or a decision made about you.",
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
          "Bring a decision made about you: can it be challenged, can an appeal change the outcome, and who can reverse it",
      },
    ],
  },
  {
    id: "knowledge",
    heading: "Knowledge",
    description:
      "Terms, scored public failures, dated field notes, and the theory behind the laws.",
    links: [
      {
        href: "/glossary",
        label: "Glossary",
        description: "Defined terms, each at a stable URL you can cite",
      },
      {
        href: "/casebook",
        label: "Casebook",
        description:
          "Public failures a court or inquiry established, scored by which safeguard broke",
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
