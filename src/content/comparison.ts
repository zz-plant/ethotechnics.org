export type ComparisonAction = {
  label: string;
  href: string;
  variant: 'primary' | 'ghost';
  rel?: string;
};

export type ComparisonCard = {
  eyebrow: string;
  title: string;
  description: string;
  actions: ComparisonAction[];
};

export type InstituteStudioComparisonContent = {
  eyebrow: string;
  heading: string;
  description: string;
  cards: ComparisonCard[];
};

export const instituteStudioComparisonContent: InstituteStudioComparisonContent = {
  eyebrow: 'Where to start',
  heading: 'Institute or Studio?',
  description:
    'Institute = open guides and diagnostics you can run yourself. Studio = facilitated engagements when you need a delivery partner.',
  cards: [
    {
      eyebrow: 'Institute',
      title: 'Open guidance and self-serve diagnostics.',
      description: 'Use the free library to align teams and run diagnostics when you want a quick readiness pulse.',
      actions: [
        { label: 'Browse the library', href: '/library', variant: 'primary' },
        { label: 'Run a diagnostic', href: '/diagnostics', variant: 'ghost' },
      ],
    },
    {
      eyebrow: 'Studio',
      title: 'Facilitated engagements when you need a partner.',
      description: 'Bring in the Studio for bespoke facilitation, governance escalations, or embedded delivery support.',
      actions: [
        {
          label: 'Visit the Studio',
          href: 'https://ethotechnics.com/studio',
          variant: 'primary',
          rel: 'noreferrer',
        },
        { label: 'Email the Studio team', href: 'mailto:studio@ethotechnics.org', variant: 'ghost' },
      ],
    },
  ],
};
