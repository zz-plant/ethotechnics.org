import type { PageWithPermalink } from './types';

export type GovernanceItem = {
  title: string;
  detail: string;
};

export type Steward = {
  name: string;
  role: string;
  focus: string;
};

export type ContactChannel = {
  label: string;
  href: string;
  description: string;
};

export type InstituteContent = PageWithPermalink & {
  mission: string[];
  governance: GovernanceItem[];
  stewards: Steward[];
  contact: ContactChannel[];
};

export const instituteContent: InstituteContent = {
  pageTitle: 'Institute — Ethotechnics',
  pageDescription: 'Programs, convenings, and ways to collaborate on the Ethotechnics institute roadmap.',
  permalink: '/institute',
  mission: [
    'Build a shared practice for ethical technology that travels across org charts and domains.',
    'Provide a home for practitioners and partners to publish accountable, human-centered playbooks.',
    'Keep materials lightweight, accessible, and linked back to the library for clarity.',
  ],
  governance: [
    {
      title: 'Charter',
      detail: 'A living charter sets expectations for consent, attribution, and how we steward community input.',
    },
    {
      title: 'Decision forum',
      detail: 'Decisions and dissent are logged with stewardship windows so accountability is visible.',
    },
    {
      title: 'Safeguards',
      detail: 'Every program ships with safety valves, appeal paths, and public status updates.',
    },
  ],
  stewards: [
    {
      name: 'Kanav Jain',
      role: 'Institute Lead',
      focus: 'Roadmapping programs and coordinating partners across the studio.',
    },
  ],
  contact: [
    {
      label: 'Studio collaborations',
      href: 'mailto:studio@ethotechnics.org',
      description: 'Reach the Studio when diagnostics flag risk or you need a facilitation partner.',
    },
    {
      label: 'Program partnerships',
      href: 'mailto:studio@ethotechnics.org',
      description: 'Ask about upcoming programs or propose a research collaboration.',
    },
    {
      label: 'General questions',
      href: 'mailto:hello@ethotechnics.org',
      description: 'For speaking requests, press, or co-writing opportunities.',
    },
  ],
};
