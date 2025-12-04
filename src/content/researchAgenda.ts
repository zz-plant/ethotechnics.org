import type { PageWithPermalink } from './types';

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
    panelCopy: {
      eyebrow?: string;
      title: string;
      description: string;
    };
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
  pageTitle: 'Research agenda — Ethotechnics',
  pageDescription:
    'How Ethotechnics traces accountability, refusal, and maintenance in care-centered systems.',
  permalink: '/research/agenda',
  hero: {
    eyebrow: 'Research',
    title: 'Research agenda',
    anchorLinks: [
      { href: '#orientation', label: 'Orientation' },
      { href: '#overview', label: 'Overview' },
      { href: '#pillars', label: 'Thematic pillars' },
    ],
    panelCopy: {
      eyebrow: 'Why this agenda exists',
      title: 'Partners use this work to stay accountable.',
      description:
        'Findings translate into safer launches, accountable governance deals, and maintenance debt that stays visible instead of hidden in people’s bodies.',
    },
  },
  orientation: {
    title: 'Care-centered accountability',
    description:
      'We study how care-centered systems stay accountable. Ethotechnics traces where maintenance, refusal, and accountability succeed—and where they collapse—inside sociotechnical systems that serve vulnerable people.',
    linesOfInquiry: [
      'Staff holding the pager and the people absorbing late-night calls.',
      'Legal and policy scaffolding that shapes accountable action.',
      'Rituals that let teams pause or reverse harm before it compounds.',
    ],
    closing:
      'Each line of inquiry keeps refusal and maintenance visible so teams can intervene early rather than rely on heroics.',
  },
  overview: {
    title: 'How we work and share',
    paragraphs: [
      'The research agenda keeps Ethotechnics honest about the problems we study and the partners we serve. We focus on accountability, refusability, and maintenance because care-critical systems fail when those elements are missing or left implicit.',
      'Each study pairs qualitative interviews with operational diagnostics so we can see how policy, tooling, and human judgment reinforce—or undermine—one another. Use this agenda to understand what questions we are pursuing next, how findings turn into drills and diagnostics, and where partners can bring their own cases for joint investigation. When a line of inquiry lands, we publish checklists, facilitation prompts, and implementation notes so teams can adapt the work without waiting for a formal engagement.',
    ],
  },
  pillars: {
    title: 'What we are investigating next',
    description:
      'Four thematic pillars steer the next wave of studies. Each highlights where refusal, maintenance, and accountability need stronger scaffolding.',
    items: [
      {
        id: 'accountability-and-refusal',
        title: 'Mapping accountability and refusal paths',
        summary:
          'We track where responsibility concentrates, how refusal is exercised, and which governance structures protect pauses or reversals. The goal is to make refusal and accountability actionable rather than dependent on heroics.',
        signals: ['Refusal paths that stay open', 'Governance that protects reversals', 'Shared accountability maps'],
      },
      {
        id: 'maintenance-visibility',
        title: 'Maintenance visibility and protected pauses',
        summary:
          'Care systems accumulate maintenance debt quickly. We study how teams surface gaps early, negotiate resourcing, and protect the pauses required to stabilize services without punishing the people who call for them.',
        signals: ['Maintenance debt surfaced early', 'Protected stewardship windows', 'Resourcing that matches risk'],
      },
      {
        id: 'safeguards-after-launch',
        title: 'Sociotechnical safeguards after launch',
        summary:
          'Safeguards only matter if they endure. We examine how documentation, observability, rollbacks, and training interact so that safeguards survive handoffs, leadership changes, and scale.',
        signals: ['Rollbacks that work under pressure', 'Documentation that survives handoffs', 'Training that keeps safeguards alive'],
      },
      {
        id: 'llm-guidance-and-drills',
        title: 'Guidance and drills powered by language models',
        summary:
          'Large language models can lower barriers to practice when used thoughtfully. We prototype guided Q&A, scenario drills, and facilitation prompts that keep accountable behavior within reach for new staff while honoring interpretive sovereignty.',
        signals: ['Guided prompts for new staff', 'Scenario drills that respect refusal', 'LLM use that protects sovereignty'],
      },
    ],
  },
};
