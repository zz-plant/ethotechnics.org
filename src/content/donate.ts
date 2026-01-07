import type { PageWithPermalink } from "./types";

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
  impactNote: string;
  paths: ContributionPath[];
  contact: ContactInfo;
  trust: {
    title: string;
    bullets: string[];
    note: string;
  };
  faq: { question: string; answer: string }[];
  quickSupport: {
    title: string;
    description: string;
    options: { amount: string; detail: string; ctaLabel: string; href: string }[];
    href: string;
    ctaLabel: string;
  };
};

export const donateContent: DonateContent = {
  pageTitle: "Donate — Ethotechnics",
  pageDescription:
    "Keep Ethotechnics research, diagnostics, and practice guides freely available through direct contributions.",
  permalink: "/donate",
  impact: [
    {
      title: "Fund open research",
      detail:
        "Underwrite studies, protocols, and publications that stay freely accessible to teams and communities.",
    },
    {
      title: "Maintain diagnostics",
      detail:
        "Support updates to the diagnostic tools and safeguards that guide teams through risky launches.",
    },
    {
      title: "Sustain the library",
      detail:
        "Back the glossary, patterns, and teaching materials that help practitioners adopt ethical defaults.",
    },
  ],
  impactNote:
    "We publish short impact updates in the Field Notes feed and share receipts with every contribution.",
  paths: [
    {
      title: "One-time gifts",
      description:
        "Send a direct contribution to back the next set of releases or cover hosting and editorial costs.",
      ctaLabel: "Email to confirm a gift",
      href: "mailto:hello@ethotechnics.org?subject=Donate%20to%20Ethotechnics",
    },
    {
      title: "Monthly support",
      description:
        "Set up a recurring transfer to keep the research cadence steady and offset publication expenses.",
      ctaLabel: "Arrange monthly support",
      href: "mailto:hello@ethotechnics.org?subject=Set%20up%20monthly%20support",
    },
    {
      title: "Partner with the Institute",
      description:
        "Fund a program, workshop series, or facilitation sprint with your team through a sponsorship agreement.",
      ctaLabel: "Discuss sponsorship",
      href: "mailto:studio@ethotechnics.org?subject=Institute%20sponsorship",
    },
  ],
  quickSupport: {
    title: "Quick support",
    description:
      "For individual supporters who want to move fast without procurement steps.",
    options: [
      {
        amount: "$50",
        detail: "Covers one new glossary definition release.",
        ctaLabel: "Contribute $50",
        href: "mailto:hello@ethotechnics.org?subject=Quick%20donation%20support%20%2450",
      },
      {
        amount: "$150",
        detail: "Supports a Field Notes dispatch and editing cycle.",
        ctaLabel: "Contribute $150",
        href: "mailto:hello@ethotechnics.org?subject=Quick%20donation%20support%20%24150",
      },
      {
        amount: "$500",
        detail: "Offsets one diagnostic worksheet refresh.",
        ctaLabel: "Contribute $500",
        href: "mailto:hello@ethotechnics.org?subject=Quick%20donation%20support%20%24500",
      },
    ],
    href: "mailto:hello@ethotechnics.org?subject=Quick%20donation%20support",
    ctaLabel: "Email to contribute",
  },
  contact: {
    title: "Need invoicing details?",
    detail:
      "We can provide invoices, ACH instructions, or fiscal sponsorship options for organizations that require them.",
    email: "hello@ethotechnics.org",
    subject: "Donation logistics",
  },
  trust: {
    title: "Donation details",
    bullets: [
      "Payment methods: email the team for ACH, wire, or card options.",
      "Receipts are issued within 2–3 business days for all contributions.",
      "Fiscal sponsorship and nonprofit paperwork available on request.",
    ],
    note: "Ethotechnics contributions support open research and publishing; no paywalls or gated resources.",
  },
  faq: [
    {
      question: "Is my contribution tax-deductible?",
      answer:
        "We can provide fiscal sponsorship documentation when needed. Contact us for the latest status and paperwork.",
    },
    {
      question: "Will I receive a receipt?",
      answer:
        "Yes. Receipts are sent within 2–3 business days after confirming your contribution.",
    },
    {
      question: "Can my organization sponsor a specific program?",
      answer:
        "Yes. We can scope program sponsorships, cohorts, or workshops with a tailored agreement.",
    },
  ],
};
