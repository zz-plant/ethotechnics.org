/**
 * DRAFT, not published. A healthcare pillar for the casebook: four public
 * failures of clinical and coverage algorithms, in the casebook's own format
 * and scored on its six safeguards. Nothing under docs/ is built, routed, or
 * listed in the sitemap, and tests/drafts.test.ts fails if any of it leaks.
 *
 * ---------------------------------------------------------------------------
 * OWNER DECISION, required before any of this is published
 * ---------------------------------------------------------------------------
 * The casebook admits only cases "established by a court, a statutory
 * inquiry, or a regulator" (src/content/casebook.ts), and its sources section
 * says "No press coverage." None of these four cases meets that rule as it
 * stands. Two rest on peer-reviewed studies, one on a Senate staff report and
 * a pending lawsuit, and one on press reporting plus an audit that covers
 * costs only. Each case records `meetsAdmissionRule` and the reason.
 *
 * Choose one:
 *   A. The pillar states its own admission rule, e.g. "established by a
 *      court, a statutory inquiry, a regulator, or a peer-reviewed external
 *      validation", and says so on the page. The main casebook keeps its rule
 *      and its claim on the hub.
 *   B. The published casebook adds a peer-reviewed source kind ("study") to
 *      `Source["kind"]` and amends its admission sentence and the sources
 *      section on every case page.
 *
 * Either way, press stays out of a published case's sources. Under the
 * current rule, Watson for Oncology's quality evidence (press) cannot be
 * cited, and nH Predict's denial-rate facts come from a majority staff
 * report, not a committee finding.
 *
 * ---------------------------------------------------------------------------
 * What differs from the published format, in this draft only
 * ---------------------------------------------------------------------------
 * - Sources may be "study" or "press". Neither is admissible today.
 * - A source may carry a month-only date ("2016-11") where the document
 *   gives no day. The published casebook requires a full date.
 * - `halt` replaces timeToHalt, haltSpan, timeToHaltDays, and haltedBy,
 *   because none of these four systems has a halt on the record. The
 *   published format has no way to say "not halted".
 * - Every score is this project's draft reading (`scoreStatus: "draft"`).
 * - `gaps` lists what could not be confirmed and was left out.
 *
 * Facts were checked against the sources listed on each case on 2026-10-08.
 */

import type {
  Case,
  CasebookContent,
  HaltSpan,
  Source,
} from "../../src/content/casebook";

export type DraftSource = Omit<Source, "kind"> & {
  kind: Source["kind"] | "study" | "press";
};

export type DraftHalt =
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

export type DraftCase = Omit<
  Case,
  "timeToHalt" | "haltSpan" | "timeToHaltDays" | "haltedBy" | "sources"
> & {
  halt: DraftHalt;
  sources: DraftSource[];
  /** Whether the case meets the casebook's admission rule as it stands. */
  meetsAdmissionRule: boolean;
  /** One line: why, or why not. */
  admissionReason: string;
  scoreStatus: "draft";
  /** Facts that could not be confirmed, and so are not in the case. */
  gaps: string[];
};

export const draftHealthcareCasebook: CasebookContent = {
  pageTitle: "Healthcare AI failures, scored — Casebook — Ethotechnics",
  pageDescription:
    "Four healthcare algorithm failures, from Medicare Advantage denials to a sepsis alert, each scored on six safeguards. Draft scores.",
  permalink: "/casebook/healthcare-ai",
  eyebrow: "Casebook · Healthcare",
  title: "Healthcare AI failures, scored",
  description:
    "Four algorithms that decided or advised on care: a coverage model for post-acute stays, a sepsis alert, a risk score that chose patients for extra care, and an oncology adviser. Each is scored on the same six safeguards as the rest of the casebook. Each case names who carried the errors and whether anyone stopped the system. The scores are drafts. The case pages say which parts of the record are findings and which are allegations, studies, or press.",
};

export const draftHealthcareCases: DraftCase[] = [
  {
    slug: "unitedhealth-nh-predict",
    title: "UnitedHealthcare and nH Predict",
    system:
      "naviHealth's nH Predict, used in UnitedHealthcare's Medicare Advantage coverage of skilled nursing and rehabilitation. The complaint says it estimates the post-acute care a patient needs by comparing them with similar patients.",
    jurisdiction:
      "United States · UnitedHealthcare and naviHealth (UnitedHealth Group)",
    period:
      "July 2019 to the present (start date by UnitedHealthcare's account)",
    scale:
      "UnitedHealthcare denied 8.7% of prior-authorization requests for post-acute care in 2019 and 22.7% in 2022, while its overall denial rate went from 7.3% to 7.6%. For skilled nursing admissions, its denial rate went from 1.4% in 2019 to 12.6% in 2022.",
    halt: {
      status: "not-halted",
      asOf: "2026-10-08",
      note: "No record found that UnitedHealthcare stopped using nH Predict. The class action is in discovery, with class certification briefing due in February 2027.",
    },
    errorsCarriedBy:
      "Medicare Advantage enrollees who were denied post-acute care and had to appeal, pay, or go without. The complaint alleges that about 0.2% of policyholders appeal.",
    published: "2026-10-08T00:00:00Z",
    summary:
      "A coverage algorithm for rehabilitation and nursing-home stays, in use while the insurer's denial rate for that care rose from 8.7% to 22.7%. The Senate staff report established the denial rates and the automation behind them. Whether the algorithm made the denials is the question a federal court has not yet answered.",
    metaDescription:
      "UnitedHealthcare's post-acute denial rate rose from 8.7% to 22.7% between 2019 and 2022 as it automated review. Scored on six safeguards. Draft.",
    narrative: [
      "UnitedHealth Group's Optum acquired naviHealth in May 2020. In March 2021, an internal UnitedHealthcare agenda said the division responsible for Medicare Advantage would move post-acute care services to naviHealth. A January 2022 presentation showed a naviHealth care coordinator completing nH Predict to determine post-acute placement while the patient was still in hospital. UnitedHealthcare says it began using nH Predict on 1 July 2019.",
      "The Senate Permanent Subcommittee on Investigations' majority staff reviewed more than 280,000 pages of documents and published its report on 17 October 2024. It found that UnitedHealthcare's denial rate for post-acute prior authorization rose from 8.7% in 2019 to 22.7% in 2022, an increase of 172%. Its overall rate barely moved. An internal committee approved machine-assisted review in April 2021 after being told it cut review time by six to ten minutes per request. A tested auto-authorization model raised the denial rate, and the committee voted to approve it tentatively. In December 2022 a working group explored using machine learning to predict which denials would be appealed and which appeals would be overturned. The report attributes to media reports the claims that staff were held to the algorithm's predictions.",
      "A class action filed in November 2023 alleges that nH Predict has a 90% error rate and that about 0.2% of policyholders appeal. It bases the error rate on the share of denials reversed on appeal. In February 2024, the Centers for Medicare & Medicaid Services told Medicare Advantage plans that a predicted length of stay alone cannot be the basis to end post-acute care. On 13 February 2025, the federal court in Minnesota dismissed most claims as preempted and let the contract and good-faith claims proceed. On 9 March 2026, it ordered UnitedHealthcare to produce documents analyzing nH Predict, its design, the naviHealth acquisition, and naviHealth employees' performance evaluations and compensation. Neither ruling is a finding on the merits.",
    ],
    timeline: [
      {
        when: "Jul 2019",
        what: "UnitedHealthcare begins using nH Predict, by its own account in the litigation.",
      },
      {
        when: "May 2020",
        what: "Optum acquires naviHealth. In March 2021 an internal UnitedHealthcare agenda says Medicare Advantage post-acute care services will move to it.",
      },
      {
        when: "Nov 2023",
        what: "A class action alleges nH Predict has a 90% error rate, measured by denials reversed on appeal.",
        evidence: true,
      },
      {
        when: "Feb 2024",
        what: "CMS tells Medicare Advantage plans that a predicted length of stay alone cannot be the basis to end post-acute care.",
        evidence: true,
      },
      {
        when: "Oct 2024",
        what: "The Senate staff report finds UnitedHealthcare's post-acute denial rate rose from 8.7% in 2019 to 22.7% in 2022 while it automated review.",
        turn: true,
        evidence: true,
      },
      {
        when: "Feb 2025",
        what: "The court dismisses most claims as preempted and lets the contract claims proceed.",
      },
      {
        when: "Mar 2026",
        what: "The court orders UnitedHealthcare to produce its documents on nH Predict and naviHealth employees' performance evaluations.",
        evidence: true,
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "drifted",
        finding:
          "An estimate of how long a patient like this one usually needs care is a capability. A stopping date for one patient's care is a different one. CMS said in February 2024 that the first cannot stand in for the second. The record does not show anyone re-examining what the estimate could support once it sat inside coverage decisions.",
        clauses: [
          { standard: "STD-08", clause: "§2.6" },
          { standard: "STD-06", clause: "§1.1" },
        ],
        laws: ["I"],
      },
      {
        variable: "authority",
        verdict: "drifted",
        finding:
          "UnitedHealthcare's coverage documents say clinical staff and physicians make claim decisions, and the company says final denials come from people. Its committee approved machine-assisted review after being told it cut six to ten minutes from each review. The authority stayed with the reviewer on paper while the time to use it shrank.",
        clauses: [
          { standard: "STD-08", clause: "§3.1" },
          { standard: "STD-08", clause: "§1.3" },
        ],
        laws: ["I", "IX"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "A committee was told that a tested auto-authorization model raised the denial rate, and voted to approve it tentatively. Over the same years the post-acute denial rate rose 172% while the overall rate barely moved. Evidence that the change was producing more denials was in the institution's hands, and it did not reopen the change.",
        clauses: [
          { standard: "STD-06", clause: "§2.2" },
          { standard: "STD-08", clause: "§2.7" },
        ],
        laws: ["III"],
      },
      {
        variable: "dependency",
        verdict: "drifted",
        finding:
          "naviHealth had been a subsidiary since May 2020, and by 2022 it was managing skilled nursing admissions for UnitedHealthcare. The record says little more than that. It does not show what withdrawing the tool or the vendor would cost, and the draft scores this variable on that thin basis.",
        clauses: [
          { standard: "STD-06", clause: "§5.1" },
          { standard: "STD-06", clause: "§5.4" },
        ],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "drifted",
        finding:
          "Enrollees can appeal through Medicare's four-level process, and the complaint alleges most appealed denials are reversed. The Senate staff report found the insurer exploring how to predict which denials would be appealed and which appeals it would lose. Appeals were a quantity to forecast, not evidence about the decisions they overturned.",
        clauses: [
          { standard: "STD-02", clause: "§5.2" },
          { standard: "STD-02", clause: "§8.6" },
          { standard: "STD-02", clause: "§4.4" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "failed",
        finding:
          "Nothing on the record has stopped or changed the tool. CMS issued general guidance in February 2024, the Senate staff report recommended rules on algorithms' influence over reviewers, and the lawsuit is in discovery. None of these is a correction the operator made or a regulator ordered.",
        clauses: [
          { standard: "STD-06", clause: "§1.3" },
          { standard: "STD-02", clause: "§4.4" },
        ],
        laws: ["IV"],
      },
    ],
    learningOutcome: {
      verdict: "absorbed",
      finding:
        "On the record found, each reversed denial ended as one person's outcome. No record shows the reversals reaching the tool, the review process, or the targets set for reviewers. What change there is came from outside the operator: CMS guidance, a Senate staff report, and a lawsuit.",
    },
    theMissingRecord:
      "An intervention specification for the reviewers who signed off on post-acute denials: the information they were shown, the changes they could make, and their approval rate and time per case, measured each period (STD-08 §3.1 and §3.4). The Senate staff report found review time cut by six to ten minutes per request. No record shows anyone measuring whether review still changed outcomes.",
    remediation: {
      diagnostic: {
        name: "Delegation Audit",
        href: "/diagnostics/delegation-audit",
        purpose:
          "Takes one workflow and asks who authorized each action, on what evidence, and whether the person reviewing it can change the outcome.",
      },
      standard: {
        id: "STD-08",
        name: "Delegation",
        href: "/standards/std-08-delegation",
        requirement:
          "Requires every claim that a human reviews to name what that person can change, and measures approval rate and time per approval against thresholds published in advance.",
      },
      theory: {
        title: "Exception learning",
        href: "/research/theory/exception-learning",
        question:
          "Why does resolving appeals one at a time leave the rule that caused them in place?",
      },
    },
    sources: [
      {
        label:
          "Estate of Gene B. Lokken et al. v. UnitedHealth Group, Inc. et al., No. 23-cv-3514 (D. Minn.), memorandum opinion and order on motion to dismiss",
        href: "https://litigationtracker.law.georgetown.edu/wp-content/uploads/2023/11/Lokken_2025.02.13_MEMORANDUM-OPINION-AND-ORDER.pdf",
        kind: "court",
        date: "2025-02-13",
      },
      {
        label:
          "Estate of Gene B. Lokken et al. v. UnitedHealth Group, Inc. et al., order on motion to compel discovery",
        href: "https://litigationtracker.law.georgetown.edu/wp-content/uploads/2023/11/Estate-of-Gene-B.-Lokken-et-al-v.-UnitedHealth-Group-Inc.-et-al_2026_3_9_ORDER-ON-MOTION-TO-COMPEL-DISCOVERY.pdf",
        kind: "court",
        date: "2026-03-09",
      },
      {
        label:
          "Estate of Gene B. Lokken et al. v. UnitedHealth Group, Inc. et al., scheduling order",
        href: "https://litigationtracker.law.georgetown.edu/wp-content/uploads/2023/11/Estate-of-Gene-B.-Lokken-The-et-al-v.-UnitedHealth-Group-Inc.-et-al_2026.09.18_SCHEDULING-ORDER.pdf",
        kind: "court",
        date: "2026-09-18",
      },
      {
        label:
          "Estate of Gene B. Lokken et al. v. UnitedHealth Group, Inc. et al., class action complaint (allegations, not findings)",
        href: "https://litigationtracker.law.georgetown.edu/wp-content/uploads/2023/11/Estate-of-Gene-B.-Lokken-et-al_20231114_COMPLAINT.pdf",
        kind: "court",
        date: "2023-11-14",
      },
      {
        label:
          "US Senate Permanent Subcommittee on Investigations, majority staff report, Refusal of Recovery: How Medicare Advantage Insurers Have Denied Patients Access to Post-Acute Care",
        href: "https://www.hsgac.senate.gov/wp-content/uploads/2024.10.17-PSI-Majority-Staff-Report-on-Medicare-Advantage.pdf",
        kind: "parliament",
        date: "2024-10-17",
      },
      {
        label:
          "Centers for Medicare & Medicaid Services, frequently asked questions on coverage criteria and utilization management in final rule CMS-4201-F (memo to Medicare Advantage organizations; copy hosted by the American Hospital Association)",
        href: "https://www.aha.org/system/files/media/file/2024/02/faqs-related-to-coverage-criteria-and-utilization-management-requirements-in-cms-final-rule-cms-4201-f.pdf",
        kind: "regulator",
        date: "2024-02-06",
      },
      {
        label:
          "Casey Ross and Bob Herman, UnitedHealth pushed employees to follow an algorithm to cut off Medicare patients' rehab care, STAT",
        href: "https://www.statnews.com/2023/11/14/unitedhealth-algorithm-medicare-advantage-investigation/",
        kind: "press",
        date: "2023-11-14",
      },
    ],
    meetsAdmissionRule: false,
    admissionReason:
      "The Senate staff report establishes the denial rates and the automation but does not establish that nH Predict made the denials. The court rulings so far make no findings.",
    scoreStatus: "draft",
    gaps: [
      "STAT's reporting that naviHealth set a target to keep stays within 1% of the algorithm's projection is press, and the complaint repeats it as an allegation. It is left out of the findings.",
      "HHS Office of Inspector General data briefs on post-acute denials from June 2026 were not reviewed (OEI-09-24-00330 and OEI-09-24-00331). They may strengthen the record on denial rates; whether they address nH Predict was not confirmed.",
      "How many people UnitedHealthcare denied post-acute care under nH Predict is not in any record found.",
    ],
  },
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
      note: "No record found that the model was withdrawn. STAT reported in October 2022 that Epic now recommends training it on a hospital's own data before clinical use. That is press, and it is a revision, not a halt.",
    },
    errorsCarriedBy:
      "Patients with sepsis the model did not flag (1,709 of 2,552 in the study) and the clinicians paged by alerts on 6,971 hospitalizations.",
    published: "2026-10-08T00:00:00Z",
    summary:
      "A sepsis alert in use at hundreds of US hospitals. The study says it had not been adequately evaluated. When one hospital checked, the model found a third of sepsis cases and alerted on nearly a fifth of all hospitalizations.",
    metaDescription:
      "Michigan Medicine found Epic's sepsis model missed 67% of sepsis cases and alerted on 18% of hospitalizations (AUC 0.63, 2021). Scored on six safeguards. Draft.",
    narrative: [
      "The Epic Sepsis Model is a proprietary score built into Epic's electronic health record. It recalculates every 15 minutes, and alerts fire at or above a set score; the study used 6. Michigan Medicine is the University of Michigan's academic health system. Its researchers evaluated the model on 38,455 hospitalizations of 27,697 adults admitted between 6 December 2018 and 20 October 2019. Sepsis occurred in 2,552 of them.",
      "JAMA Internal Medicine published the study on 21 June 2021. It found an area under the curve of 0.63. The authors call that substantially worse than the performance reported by the model's developer. At a score of 6 or higher, the model alerted on 6,971 hospitalizations (18% of the total) and still did not identify 1,709 of the patients with sepsis (67%). It identified 183 patients with sepsis (7%) who had not already received timely antibiotics. The authors wrote that the model's widespread adoption despite poor performance raises fundamental concerns about sepsis management nationally.",
      "Epic said the study did not account for the analysis and tuning a hospital does before using the model. In October 2022, STAT reported from corporate documents that Epic now recommends hospitals train the model on their own patients before clinical use. STAT also reported that Epic was changing its definition of sepsis onset. No court or regulator has made a finding about the model.",
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
      {
        when: "Jun 2021",
        what: "Epic says the study did not account for the tuning a hospital does before deployment.",
      },
      {
        when: "Oct 2022",
        what: "STAT reports that Epic now recommends training the model on a hospital's own data before clinical use.",
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
          "A patient the model missed had no way to know a score existed. The clinicians absorbing 6,971 alerts had no route that obliged the vendor to answer. When the hospital's own researchers published, the vendor disputed the study; nothing required a response or a change.",
        clauses: [
          { standard: "STD-02", clause: "§8.1" },
          { standard: "STD-02", clause: "§8.4" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "drifted",
        finding:
          "By STAT's account, a correction came more than a year after the study: Epic recommended local training before use and changed its sepsis definition. It came from the vendor, after outside evidence, with no threshold set in advance that would have forced it.",
        clauses: [
          { standard: "STD-08", clause: "§2.7" },
          { standard: "STD-06", clause: "§2.2" },
        ],
        laws: ["IV"],
      },
    ],
    learningOutcome: {
      verdict: "partial",
      finding:
        "The vendor changed what it tells hospitals to do before use. That is a change to the process and not only to one deployment. The record of that change is press. No record shows hospitals that had already deployed the model re-validating it.",
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
      {
        label:
          "Elise Reuter, Popular sepsis prediction model works 'substantially worse' than claimed, researchers find, MedCity News (Epic's response)",
        href: "https://medcitynews.com/2021/06/popular-sepsis-prediction-model-works-substantially-worse-than-claimed-researchers-find/",
        kind: "press",
        date: "2021-06-23",
      },
      {
        label:
          "Casey Ross, Epic overhauls popular sepsis algorithm criticized for faulty alarms, STAT",
        href: "https://www.statnews.com/2022/10/03/epic-sepsis-algorithm-revamp-training/",
        kind: "press",
        date: "2022-10-03",
      },
    ],
    meetsAdmissionRule: false,
    admissionReason:
      "The record is a peer-reviewed external validation; no court, statutory inquiry, or regulator has made a finding about the model.",
    scoreStatus: "draft",
    gaps: [
      "The developer's reported performance is not stated here, though the study cites figures from Epic's documentation. The draft says only what the abstract says: the model performed substantially worse.",
      "No record found of the model being withdrawn, or of when Epic's revised version shipped.",
      "No FDA action or finding specific to this model was found.",
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
    published: "2026-10-08T00:00:00Z",
    summary:
      "A risk score that did exactly what it was built to do: predict cost. It was used for something else: finding the sickest patients. Unequal access to care made cost a worse measure of need for Black patients. The manufacturer confirmed the finding on 3.7 million patients.",
    metaDescription:
      "A risk score used cost as a proxy for need, so Black patients had to be sicker to be picked for extra care (Science, 2019). Scored on six safeguards. Draft.",
    narrative: [
      "Obermeyer, Powers, Vogeli, and Mullainathan studied primary care patients enrolled in risk-based contracts at one large academic hospital from 2013 to 2015. The hospital used a commercial algorithm to choose patients for care management programs: those above the 97th percentile of its score were automatically identified for enrollment. The algorithm predicted health care cost. Unequal access to care means less is spent on Black patients. At a given level of illness, they generated $1,801 less in costs a year, and so scored lower. At the same risk score, Black patients were considerably sicker. Removing the disparity would raise the share of Black patients identified for extra help from 17.7% to 46.5%. Science published the study on 25 October 2019.",
      "Before publication, the authors took their results to the manufacturer. It replicated the analysis on its national dataset of 3,695,943 commercially insured patients and found Black patients had 48,772 more active chronic conditions than White patients at the same risk score. Changing the label from cost alone to an index of health and cost cut that to 7,758, an 84% reduction in bias. The authors described an ongoing unpaid collaboration to build a better predictor. The paper does not name the manufacturer.",
      "On 25 October 2019, New York's Department of Financial Services and Department of Health wrote to UnitedHealth Group about Optum's Impact Pro. They asked it to investigate, show the algorithm was not racially discriminatory, or stop using it. Optum said the study confirmed that the cost model within Impact Pro was highly predictive of cost, as it was designed to be.",
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
      {
        when: "Nov 2019",
        what: "As NBC News reports, Optum says the study confirmed its cost model was highly predictive of cost, as it was designed to be.",
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "held",
        finding:
          "The model predicted cost well, and the manufacturer's own replication confirmed it. Measured as a cost predictor, it worked. Capability is not where this case failed.",
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
      {
        label:
          "Quinn Gawronski, Racial bias found in widely used health care algorithm, NBC News (Optum's statement)",
        href: "https://www.nbcnews.com/news/nbcblk/racial-bias-found-widely-used-health-care-algorithm-n1076436",
        kind: "press",
        date: "2019-11-06",
      },
    ],
    meetsAdmissionRule: false,
    admissionReason:
      "The finding is a peer-reviewed study; New York's regulators demanded proof or a stop but made no finding on the record.",
    scoreStatus: "draft",
    gaps: [
      "The outcome of New York's inquiry was not found.",
      "No record found that a revised version of the score was deployed.",
      "The paper does not name the manufacturer; the attribution to Optum's Impact Pro rests on New York's letter and Optum's own statement.",
    ],
  },
  {
    slug: "ibm-watson-oncology",
    title: "IBM Watson in cancer care",
    system:
      "IBM's Watson for Oncology recommended cancer treatments. MD Anderson Cancer Center's Oncology Expert Advisor was a separate project built on IBM Watson technology to offer care advice and match patients with clinical trials.",
    jurisdiction:
      "United States · IBM; The University of Texas MD Anderson Cancer Center",
    period:
      "MD Anderson's project through September 2016; Watson for Oncology flagged internally in 2017",
    scale:
      "Through August 2016, MD Anderson paid external firms about $62.1 million for a system that was not in clinical use. Of that, $39.2 million went to IBM. The record found does not say how many patients Watson for Oncology's recommendations reached.",
    halt: {
      status: "not-halted",
      asOf: "2026-10-08",
      note: "MD Anderson's system never reached clinical use, and IBM ended support for its pilot effective 1 September 2016. No verified date was found for withdrawing Watson for Oncology; IBM's January 2022 sale of its healthcare data and analytics assets does not name it.",
    },
    errorsCarriedBy:
      "No patient harm is established in the record found. The cost the audit records is MD Anderson's $62.1 million, more than half of it from restricted gifts.",
    published: "2026-10-08T00:00:00Z",
    summary:
      "Two Watson projects in cancer care. One cost a cancer center $62.1 million and was never put into clinical use. By the account of IBM's own internal slides, the other recommended unsafe treatments while it was being sold to hospitals. Only the first has an audit behind it.",
    metaDescription:
      "MD Anderson paid $62.1M for a Watson-based cancer adviser never used on patients; IBM's own slides flagged unsafe advice. Scored on six safeguards. Draft.",
    narrative: [
      "The University of Texas System Audit Office reviewed how MD Anderson procured its Oncology Expert Advisor, a system meant to use IBM Watson technology to offer care advice and match patients with clinical trials. Its November 2016 report found about $62.1 million paid to external firms through 31 August 2016 for a system not in clinical use. More than half of the money came from restricted gifts. IBM's agreement said the system was not ready for human investigational or clinical use, and IBM ended support for the pilot effective 1 September 2016. The auditors found two non-competitive contracts worth about $41.7 million with no formal justification, fees set just below the amount that would have required Board approval, and invoices paid in full regardless of whether the services were delivered. They gave no opinion on the system's scientific basis or capabilities.",
      "Watson for Oncology was a separate IBM product. STAT reported in September 2017 that IBM had pitched it as a revolution in cancer care and that it was nowhere close. In July 2018, STAT reported on internal slides that described unsafe and incorrect treatment recommendations. IBM Watson Health's deputy chief health officer had presented them in June and July 2017. According to the slides, the system had been trained on a small number of hypothetical cases rather than real patient data. Both accounts are press.",
      "In January 2022, IBM announced the sale of its healthcare data and analytics assets to Francisco Partners. The announcement names the products sold and does not name Watson for Oncology. No court or regulator has made a finding about either system.",
    ],
    timeline: [
      {
        when: "Sep 2016",
        what: "IBM ends support for MD Anderson's Oncology Expert Advisor pilot. The system is not in clinical use.",
      },
      {
        when: "Nov 2016",
        what: "The UT System audit finds $62.1 million paid to outside firms, contracts not formally justified, and invoices paid whether or not services were delivered.",
        evidence: true,
      },
      {
        when: "Jun 2017",
        what: "IBM Watson Health's deputy chief health officer presents internal slides describing unsafe and incorrect treatment recommendations, by STAT's later account.",
        turn: true,
      },
      {
        when: "Sep 2017",
        what: "STAT reports that Watson for Oncology is nowhere close to what IBM pitched.",
      },
      {
        when: "Jul 2018",
        what: "STAT publishes the internal slides.",
      },
      {
        when: "Jan 2022",
        what: "IBM announces the sale of its healthcare data and analytics assets. Watson for Oncology is not named.",
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "failed",
        finding:
          "IBM's agreement with MD Anderson said the system was not ready for clinical use. According to STAT, IBM's own slides on Watson for Oncology described unsafe and incorrect recommendations. In both, the capability marketed was not the capability built.",
        clauses: [{ standard: "STD-06", clause: "§2.1" }],
        laws: ["I"],
      },
      {
        variable: "authority",
        verdict: "held",
        finding:
          "At MD Anderson the system was never given authority over a patient's care: IBM's agreement prohibited its use in treatment except for testing, and the audit found it not in clinical use. For Watson for Oncology, the record found does not show what authority hospitals gave it.",
        clauses: [{ standard: "STD-06", clause: "§4.2" }],
        laws: ["I"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "By STAT's account, Watson for Oncology was trained on a small number of hypothetical cases, not real patients. A recommendation trained on cases no patient had is evidence about the cases, not about the patient in front of the clinician.",
        clauses: [
          { standard: "STD-06", clause: "§2.2" },
          { standard: "STD-08", clause: "§4.6" },
        ],
        laws: ["III", "X"],
      },
      {
        variable: "dependency",
        verdict: "drifted",
        finding:
          "MD Anderson paid $62.1 million in all for a system that had not been updated to work with its new record system. More than half the money came from restricted gifts pledged for the project, and the gift fund ran an $11.59 million deficit. Spending continued while the system stayed out of clinical use.",
        clauses: [
          { standard: "STD-06", clause: "§5.1" },
          { standard: "STD-08", clause: "§1.1" },
        ],
        laws: ["V", "II"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "By STAT's account, the people who caught Watson for Oncology's unsafe recommendations were IBM's own specialists and its customers. Their findings went into internal slides. The record shows no route by which a clinician or a patient could make the vendor answer them.",
        clauses: [
          { standard: "STD-02", clause: "§8.4" },
          { standard: "STD-06", clause: "§3.3" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "drifted",
        finding:
          "MD Anderson's project ended when IBM stopped supporting it, not on a threshold anyone had set. For Watson for Oncology, no withdrawal is on the record; IBM later sold its healthcare data business without naming it. Correction by abandonment is not a stop the operator held.",
        clauses: [
          { standard: "STD-06", clause: "§1.3" },
          { standard: "STD-06", clause: "§4.2" },
        ],
        laws: ["IV"],
      },
    ],
    learningOutcome: {
      verdict: "absorbed",
      finding:
        "The audit reviewed procurement and said MD Anderson's standard procedures were sufficient if applied consistently. That puts the failure in how the rules were applied, not in the rules. For Watson for Oncology, the record found shows no revision of how the product was built or evidenced.",
    },
    theMissingRecord:
      "A record of each unsafe recommendation caught before it reached a patient, with who caught it and whether the source was fixed (STD-06 §3.3). IBM's internal slides held that evidence in 2017. Nothing in the record found shows it reaching the hospitals using the product.",
    remediation: {
      diagnostic: {
        name: "Delegation Audit",
        href: "/diagnostics/delegation-audit",
        purpose:
          "Takes one workflow and asks what evidence justifies the system's authority and whether anyone can stop it.",
      },
      standard: {
        id: "STD-06",
        name: "Human Impact Safety Case",
        href: "/standards/std-06-human-impact-safety-case",
        requirement:
          "Requires each failure a person caught before it reached anyone to be recorded, with who caught it and whether the condition was fixed.",
      },
      theory: {
        title: "Deliberate non-use",
        href: "/research/theory/deliberate-non-use",
        question:
          "Once a system can do something it could not do before, how can an institution decide, on the record, not to use it?",
      },
    },
    sources: [
      {
        label:
          "The University of Texas System Audit Office, Special Review of Procurement Procedures Related to the M.D. Anderson Cancer Center Oncology Expert Advisor Project (archived copy)",
        href: "https://web.archive.org/web/20170829022602id_/https://www.utsystem.edu/sites/default/files/documents/UT%20System%20Administration%20Special%20Review%20of%20Procurement%20Procedures%20Related%20to%20UTMDACC%20Oncology%20Expert%20Advisor%20Project/ut-system-administration-special-review-procurement-procedures-related-utmdacc-oncology-expert-advis.pdf",
        kind: "operator",
        date: "2016-11",
      },
      {
        label:
          "IBM, Francisco Partners to Acquire IBM's Healthcare Data and Analytics Assets",
        href: "https://newsroom.ibm.com/2022-01-21-Francisco-Partners-to-Acquire-IBMs-Healthcare-Data-and-Analytics-Assets",
        kind: "operator",
        date: "2022-01-21",
      },
      {
        label:
          "Casey Ross and Ike Swetlitz, IBM pitched its Watson supercomputer as a revolution in cancer care. It's nowhere close, STAT",
        href: "https://www.statnews.com/2017/09/05/watson-ibm-cancer/",
        kind: "press",
        date: "2017-09-05",
      },
      {
        label:
          "Casey Ross and Ike Swetlitz, IBM's Watson supercomputer recommended 'unsafe and incorrect' cancer treatments, internal documents show, STAT",
        href: "https://www.statnews.com/2018/07/25/ibm-watson-recommended-unsafe-incorrect-treatments/",
        kind: "press",
        date: "2018-07-25",
      },
    ],
    meetsAdmissionRule: false,
    admissionReason:
      "The evidence on recommendation quality is press; the UT System audit covers MD Anderson's procurement and costs only, and gives no opinion on the system.",
    scoreStatus: "draft",
    gaps: [
      "The audit is dated November 2016; the day it was released was not confirmed.",
      "No verified date for IBM withdrawing Watson for Oncology.",
      "No record found says how many patients Watson for Oncology's recommendations reached or whether any were harmed.",
      "The audit is filed as an operator source because the UT System is MD Anderson's parent; it is not a statutory inquiry or a regulator.",
    ],
  },
];
