export type KnowledgeCheck = {
  moduleId: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type ModuleResource = {
  diagnostics: string[];
  libraryLink: {
    href: string;
    label: string;
  };
};

export const knowledgeChecks: KnowledgeCheck[] = [
  {
    moduleId: "orientation",
    question:
      "What keeps syllabus links trustworthy when you share them in specs or briefings?",
    options: [
      "Copying screenshots of the glossary so teams do not need the site.",
      "Linking the stable permalinks for primers, glossary anchors, and mechanism filters.",
      "Asking every team to draft their own definitions in a separate doc.",
    ],
    correct: 1,
    explanation:
      "Use the existing permalinks for the primer, glossary anchors, and mechanism filters so teams land on the same references.",
  },
  {
    moduleId: "field-ready-research",
    question:
      "How should research outputs connect back to the mechanisms during this module?",
    options: [
      "Skip links entirely and rely on word-of-mouth summaries.",
      "Tag findings with glossary anchors and mechanism cues so teams can reuse them.",
      "Wait until the end of the project to decide which terms to use.",
    ],
    correct: 1,
    explanation:
      "Tagging field findings with glossary anchors and mechanism cues keeps the handoff fast and traceable.",
  },
  {
    moduleId: "governance-and-maintenance",
    question:
      "Before marking this module complete, what should the team confirm?",
    options: [
      "That maintenance windows, appeal paths, and escalation owners are visible and linked.",
      "That only the design team knows how to find the decision log.",
      "That governance documents stay private to avoid scrutiny.",
    ],
    correct: 0,
    explanation:
      "Completion means governance links are visible: the maintenance window, appeal paths, and escalation owners are documented.",
  },
];

export const moduleResources: Record<string, ModuleResource> = {
  orientation: {
    diagnostics: ["burden-modeler"],
    libraryLink: {
      href: "#primer",
      label: "Mechanisms primer",
    },
  },
  "field-ready-research": {
    diagnostics: ["llm-capacity-benchmark"],
    libraryLink: {
      href: "#glossary",
      label: "Glossary anchors",
    },
  },
  "governance-and-maintenance": {
    diagnostics: ["maintenance-simulator"],
    libraryLink: {
      href: "#mechanisms",
      label: "Mechanism language",
    },
  },
};
