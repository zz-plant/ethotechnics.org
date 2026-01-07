import type { PageWithPermalink } from './types';

export type AnchorLink = {
  href: string;
  label: string;
};

export type StartHereRoute = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  time: string;
};

export type ArtifactPreview = {
  title: string;
  description: string;
  label: string;
  href: string;
  note: string;
};

export type StudioRelationship = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaAriaLabel: string;
};

export type StartHereContent = PageWithPermalink & {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    quickNote: string;
    panel: {
      title: string;
      description: string;
    };
    actions: {
      label: string;
      href: string;
      ariaLabel?: string;
      variant: 'primary' | 'ghost';
    }[];
  };
  anchorLinks: AnchorLink[];
  routes: {
    eyebrow: string;
    title: string;
    description: string;
    cards: StartHereRoute[];
  };
  artifacts: {
    eyebrow: string;
    title: string;
    description: string;
    previews: ArtifactPreview[];
  };
  framing: {
    eyebrow: string;
    title: string;
    description: string;
    isList: string[];
    isNotList: string[];
  };
  studio: StudioRelationship;
  footerCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const startHereContent: StartHereContent = {
  pageTitle: 'Start here — Ethotechnics',
  pageDescription:
    'Pick the right starting point for diagnostics, the Institute library, or a Studio engagement.',
  permalink: '/start-here',
  hero: {
    eyebrow: 'Orientation',
    heading: 'Start here',
    description:
      'Choose a path based on whether you need a quick diagnostic, library guidance, or a co-delivered engagement.',
    quickNote: 'If you only have 5 minutes, start with the diagnostic menu to pick the fastest next step.',
    panel: {
      title: 'How to use this page',
      description:
        'Follow the cards to run a diagnostic, grab references you can share, or learn how the Studio pairs with the Institute.',
    },
    actions: [
      {
        label: 'Open the diagnostic runner',
        href: '/diagnostics',
        ariaLabel: 'Open the diagnostics landing page to run a tool',
        variant: 'primary',
      },
      {
        label: 'Preview a sample PDF',
        href: '/assets/start-here/diagnostic-readout.pdf',
        ariaLabel: 'Download a sample diagnostic PDF',
        variant: 'ghost',
      },
    ],
  },
  anchorLinks: [
    { href: '#routes', label: 'Choose your path' },
    { href: '#artifacts', label: 'Preview outputs' },
    { href: '#framing', label: 'What this is' },
    { href: '#studio', label: 'Studio relationship' },
    { href: '#cta', label: 'Talk to the team' },
  ],
  routes: {
    eyebrow: 'Navigation',
    title: 'Pick the entry point that matches your task.',
    description:
      'Run a diagnostic if you need a quick decision, scan the library for reusable guidance, or enlist the Studio for delivery.',
    cards: [
      {
        title: 'Run a diagnostic',
        description:
          'Choose a tool, bring a scenario, and leave with a shareable readout tied to the pattern language.',
        href: '/diagnostics',
        tags: ['Readiness labs', 'Off-ramps included', 'Shareable results'],
        time: '15–30 min session',
      },
      {
        title: 'Browse the library',
        description:
          'Use primers, playbooks, and glossary anchors to align your team on safety, consent, and stewardship.',
        href: '/library',
        tags: ['Permalinked guidance', 'Field-tested patterns', 'Glossary linked'],
        time: '30–60 min scan',
      },
      {
        title: 'Check field notes',
        description:
          'See how teams apply the guidance in practice with annotated walkthroughs and facilitation prompts.',
        href: '/field-notes',
        tags: ['Applied examples', 'Facilitation cues', 'Shareable links'],
        time: '10 min per note',
      },
      {
        title: 'Join the Institute',
        description:
          'Stay close to new releases, contribute playbooks, and access facilitation kits as they launch.',
        href: '/institute',
        tags: ['Cohorts', 'Contributor program', 'Pattern updates'],
        time: 'Ongoing',
      },
    ],
  },
  artifacts: {
    eyebrow: 'Artifacts',
    title: 'See what you can take with you.',
    description:
      'Diagnostics and playbooks export to PDFs you can share with leadership, regulators, or delivery partners.',
    previews: [
      {
        title: 'Diagnostic readout',
        description:
          'Summarizes the scenario, readiness score, and recommendations with a persistent off-ramp to facilitation.',
        label: 'Download diagnostic sample (PDF)',
        href: '/assets/start-here/diagnostic-readout.pdf',
        note: 'Formatted for quick executive sharing with glossary references.',
      },
      {
        title: 'Playbook excerpt',
        description:
          'A compact PDF pull from the library that pairs prompts, checklists, and glossary links for reuse.',
        label: 'Download playbook sample (PDF)',
        href: '/assets/start-here/playbook-excerpt.pdf',
        note: 'Use it to brief a partner before running a diagnostic together.',
      },
    ],
  },
  framing: {
    eyebrow: 'Definition',
    title: 'What this page is and is not.',
    description:
      'Use this as a dispatcher, not a comprehensive guide—each link lands on a permalink that stays updated.',
    isList: [
      'A quick orientation for new collaborators and decision-makers.',
      'A map linking diagnostics, the library, and Studio off-ramps.',
      'A place to grab sample outputs you can forward without edits.',
    ],
    isNotList: [
      'A replacement for the full library or glossary.',
      'A marketing landing page—everything here is operational.',
      'A gated experience; every link is public and shareable.',
    ],
  },
  studio: {
    eyebrow: 'Studio',
    title: 'How the Studio fits in.',
    description:
      'Diagnostics and library guidance stay public. The Studio steps in when you need facilitation, co-delivery, or a mediator.',
    bullets: [
      'Escalate from any diagnostic readout to ethotechnics.com/studio when risk or ambiguity shows up.',
      'Invite Studio partners to co-facilitate workshops using the same playbooks you see in the library.',
      'Use Studio engagements to trial a path, then fold the learnings back into the Institute releases.',
    ],
    ctaLabel: 'Visit the Studio',
    ctaHref: 'https://ethotechnics.com/studio',
    ctaAriaLabel: 'Open ethotechnics.com/studio in a new tab to learn about engagements',
  },
  footerCta: {
    eyebrow: 'Ready to start?',
    title: 'Pick a diagnostic or share a sample output.',
    description:
      'Bring a scenario and we will route you to the right tool, facilitator, or playbook.',
    primaryLabel: 'Run a diagnostic',
    primaryHref: '/diagnostics',
    secondaryLabel: 'Download the diagnostic sample (PDF)',
    secondaryHref: '/assets/start-here/diagnostic-readout.pdf',
  },
};
