import type {
  Case,
  CasebookContent,
  Finding,
  HaltSpan,
  LearningVerdict,
  Source,
  Verdict,
} from "./casebook";

/**
 * The healthcare pillar of the casebook: failures of clinical algorithms,
 * scored on the casebook's six safeguards, on one page with its own admission
 * rule.
 *
 * The main casebook admits a case established by a court, a statutory
 * inquiry, or a regulator. This page admits one more kind of record: a
 * peer-reviewed external validation. That is why these cases live here and
 * not in `src/data/casebook.json`, and why nothing on the main casebook's
 * pages, tallies, or claims counts them.
 *
 * What differs from the main casebook's format:
 * - A source may be a "study". Press is not a source kind here either: a fact
 *   that rested only on press was cut, and where a score rested only on press
 *   the score is withheld and the case says so.
 * - `halt` replaces timeToHalt, haltSpan, timeToHaltDays, and haltedBy, so a
 *   case can say that no halt is on the record.
 * - Every score is this project's draft reading (`scoreStatus: "draft"`).
 * - `gaps` lists what could not be confirmed and was left out.
 *
 * Cases that do not meet this page's rule stay in
 * `docs/drafts/healthcare-casebook.ts`.
 */

export type PillarSource = Omit<Source, "kind"> & {
  kind: Source["kind"] | "study";
};

export type PillarHalt =
  | {
      status: "halted";
      timeToHalt: string;
      haltSpan: HaltSpan;
      timeToHaltDays: number;
      haltedBy: string;
    }
  | {
      status: "not-halted";
      /** The date the record was last checked. */
      asOf: string;
      note: string;
    };

/**
 * `withheld`: the draft reading rested on press, which this page does not
 * cite, so no score is published. The finding says so and cites no clause.
 */
export type PillarFinding = Omit<Finding, "verdict"> & {
  verdict: Verdict | "withheld";
};

export type PillarCase = Omit<
  Case,
  | "timeToHalt"
  | "haltSpan"
  | "timeToHaltDays"
  | "haltedBy"
  | "sources"
  | "findings"
  | "learningOutcome"
> & {
  halt: PillarHalt;
  findings: PillarFinding[];
  learningOutcome: {
    verdict: LearningVerdict | "withheld";
    finding: string;
  };
  sources: PillarSource[];
  /** Whether the case meets this page's admission rule. */
  meetsAdmissionRule: true;
  /** One line: the record the case is admitted on. */
  admissionReason: string;
  scoreStatus: "draft";
  /** Facts that could not be confirmed, and so are not in the case. */
  gaps: string[];
};

export type HealthcareCasebookContent = CasebookContent & {
  /** The admission rule, as the page states it. */
  admissionRule: string;
  /** How that rule differs from the main casebook's. */
  admissionDifference: string;
  /** Whose reading the scores are. */
  scoreStatement: string;
  /** What the record says about a halt, across every case on the page. */
  haltStatement: string;
};

export const healthcareCasebookContent: HealthcareCasebookContent = {
  pageTitle: "Healthcare AI failures, scored — Casebook — Ethotechnics",
  pageDescription:
    "Two healthcare algorithm failures, a sepsis alert and a risk score that chose patients for extra care, each read against six safeguards. Draft scores.",
  permalink: "/casebook/healthcare-ai",
  eyebrow: "Casebook · Healthcare",
  title: "Healthcare AI failures, scored",
  description:
    "Two algorithms that advised on care: a sepsis alert and a risk score that chose patients for extra care. Each is read against the same six safeguards as the rest of the casebook. Each case names who carried the errors and whether anyone stopped the system. The scores are drafts.",
  admissionRule:
    "Every case on this page was established by a court, a statutory inquiry, a regulator, or a peer-reviewed external validation.",
  admissionDifference:
    "The main casebook admits only cases established by a court, an inquiry, or a regulator. This page admits one more kind of record: a peer-reviewed study in which researchers outside the developer tested the system. Both cases here rest on such a study. Neither would be admitted to the main casebook, and neither is counted in its scores. No press coverage is cited; a fact that rested only on press was left out.",
  scoreStatement:
    "Every score on this page is this project's own draft reading of the record. It is not a finding by the study's authors, a court, or a regulator, and it is not a verdict on anyone. Where a draft score rested only on press, it is withheld and the case says so.",
  haltStatement:
    "Neither system has a halt on the record. When the record was last checked, on October 8, 2026, no record was found that either was withdrawn.",
};

export const healthcareCases: PillarCase[] = [
  {
    slug: "epic-sepsis-model",
    title: "The Epic Sepsis Model",
    system:
      "A proprietary model that Epic Systems built into its electronic health record. It scores hospitalized patients for sepsis every 15 minutes and alerts clinicians above a set score.",
    jurisdiction:
      "United States · Epic Systems (vendor); Michigan Medicine (the deployment studied)",
    period: "December 2018 to October 2019, the period the study covers",
    scale:
      "38,455 hospitalizations of 27,697 adults at Michigan Medicine. The model alerted on 6,971 hospitalizations (18%) and missed 1,709 of the 2,552 patients with sepsis (67%). The study reports the model in use at hundreds of US hospitals.",
    halt: {
      status: "not-halted",
      asOf: "2026-10-08",
      note: "No record found that the model was withdrawn.",
    },
    errorsCarriedBy:
      "Patients with sepsis the model did not flag (1,709 of 2,552 in the study) and the clinicians paged by alerts on 6,971 hospitalizations.",
    published: "2026-11-10T00:00:00Z",
    summary:
      "A sepsis alert in use at hundreds of US hospitals. The study says it had not been adequately evaluated. When one hospital checked, the model found a third of sepsis cases and alerted on nearly a fifth of all hospitalizations.",
    metaDescription:
      "Michigan Medicine found Epic's sepsis model missed 67% of sepsis cases and alerted on 18% of hospitalizations (AUC 0.63, 2021). Draft scores.",
    narrative: [
      "The Epic Sepsis Model is a proprietary score built into Epic's electronic health record. It recalculates every 15 minutes, and alerts fire at or above a set score; the study used 6. Michigan Medicine is the University of Michigan's academic health system. Its researchers evaluated the model on 38,455 hospitalizations of 27,697 adults admitted between 6 December 2018 and 20 October 2019. Sepsis occurred in 2,552 of them.",
      "JAMA Internal Medicine published the study on 21 June 2021. It found an area under the curve of 0.63. The authors call that substantially worse than the performance reported by the model's developer. At a score of 6 or higher, the model alerted on 6,971 hospitalizations (18% of the total) and still did not identify 1,709 of the patients with sepsis (67%). It identified 183 patients with sepsis (7%) who had not already received timely antibiotics. The authors wrote that the model's widespread adoption despite poor performance raises fundamental concerns about sepsis management nationally.",
      "No court or regulator has made a finding about the model.",
    ],
    timeline: [
      {
        when: "Dec 2018",
        what: "The study period begins at Michigan Medicine. The model scores each patient every 15 minutes.",
      },
      {
        when: "Oct 2019",
        what: "The study period ends: 38,455 hospitalizations, 2,552 of them with sepsis.",
      },
      {
        when: "Jun 2021",
        what: "JAMA Internal Medicine publishes the external validation. The model missed 67% of sepsis cases and alerted on 18% of hospitalizations.",
        turn: true,
        evidence: true,
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "failed",
        finding:
          "The deployment relied on a model that could find sepsis. At the hospital that checked, it found a third of the cases. Of the 2,552 patients with sepsis, it flagged 183 (7%) whom clinicians had not already treated with timely antibiotics. The capability on the label was not the capability in the ward.",
        clauses: [
          { standard: "STD-06", clause: "§2.1" },
          { standard: "STD-06", clause: "§2.2" },
        ],
        laws: ["I", "X"],
      },
      {
        variable: "authority",
        verdict: "drifted",
        finding:
          "A score above a threshold had the authority to page a clinician. The study says the model's ability to find sepsis had not been adequately evaluated despite its use at hundreds of hospitals. The record found shows no evaluation behind the threshold that decided who was paged.",
        clauses: [{ standard: "STD-08", clause: "§2.6" }],
        laws: ["II", "III"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "The performance reported for the model came from its developer. The external check at one hospital found it substantially worse. Evaluation that only the supplier performs is not detection the operator holds.",
        clauses: [
          { standard: "STD-08", clause: "§4.6" },
          { standard: "STD-06", clause: "§2.2" },
        ],
        laws: ["III", "X"],
      },
      {
        variable: "dependency",
        verdict: "held",
        finding:
          "The record shows no lock-in. Michigan Medicine could evaluate the model on its own records and report the threshold it used. That is the precondition for switching an alert off or changing it. The cost the record shows is alert burden, not dependence.",
        clauses: [{ standard: "STD-06", clause: "§5.1" }],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "The record found shows no way for a patient the model missed to know a score existed, and no route by which the clinicians absorbing alerts on 6,971 hospitalizations could oblige the vendor to answer.",
        clauses: [
          { standard: "STD-02", clause: "§8.1" },
          { standard: "STD-02", clause: "§8.4" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "withheld",
        finding:
          "The draft reading of this safeguard rested on press reports, which this page does not cite. No record found that the model was withdrawn.",
        clauses: [],
        laws: [],
      },
    ],
    learningOutcome: {
      verdict: "withheld",
      finding:
        "The draft reading rested on press reports, which this page does not cite. No record shows hospitals that had already deployed the model re-validating it.",
    },
    theMissingRecord:
      "An evaluation independent of the vendor, at the hospital where the alerts fire, before they go live. STD-08 §4.6 refuses to count detection that the supplier alone performs, and STD-06 §2.2 requires each threshold to be declared before the test runs.",
    remediation: {
      diagnostic: {
        name: "Delegation Audit",
        href: "/diagnostics/delegation-audit",
        purpose:
          "Takes one workflow and asks what evidence each automated action rests on and who produced that evidence.",
      },
      standard: {
        id: "STD-06",
        name: "Human Impact Safety Case",
        href: "/standards/std-06-human-impact-safety-case",
        requirement:
          "Requires each test's threshold to be declared before the test runs, with the action that follows a breach.",
      },
      theory: {
        title: "What does not convert",
        href: "/research/theory/what-does-not-convert",
        question:
          "Why do a system's capability and track record never give it authority on their own?",
      },
    },
    sources: [
      {
        label:
          "Wong A, Otles E, Donnelly JP, et al., External Validation of a Widely Implemented Proprietary Sepsis Prediction Model in Hospitalized Patients, JAMA Internal Medicine 181(8):1065–1070",
        href: "https://doi.org/10.1001/jamainternmed.2021.2626",
        kind: "study",
        date: "2021-06-21",
      },
    ],
    meetsAdmissionRule: true,
    admissionReason:
      "A peer-reviewed external validation, published in JAMA Internal Medicine on 21 June 2021. No court, statutory inquiry, or regulator has made a finding about the model.",
    scoreStatus: "draft",
    gaps: [
      "The developer's reported performance is not stated here, though the study cites figures from Epic's documentation. This page says only what the abstract says: the model performed substantially worse.",
      "No record found of the model being withdrawn.",
      "No FDA action or finding specific to this model was found.",
      "The vendor's response to the study, and what happened to the model after it, were found only in press. They are left out, and the two readings that rested on them, correction and what the institution changed afterward, are not scored.",
    ],
  },
  {
    slug: "optum-impact-pro",
    title: "Optum's cost-as-proxy risk score",
    system:
      "A commercial risk score that health systems and insurers use to pick patients for high-risk care management. It predicts future health care cost and uses that as a stand-in for health need.",
    jurisdiction:
      "United States · Optum (UnitedHealth Group), named by New York regulators as the maker of Impact Pro",
    period: "2013 to 2015, the years the study covers",
    scale:
      "At the same risk score, Black patients were considerably sicker than White patients. Removing the disparity would raise the share of Black patients identified for extra help from 17.7% to 46.5%. By industry estimates, tools of this kind are applied to about 200 million people in the US each year.",
    halt: {
      status: "not-halted",
      asOf: "2026-10-08",
      note: "No record found that the score was withdrawn or that New York's inquiry reached a finding. The authors reported an unpaid collaboration with the manufacturer on a better label; no record found that a revised version was deployed.",
    },
    errorsCarriedBy:
      "Black patients, who at the same level of illness generated $1,801 less in health care costs a year. They scored as healthier and were selected less often for extra care.",
    published: "2026-11-10T00:00:00Z",
    summary:
      "A risk score that did exactly what it was built to do: predict cost. It was used for something else: finding the sickest patients. Unequal access to care made cost a worse measure of need for Black patients. The manufacturer confirmed the finding on 3.7 million patients.",
    metaDescription:
      "A risk score used cost as a proxy for need, so Black patients had to be sicker to be picked for extra care (Science, 2019). Scored on six safeguards. Draft.",
    narrative: [
      "Obermeyer, Powers, Vogeli, and Mullainathan studied primary care patients enrolled in risk-based contracts at one large academic hospital from 2013 to 2015. The hospital used a commercial algorithm to choose patients for care management programs: those above the 97th percentile of its score were automatically identified for enrollment. The algorithm predicted health care cost. Unequal access to care means less is spent on Black patients. At a given level of illness, they generated $1,801 less in costs a year, and so scored lower. At the same risk score, Black patients were considerably sicker. Removing the disparity would raise the share of Black patients identified for extra help from 17.7% to 46.5%. Science published the study on 25 October 2019.",
      "Before publication, the authors took their results to the manufacturer. It replicated the analysis on its national dataset of 3,695,943 commercially insured patients and found Black patients had 48,772 more active chronic conditions than White patients at the same risk score. Changing the label from cost alone to an index of health and cost cut that to 7,758, an 84% reduction in bias. The authors described an ongoing unpaid collaboration to build a better predictor. The paper does not name the manufacturer.",
      "On 25 October 2019, New York's Department of Financial Services and Department of Health wrote to UnitedHealth Group about Optum's Impact Pro. They asked it to investigate, show the algorithm was not racially discriminatory, or stop using it.",
    ],
    timeline: [
      {
        when: "2013–15",
        what: "The patients the study follows are enrolled in risk-based contracts at one academic hospital and scored by the algorithm.",
      },
      {
        when: "Oct 2019",
        what: "Science publishes the study. At the same risk score, Black patients are considerably sicker. The manufacturer has replicated the result on 3,695,943 patients.",
        turn: true,
        evidence: true,
      },
      {
        when: "Oct 2019",
        what: "New York's financial and health regulators ask UnitedHealth Group to show Impact Pro is not discriminatory, or stop using it.",
        evidence: true,
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "held",
        finding:
          "The model predicted cost well. Measured as a cost predictor, it worked. Capability is not where this case failed.",
        clauses: [{ standard: "STD-06", clause: "§1.1" }],
        laws: ["I"],
      },
      {
        variable: "authority",
        verdict: "drifted",
        finding:
          "A score built to predict spending was given the authority to decide who got extra care: above the 97th percentile, enrollment was automatic. The threshold traded one kind of error for another, and nothing on the record named which, or for whom.",
        clauses: [{ standard: "STD-08", clause: "§2.6" }],
        laws: ["II", "III"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "Cost was the evidence; need was the decision. Black patients generated $1,801 less in costs a year at the same level of illness, so the evidence understated their need. By ordinary accuracy measures the proxy looked sound. That is why the gap went unseen.",
        clauses: [
          { standard: "STD-06", clause: "§2.4" },
          { standard: "STD-06", clause: "§2.2" },
        ],
        laws: ["III"],
      },
      {
        variable: "dependency",
        verdict: "drifted",
        finding:
          "The study says large health systems and payers rely on the algorithm, and tools like it reach about 200 million people a year. The fix the authors tested runs through the manufacturer's next round of development.",
        clauses: [
          { standard: "STD-06", clause: "§5.1" },
          { standard: "STD-02", clause: "§9.2" },
        ],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "For patients passed over for care management, the record found shows no notice that a score had been used and no route to question it. The disparity was found by outside researchers with access to the data, not by any challenge from the people it fell on.",
        clauses: [
          { standard: "STD-02", clause: "§8.1" },
          { standard: "STD-06", clause: "§2.4" },
        ],
        laws: ["VII", "XII"],
      },
      {
        variable: "correction",
        verdict: "drifted",
        finding:
          "The manufacturer replicated the result and tested a new label that cut the bias by 84%. A regulator demanded proof or a stop. Neither has a recorded end: no record found shows a deployed fix or an outcome of the inquiry.",
        clauses: [
          { standard: "STD-02", clause: "§4.4" },
          { standard: "STD-06", clause: "§2.2" },
        ],
        laws: ["IV"],
      },
    ],
    learningOutcome: {
      verdict: "partial",
      finding:
        "The manufacturer accepted the finding and began work on the label that produced the bias. That work reaches the rule and not just the cases. The record stops there. No record shows whether the revised score is in use or what happened to patients scored by the old one.",
    },
    theMissingRecord:
      "Error rates by population, computed on a declared cadence from records the operator already holds (STD-06 §2.4). The disparity was in the data the score ran on. It took outside researchers to compute it.",
    remediation: {
      diagnostic: {
        name: "Delegation Audit",
        href: "/diagnostics/delegation-audit",
        purpose:
          "Takes one workflow and asks what evidence each decision rests on and who bears the errors when that evidence is wrong.",
      },
      standard: {
        id: "STD-06",
        name: "Human Impact Safety Case",
        href: "/standards/std-06-human-impact-safety-case",
        requirement:
          "Requires error rates measured per affected population from the operator's own records, with a materially worse rate for any group treated as a breach.",
      },
      theory: {
        title: "What outcomes hide",
        href: "/research/theory/what-outcomes-hide",
        question:
          "Why does judging an institution by its outcomes hide who carried the burden of producing them?",
      },
    },
    sources: [
      {
        label:
          "Obermeyer Z, Powers B, Vogeli C, Mullainathan S, Dissecting racial bias in an algorithm used to manage the health of populations, Science 366(6464):447–453",
        href: "https://doi.org/10.1126/science.aax2342",
        kind: "study",
        date: "2019-10-25",
      },
      {
        label:
          "New York State Department of Financial Services and Department of Health, joint letter to UnitedHealth Group on Impact Pro",
        href: "https://www.dfs.ny.gov/reports_and_publications/comment_letters/dfs-doh-joint-letter-uhgi-20191025",
        kind: "regulator",
        date: "2019-10-25",
      },
    ],
    meetsAdmissionRule: true,
    admissionReason:
      "A peer-reviewed study, published in Science on 25 October 2019, in which researchers outside the manufacturer tested the score on one hospital's patients. New York's regulators demanded proof or a stop but made no finding on the record.",
    scoreStatus: "draft",
    gaps: [
      "The outcome of New York's inquiry was not found.",
      "No record found that a revised version of the score was deployed.",
      "The paper does not name the manufacturer; the attribution to Optum's Impact Pro rests on New York's letter.",
      "The manufacturer's public response to the study was found only in press, and is left out.",
    ],
  },
];
