import { instituteStudioGuidance } from "./comparison";

export type ReferenceCalloutContent = {
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
  ariaLabel?: string;
};

export const instituteStudioCallout: ReferenceCalloutContent = {
  title: "Institute vs. Studio",
  summary: instituteStudioGuidance.callout,
  href: "/institute/how-studio-fits",
  linkLabel: "Read more",
  ariaLabel: "Read more about how the Institute and Studio work together",
};

export const diagnosticsStudioOffRampCallout: ReferenceCalloutContent = {
  title: "Need help with a result?",
  summary:
    "Every diagnostic runs without us. For a result that shows high risk, or that your team cannot interpret, Ethotechnics Studio takes commissioned work to go through it with you.",
  href: "/institute/how-studio-fits",
  linkLabel: "How the Studio fits",
  ariaLabel: "Read how Ethotechnics Studio fits alongside the diagnostics",
};
