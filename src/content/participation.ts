import type { PageCopy } from './types';

type ParticipationAction = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type ParticipationPathway = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  actions: ParticipationAction[];
  checklist: string[];
};

type ParticipationContent = PageCopy & {
  permalink: string;
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    anchorLinks: { href: string; label: string }[];
    panel: {
      title: string;
      description: string;
      eyebrow?: string;
    };
  };
  pathways: ParticipationPathway[];
  feedback: {
    eyebrow: string;
    title: string;
    description: string;
    actions: ParticipationAction[];
  };
};

export const participationContent: ParticipationContent = {
  pageTitle: 'Participate — Strengthen the Ethotechnics library',
  pageDescription:
    'Share field reports, host peer reviews, and join monthly clinics to keep the Institute grounded in practitioner evidence.',
  permalink: '/participate',
  hero: {
    eyebrow: 'Participate',
    heading: 'Bring your evidence and questions to the Institute.',
    description:
      'We publish guidance with the community. Share case studies, invite peer review, or join clinics so the work reflects real-world delivery and governance pressures.',
    anchorLinks: [
      { href: '#field-reports', label: 'Submit a field report' },
      { href: '#peer-review', label: 'Host a peer review' },
      { href: '#clinics', label: 'Join monthly clinics' },
      { href: '#feedback', label: 'Send feedback' },
    ],
    panel: {
      eyebrow: 'What we collect',
      title: 'Applied signals over theory',
      description:
        'Annotated notes from live systems, prototypes, and governance pilots keep the guidance accountable to the people it affects.',
    },
  },
  pathways: [
    {
      id: 'field-reports',
      title: 'Submit field reports and case studies',
      description:
        'Share research memos, postmortems, or annotated experiments that illustrate how accountable delivery looks in practice.',
      tags: ['Discovery research', 'Pilots', 'Policy reviews'],
      checklist: [
        'Summarize the scenario and the stakeholders involved.',
        'Include any artifacts or decision logs you can share.',
        'Note what changed for people after the intervention.',
      ],
      actions: [
        {
          label: 'Email your field report',
          href: 'mailto:hello@ethotechnics.org?subject=Field%20report%20submission',
          ariaLabel: 'Email your field report to hello@ethotechnics.org',
        },
        { label: 'See framing prompts', href: '/start-here#framing' },
      ],
    },
    {
      id: 'peer-review',
      title: 'Host a peer review',
      description:
        'Invite us to facilitate a review of your guidance, governance plans, or interventions so we can publish anonymized lessons.',
      tags: ['Governance pilots', 'Playbook drafts', 'Risk reviews'],
      checklist: [
        'Share the draft or deck you want reviewed.',
        'Name the decision you need to make next.',
        'Flag any sensitive details that need anonymizing.',
      ],
      actions: [
        {
          label: 'Schedule a review',
          href: 'mailto:studio@ethotechnics.org?subject=Peer%20review%20request',
          ariaLabel: 'Schedule a peer review via studio@ethotechnics.org',
        },
        { label: 'Share a draft for feedback', href: 'mailto:hello@ethotechnics.org?subject=Library%20peer%20review' },
      ],
    },
    {
      id: 'clinics',
      title: 'Join monthly clinics',
      description:
        'Bring open questions to monthly drop-in sessions focused on facilitation challenges, safeguards, and metrics.',
      tags: ['Live Q&A', 'Practice labs', 'Office hours'],
      checklist: [
        'Bring one specific question or scenario.',
        'Share where you are in the delivery timeline.',
        'Note any blockers or risks you want to explore.',
      ],
      actions: [
        {
          label: 'Reserve a clinic spot',
          href: 'mailto:hello@ethotechnics.org?subject=Clinic%20RSVP',
          ariaLabel: 'Reserve a monthly clinic spot',
        },
        { label: 'Suggest a clinic topic', href: 'mailto:hello@ethotechnics.org?subject=Clinic%20topic' },
      ],
    },
  ],
  feedback: {
    eyebrow: 'Feedback',
    title: 'Prefer to send quick notes?',
    description:
      'Tell us what would make the library more useful—missing artifacts, unclear steps, or examples you need to see.',
    actions: [
      {
        label: 'Contact the inbox',
        href: 'mailto:hello@ethotechnics.org?subject=Library%20feedback',
        ariaLabel: 'Email hello@ethotechnics.org with library feedback',
      },
      {
        label: 'Share facilitation feedback',
        href: 'mailto:studio@ethotechnics.org?subject=Facilitation%20feedback',
        ariaLabel: 'Email studio@ethotechnics.org with facilitation feedback',
      },
    ],
  },
} satisfies ParticipationContent;
