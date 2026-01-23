export type ReferenceCalloutContent = {
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
  ariaLabel?: string;
};

export const instituteStudioCallout: ReferenceCalloutContent = {
  title: "Institute vs. Studio",
  summary:
    "The Institute stays open and self-serve. Studio support is optional when you need a delivery partner or facilitation.",
  href: "/institute/how-studio-fits",
  linkLabel: "Read more",
  ariaLabel: "Read more about how the Institute and Studio work together",
};

export const diagnosticsStudioOffRampCallout: ReferenceCalloutContent = {
  title: "Need to escalate?",
  summary:
    "Result pages include the off-ramp to ethotechnics.com/studio so teams can escalate when scores are risky or unclear.",
  href: "/institute/how-studio-fits",
  linkLabel: "Read more",
  ariaLabel: "Read more about Studio escalation paths",
};
