import { standardClauses, standardsContent } from "./standards";
import type { PageWithPermalink, PublishedContent } from "./types";

/**
 * The casebook: public failures of delegated decision systems, each scored
 * against the six state variables the Laws track and pinned to the clauses
 * that would have caught it.
 *
 * Every case here was established by a court, a statutory inquiry, or a
 * regulator, and the findings quoted are theirs. The scores are ours: they
 * say which variable drifted, not who was at fault. A case where most
 * variables held is as useful as one where none did, because a standard
 * that finds every deployment guilty discriminates nothing.
 */

export type StateVariableId =
  | "capability"
  | "authority"
  | "evidence"
  | "dependency"
  | "standing"
  | "correction";

export type LawId =
  | "I"
  | "II"
  | "III"
  | "IV"
  | "V"
  | "VI"
  | "VII"
  | "VIII"
  | "IX"
  | "X"
  | "XI"
  | "XII";

/**
 * held: the variable was explicit and stayed coupled to the others.
 * drifted: it existed but detached from the variable it should track.
 * failed: it was absent, or its absence is what the inquiry found.
 */
export type Verdict = "held" | "drifted" | "failed";

export type StateVariable = {
  id: StateVariableId;
  label: string;
  question: string;
};

export const stateVariables: StateVariable[] = [
  {
    id: "capability",
    label: "Capability",
    question: "What could the assembled system do?",
  },
  {
    id: "authority",
    label: "Authority",
    question: "Which actions was it permitted to take, for whom, until when?",
  },
  {
    id: "evidence",
    label: "Evidence",
    question: "What propositions justified that authority?",
  },
  {
    id: "dependency",
    label: "Dependency",
    question: "How hard had withdrawal or substitution become?",
  },
  {
    id: "standing",
    label: "Standing",
    question: "Who could challenge a decision, with what procedural force?",
  },
  {
    id: "correction",
    label: "Correction",
    question: "Which interventions stayed feasible, and on what clock?",
  },
];

export type ClauseRef = {
  /** Standard id as the clause register spells it, e.g. "STD-02". */
  standard: string;
  /** Clause display id, e.g. "§1.2". */
  clause: string;
};

export type Finding = {
  variable: StateVariableId;
  verdict: Verdict;
  /** What the record shows about this variable, in one paragraph. */
  finding: string;
  /** The clauses whose obligation the finding falls under. */
  clauses: ClauseRef[];
  laws: LawId[];
};

export type Source = {
  label: string;
  /** Omitted where no stable public URL exists; the citation stands alone. */
  href?: string;
  /** Who produced it. Primary records first; an NGO report only where it
   * documents what the primary record established. */
  kind: "court" | "inquiry" | "regulator" | "parliament" | "operator" | "ngo";
  date: string;
};

export type TimelineEvent = {
  when: string;
  what: string;
  turn?: boolean;
  /**
   * The event is part of the record against the scheme: a warning, a finding,
   * or a ruling. The home page's two-ledger panel counts these as the reader
   * passes them.
   */
  evidence?: boolean;
  /** The event at which the system was actually halted. */
  halt?: boolean;
};

export type Case = PublishedContent & {
  slug: string;
  title: string;
  /** The system, in one line: what it decided and for whom. */
  system: string;
  jurisdiction: string;
  /** The years the system ran with the defect, as people would say them. */
  period: string;
  /** How many people the record says were affected. */
  scale: string;
  /** From first harm to the delegation being halted or reversed. */
  timeToHalt: string;
  /** Who made the halt happen. Almost never the operator. */
  haltedBy: string;
  summary: string;
  /** What happened, from the primary record, in a few paragraphs. */
  narrative: string[];
  /**
   * The case as dated events, drawn only from the narrative, findings,
   * period, halt, and sources above. `turn` marks the one event the narrative
   * treats as the turning point, at most one per case.
   */
  timeline?: TimelineEvent[];
  findings: Finding[];
  /**
   * Where the failure trajectory ended: in case resolution (each exception
   * handled, the delegation unchanged) or in institutional revision (the
   * rule, category, workflow, or authority that produced the errors changed).
   * The distinction is exception absorption versus exception learning.
   */
  learningOutcome: {
    verdict: "learned" | "partial" | "absorbed";
    finding: string;
  };
  /** The one thing the standards would have required that was absent. */
  theMissingRecord: string;
  sources: Source[];
};

export type CasebookContent = PageWithPermalink & {
  eyebrow: string;
  title: string;
  description: string;
};

export const casebookContent: CasebookContent = {
  pageTitle: "Casebook — five public failures, scored — Ethotechnics",
  pageDescription:
    "Robodebt, the Dutch childcare-benefits scandal, Post Office Horizon, England's 2020 exam grades, and Apple Card, each scored against the six state variables and pinned to the clauses that would have caught it.",
  permalink: "/casebook",
  eyebrow: "Casebook",
  title: "Five public failures, scored",
  description:
    "Each case was established by a court, an inquiry, or a regulator. Each is scored against the six state variables the laws track, with the clause that would have caught the drift, and against whether the failure trajectory ended in institutional learning or was absorbed as handled cases. The scores are not a verdict on anyone; they show where the coupling broke.",
};

export const cases: Case[] = [
  {
    slug: "robodebt",
    title: "Robodebt",
    system:
      "Automated welfare-debt raising: annual tax-office income averaged across fortnights to assert overpayments, with the burden of disproof placed on the recipient.",
    jurisdiction: "Australia · Services Australia (Centrelink)",
    period: "July 2016 to November 2019",
    scale:
      "About 470,000 debts raised unlawfully. The class-action settlement the Federal Court approved in 2021 covered roughly 381,000 people, with repayments, wiped debts, and interest valued at about A$1.8 billion.",
    timeToHalt: "Three years and four months",
    haltedBy:
      "The Federal Court, on a consent order the Commonwealth agreed to hours before a hearing it would have lost.",
    published: "2026-09-17T00:00:00Z",
    summary:
      "A scheme that raised debts at twenty times the previous rate, under an interpretation of the law the department had been advised in 2014 was wrong, and that treated a tribunal's repeated findings of unlawfulness as individual outcomes rather than as evidence against the delegation.",
    narrative: [
      "From July 2016 the Online Compliance Intervention replaced a manual process in which a compliance officer reconciled a welfare recipient's reported fortnightly income against employer records. The automated process took the annual income the tax office held, divided it evenly across the year's fortnights, compared each fortnight to what the recipient had declared, and raised a debt for the difference. The recipient was then asked to produce payslips, often for years past, to disprove it. Income averaging cannot establish what a person earned in any given fortnight, and the Department of Social Services had received legal advice to that effect in 2014.",
      "The Commonwealth Ombudsman reported in April 2017 that the scheme's notices did not explain how a debt had been calculated and that the reversal of the onus of proof was causing serious distress. The Administrative Appeals Tribunal found individual debts unlawful in dozens of matters from early 2017. The department did not appeal those decisions, which would have created a binding precedent, and did not treat them as evidence about the scheme. In November 2019, in Amato v Commonwealth, the Commonwealth consented to a Federal Court declaration that a debt raised by averaging was not lawfully made. The scheme was halted the same month.",
      "The Royal Commission into the Robodebt Scheme reported on 7 July 2023. It found the scheme unlawful from the outset, that the government had been told so, and that the department's handling of the legal advice, the Ombudsman, and the tribunal decisions amounted to a sustained refusal to look at the evidence the scheme was generating about itself.",
    ],
    timeline: [
      {
        when: "2014",
        what: "The department is advised in writing that income averaging cannot prove a debt.",
        evidence: true,
      },
      {
        when: "Jul 2016",
        what: "The automated scheme launches. Debt notices go from about 20,000 a year to 20,000 a week.",
      },
      {
        when: "Apr 2017",
        what: "The Ombudsman reports that notices do not explain how a debt was calculated.",
        evidence: true,
      },
      {
        when: "2017–19",
        what: "A tribunal rules individual debts unlawful dozens of times. Each ruling fixes one case. The scheme keeps running.",
        turn: true,
        evidence: true,
      },
      {
        when: "Nov 2019",
        what: "The government concedes a Federal Court case it was about to lose. The scheme is halted that month.",
        evidence: true,
        halt: true,
      },
      {
        when: "Jul 2023",
        what: "A Royal Commission finds the scheme was unlawful from the outset.",
        evidence: true,
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "drifted",
        finding:
          "The automated process could raise about 20,000 debt notices a week where the manual process had raised about 20,000 a year. Nothing about the authority to raise debts was re-examined when the capacity to raise them grew by that factor, and the review capacity on the other side of the notice, the recipient's ability to contest, did not grow at all.",
        clauses: [
          { standard: "STD-08", clause: "§4.2" },
          { standard: "STD-08", clause: "§4.3" },
        ],
        laws: ["I", "XI"],
      },
      {
        variable: "authority",
        verdict: "failed",
        finding:
          "The authority to raise a debt by averaging did not exist under the Social Security Act, and the department held written advice saying so before the scheme launched. The delegation ran for three years on an authorization whose legal basis had been examined and found absent. A grant that cites a policy it knows to be wrong is not a grant.",
        clauses: [
          { standard: "STD-07", clause: "§2.1" },
          { standard: "STD-08", clause: "§2.1" },
          { standard: "STD-08", clause: "§2.5" },
        ],
        laws: ["II", "III"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "An averaged annual figure is not evidence of fortnightly income. The scheme asserted a debt, then asked the person to supply the evidence that would have been needed to assert it. Notices did not state how the figure was computed. The Royal Commission's central finding was that the evidence for each debt was never held by the party raising it.",
        clauses: [
          { standard: "STD-02", clause: "§1.2" },
          { standard: "STD-02", clause: "§2.2" },
          { standard: "STD-06", clause: "§2.4" },
        ],
        laws: ["III"],
      },
      {
        variable: "dependency",
        verdict: "drifted",
        finding:
          "The scheme was booked as a budget saving of more than a billion dollars before it had raised a debt. Once the savings were in the forward estimates, withdrawing the scheme carried a fiscal and political cost that no one inside the department had the standing to incur. The dependency was institutional, and it was the reason the tribunal findings were absorbed rather than acted on.",
        clauses: [
          { standard: "STD-06", clause: "§5.1" },
          { standard: "STD-06", clause: "§5.3" },
        ],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "Recipients could object, and many did, and the tribunal found for them repeatedly. But an objection that succeeds only for the objector, and produces no transition in the delegation itself, has no procedural force against the scheme. The department chose not to appeal, which kept each finding from becoming precedent, and did not record the pattern as a finding about the delegation.",
        clauses: [
          { standard: "STD-02", clause: "§8.3" },
          { standard: "STD-02", clause: "§8.5" },
          { standard: "STD-02", clause: "§9.3" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "failed",
        finding:
          "The scheme was technically trivial to halt, and was halted in a day when the Federal Court forced the question. It was not operationally or institutionally reversible for three years, because no one whose job it was to stop it had been given the authority to, and the people who had the authority had a reason not to. A correction that only a court can exercise is not a correction the operator holds.",
        clauses: [
          { standard: "STD-06", clause: "§1.3" },
          { standard: "STD-06", clause: "§4.2" },
          { standard: "STD-02", clause: "§4.3" },
        ],
        laws: ["IV", "VI", "XII"],
      },
    ],
    learningOutcome: {
      verdict: "absorbed",
      finding:
        "The tribunal's repeated findings of unlawfulness were handled as individual outcomes and never entered the delegation. The department did not appeal, which kept each finding from becoming precedent, and did not record the pattern as a finding about the scheme. The sequence ended in case resolution for three years; the rule was never revised by the institution that ran it. The delegation was halted only by a court, and the institutional revision came after that, from a Royal Commission, not from the operator's own machinery.",
    },
    theMissingRecord:
      "A policy record for income averaging with its provenance and status. The 2014 advice would have been the review trigger; the first adverse tribunal decision would have moved the policy, and every grant citing it, to review_required. STD-08 §2.3 gives that a clock.",
    sources: [
      {
        label: "Royal Commission into the Robodebt Scheme, Report",
        href: "https://robodebt.royalcommission.gov.au/publications/report",
        kind: "inquiry",
        date: "2023-07-07",
      },
      {
        label:
          "Commonwealth Ombudsman, Centrelink's automated debt raising and recovery system",
        href: "https://www.ombudsman.gov.au/__data/assets/pdf_file/0022/43528/Report-Centrelinks-automated-debt-raising-and-recovery-system-April-2017.pdf",
        kind: "regulator",
        date: "2017-04-10",
      },
      {
        label:
          "Amato v Commonwealth of Australia, Federal Court consent orders",
        kind: "court",
        date: "2019-11-27",
      },
      {
        label:
          "Prygodicz v Commonwealth of Australia (No 2) [2021] FCA 634, settlement approval",
        href: "https://www.judgments.fedcourt.gov.au/judgments/Judgments/fca/single/2021/2021fca0634",
        kind: "court",
        date: "2021-06-11",
      },
    ],
  },
  {
    slug: "toeslagenaffaire",
    title: "The childcare benefits scandal",
    system:
      "Risk-scored fraud detection on childcare benefit claims, with an all-or-nothing rule that reclaimed the entire benefit for any irregularity and an intent label that barred repayment arrangements.",
    jurisdiction: "Netherlands · Belastingdienst/Toeslagen",
    period: "Roughly 2012 to 2019",
    scale:
      "More than 30,000 parents wrongly accused of fraud and made to repay benefits, often tens of thousands of euros; children placed in care; the cabinet resigned.",
    timeToHalt: "About seven years",
    haltedBy:
      "The Council of State reversing its own case law in October 2019, then a parliamentary inquiry.",
    published: "2026-09-17T00:00:00Z",
    summary:
      "A fraud-detection system whose risk score was treated as a finding, whose reasons were withheld from the people it flagged and from the courts that reviewed them, and whose harshest rule was upheld by the highest administrative court for years before that court changed its mind.",
    narrative: [
      "After a 2013 fraud case involving Bulgarian nationals, the Dutch tax administration's benefits arm was set aggressive enforcement targets. A risk-classification model scored childcare benefit applications, and applications with high scores were pulled for manual review under a presumption of fraud. Reviewers applied a rule under which any irregularity, including a missing signature or a late payment to the childcare provider, could lead to the whole benefit for the year being reclaimed. Parents labeled with intent or gross negligence were denied repayment arrangements.",
      "Parents who objected were not told why they had been flagged. Files provided to courts were incomplete; internal memos later showed that the administration knew its position in some cases was untenable and litigated anyway. The Council of State, the highest administrative court, upheld the all-or-nothing rule in its case law until 23 October 2019, when it reversed course and held that the administration had discretion it had never exercised.",
      "The Dutch Data Protection Authority found in July 2020 that the administration had unlawfully processed applicants' nationality, including dual nationality, as a risk indicator, and fined it in December 2021. The parliamentary inquiry committee's report, Ongekend onrecht, unprecedented injustice, was published on 17 December 2020. The cabinet resigned over it on 15 January 2021. A redress operation is still running.",
    ],
    timeline: [
      {
        when: "2013",
        what: "After a fraud case, the benefits office is set aggressive enforcement targets.",
      },
      {
        when: "2013–19",
        what: "A risk model scores childcare claims. High scores are reviewed under a presumption of fraud. Any irregularity, even a missing signature, can reclaim the whole year's benefit.",
      },
      {
        when: "To Oct 2019",
        what: "Parents who object are not told why they were flagged. Courts get incomplete files. The highest administrative court upholds the all-or-nothing rule.",
        turn: true,
      },
      {
        when: "Oct 2019",
        what: "The Council of State reverses its own case law. The administration had discretion it never used.",
      },
      {
        when: "Jul 2020",
        what: "The Data Protection Authority finds nationality was used unlawfully as a risk indicator.",
      },
      {
        when: "Dec 2020",
        what: "A parliamentary inquiry reports: unprecedented injustice.",
      },
      {
        when: "Jan 2021",
        what: "The cabinet resigns.",
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "drifted",
        finding:
          "The model could flag at a rate no review team could examine. Reviewers with a queue and a target processed flags as findings. The capability to suspect scaled; the capability to establish did not.",
        clauses: [
          { standard: "STD-08", clause: "§3.4" },
          { standard: "STD-08", clause: "§4.2" },
        ],
        laws: ["I", "IX"],
      },
      {
        variable: "authority",
        verdict: "drifted",
        finding:
          "The all-or-nothing rule was lawful in the sense that the highest court said so, until it said otherwise. Authority that rests on a reading no one has re-examined is authority outliving its evidence. The nationality indicator had no lawful basis at all, which the data protection authority later established.",
        clauses: [
          { standard: "STD-08", clause: "§2.1" },
          { standard: "STD-08", clause: "§2.3" },
        ],
        laws: ["II", "III"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "A risk score is a proposition about a population, not a finding about a person. It was treated as the latter. The reasons behind a flag were not given to the parent, and the file given to the court was not the file the administration held. The proposition justifying the reclaim was never produced to anyone who could test it.",
        clauses: [
          { standard: "STD-02", clause: "§1.1" },
          { standard: "STD-02", clause: "§2.2" },
          { standard: "STD-02", clause: "§6.3" },
        ],
        laws: ["III"],
      },
      {
        variable: "dependency",
        verdict: "drifted",
        finding:
          "Enforcement targets made the flag rate a metric the organization reported up. A system that produces the number a ministry is measured on is a system the ministry cannot afford to doubt.",
        clauses: [
          { standard: "STD-02", clause: "§6.2" },
          { standard: "STD-06", clause: "§5.1" },
        ],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "Parents had a formal right to object and to go to court. They could not see the reasons, could not see their file, and were answered by an administration that later admitted it withheld documents. Standing without disclosure is a queue. The people working the queue, who saw the pattern first, had no standing to raise it.",
        clauses: [
          { standard: "STD-02", clause: "§8.1" },
          { standard: "STD-02", clause: "§8.4" },
          { standard: "STD-02", clause: "§9.1" },
        ],
        laws: ["VII", "XII"],
      },
      {
        variable: "correction",
        verdict: "failed",
        finding:
          "There was no halt control. The rule was not a parameter anyone was empowered to change; it was case law. Reversal required the court to reverse itself, then a parliamentary inquiry, then a government to fall. Redress for individual parents has taken years and is not complete.",
        clauses: [
          { standard: "STD-02", clause: "§5.2" },
          { standard: "STD-02", clause: "§5.3" },
          { standard: "STD-06", clause: "§4.2" },
        ],
        laws: ["IV", "VI"],
      },
    ],
    learningOutcome: {
      verdict: "partial",
      finding:
        "The rule itself was eventually changed — the Council of State reversed its own case law — but only after seven years, and the reversal was a correction of the institution's legal position, not of the delegation's machinery. The institution that ran the model never revised its own evidentiary practice; the change came from the highest court overturning its own precedent, then a parliamentary inquiry, then a cabinet resignation. Redress is still running. The exception was visible and fought; the learning took the collapse of the government.",
    },
    theMissingRecord:
      "A standing register entry: who may challenge a flag, what evidence is admissible, and against which standard it is decided. STD-02 §8.2 would have forced the administration to say whether a parent was contesting policy conformance or evidentiary support, and to disclose the file either way.",
    sources: [
      {
        label:
          "Parlementaire ondervragingscommissie Kinderopvangtoeslag, Ongekend onrecht",
        kind: "parliament",
        date: "2020-12-17",
      },
      {
        label:
          "Autoriteit Persoonsgegevens, De verwerking van de nationaliteit van aanvragers van kinderopvangtoeslag",
        kind: "regulator",
        date: "2020-07-17",
      },
      {
        label:
          "Raad van State, ECLI:NL:RVS:2019:3535 and 3536, reversal of the all-or-nothing case law",
        kind: "court",
        date: "2019-10-23",
      },
      {
        label: "Amnesty International, Xenophobic Machines",
        href: "https://www.amnesty.org/en/documents/eur35/4686/2021/en/",
        kind: "ngo",
        date: "2021-10-25",
      },
    ],
  },
  {
    slug: "post-office-horizon",
    title: "Post Office Horizon",
    system:
      "A branch accounting system whose reported shortfalls were treated as proof of theft or false accounting, by an operator that was also the investigator and the prosecutor.",
    jurisdiction: "United Kingdom · Post Office Ltd, Fujitsu",
    period: "1999 to 2015 (prosecutions); redress continuing",
    scale:
      "More than 900 prosecutions; hundreds imprisoned, bankrupted, or both; the inquiry's first volume links at least thirteen suicides to the scandal and identifies roughly 10,000 eligible for redress.",
    timeToHalt: "About twenty years",
    haltedBy:
      "A group of 555 subpostmasters in civil litigation, then the Court of Appeal, then an Act of Parliament quashing convictions in bulk.",
    published: "2026-09-17T00:00:00Z",
    summary:
      "A system whose output was admitted as evidence of a crime under a legal presumption that computers work, whose known defects were logged by the supplier and withheld from defendants, and whose operator could not afford, contractually or reputationally, to find that it was wrong.",
    narrative: [
      "Horizon, built by ICL and then Fujitsu, was rolled out to Post Office branches from 1999. Subpostmasters were contractually liable for shortfalls the system reported. When it reported them, the Post Office investigated, and where it chose to, prosecuted, using its own power to bring private prosecutions. Between 1999 and 2015 it brought more than 700 prosecutions itself; other prosecutors brought more on the same evidence. Defendants who said the system was wrong were told it was robust and that no one else had complained.",
      "Fujitsu kept a known error log recording bugs that produced phantom shortfalls, and its engineers had remote access that could alter branch accounts without the subpostmaster's knowledge. Neither fact was disclosed to defendants. In Bates v Post Office, the Horizon Issues judgment of December 2019 found that the system had contained bugs, errors and defects capable of causing the discrepancies, and that the Post Office's position had been, in the judge's phrase, the equivalent of asserting the earth is flat.",
      "The Court of Appeal quashed 39 convictions in April 2021, finding that the prosecutions were an affront to the conscience of the court. The Post Office (Horizon System) Offences Act 2024 quashed the remainder by statute. The statutory inquiry chaired by Sir Wyn Williams published its first volume, on human impact and compensation, on 8 July 2025.",
    ],
    timeline: [
      {
        when: "1999",
        what: "Horizon is rolled out to Post Office branches. Subpostmasters are liable for the shortfalls it reports.",
      },
      {
        when: "1999–2015",
        what: "The Post Office brings more than 700 prosecutions itself. Each defendant is told the system is robust and no one else has complained. Fujitsu's log of known bugs is not disclosed.",
        turn: true,
      },
      {
        when: "Dec 2019",
        what: "In Bates v Post Office, brought by 555 subpostmasters, a judge finds Horizon had bugs capable of causing the shortfalls.",
      },
      {
        when: "Apr 2021",
        what: "The Court of Appeal quashes 39 convictions.",
      },
      {
        when: "May 2024",
        what: "An Act of Parliament quashes the remaining convictions.",
      },
      {
        when: "Jul 2025",
        what: "The statutory inquiry publishes its first volume, on human impact and compensation.",
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "drifted",
        finding:
          "The assembled system could alter a branch's accounts from outside the branch. That capability was known to the supplier and never declared to the people whose liberty turned on the accounts being theirs. A capability nobody has declared is one nobody has authorized.",
        clauses: [
          { standard: "STD-07", clause: "§2.2" },
          { standard: "STD-06", clause: "§1.2" },
        ],
        laws: ["I"],
      },
      {
        variable: "authority",
        verdict: "drifted",
        finding:
          "The Post Office held the authority to prosecute on its own system's say-so. The law at the time presumed that a computer's output was reliable unless the defendant showed otherwise, and the defendant had no access to the data that could show it. Authority was coupled to a presumption, not to evidence.",
        clauses: [
          { standard: "STD-08", clause: "§4.6" },
          { standard: "STD-02", clause: "§6.2" },
        ],
        laws: ["II", "III"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "The proposition that a shortfall meant money had been taken was never tested against the system's known error rate, because the error log was withheld. The evidence that would have shown the system's own contribution, transaction-level audit data, was available to the operator and not to the accused.",
        clauses: [
          { standard: "STD-02", clause: "§2.1" },
          { standard: "STD-02", clause: "§6.3" },
          { standard: "STD-06", clause: "§2.4" },
        ],
        laws: ["III", "X"],
      },
      {
        variable: "dependency",
        verdict: "failed",
        finding:
          "Every branch ran on Horizon. There was no substitute, the contract with Fujitsu was among the largest the Post Office held, and every prior conviction rested on the system being sound. Admitting a defect meant admitting all of them. This is the purest instance in the casebook of dependence converting a technical fault into a structural one.",
        clauses: [
          { standard: "STD-06", clause: "§5.1" },
          { standard: "STD-06", clause: "§5.2" },
          { standard: "STD-06", clause: "§5.3" },
        ],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "The people bearing the system's errors were prosecuted by its operator. There was no route by which a subpostmaster could put the system itself in question, and the operator told each one they were alone. Standing was not merely absent; the operator's incentives ran against it.",
        clauses: [
          { standard: "STD-02", clause: "§3.2" },
          { standard: "STD-02", clause: "§7.1" },
          { standard: "STD-02", clause: "§8.4" },
        ],
        laws: ["VII", "XII"],
      },
      {
        variable: "correction",
        verdict: "failed",
        finding:
          "Correction took two decades, civil litigation funded at the claimants' risk, an appellate court, and primary legislation. At no point did the operator hold an intervention it was willing to exercise. The inquiry's first volume is about compensation because the underlying harm can no longer be reversed.",
        clauses: [
          { standard: "STD-02", clause: "§5.2" },
          { standard: "STD-06", clause: "§5.6" },
          { standard: "STD-02", clause: "§4.3" },
        ],
        laws: ["IV", "VI"],
      },
    ],
    learningOutcome: {
      verdict: "absorbed",
      finding:
        "The operator never revised the machinery. The system's known defects were logged by the supplier and withheld; each subpostmaster was answered alone, so the pattern could not aggregate; and admitting a defect would have admitted every prior conviction, which made correction institutionally impossible for the operator itself. The learning came entirely from outside the institution — civil litigation, an appellate court, an inquiry, and an Act of Parliament — none of which the operator's own machinery produced. Exception absorption here lasted twenty years.",
    },
    theMissingRecord:
      "A dependency record with the exposure score computed and published. Dependency depth was total, substitution cost was the business, and correction latency turned out to be twenty years. STD-06 §5.5 would have barred expansion of the system's authority, including its use as prosecution evidence, until institutional reversibility was evidenced.",
    sources: [
      {
        label:
          "Bates & Others v Post Office Ltd (No 6: Horizon Issues) [2019] EWHC 3408 (QB)",
        href: "https://www.bailii.org/ew/cases/EWHC/QB/2019/3408.html",
        kind: "court",
        date: "2019-12-16",
      },
      {
        label: "Hamilton & Others v Post Office Ltd [2021] EWCA Crim 577",
        href: "https://www.bailii.org/ew/cases/EWCA/Crim/2021/577.html",
        kind: "court",
        date: "2021-04-23",
      },
      {
        label:
          "Post Office Horizon IT Inquiry, Volume 1: Human Impact and Compensation",
        href: "https://www.postofficehorizoninquiry.org.uk/",
        kind: "inquiry",
        date: "2025-07-08",
      },
      {
        label: "Post Office (Horizon System) Offences Act 2024",
        href: "https://www.legislation.gov.uk/ukpga/2024/14/contents",
        kind: "parliament",
        date: "2024-05-24",
      },
    ],
  },
  {
    slug: "ofqual-2020-grades",
    title: "England's 2020 exam grades",
    system:
      "A standardisation model that replaced cancelled A-level and GCSE exams by fitting each school's historical grade distribution to its current cohort, overriding teachers' assessed grades for all but the smallest classes.",
    jurisdiction: "England · Ofqual, Department for Education",
    period: "13 to 17 August 2020",
    scale:
      "About 39% of A-level grades issued below the teacher-assessed grade; the effect fell hardest on large cohorts in state schools and lightest on small classes, which were exempt.",
    timeToHalt: "Four days",
    haltedBy:
      "The Secretary of State, after Scotland had already reversed its equivalent and universities had begun allocating places on the model's grades.",
    published: "2026-09-17T00:00:00Z",
    summary:
      "The one case in the casebook where correction was fast, which is what makes it useful: a model with no evidenced accuracy at the level of the individual it was applied to, no appeal on the ground that it was wrong about that individual, and a halt that worked only because it was thrown before dependence had set.",
    narrative: [
      "When the 2020 exams were cancelled, the Secretary of State directed Ofqual to award grades and to ensure the distribution was broadly similar to previous years. Schools submitted a centre-assessed grade and a rank order for each student. Ofqual's model then fitted each school's grade distribution from the previous three years, adjusted for the cohort's prior attainment, to the rank order. Where a subject cohort at a school was five or fewer, the teacher's grade was used as submitted; between five and fifteen, a blend.",
      "Results were issued on 13 August. The regulator's interim report published the same day acknowledged that the model could not be validated against outcomes for individual students, since none existed, and that its aggregate agreement with past distributions was the design target rather than a measurement of accuracy. Students could appeal only through their school, on grounds of administrative error or, under a policy announced two days before results and withdrawn two days after, a higher mock grade. There was no ground of appeal that the model had ranked the student wrongly.",
      "Scotland's regulator had already withdrawn its equivalent model on 11 August. On 17 August Ofqual and the Department for Education announced that centre-assessed grades would stand. The Office for Statistics Regulation's review, published in March 2021, concluded that the model's limitations were understood by those building it and that the failure was in how the choices were made, explained, and opened to challenge.",
    ],
    timeline: [
      {
        when: "2020",
        what: "Exams are cancelled. The Secretary of State directs Ofqual to keep grades broadly similar to previous years.",
      },
      {
        when: "11 Aug 2020",
        what: "Scotland withdraws its equivalent model.",
      },
      {
        when: "13 Aug 2020",
        what: "Results are issued. Ofqual's own report says the model cannot be validated for individual students. No appeal lets a student argue it ranked them wrongly.",
      },
      {
        when: "17 Aug 2020",
        what: "Four days after results, Ofqual and the Department for Education announce that teachers' grades will stand.",
      },
      {
        when: "Mar 2021",
        what: "The statistics regulator finds the failure was in how the choices were made, explained, and opened to challenge.",
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "held",
        finding:
          "The model did what was asked of it: it reproduced the prior distribution. Its capability was declared, its exclusions were declared, and its behavior on small cohorts was published in advance. The capability variable is not where this case failed.",
        clauses: [{ standard: "STD-06", clause: "§1.2" }],
        laws: ["I"],
      },
      {
        variable: "authority",
        verdict: "drifted",
        finding:
          "The authority came from a ministerial direction to hold the distribution steady. That direction was itself the policy the model implemented, and it was never re-examined once the model's individual-level effects were visible. Authority that names its ceiling as an aggregate says nothing about what it may do to any one person.",
        clauses: [
          { standard: "STD-07", clause: "§2.2" },
          { standard: "STD-08", clause: "§2.1" },
        ],
        laws: ["II"],
      },
      {
        variable: "evidence",
        verdict: "failed",
        finding:
          "The model's accuracy was evidenced at the level of the distribution and applied at the level of the student. The regulator said as much in its own report. A proposition about a cohort was used to justify an action against an individual, which is the gap Law X names: the eval sat one layer below the harm.",
        clauses: [
          { standard: "STD-06", clause: "§2.2" },
          { standard: "STD-06", clause: "§2.4" },
        ],
        laws: ["III", "X"],
      },
      {
        variable: "dependency",
        verdict: "held",
        finding:
          "The halt was thrown four days in, before universities had finalised admissions and before the grades had been used for anything irreversible. Dependence had not yet set. Three weeks later, with places confirmed and courses full, the same reversal would have been operationally impossible. The clock, not the decision, is what made this case recoverable.",
        clauses: [{ standard: "STD-06", clause: "§5.5" }],
        laws: ["V", "XI"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "Students could not appeal on the ground that the model had got them wrong. Appeals ran through the school, on grounds that excluded the decision itself, and the one ground that might have helped was announced and withdrawn within four days. The party bearing the error had no route to put the delegation in question.",
        clauses: [
          { standard: "STD-02", clause: "§1.3" },
          { standard: "STD-02", clause: "§3.1" },
          { standard: "STD-02", clause: "§8.1" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "drifted",
        finding:
          "The halt existed and was thrown. It was not the operator's; it was ministerial, taken under public pressure, and after a neighbouring jurisdiction had gone first. A correction that works when a minister chooses to exercise it is real, but it is not a rehearsed control with a named owner and a declared threshold.",
        clauses: [
          { standard: "STD-06", clause: "§1.3" },
          { standard: "STD-06", clause: "§2.2" },
        ],
        laws: ["IV", "IX"],
      },
    ],
    learningOutcome: {
      verdict: "absorbed",
      finding:
        "The decision was corrected — every grade was reversed within four days — but no institution's machinery was revised by the failure. Ofqual and the Department for Education withdrew the model rather than repairing the rule that generated the harm; the evidentiary practice of validating an aggregate and applying it to individuals was never revisited inside the institution. The halt was thrown by a minister under public pressure after a neighbouring jurisdiction had gone first, which is a correction of the case, not a change to the rule. The office that reviewed the episode was the statistics regulator, external to the operator.",
    },
    theMissingRecord:
      "A declared threshold with the action that follows a breach. STD-06 §2.2 asks the operator to say, before running the model, what share of downgrades or what disparity between school types would stop the release. Had that number existed, the halt on 17 August would have been a control firing rather than a reversal under pressure.",
    sources: [
      {
        label:
          "Ofqual, Awarding GCSE, AS, A level, advanced extension awards and extended project qualifications in summer 2020: interim report",
        href: "https://www.gov.uk/government/publications/awarding-gcse-as-a-levels-in-summer-2020-interim-report",
        kind: "regulator",
        date: "2020-08-13",
      },
      {
        label:
          "Office for Statistics Regulation, Ensuring statistical models command public confidence: lessons learned from the 2020 A level and GCSE grades",
        href: "https://osr.statisticsauthority.gov.uk/publication/ensuring-statistical-models-command-public-confidence/",
        kind: "regulator",
        date: "2021-03-02",
      },
      {
        label:
          "House of Commons Education Committee, Getting the grades they've earned: Covid-19: the cancellation of exams and 'calculated' grades",
        kind: "parliament",
        date: "2020-07-11",
      },
    ],
  },
  {
    slug: "apple-card",
    title: "Apple Card credit limits",
    system:
      "Automated credit-limit decisions on a consumer card issued by Goldman Sachs, with no route by which an applicant could learn why their limit differed from a spouse's or ask for the decision to be reconsidered.",
    jurisdiction: "United States · New York Department of Financial Services",
    period: "November 2019 to 2021",
    scale:
      "No unlawful discrimination found. The regulator's finding was that applicants, and the bank's own staff, could not explain individual outcomes, and that no reconsideration path existed.",
    timeToHalt:
      "About seventeen months to a policy change; the model was not withdrawn.",
    haltedBy:
      "Nobody. The issuer changed its policies after a regulator's investigation found the process, not the model, deficient.",
    published: "2026-09-17T00:00:00Z",
    summary:
      "The control case. The model was examined and cleared; the failure was that the person on the receiving end had no reasons and no route, and the people answering the phone had neither either. Most variables held. The two that did not are the two the Contestability standard exists for.",
    narrative: [
      "In November 2019, several applicants reported publicly that they had been offered credit limits many times higher than their spouses', despite shared finances and, in some cases, the spouse's better credit history. Customer service representatives could not explain the outcomes and, by the applicants' accounts, said the algorithm had decided. The New York Department of Financial Services opened an investigation.",
      "The Department's report, published in March 2021, found that the underwriting model did not use sex or marital status and that the outcomes could be explained by differences in the applicants' individual credit files, including that a spouse who was an authorised user on the other's accounts had a thinner history. It found no violation of fair lending law. It also found that neither applicants nor the bank's staff had been able to obtain that explanation at the time, that there was no process to request reconsideration of a limit, and that the bank's reliance on individual credit data disadvantaged spouses whose finances were shared but whose credit histories were not.",
      "The issuer subsequently introduced the ability for spouses to share an account and build credit jointly, and a reconsideration process. The model was not changed.",
    ],
    timeline: [
      {
        when: "Nov 2019",
        what: "Applicants report credit limits many times higher than their spouses', despite shared finances.",
      },
      {
        when: "Nov 2019",
        what: "Customer service cannot explain the outcomes. By the applicants' accounts, staff say the algorithm decided. There is no way to ask for a reconsideration.",
        turn: true,
      },
      {
        when: "Mar 2021",
        what: "The New York regulator reports. The model did not use sex or marital status, and no fair lending law was broken.",
      },
      {
        when: "Mar 2021",
        what: "It also finds that neither applicants nor the bank's staff could get that explanation at the time.",
      },
      {
        when: "2021",
        what: "The issuer adds a reconsideration process and joint accounts for spouses. The model is not changed.",
      },
    ],
    findings: [
      {
        variable: "capability",
        verdict: "held",
        finding:
          "The model set limits. It did not do anything it had not been authorised to do, and its inputs were declared to the regulator.",
        clauses: [{ standard: "STD-07", clause: "§2.2" }],
        laws: ["I"],
      },
      {
        variable: "authority",
        verdict: "held",
        finding:
          "The issuer held the authority to set limits and did so within fair lending law. The regulator examined the authority and confirmed it.",
        clauses: [{ standard: "STD-07", clause: "§2.1" }],
        laws: ["II"],
      },
      {
        variable: "evidence",
        verdict: "drifted",
        finding:
          "The evidence for each decision existed, in the credit file, and was produced to the regulator. It was not produced to the applicant, and the bank's own front line could not retrieve it. Evidence that the operator holds but cannot surface at the moment of the decision is evidence in name.",
        clauses: [
          { standard: "STD-02", clause: "§1.2" },
          { standard: "STD-02", clause: "§2.2" },
        ],
        laws: ["III"],
      },
      {
        variable: "dependency",
        verdict: "held",
        finding:
          "A credit limit is revisable and the issuer revised its policy. Nothing about the deployment made withdrawal or change costly.",
        clauses: [{ standard: "STD-06", clause: "§5.1" }],
        laws: ["V"],
      },
      {
        variable: "standing",
        verdict: "failed",
        finding:
          "There was no reconsideration path. An applicant could complain, and the complaint could be logged, but there was no route by which the complaint produced an answer against a stated standard or a possible change to the decision. The regulator's finding was about this, not the model.",
        clauses: [
          { standard: "STD-02", clause: "§6.1" },
          { standard: "STD-02", clause: "§8.1" },
          { standard: "STD-02", clause: "§8.3" },
        ],
        laws: ["VII"],
      },
      {
        variable: "correction",
        verdict: "held",
        finding:
          "The issuer changed its policies within months of the report. The correction was institutionally feasible and was exercised without a court. That it took a regulator to prompt it is the drift; that it happened is the difference between this case and the other four.",
        clauses: [{ standard: "STD-02", clause: "§5.3" }],
        laws: ["IV"],
      },
    ],
    learningOutcome: {
      verdict: "learned",
      finding:
        "The institution revised its machinery. The regulator found the process deficient, and the issuer responded by changing the process: it introduced a reconsideration path for credit-limit decisions, so that the error-bearing party could contest an outcome against a stated standard, and it changed the product so that spouses could share an account and build credit jointly. The model was not changed, but the workflow and the standing that surround it were. This is the only case in the casebook where the correction was exercised by the operator rather than imposed from outside, and the distinction is what made the episode end in learning rather than absorption.",
    },
    theMissingRecord:
      "A standing register entry for credit-limit decisions: that an applicant may ask for reasons, that the reasons name the inputs that moved the limit, and that a reconsideration is answered within a deadline. STD-02 §8.1 and §8.5 describe a process the issuer built after the fact.",
    sources: [
      {
        label:
          "New York State Department of Financial Services, Report on Apple Card Investigation",
        href: "https://www.dfs.ny.gov/reports_and_publications/press_releases/pr202103231",
        kind: "regulator",
        date: "2021-03-23",
      },
    ],
  },
];

export const casesBySlug = new Map(cases.map((entry) => [entry.slug, entry]));

/** Verdict counts per variable across the casebook, for the matrix footer. */
export function verdictTally(
  entries: Case[] = cases,
): Record<StateVariableId, Record<Verdict, number>> {
  const tally = Object.fromEntries(
    stateVariables.map((variable) => [
      variable.id,
      { held: 0, drifted: 0, failed: 0 },
    ]),
  ) as Record<StateVariableId, Record<Verdict, number>>;
  for (const entry of entries) {
    for (const finding of entry.findings) {
      tally[finding.variable][finding.verdict] += 1;
    }
  }
  return tally;
}

/** The clause register on the standard's page; clauses are anchored there. */
export function clauseHref(ref: ClauseRef): string {
  const standard = standardsContent.standards.find(
    (entry) => entry.id === ref.standard,
  );
  return standard
    ? `/standards/${standard.slug}#clause-register`
    : "/standards";
}

/** The clause's obligation text from the register, for a title attribute. */
export function clauseObligation(ref: ClauseRef): string | undefined {
  return standardClauses[ref.standard]?.find(
    (clause) => clause.displayId === ref.clause,
  )?.obligation;
}
