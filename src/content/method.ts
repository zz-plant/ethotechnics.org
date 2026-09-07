export type MethodLink = { label: string; href: string };

export type ChainStage = {
  id: string;
  title: string;
  question: string;
  currentAssets: string[];
  links: MethodLink[];
};

export type StateVariable = {
  state: string;
  question: string;
  drift: string;
  lawRefs: string;
};

export type Law = {
  numeral: string;
  statement: string;
  href: string;
};

/**
 * A lens is applied at the Consequence stage, to make the burden a decision
 * places on people visible before the chain reaches Challenge. Each carries a
 * worked example, because the lenses are unusable as abstractions.
 */
export type Lens = {
  id: string;
  title: string;
  question: string;
  example: string;
};

export type SequenceStep = { title: string; detail: string };

export type MethodContent = {
  pageTitle: string;
  pageDescription: string;
  permalink: string;
  definition: string;
  claim: string;
  unitOfGovernance: string;
  invariant: string;
  chain: ChainStage[];
  stateVariables: StateVariable[];
  laws: Law[];
  lenses: Lens[];
  applicationSequence: SequenceStep[];
  optimizationProblem: string;
};

export const methodContent: MethodContent = {
  pageTitle: "The Ethotechnics Method: Engineering Delegated Intelligence",
  pageDescription:
    "The canonical statement of the method: the seven-stage chain every consequential decision follows, the six state variables that must stay coupled, and the twelve laws the standards bind.",
  permalink: "/method",
  definition:
    "Ethotechnics is the engineering discipline concerned with keeping authority, evidence, capability, consequence, and correction coupled tightly enough that increasing machine agency does not silently become unreviewable institutional power.",
  claim:
    "The primary object being engineered is not the model. It is the delegation of consequential agency. The question is not whether the model is capable, aligned, or safe. It is whether the delegation itself remains valid as the system acts, learns, scales, and becomes depended upon.",
  unitOfGovernance:
    "The unit of governance is the consequential decision and the delegation that produced it. Models, agents, humans, APIs, rules engines, policies, and databases are components of the machinery. Nothing in the method depends on which component made the decision, so its primitives are substrate-independent.",
  invariant:
    "No system may accumulate consequential agency faster than the institution accumulates the capacity to inspect, challenge, revise, and survive its decisions.",
  chain: [
    {
      id: "evidence",
      title: "Evidence",
      question: "What propositions justify letting this system act at all?",
      currentAssets: [
        "Evidence packs for STD-01, STD-02, and STD-06",
        "evidence_refs on the decision record",
        "STD-06 Human Impact Safety Case",
        "Burden Concealment evals",
        "STD-07 belief records, with what they rest on and what would invalidate them",
        "STD-08 Part B: the policies a grant rests on are records with provenance, review triggers, and an expiry, and an expired policy stops justifying the grant",
        "Record Conformance Checker: grades whether an exported record stream states what would invalidate its beliefs",
      ],
      links: [
        { label: "Evidence packs", href: "/evidence-packs" },
        { label: "Eval suites", href: "/evals" },
        {
          label: "STD-07 Revisable Delegation Record",
          href: "/standards/std-07-revisable-delegation-record",
        },
        { label: "STD-08 Delegation", href: "/standards/std-08-delegation" },
        {
          label: "Record Conformance Checker",
          href: "/diagnostics/record-conformance",
        },
      ],
    },
    {
      id: "authority",
      title: "Authority",
      question:
        "Which actions is the system permitted to perform, for whom, and until when?",
      currentAssets: [
        "stop_override_authority, autonomy_level, and action_classes on the agent safety object model",
        "MEC-03 rollback authority",
        "Glossary: design-authority, decision-reversal-authority, permission-surface, human-override-lanes",
        "STD-07 Article II: every action names the authorization it ran under, and a delegation with no revocation conditions is a transfer",
        "STD-08 Part A: a grant is a lease, renewal states its evidence in advance, and widening scope is a new authorization",
        "Delegation Audit: names the action classes nobody can ground in a grant",
      ],
      links: [
        {
          label: "STD-07 Revisable Delegation Record",
          href: "/standards/std-07-revisable-delegation-record",
        },
        { label: "STD-08 Delegation", href: "/standards/std-08-delegation" },
        {
          label: "Delegation Audit",
          href: "/diagnostics/delegation-audit",
        },
        {
          label: "Permission surface explainer",
          href: "/explainers/permission-surface",
        },
        { label: "Glossary", href: "/glossary" },
      ],
    },
    {
      id: "decision",
      title: "Decision",
      question: "What was decided, on what record, and with what dissent?",
      currentAssets: [
        "Decision record schema and /api/decisions",
        "Agent receipt schema",
        "MEC-01 decision log with dissent",
        "STD-07 action records, pinned to their authorization",
      ],
      links: [
        {
          label: "MEC-01 Decision log",
          href: "/mechanisms/patterns/decision-log",
        },
        {
          label: "STD-07 Revisable Delegation Record",
          href: "/standards/std-07-revisable-delegation-record",
        },
      ],
    },
    {
      id: "consequence",
      title: "Consequence",
      question: "Who carries the burden of this decision, and for how long?",
      currentAssets: [
        "Burden hours schema",
        "Burden modeler, capacity forecaster, maintenance simulator",
        "The three lenses, in the method",
        "STD-01 Temporal Bill of Rights clocks",
      ],
      links: [
        {
          label: "STD-01 Temporal rights",
          href: "/standards/std-01-temporal-rights",
        },
        { label: "Diagnostics", href: "/diagnostics" },
        { label: "The three lenses", href: "/method#lenses" },
      ],
    },
    {
      id: "challenge",
      title: "Challenge",
      question: "Who can contest the decision, and with what procedural force?",
      currentAssets: [
        "STD-02 Contestability and Recourse",
        "Minimum viable contestability: standing, reasons, records, timelines, remedies, non-retaliation",
        "Appeal event schema",
        "MEC-06 appeal paths and MEC-08 contestation APIs",
      ],
      links: [
        {
          label: "STD-02 Contestability",
          href: "/standards/std-02-contestability-recourse",
        },
        {
          label: "Minimum viable contestability",
          href: "/standards/minimum-viable-contestability",
        },
        { label: "Appeal paths", href: "/mechanisms/patterns/appeal-paths" },
        {
          label: "Contestation APIs",
          href: "/mechanisms/patterns/contestation-apis",
        },
        {
          label: "STD-07 Revisable Delegation Record",
          href: "/standards/std-07-revisable-delegation-record",
        },
      ],
    },
    {
      id: "reconsideration",
      title: "Reconsideration",
      question:
        "Does the delegation still deserve to stand once challenged or once the facts change?",
      currentAssets: [
        "Pause and reversal schema",
        "decision.deadline.reminder and appeal.deadline.breached events",
        "MEC-11 escalation SLAs",
        "STD-07 discrepancy handling: silence past the clock is a governance failure, not a pending state",
        "STD-08 §2.3 and §2.4: a fired review trigger moves the policy and every grant that cites it into review_required",
        "Record Conformance Checker: reports discrepancies that were never answered inside their clock",
      ],
      links: [
        {
          label: "Escalation SLAs",
          href: "/mechanisms/patterns/escalation-slas",
        },
        {
          label: "STD-07 Revisable Delegation Record",
          href: "/standards/std-07-revisable-delegation-record",
        },
        { label: "STD-08 Delegation", href: "/standards/std-08-delegation" },
        {
          label: "Record Conformance Checker",
          href: "/diagnostics/record-conformance",
        },
      ],
    },
    {
      id: "correction",
      title: "Correction",
      question:
        "Can the institution actually stop, reverse, or repair, at acceptable cost?",
      currentAssets: [
        "Repair SLA schema and /api/repairs",
        "MEC-10 reversibility audit logs",
        "MEC-12 stoppability testing",
        "Tier 1 harness: stop, override, audit completeness",
        "STD-08 Part D: correction capacity is stated across seven components and must grow when authority does",
        "Delegation Audit: a reversibility verdict at the technical, operational, and institutional levels",
      ],
      links: [
        { label: "STD-08 Delegation", href: "/standards/std-08-delegation" },
        {
          label: "Delegation Audit",
          href: "/diagnostics/delegation-audit",
        },
        { label: "Kill switch", href: "/mechanisms/patterns/kill-switch" },
        {
          label: "Reversibility audit logs",
          href: "/mechanisms/patterns/reversibility-audit-logs",
        },
        {
          label: "Stoppability testing",
          href: "/mechanisms/patterns/stoppability-testing",
        },
      ],
    },
  ],
  stateVariables: [
    {
      state: "Capability",
      question: "What can the assembled system actually do?",
      drift: "Capability outruns authority",
      lawRefs: "Law I",
    },
    {
      state: "Authority",
      question:
        "Which actions is it currently permitted to perform, for whom, until when?",
      drift: "Authority outlives evidence",
      lawRefs: "Laws II, III",
    },
    {
      state: "Evidence",
      question: "What propositions justify that authority?",
      drift: "Policy detaches from reality",
      lawRefs: "Law III",
    },
    {
      state: "Dependency",
      question: "How difficult would withdrawal or substitution now be?",
      drift: "Dependence outruns correction",
      lawRefs: "Laws V, XI",
    },
    {
      state: "Standing",
      question:
        "Who can challenge which decisions or delegations, with what procedural force?",
      drift: "Exposure grows without standing",
      lawRefs: "Law VII",
    },
    {
      state: "Correction",
      question:
        "Which interventions remain technically, operationally, institutionally feasible?",
      drift: "Observability grows without control",
      lawRefs: "Laws VIII, IX, XII",
    },
  ],
  laws: [
    {
      numeral: "I",
      statement: "Capability does not imply authority",
      href: "/standards/laws#law-i",
    },
    {
      numeral: "II",
      statement: "Authority decays unless its justification is renewed",
      href: "/standards/laws#law-ii",
    },
    {
      numeral: "III",
      statement: "Evidence and authority must remain coupled",
      href: "/standards/laws#law-iii",
    },
    {
      numeral: "IV",
      statement:
        "Every consequential delegation creates a correction obligation",
      href: "/standards/laws#law-iv",
    },
    {
      numeral: "V",
      statement: "Dependence converts technical risk into structural risk",
      href: "/standards/laws#law-v",
    },
    {
      numeral: "VI",
      statement: "Nominal reversibility is not operational reversibility",
      href: "/standards/laws#law-vi",
    },
    {
      numeral: "VII",
      statement:
        "Error-bearing parties require standing proportional to exposure",
      href: "/standards/laws#law-vii",
    },
    {
      numeral: "VIII",
      statement: "Observability without state transition is theater",
      href: "/standards/laws#law-viii",
    },
    {
      numeral: "IX",
      statement:
        "Human oversight is a control only if the human can alter system state",
      href: "/standards/laws#law-ix",
    },
    {
      numeral: "X",
      statement:
        "The relevant eval sits at the highest layer where harm can emerge",
      href: "/standards/laws#law-x",
    },
    {
      numeral: "XI",
      statement: "Successful automation increases its own governance burden",
      href: "/standards/laws#law-xi",
    },
    {
      numeral: "XII",
      statement: "No system may erase the conditions of its own contestability",
      href: "/standards/laws#law-xii",
    },
  ],
  lenses: [
    {
      id: "burden-accounting",
      title: "Burden accounting",
      question:
        "What hidden labor does this decision create — triage, rework, apology loops, policy exceptions — and who performs it?",
      example:
        "A health plan's AI triage tool misroutes 12% of prior auths. Nurses spend 90 minutes per shift re-routing them. That is 7.5 hours of unpaid care-time per week per nurse, and it appears in no budget.",
    },
    {
      id: "infrastructure-dignity",
      title: "Infrastructure dignity",
      question:
        "Does the system preserve operator agency and user recourse under pressure, or only when nothing is going wrong?",
      example:
        "A clinical chatbot gives a wrong dosing recommendation. The nurse cannot override it without calling a supervisor who is in a meeting. The lens asks where the override is, and whether the operator can reach it in thirty seconds.",
    },
    {
      id: "care-time-economics",
      title: "Care-time economics",
      question:
        "What is being traded between shipping velocity and long-term maintenance extraction, and was the trade visible to anyone before it was made?",
      example:
        "Engineering ships a model update that cuts false positives by 3% and adds 45 minutes of daily review work for the care management team. The lens asks whether that second number existed before the deploy.",
    },
  ],
  applicationSequence: [
    {
      title: "Select a workflow",
      detail:
        "Choose a process where system decisions affect people: triage, prior authorization, customer escalation.",
    },
    {
      title: "Map burden by role",
      detail:
        "Follow one decision from initiation to resolution. Document every point where a person compensates for or overrides the system.",
    },
    {
      title: "Apply one lens",
      detail:
        "Choose the lens that fits the pressure point in the workflow. One lens at a time; three at once produces a report nobody acts on.",
    },
    {
      title: "Share the analysis",
      detail:
        "Present it to someone who can change the workflow. The pattern is sized to communicate in a single conversation.",
    },
  ],
  optimizationProblem:
    'The optimization problem is not "how autonomous can the system safely become?" but "how much authority can be delegated without degrading the institution\'s ability to revise that delegation later?"',
};
