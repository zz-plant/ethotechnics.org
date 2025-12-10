import type { GlossaryTerm } from './glossary';
import type { PageWithPermalink } from './types';

import { glossaryContent, glossaryTerms } from './glossary';

export type PrimerSection = {
  title: string;
  summary: string;
  takeaways: string[];
};

export type PatternFilter = {
  slug: 'governance' | 'design-ethics' | 'policy';
  label: string;
  description: string;
};

export type Pattern = {
  slug: string;
  title: string;
  summary: string;
  filters: PatternFilter['slug'][];
  cues: string[];
  diagnostics: string[];
};

export type SyllabusModule = {
  title: string;
  duration: string;
  topics: string[];
  outcome: string;
};

export type LibraryContent = PageWithPermalink & {
  primer: PrimerSection[];
  glossary: { terms: GlossaryTerm[]; permalink: string };
  patterns: { filters: PatternFilter[]; entries: Pattern[] };
  syllabus: { overview: string; modules: SyllabusModule[] };
};

export const libraryContent: LibraryContent = {
  pageTitle: 'Library — Ethotechnics',
  pageDescription: 'Reference shelf for primers, glossary entries, and reusable patterns.',
  permalink: '/library',
  primer: [
    {
      title: 'Primer',
      summary: 'Short explainers teams can skim before working with the rest of the library.',
      takeaways: [
        'Why burden, consent, and stewardship matter for socio-technical systems.',
        'How to align governance artifacts with the lived experience of the people using your product.',
        'What “pattern language” means for UI safeguards, facilitation prompts, and escalation design.',
      ],
    },
    {
      title: 'Usage guidance',
      summary: 'How to adapt the materials to your org without slowing delivery.',
      takeaways: [
        'Each section ships with permalinks; link directly in design docs or runbooks to keep teams aligned.',
        'Filters call out whether a pattern is governance-first, design-ethics guidance, or a policy control.',
        'Glossary terms stay stable so research, field notes, and diagnostics can cross-link without drift.',
      ],
    },
  ],
  glossary: {
    terms: glossaryTerms.slice(0, 12),
    permalink: glossaryContent.permalink,
  },
  patterns: {
    filters: [
      {
        slug: 'governance',
        label: 'Governance',
        description: 'Decision logs, maintenance windows, and escalation paths backed by diagnostics.',
      },
      {
        slug: 'design-ethics',
        label: 'Design ethics',
        description: 'Consent prompts, appeal paths, and humane defaults that keep interfaces accountable.',
      },
      {
        slug: 'policy',
        label: 'Policy',
        description: 'Charters, stewardship commitments, and controls you can cite in contracts and playbooks.',
      },
    ],
    entries: [
      {
        slug: 'decision-log',
        title: 'Decision log with dissent',
        summary:
          'Capture high-stakes calls, dissenting views, and follow-ups so governance stays legible to teams and impacted people.',
        filters: ['governance', 'policy'],
        cues: [
          'Record why options were ruled out and who was consulted.',
          'Attach plain-language summaries for external readers.',
          'Set a review date tied to the stewardship window.',
        ],
        diagnostics: ['burden-modeler'],
      },
      {
        slug: 'progressive-consent',
        title: 'Progressive consent prompts',
        summary:
          'Stage requests for data or automation over time, with reminders and exits that honor the consent journey.',
        filters: ['design-ethics', 'policy'],
        cues: [
          'Pair each ask with why it is needed and how to revoke it.',
          'Show impacts of opting out before a person commits.',
          'Include a safety valve that defaults to privacy-preserving behavior.',
        ],
        diagnostics: ['llm-capacity-benchmark'],
      },
      {
        slug: 'maintenance-windowing',
        title: 'Maintenance windowing',
        summary:
          'Schedule improvements, monitoring, and resourcing using a visible stewardship window.',
        filters: ['governance', 'policy'],
        cues: [
          'Set owners and success criteria for each window.',
          'Map communication cadences to risk levels and audiences.',
          'Align dependencies so a degraded tool has a safe fallback.',
        ],
        diagnostics: ['maintenance-simulator'],
      },
      {
        slug: 'appeal-paths',
        title: 'Appeal paths inside the UI',
        summary:
          'Give people a built-in channel to dispute outputs, get human review, or learn how a decision was made.',
        filters: ['design-ethics', 'governance'],
        cues: [
          'Explain who reviews appeals and the expected response time.',
          'Pre-fill context to reduce effort during stressful moments.',
          'Track appeal outcomes to improve signal credibility.',
        ],
        diagnostics: ['burden-modeler', 'maintenance-simulator'],
      },
    ],
  },
  syllabus: {
    overview:
      'A guided track for teams adopting the library. Each module links to glossary anchors and patterns you can cite in docs.',
    modules: [
      {
        title: 'Orientation',
        duration: '60 minutes',
          topics: [
            'Library tour and how to use permalinks in specs',
            'Primer on burden, consent, and stewardship',
            'Navigation of governance, design ethics, and policy filters',
          ],
        outcome: 'Teams can route questions to the right section and cite glossary terms consistently.',
      },
      {
        title: 'Field-ready research',
        duration: '90 minutes',
        topics: [
          'Integrating glossary terms into research and field notes',
          'Tagging findings by focus area and diagnostic relevance',
          'Building appeal paths and consent prompts into prototypes',
        ],
        outcome: 'Practitioners share findings with linked terms and pattern cues that ship with the work.',
      },
      {
        title: 'Governance and maintenance',
        duration: '75 minutes',
        topics: [
          'Decision logs, stewardship windows, and escalation readiness',
          'Pairing diagnostics with pattern rollout',
          'Designing safety valves for high-burden scenarios',
        ],
        outcome: 'Leadership aligns on accountable maintenance plans backed by diagnostic evidence.',
      },
    ],
  },
};
