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
  title: "Need to escalate?",
  summary:
    "Each result page links to the Studio at ethotechnics.com, for results that show high risk or that your team cannot interpret.",
  href: "/institute/how-studio-fits",
  linkLabel: "Read more",
  ariaLabel: "Read more about Studio escalation paths",
};
