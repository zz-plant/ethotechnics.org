/**
 * What an institution says about its own system, beside the record that
 * would back the claim. The home page and the About page both show it, from
 * this one source.
 *
 * The test does not say who should hold power over a system. It holds an
 * institution to the words it uses about itself: the glossary's own
 * definitions make legitimacy and democratic governability turn on who has
 * standing and remedy, so a claim to either is a claim about that
 * distribution, and the distribution is something a record can show.
 *
 * `claim` reads after "If you call the system". `show` reads as the
 * instruction that follows. `basis` names where the standards and the theory
 * already ask for that record.
 */
export type InstitutionalClaim = {
  claim: string;
  show: string;
  basis: { label: string; href: string }[];
};

export const institutionalClaims: InstitutionalClaim[] = [
  {
    claim: "democratic or legitimate",
    show: "Show who is exposed to its decisions, who can challenge them, whose challenge must be answered by a date, and who can force a reconsideration or a halt.",
    basis: [
      { label: "Law VII", href: "/standards/laws#law-vii" },
      {
        label: "STD-02 §8.4",
        href: "/standards/std-02-contestability-recourse",
      },
      {
        label: "STD-07 §4.2",
        href: "/standards/std-07-revisable-delegation-record",
      },
    ],
  },
  {
    claim: "efficient",
    show: "Show that the figure counts the work the system pushes onto people with less power: the nurse fixing a scheduler's mistakes, the claimant proving a denial wrong.",
    basis: [
      { label: "STD-01 §7.1", href: "/standards/std-01-temporal-rights" },
      { label: "Burden concealment evals", href: "/evals/burden-concealment" },
    ],
  },
  {
    claim: "accurate",
    show: "Show accurate for whom: who bears its false positives, its delays, and its denials.",
    basis: [
      {
        label: "Burden distribution evals",
        href: "/evals/burden-distribution",
      },
    ],
  },
  {
    claim: "responsive",
    show: "Show the challenges it upheld that changed a rule, not only a case.",
    basis: [
      {
        label: "Exception learning",
        href: "/research/theory/exception-learning",
      },
      {
        label: "Corrective learning evals",
        href: "/evals/corrective-learning",
      },
    ],
  },
  {
    claim: "authorized",
    show: "Show the authority grant: who signed it, on what evidence, and when it ends.",
    basis: [{ label: "STD-08", href: "/standards/std-08-delegation" }],
  },
  {
    claim: "chosen, not imposed",
    show: "Show what it costs the person who depends on it to leave.",
    basis: [
      { label: "Law V", href: "/standards/laws#law-v" },
      {
        label: "Dependence runs both ways",
        href: "/research/theory/dependence-runs-both-ways",
      },
    ],
  },
];
