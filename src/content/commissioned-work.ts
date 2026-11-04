/**
 * Commissioned work on this framework, in one place.
 *
 * The Institute once described its commercial counterpart, Ethotechnics
 * Studio, at least six ways: clinical AI safety evaluation and VC diligence on
 * some pages; facilitation, mediation, and embedded delivery on others;
 * "independent audit verification", "custom governance tooling", and
 * "independent GRC auditing" on a few. Pages also sent people to two
 * different inboxes. This file holds one description and one address, and
 * every page that offers the work reads from it.
 *
 * The Studio and its site, ethotechnics.com, were retired in October 2026.
 * Kanav Jain, who wrote this framework, takes the same work under his own
 * name. The author of the standards is the person paid to apply them, so
 * every page that offers the work says he wrote the framework.
 *
 * This file is the source of truth for the four formats and their outputs,
 * which are the ones ethotechnics.com listed on 2026-10-01. Since 2026-11-04 the
 * Engagements section on kanav.net/contact names the engagement, its focus, and
 * its clients, and links to /institute/commissioned-work#offers for the rest. If
 * the name, focus, or clients change on either site, change the other, and keep
 * that anchor. Prices are not published anywhere, so no page here states one.
 */
export type CommissionedOffer = {
  name: string;
  /** How long it takes. */
  format: string;
  /** What the client leaves with. */
  output: string;
};

const href = "https://kanav.net/contact/#engagements-title";

export const commissionedWork = {
  provider: "Kanav Jain",
  /**
   * The conflict of interest, as a clause that follows the provider's name
   * at its first mention on a page that offers the work.
   */
  disclosure: "who wrote this framework",
  /** The engagement's name on kanav.net. */
  name: "Clinical AI safety review",
  href,
  /** Link text for `href` that says where it goes. */
  linkLabel: `Engagements on ${new URL(href).hostname}`,
  email: "kanav@kanav.net",
  /** The subject kanav.net puts on its own advisory mail links. */
  subject: "Advisory or fractional engagement",
  focus:
    "Whether a healthcare AI system can be stopped, overridden, and reversed",
  clients: "health plans, healthcare AI companies, and investors",
  offers: [
    {
      name: "Safeguards review",
      format: "1 hour",
      output: "A written list of gaps, ranked by the harm they could do.",
    },
    {
      name: "Readiness sprint",
      format: "2 weeks",
      output:
        "One workflow mapped end to end: who can halt it, how fast, and who owns each fix.",
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
  ] satisfies CommissionedOffer[],
};

export const commissionedWorkMailto = (subject = commissionedWork.subject) =>
  `mailto:${commissionedWork.email}?subject=${encodeURIComponent(subject)}`;

/** The four formats in one clause. */
export const commissionedWorkFormats =
  "a one-hour safeguards review, a two-week readiness sprint on one workflow, an investor diligence memo in five business days, or a two-to-three-week evaluation against FDA and EU AI Act expectations";

/** The offer in one sentence, with the disclosure, for cards and callouts. */
export const commissionedWorkSummary = `${commissionedWork.provider}, ${commissionedWork.disclosure}, does commissioned safety evaluation for healthcare AI: ${commissionedWorkFormats}.`;
