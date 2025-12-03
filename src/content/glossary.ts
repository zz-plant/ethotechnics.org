import type { PageWithPermalink } from './types';

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  appliesTo: string[];
};

export type GlossaryPage = PageWithPermalink & {
  glossary: { terms: GlossaryTerm[] };
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'consent-journey',
    term: 'Consent journey',
    definition:
      'The end-to-end set of moments where a person learns, agrees, reconsiders, or exits an experience.',
    appliesTo: ['Research protocols', 'UI flows', 'Governance checkpoints'],
  },
  {
    slug: 'burden-index',
    term: 'Burden index',
    definition:
      'A quick score combining effort, confusion, and risk signals to spot when a service asks too much of a person.',
    appliesTo: ['Diagnostics', 'Design reviews', 'Accessibility audits'],
  },
  {
    slug: 'safety-valve',
    term: 'Safety valve',
    definition:
      'An intentionally designed escape hatch that lets people pause, undo, or appeal a decision without penalty.',
    appliesTo: ['Interfaces', 'Escalation runbooks', 'Service policies'],
  },
  {
    slug: 'stewardship-window',
    term: 'Stewardship window',
    definition:
      'The time horizon a team commits to monitoring, maintaining, and communicating about a feature or model.',
    appliesTo: ['Post-launch reviews', 'Maintenance simulators', 'Service-level objectives'],
  },
  {
    slug: 'signal-credibility',
    term: 'Signal credibility',
    definition:
      'A read on whether an insight comes from representative voices, and how rigorously it was validated.',
    appliesTo: ['Field notes', 'Research findings', 'Risk assessments'],
  },
];

const glossaryIndex = glossaryTerms.reduce<Record<string, GlossaryTerm>>((index, term) => {
  index[term.slug] = term;
  return index;
}, {});

const formatSlug = (slug: string) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getGlossaryLabel = (slug: string) => glossaryIndex[slug]?.term ?? formatSlug(slug);
