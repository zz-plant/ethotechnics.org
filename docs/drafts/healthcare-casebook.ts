/**
 * DRAFT, not published. Two healthcare cases held back from the casebook's
 * healthcare pillar, in the casebook's own format and scored on its six
 * safeguards. Nothing under docs/ is built, routed, or listed in the sitemap,
 * and tests/drafts.test.ts fails if any of it leaks.
 *
 * ---------------------------------------------------------------------------
 * The owner decision, taken 2026-11-10: option A
 * ---------------------------------------------------------------------------
 * This file held four cases and a choice. The owner chose A: the healthcare
 * pillar states its own admission rule on its own page ("established by a
 * court, a statutory inquiry, a regulator, or a peer-reviewed external
 * validation"), and the main casebook keeps its rule and its claim on the
 * hub. The pillar is /casebook/healthcare-ai, and its cases are in
 * src/content/healthcare-casebook.ts.
 *
 * Two cases met that rule from their non-press sources and were published
 * there, with every press-only fact cut: the Epic Sepsis Model and Optum's
 * cost-as-proxy risk score. Each rests on a peer-reviewed study.
 *
 * The two cases below do not meet the pillar's rule, and stay here:
 * - UnitedHealthcare and nH Predict. The record is a Senate subcommittee's
 *   majority staff report, court orders that make no findings, a complaint,
 *   and general CMS guidance. The staff report is not a statutory inquiry
 *   and does not establish that nH Predict made the denials. It can move
 *   when a court or regulator makes a finding, or a peer-reviewed study
 *   tests the tool.
 * - IBM Watson in cancer care. The evidence on recommendation quality is
 *   press. The UT System audit is an operator document that covers
 *   procurement and costs and gives no opinion on the system.
 *
 * Press stays out of a published case's sources. Before either case is
 * published, every fact that rests only on press comes out with it.
 *
 * ---------------------------------------------------------------------------
 * What differs from the published format, in this draft only
 * ---------------------------------------------------------------------------
 * - Sources may be "study" or "press". The pillar admits "study"; nothing
 *   published admits "press".
 * - A source may carry a month-only date ("2016-11") where the document
 *   gives no day. The published casebook and the pillar carry full dates.
 * - `halt` replaces timeToHalt, haltSpan, timeToHaltDays, and haltedBy,
 *   because neither system has a halt on the record. The pillar uses the
 *   same field.
 * - Every score is this project's draft reading (`scoreStatus: "draft"`).
 * - `gaps` lists what could not be confirmed and was left out.
 * - `meetsAdmissionRule` is read against the pillar's rule, not the main
 *   casebook's.
 *
 * Facts were checked against the sources listed on each case on 2026-10-08.
 */

import type { Case, HaltSpan, Source } from "../../src/content/casebook";

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
  /** Whether the case meets the healthcare pillar's admission rule. */
  meetsAdmissionRule: boolean;
  /** One line: why, or why not. */
  admissionReason: string;
  scoreStatus: "draft";
  /** Facts that could not be confirmed, and so are not in the case. */
  gaps: string[];
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
      "The Senate staff report establishes the denial rates and the automation but does not establish that nH Predict made the denials, and a majority staff report is not a statutory inquiry. The court rulings so far make no findings. No peer-reviewed study of the tool is among the sources.",
    scoreStatus: "draft",
    gaps: [
      "STAT's reporting that naviHealth set a target to keep stays within 1% of the algorithm's projection is press, and the complaint repeats it as an allegation. It is left out of the findings.",
      "HHS Office of Inspector General data briefs on post-acute denials from June 2026 were not reviewed (OEI-09-24-00330 and OEI-09-24-00331). They may strengthen the record on denial rates; whether they address nH Predict was not confirmed.",
      "How many people UnitedHealthcare denied post-acute care under nH Predict is not in any record found.",
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
      "The evidence on recommendation quality is press; the UT System audit covers MD Anderson's procurement and costs only, and gives no opinion on the system. No court, statutory inquiry, regulator, or peer-reviewed study is among the sources.",
    scoreStatus: "draft",
    gaps: [
      "The audit is dated November 2016; the day it was released was not confirmed.",
      "No verified date for IBM withdrawing Watson for Oncology.",
      "No record found says how many patients Watson for Oncology's recommendations reached or whether any were harmed.",
      "The audit is filed as an operator source because the UT System is MD Anderson's parent; it is not a statutory inquiry or a regulator.",
    ],
  },
];
