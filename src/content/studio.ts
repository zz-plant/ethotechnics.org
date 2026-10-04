/**
 * What Ethotechnics Studio offers, in one place.
 *
 * The Institute described the Studio at least six ways: clinical AI safety
 * evaluation and VC diligence on some pages; facilitation, mediation, and
 * embedded delivery on others; "independent audit verification", "custom
 * governance tooling", and "independent GRC auditing" on a few. Several of
 * those are not services the Studio lists. Institute pages also sent people
 * to studio@ethotechnics.org while the Studio's own site gives
 * hello@ethotechnics.com.
 *
 * This is the Studio's offer as ethotechnics.com stated it on `checked`.
 * When the Studio's site changes, change this file, and every Institute page
 * that describes the Studio changes with it. Prices stay on the Studio's
 * site.
 */
export type StudioOffer = {
  name: string;
  /** Duration as the Studio states it. */
  format: string;
  /** What the client leaves with. */
  output: string;
};

export const studio = {
  name: "Ethotechnics Studio",
  href: "https://ethotechnics.com",
  email: "hello@ethotechnics.com",
  checked: "2026-10-01",
  focus: "Independent safety evaluation for healthcare AI",
  /** Who the Studio names as its clients. */
  clients:
    "health plans, healthcare AI companies, and investors in healthcare AI",
  offers: [
    {
      name: "Safeguards review",
      format: "60 minutes",
      output: "A written list of gaps, ranked by the harm they could do.",
    },
    {
      name: "Readiness sprint",
      format: "2 weeks",
      output:
        "One workflow mapped end to end: who can stop it, how fast, and who owns each fix.",
    },
    {
      name: "Investor diligence",
      format: "5 business days",
      output:
        "The clinical safety, evidence, and regulatory exposure of a healthcare AI deal, in a memo you can cite.",
    },
    {
      name: "Clinical AI safety evaluation",
      format: "2 to 3 weeks",
      output:
        "A written evaluation against FDA and EU AI Act expectations, with a summary for your board.",
    },
  ] satisfies StudioOffer[],
};

export const studioMailto = (subject?: string) =>
  subject
    ? `mailto:${studio.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${studio.email}`;

/** The offer in one sentence, for cards and callouts. */
export const studioSummary = `${studio.name} does commissioned safety evaluation for healthcare AI: a safeguards review, a readiness sprint on one workflow, investor diligence on a healthcare AI deal, or a clinical AI safety evaluation against FDA and EU AI Act expectations.`;
