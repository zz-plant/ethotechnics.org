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

export const navPrimaryLinks: NavLink[] = [
  {
    href: "/method",
    label: "Method",
    description:
      "How evidence of a wrong decision reaches someone who has to change the rule",
  },
  {
    href: "/standards",
    label: "Standards",
    description: "Draft requirements a system can be held to, clause by clause",
  },
  {
    href: "/mechanisms",
    label: "Mechanisms",
    description:
      "Specifications for kill switches, circuit breakers, and appeal controls",
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    description:
      "Tools that test a workflow, a decision log, or a set of numbers",
  },
  {
    href: "/casebook",
    label: "Casebook",
    description: "Scored public failures established by courts and regulators",
  },
];

/**
 * The mega menu, named for the three layers the content model already has.
 *
 * Theory says why the laws hold, method says what must be true, instruments
 * check whether it is. The old headings ("Standards & Specifications",
 * "Diagnostics & Workbench") described file types rather than layers, which is
 * why every new page had to argue for a slot instead of falling into one.
 *
 * The five-link ceiling stays. It is not a display constraint — it is the only
 * thing forcing a decision about what a section is for.
 */
export const navSections: NavSection[] = [
  {
    heading: "Method",
    description:
      "What must be true when a system decides for an institution, and the draft requirements that test for it.",
    links: [
      {
        href: "/method",
        label: "The method",
        description:
          "How evidence of a wrong decision reaches someone who has to change the rule",
      },
      {
        href: "/standards/laws",
        label: "The twelve laws",
        description:
          "Twelve conditions that must always hold, and the clauses behind each",
      },
      {
        href: "/low-leverage",
        label: "Low-leverage work",
        description: "Eleven approaches that fail, and what replaces each",
      },
      {
        href: "/standards",
        label: "Standards",
        description: "Draft requirements, each one a test a system can fail",
      },
      {
        href: "/evidence-packs",
        label: "Evidence packs",
        description: "What a clause needs you to be able to show",
      },
    ],
  },
  {
    heading: "Mechanisms and evals",
    description:
      "How the requirements are built, and how a built system is scored against them.",
    links: [
      {
        href: "/mechanisms",
        label: "Mechanisms catalog",
        description: "Kill switches, appeals queues, and safe-state controls",
      },
      {
        href: "/evals",
        label: "Eval suites",
        description:
          "Tests of whether a deployed system's decisions can be challenged, halted, and reversed",
      },
      {
        href: "/evals/coverage",
        label: "What we can check",
        description:
          "Each check and the claim it tests, plus the claims no check covers yet",
      },
      {
        href: "/validators",
        label: "Validators",
        description:
          "Specifications, each with a working form, for scoring a user journey's time, friction, and delay",
      },
      {
        href: "/measurement-tiers",
        label: "Measurement tiers",
        description:
          "Levels of evidence, how each is gamed, and how to detect it",
      },
    ],
  },
  {
    // Ordered by what you have to bring, not by tool name. "Which one do I
    // want" is answerable from the input; it is not answerable from a list of
    // product names.
    heading: "Tools",
    // The heading carries the hub link so the five slots stay tools. Without
    // it a phone reaches /diagnostics from no menu: the bar's link to it is
    // desktop-only, and the footer no longer repeats this map.
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
        label: "Record conformance",
        description: "Bring a decision log: does it meet the level it claims?",
      },
      {
        href: "/use-cases",
        label: "Which tool for your system",
        description:
          "Bring the decision it makes: six kinds of system, each with the check to run first",
      },
      {
        href: "/diagnostics/self-defense-tools",
        label: "Self-defense checks",
        description:
          "Bring a decision made about you: can it be challenged, can the appeal change the outcome, and who can reverse it",
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
        href: "/taxonomy",
        label: "Practice taxonomy",
        description:
          "Governance practices by domain, each filed under the safeguards it serves",
      },
      {
        href: "/casebook",
        label: "Casebook",
        description: "Five public failures scored on six safeguards",
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
