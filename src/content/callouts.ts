import { commissionedWork } from "./commissioned-work";

export type ReferenceCalloutContent = {
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
  ariaLabel?: string;
};

export const diagnosticsOffRampCallout: ReferenceCalloutContent = {
  title: "Need help with a result?",
  summary: `Every diagnostic runs without us. For a result that shows high risk, or that your team cannot interpret, ${commissionedWork.provider}, ${commissionedWork.disclosure}, takes commissioned work to go through it with you.`,
  href: "/institute/commissioned-work",
  linkLabel: "How commissioned work fits",
  ariaLabel: "Read how commissioned work fits alongside the diagnostics",
};
