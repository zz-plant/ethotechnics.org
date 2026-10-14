import {
  commissionedWork,
  commissionedWorkFormats,
  commissionedWorkMailto,
} from "./commissioned-work";

export type ComparisonAction = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  rel?: string;
};

export type ComparisonCard = {
  eyebrow: string;
  title: string;
  description: string;
  actions: ComparisonAction[];
};

export type CommissionedWorkComparisonContent = {
  eyebrow: string;
  heading: string;
  description: string;
  cards: ComparisonCard[];
};

export const commissionedWorkComparisonContent: CommissionedWorkComparisonContent =
  {
    eyebrow: "Where to start",
    heading: "Run it yourself, or commission an evaluation?",
    description: `Ethotechnics.org is the Institute: open guides and diagnostics you can run yourself. Commissioned safety evaluation for healthcare AI is ${commissionedWork.provider}'s own practice.`,
    cards: [
      {
        eyebrow: "Institute",
        title: "Open guidance and self-serve diagnostics",
        description:
          "Work from the openly licensed mechanisms catalog (CC BY-SA 4.0), and run a diagnostic yourself for a first reading of readiness.",
        actions: [
          {
            label: "Browse mechanisms",
            href: "/mechanisms",
            variant: "primary",
          },
          { label: "Run a diagnostic", href: "/diagnostics", variant: "ghost" },
        ],
      },
      {
        eyebrow: "Commissioned",
        title: "Commissioned evaluation of healthcare AI",
        description: `Four formats: ${commissionedWorkFormats}.`,
        actions: [
          {
            label: commissionedWork.linkLabel,
            href: commissionedWork.href,
            variant: "primary",
            rel: "noopener noreferrer",
          },
          {
            label: `Email ${commissionedWork.email}`,
            href: commissionedWorkMailto(),
            variant: "ghost",
          },
        ],
      },
    ],
  };
