import type { PageWithPermalink } from './types';

type ImpactArea = {
  title: string;
  detail: string;
};

type ContributionPath = {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

type ContactInfo = {
  title: string;
  detail: string;
  email: string;
  subject: string;
};

export type DonateContent = PageWithPermalink & {
  impact: ImpactArea[];
  paths: ContributionPath[];
  contact: ContactInfo;
};

export const donateContent: DonateContent = {
  pageTitle: 'Donate — Ethotechnics',
  pageDescription:
    'Keep Ethotechnics research, diagnostics, and practice guides freely available through direct contributions.',
  permalink: '/donate',
  impact: [
    {
      title: 'Fund open research',
      detail: 'Underwrite studies, protocols, and publications that stay freely accessible to teams and communities.',
    },
    {
      title: 'Maintain diagnostics',
      detail: 'Support updates to the diagnostic tools and safeguards that guide teams through risky launches.',
    },
    {
      title: 'Sustain the library',
      detail: 'Back the glossary, patterns, and teaching materials that help practitioners adopt ethical defaults.',
    },
  ],
  paths: [
    {
      title: 'One-time gifts',
      description: 'Send a direct contribution to back the next set of releases or cover hosting and editorial costs.',
      ctaLabel: 'Email to confirm a gift',
      href: 'mailto:hello@ethotechnics.org?subject=Donate%20to%20Ethotechnics',
    },
    {
      title: 'Monthly support',
      description: 'Set up a recurring transfer to keep the research cadence steady and offset publication expenses.',
      ctaLabel: 'Arrange monthly support',
      href: 'mailto:hello@ethotechnics.org?subject=Set%20up%20monthly%20support',
    },
    {
      title: 'Partner with the Institute',
      description: 'Fund a program, workshop series, or facilitation sprint with your team through a sponsorship agreement.',
      ctaLabel: 'Discuss sponsorship',
      href: 'mailto:studio@ethotechnics.org?subject=Institute%20sponsorship',
    },
  ],
  contact: {
    title: 'Need invoicing details?',
    detail:
      'We can provide invoices, ACH instructions, or fiscal sponsorship options for organizations that require them.',
    email: 'hello@ethotechnics.org',
    subject: 'Donation logistics',
  },
};
