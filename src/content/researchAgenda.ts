import type { PageWithPermalink } from "./types";

export type ResearchAgendaPillar = {
  id: string;
  title: string;
  summary: string;
  signals: string[];
};

export type ResearchAgendaContent = PageWithPermalink & {
  hero: {
    eyebrow: string;
    title: string;
    anchorLinks: { href: string; label: string }[];
  };
  orientation: {
    title: string;
    description: string;
    linesOfInquiry: string[];
    closing: string;
  };
  overview: {
    title: string;
    paragraphs: string[];
  };
  pillars: {
    title: string;
    description: string;
    items: ResearchAgendaPillar[];
  };
};

export const researchAgendaContent: ResearchAgendaContent = {
  pageTitle: "Research agenda — Ethotechnics",
  pageDescription:
    "The questions Ethotechnics research pursues next: where accountability, refusal, and maintenance hold or fail in systems that decide about people.",
  permalink: "/research/agenda",
  hero: {
    eyebrow: "Research",
    title: "Research agenda",
    anchorLinks: [
      { href: "#orientation", label: "Orientation" },
      { href: "#overview", label: "Overview" },
      { href: "#pillars", label: "Thematic pillars" },
    ],
  },
  orientation: {
    title: "Accountability where decisions land",
    description:
      "We study where maintenance, refusal, and accountability hold, and where they fail, in sociotechnical systems that make consequential decisions about vulnerable people.",
    linesOfInquiry: [
      "Staff holding the pager and the people absorbing late-night calls.",
      "The legal and policy terms that say who must act, and by when.",
      "Routines that let teams pause or reverse a decision before harm compounds.",
    ],
    closing:
      "Each line asks where refusal and maintenance are recorded, so a team can intervene early without relying on heroics.",
  },
  overview: {
    title: "How we work and share",
    paragraphs: [
      "The agenda names the problems Ethotechnics studies. It focuses on accountability, refusability, and maintenance, because consequential systems fail when any of them is missing or left implicit.",
      "Each study pairs qualitative interviews with operational diagnostics, to show where policy, tooling, and human judgment support or undermine one another. Findings become drills and diagnostics. Partners can bring their own cases for joint investigation. When a line of inquiry concludes, we publish checklists, facilitation prompts, and implementation notes that teams can adapt without a formal engagement.",
    ],
  },
  pillars: {
    title: "What we are investigating next",
    description:
      "Four pillars set the next studies. Each names a place where refusal, maintenance, or accountability lacks a working mechanism.",
    items: [
      {
        id: "accountability-and-refusal",
        title: "Mapping accountability and refusal paths",
        summary:
          "We track where responsibility concentrates, how refusal is exercised, and which governance structures protect pauses or reversals. The aim is refusal and accountability that work without heroics.",
        signals: [
          "Refusal paths that stay open",
          "Governance that protects reversals",
          "Shared accountability maps",
        ],
      },
      {
        id: "maintenance-visibility",
        title: "Maintenance visibility and protected pauses",
        summary:
          "Services people depend on accumulate maintenance debt quickly. We study how teams surface gaps early, negotiate resourcing, and protect the pauses needed to stabilize a service without punishing the people who call for them.",
        signals: [
          "Maintenance debt surfaced early",
          "Protected stewardship windows",
          "Resourcing that matches risk",
        ],
      },
      {
        id: "safeguards-after-launch",
        title: "Sociotechnical safeguards after launch",
        summary:
          "We examine how documentation, observability, rollbacks, and training interact, and whether a safeguard survives handoffs, leadership changes, and growth in volume.",
        signals: [
          "Rollbacks that work under pressure",
          "Documentation that survives handoffs",
          "Training that keeps safeguards alive",
        ],
      },
      {
        id: "llm-guidance-and-drills",
        title: "Language-model guidance and drills",
        summary:
          "We prototype guided Q&A, scenario drills, and facilitation prompts built on large language models, so new staff can practice accountable behavior. Each prototype must respect interpretive sovereignty.",
        signals: [
          "Guided prompts for new staff",
          "Scenario drills that respect refusal",
          "LLM use that protects sovereignty",
        ],
      },
    ],
  },
};
