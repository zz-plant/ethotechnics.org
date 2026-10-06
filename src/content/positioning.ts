/**
 * What the framework contributes to people who are already working on
 * adjacent problems, and where the real disagreements sit.
 *
 * The About page's lineage section answers "where the argument comes from."
 * This module answers the question the lineage cannot: what each neighboring
 * tradition, and each governance mechanism this framework does not replace,
 * can take from it. The About page summarizes it; the research note
 * /research/scholarly-crossings develops it with worked examples.
 *
 * Three audiences, one data module:
 * 1. Scholars who share the commitments (instruments).
 * 2. Governance thinkers who prefer a different mechanism (completions).
 * 3. The genuine counterpositions (adversaries).
 *
 * The convergence array states what the instruments have in common, and
 * embeddedPolitics states the political proposition each law carries, so the
 * engineering vocabulary is not mistaken for a retreat from politics.
 */

export type ArtifactLink = { label: string; href: string };

export type Instrument = {
  /** The tradition the scholar works in. */
  tradition: string;
  scholars: string;
  /** What the tradition establishes, in its own terms. */
  has: string;
  /** The instrument this site supplies for that value, named. */
  instrument: string;
  /** What the instrument adds to the tradition. */
  supplies: string;
  /** Where the instrument lives on this site. */
  links: ArtifactLink[];
};

export type Completion = {
  interlocutor: string;
  /** The mechanism they prefer, named. */
  mechanism: string;
  /** What Ethotechnics adds to it, without replacing it. */
  addition: string;
  /** What the addition makes testable. */
  testable: string;
};

export type Adversary = {
  position: string;
  /** Who holds it, by surname where the position is published. */
  representatives: string;
  /** The challenge to the framework, stated in the position's own terms. */
  challenge: string;
  /** What the framework must demonstrate for its case to stand. */
  demonstration: string;
  /** The empirical question that would settle the dispute. */
  question: string;
};

export type Convergence = {
  name: string;
  statement: string;
  question: string;
};

export type PoliticalTranslation = {
  numeral: string;
  /** The political proposition the law carries. */
  proposition: string;
};

export type Positioning = {
  id: string;
  title: string;
  permalink: string;
  published: string;
  staleAfter: string;
  /** What the research note is, for its intro section. */
  scope: string;
  /** Reading limits, stated as bullets on the note. */
  disclaimer: string[];
  sourcesNote: string;
};

export const positioning: Positioning = {
  id: "scholarly-crossings",
  title: "Scholarly crossings",
  permalink: "/research/scholarly-crossings",
  published: "2026-10-03",
  staleAfter: "2027-10",
  scope:
    "A dated research note mapping what Ethotechnics supplies to three audiences it does not command: scholars who already hold the values, governance thinkers who prefer a different mechanism, and the counterpositions that would make the framework unnecessary overhead if they are right.",
  disclaimer: [
    "Scholarly positions are stated in summary. Each summary is a reading of published work, and the cited traditions belong to their authors; where a pairing misstates a position, the correction changes the note, not the instrument.",
    "The worked examples are constructed scenarios set in a hospital. The records each example reads are ordinary: override logs, screen-flow timings, committee minutes, staffing rosters, edit queues.",
    "No worked example reports a measurement taken at a real institution. Where an example states a test, the test is specified, not run.",
    "The note is dated. It describes published positions as of the publication date and will age.",
  ],
  sourcesNote:
    "Positions are summarized from published books, articles, and public commentary by the scholars and commentators named. Instrument names, laws, glossary terms, and case scores are this site's.",
};

export const instruments: Instrument[] = [
  {
    tradition: "Power-sharing",
    scholars: "Danielle Allen",
    has: "A normative account of power-sharing: institutions are legitimate when they distribute the power to shape the decisions that bind people, not only the goods those decisions produce.",
    instrument: "Effective-power audit",
    supplies:
      "The measurement the norm needs: formal authority mapped against practical capacity, role by role, so that reconcentration can be detected while the constitution still reads as shared.",
    links: [
      { label: "Delegation audit", href: "/diagnostics/delegation-audit" },
      {
        label: "Corrective power, glossary",
        href: "/glossary/corrective-power",
      },
      {
        label: "Dependence without standing",
        href: "/research/theory/dependence-without-standing",
      },
    ],
  },
  {
    tradition: "Right to contest",
    scholars: "Margot Kaminski, Jennifer Urban",
    has: "A theory of the individual right to contest AI decisions, and of what the procedural promise in law needs before a contest can function.",
    instrument: "Corrigibility ladder",
    supplies:
      "The ladder that specifies the right: voice, hearing, review, state change, repair, structural change, with an efficacy gradient between the rungs. A contest that stops at hearing is a hearing, not correction.",
    links: [
      {
        label: "Corrective standing, glossary",
        href: "/glossary/corrective-standing",
      },
      {
        label: "STD-02 contestability and recourse",
        href: "/standards/std-02-contestability-recourse",
      },
      {
        label: "Exception learning",
        href: "/research/theory/exception-learning",
      },
    ],
  },
  {
    tradition: "Contestable AI",
    scholars: "Kars Alfrink, Neelke Doorn",
    has: "A design framework for keeping AI systems contestable across their lifecycle: what a system must be like for the people it decides about to condition, control, and contest it.",
    instrument: "Contestability-maintenance test",
    supplies:
      "The maintenance question the design framework leaves open: contestability depreciates as dependence grows, and nothing in the lifecycle reads the level. A design built for year one can be unusable by year five.",
    links: [
      { label: "Contestability, glossary", href: "/glossary/contestability" },
      { label: "Contestability eval suite", href: "/evals/contestability" },
      {
        label: "STD-02 contestability and recourse",
        href: "/standards/std-02-contestability-recourse",
      },
    ],
  },
  {
    tradition: "Reviewability",
    scholars: "Lee Cobbe, Jatinder Singh",
    has: "A sociotechnical account of reviewability: a decision is reviewable only where a reviewer with the access, competence, and duty to review it actually exists.",
    instrument: "Reviewability-to-action bridge",
    supplies:
      "The bridge from review to consequence: observability, reviewability, standing, state-changing authority, structural correction. A review that cannot change anything is documentation.",
    links: [
      { label: "Appeal paths", href: "/mechanisms/patterns/appeal-paths" },
      {
        label: "Standing mechanism, glossary",
        href: "/glossary/standing-mechanism",
      },
      { label: "Law VIII", href: "/standards/laws#law-viii" },
    ],
  },
  {
    tradition: "Oversight",
    scholars: "Samir Passi, Jatinder Singh",
    has: "A decomposition of oversight into knowledge, observation, control, and timely intervention: the capacities an oversight arrangement must contain to be real.",
    instrument: "Oversight depreciation model",
    supplies:
      "The time index those capacities lack. Oversight is read as O(t): what the arrangement contains at year one, and what five years of reliable automation leave of it.",
    links: [
      {
        label: "Oversight horizon, glossary",
        href: "/glossary/oversight-horizon",
      },
      {
        label: "Meaningful-control eval suite",
        href: "/evals/meaningful-control",
      },
      {
        label: "The human subsidy",
        href: "/research/theory/the-human-subsidy",
      },
    ],
  },
  {
    tradition: "Meaningful human control",
    scholars: "Juri Santoni de Sio, Jeroen van den Hoven",
    has: "The tracking and tracing conditions: a system is meaningfully controlled when its behavior tracks a human's moral decision and its outcomes trace to a human who could have acted differently.",
    instrument: "Effective-control test",
    supplies:
      "The conditions as a test rather than a list: formal control, information, competence, and intervention feasibility, all of them required. Any one missing, and the control is not meaningful, however complete the approval chain.",
    links: [
      {
        label: "Meaningful-control eval suite",
        href: "/evals/meaningful-control",
      },
      {
        label: "Delegated agency, glossary",
        href: "/glossary/delegated-agency",
      },
      {
        label: "The sovereign override",
        href: "/research/theory/the-sovereign-override",
      },
    ],
  },
  {
    tradition: "Moral crumple zones",
    scholars: "Madeleine Clare Elish",
    has: "The diagnosis that responsibility for an automated failure collapses onto the operator nearest the point of failure, while control sat elsewhere.",
    instrument: "Power-responsibility matrix",
    supplies:
      "The matrix that makes the mismatch legible before the failure: six variables — capability, authority, evidence, dependency, standing, correction — mapped separately for each role, so the single verdict of human error cannot absorb them.",
    links: [
      { label: "Crumple zone, glossary", href: "/glossary/crumple-zone" },
      { label: "Insulation", href: "/research/theory/insulation" },
      { label: "The casebook", href: "/casebook" },
    ],
  },
  {
    tradition: "Resilience engineering",
    scholars: "David Woods",
    has: "Adaptive capacity theory: systems stay safe on the spare capacity people spend absorbing surprises, and that capacity is finite and usually invisible until it is gone.",
    instrument: "Reserve accounting",
    supplies:
      "The capacity as an account: consumed on one side, regenerated on the other. It separates resilience from performance purchased by depletion — a system can meet every target on a reserve it is not refilling.",
    links: [
      {
        label: "The consumption of adaptive capacity",
        href: "/research/theory/the-consumption-of-adaptive-capacity",
      },
      {
        label: "Adaptive capacity, glossary",
        href: "/glossary/adaptive-capacity",
      },
      {
        label: "Rescue register",
        href: "/mechanisms/patterns/rescue-register",
      },
    ],
  },
  {
    tradition: "Administrative burden",
    scholars: "Pamela Herd, Donald Moynihan",
    has: "Measurement of the learning, compliance, and psychological costs a process imposes on the people it serves, and the finding that burden is a policy choice.",
    instrument: "Compensated-performance accounting",
    supplies:
      "The decomposition that turns burden measurement on the institution's own numbers: observed performance separates into intrinsic performance and compensatory human work, P_obs = C_des + H_comp. A system that meets its targets on unrecorded compensatory work is not performing better. It is moving the cost.",
    links: [
      {
        label: "Compensated performance, glossary",
        href: "/glossary/compensated-performance",
      },
      {
        label: "Burden dashboards",
        href: "/mechanisms/patterns/burden-dashboards",
      },
      {
        label: "What outcomes hide",
        href: "/research/theory/what-outcomes-hide",
      },
    ],
  },
];

export const completions: Completion[] = [
  {
    interlocutor: "Adam Thierer",
    mechanism: "Permissionless innovation",
    addition:
      "Dependency theory. Permission to experiment is not permission to accumulate irreversible dependency. A deployment's dependency profile — switching cost, substitution difficulty, who bears its errors — is a separate variable from the permission that authorized it, and it changes while the permission does not.",
    testable:
      "Whether an authorization measured its dependency and not only its permissions, and whether the dependency measured at launch still matches the dependency today.",
  },
  {
    interlocutor: "Jennifer Huddleston",
    mechanism: "User sovereignty",
    addition:
      "An exit specification. Exit is a capacity, not a clause: it takes a substitutable service, portable data and history, a cost the user can pay, and a path that does not also exit the household's insurance, the child's school, or the job. That exit exists and that exit is usable are different claims.",
    testable:
      "The operational exit test: can a user leave within a stated time and cost, with data, history, and substitutes intact, and does anyone record how often users complete an exit?",
  },
  {
    interlocutor: "Neil Chilson",
    mechanism: "Open models",
    addition:
      "Institutional openness. An open artifact does not guarantee an open institutional future. Weights can stay downloadable while the practice consolidates: the fine-tuning pipeline, the evaluation suite, and the operating expertise concentrate in a few hands, and organizational optionality collapses with the license untouched.",
    testable:
      "A periodic count of independent operators: who outside the originating lab can run, evaluate, and adapt the artifact to production standard, and has that count moved since release?",
  },
  {
    interlocutor: "Daniel Castro",
    mechanism: "Benefit-cost analysis",
    addition:
      "Optionality accounting. The cost side of the ledger prices compliance but not depletion: the options a deployment forecloses — reversibility, substitution, later correction — are paid later, by other people, and so are never entered. Optionality accounting puts them on the ledger at authorization.",
    testable:
      "A cost line for foreclosed options in each regulatory impact analysis: what unwinding the system costs, who bears it, and whether that price was stated before deployment.",
  },
  {
    interlocutor: "Tyler Cowen",
    mechanism: "Industry self-regulation",
    addition:
      "A constitutional test for the self-regulatory body. It can discipline an industry only if it can obtain evidence independent of its members, protect challengers inside its firms, owe responses on a clock, and impose costs on a member the industry cannot replace.",
    testable:
      "Four records, held by the body: evidence obtained independently, challengers protected, responses delivered by their dates, and a sanction actually imposed on an indispensable member.",
  },
  {
    interlocutor: "Andrew Ng",
    mechanism: "Application-layer regulation",
    addition:
      "Delegation-layer governance. The boundary that matters is not model versus application but delegation structure: what the system decides, at what consequence, for whom, with what exposure, and what correction exists. A pipeline of innocuous components can be delegated into a decision no one can reverse.",
    testable:
      "For any regulated application: a delegation record covering the pipeline and not just the interface — who authorized it, at what consequence, with what exposure, and what correction exists.",
  },
  {
    interlocutor: "Dean Ball",
    mechanism: "Institutional adaptation",
    addition:
      "A failure criterion for adaptation. Adaptation is a prediction, and a prediction needs its failure condition named in advance. Adaptive capacity is a variable: an institution can adapt toward dependence on the very system it is supposed to discipline.",
    testable:
      "A published threshold at which adaptation is judged to have failed — oversight capacity falling below a floor while dependence rises — and who is obliged to act when it fires.",
  },
  {
    interlocutor: "Cary Coglianese",
    mechanism: "Management-based regulation",
    addition:
      "The political economy of the leash. A leash works only if the handler keeps expertise, independence, and the ability to pull. All three decay under prolonged reliable automation: the handler stops practicing judgment, the leash's funding becomes a line item in the system's budget, and pulling becomes the act that breaks a workflow everyone depends on.",
    testable:
      "The handler's three records: a dated exercise of independent judgment, a budget line the system's operator does not control, and the last pull — when it was made and what it changed.",
  },
];

export const adversaries: Adversary[] = [
  {
    position: "Markets and exit",
    representatives: "Thierer, Huddleston",
    challenge:
      "Users can see a bad system's failures and take their business elsewhere. Competition prices failure and forces correction without new bureaucracy, and exit is the consumer protection that needs no administrator.",
    demonstration:
      "Identifiable conditions under which exit stays formal while becoming unusable: switching costs the user does not control, data and history the user cannot take, and settings — employer systems, public benefits, a region's only hospital — where exit means exiting more than the product. The claim is not that exit fails everywhere. It is that exit's quality is a variable, and nobody measures it.",
    question:
      "For a system with measurable lock-in, how many of the people it decides about completed an exit in a year, what did exit cost them, and did any rule change because they left?",
  },
  {
    position: "Liability and existing law",
    representatives: "Thierer",
    challenge:
      "Courts, tort law, and existing statutes address harm when it occurs. Liability prices failure better than a regulator can anticipate it, and prior restraint should not precede the harm it guesses at.",
    demonstration:
      "Failure shapes the ex-post system cannot reach: harms that arrive in individually small units no lawyer takes, harms whose evidence is generated and held by the operator, and settlements that pay the plaintiff without touching the rule. Several cases in this site's casebook persisted for years under existing law; the 2020 exam-grades system was halted after four days.",
    question:
      "In each casebook case, what did litigation change in the rule, how long did that take, and how many people the system decided about never filed?",
  },
  {
    position: "Sectoral regulators and adaptive institutions",
    representatives: "Ball, Coglianese",
    challenge:
      "Existing institutions adapt. Management-based regulation — let the operator plan, verify, and document — outperforms fixed guardrails, because the operator knows the system and the sectoral regulator knows the sector.",
    demonstration:
      "A way to detect when the adapting institution loses its independence from what it adapts to: the regulator's expertise hired out of the industry it oversees, its evidence supplied by the operator, and its management plan authored by the party it would have to fault.",
    question:
      "Which regulator publishes a measure of its own capacity to halt a system it oversees — expertise, independent evidence, the last halt exercised — and what was that capacity at year five of its most depended-upon system?",
  },
  {
    position: "Democratic authorization",
    representatives:
      "The position that legislatures, courts, and administrative process are the correction",
    challenge:
      "A program is authorized, funded, and overseen through ordinary politics. If it misgoverns, the remedy is political: ministers, committees, elections. An individual right to contest each decision adds a second channel and dilutes the first.",
    demonstration:
      "That authorization for a program and correction for a decision can come apart. The legislature can authorize, defund, or abolish a scheme, and still leave no channel inside it that turns one person's harm into a change in the rule that produced the harm. Automated harm concentrates in exactly that gap, because the system makes thousands of decisions no legislature reviews.",
    question:
      "In the casebook's Robodebt entry, a tribunal ruled dozens of individual debts unlawful between 2017 and 2019 while the scheme ran. What channel available in 2017 would have carried any of those rulings to the rule, and how long did the surviving channel take?",
  },
  {
    position: "Transparency and reputation",
    representatives:
      "The disclosure-and-audit position: impact assessments, model cards, and published audits let publicity do the disciplining",
    challenge:
      "Institutions compelled to publish their governance will be disciplined by journalists, researchers, and procurement. Sunlight costs less than supervision, and it is workable under existing corporate and reputational pressure.",
    demonstration:
      "That publication without decision consequences is a stable state: documents produced for the file, metrics that improve while the underlying work moves onto unpaid labor, and audiences that read the disclosure without holding the standing to act on it.",
    question:
      "Since 2020, which published AI-governance artifact — a model card, an impact assessment, an audit — changed a decision right at an institution, and who held the standing that made the change?",
  },
];

export const convergence: Convergence[] = [
  {
    name: "The authority map",
    statement:
      "Formal authority and practical capacity, mapped separately, role by role. Where they diverge, power has reconcentrated without any change to the constitution.",
    question: "Who can actually do what the org chart says someone can?",
  },
  {
    name: "The correction distance",
    statement:
      "Voice, hearing, review, state change, repair, structural change: the rungs an individual correction can climb, and the efficacy gradient between them.",
    question: "How far up the ladder does one person's correction travel?",
  },
  {
    name: "Capacity depreciation",
    statement:
      "Oversight and corrective capacity read as a function of time under reliable automation, O(t), rather than as a property of the org chart.",
    question: "What does this arrangement's oversight contain at year five?",
  },
  {
    name: "The exit stress test",
    statement:
      "Reversal simulated, not asked about: halt the system, substitute the vendor, leave the service, and price the procedure in time, money, and who can authorize it.",
    question:
      "If this system had to be shut down this quarter, what would it take?",
  },
  {
    name: "Compensated-performance accounting",
    statement:
      "Observed performance decomposed into intrinsic performance and the compensatory human work that bridges the difference: P_obs = C_des + H_comp.",
    question:
      "How much of the reported number is work moved onto people the metric does not count?",
  },
];

export const embeddedPolitics: PoliticalTranslation[] = [
  {
    numeral: "I",
    proposition:
      "Ability does not create a right to rule. What a system can do is a fact about the system; what it may do is a decision someone has to make and renew.",
  },
  {
    numeral: "II",
    proposition:
      "Political authority is held on condition. A delegation that has stopped serving the people it was granted for must be renewed by them, not by its own momentum.",
  },
  {
    numeral: "III",
    proposition:
      "Power that cannot be argued against is not accountable power. Whoever holds authority must stay answerable to the evidence that would defeat it.",
  },
  {
    numeral: "IV",
    proposition:
      "Delegating a decision creates a debtor. Whoever is delegated owes the person decided about a working correction when the decision is wrong.",
  },
  {
    numeral: "V",
    proposition:
      "Once people cannot leave, a technical failure stops being an accident and becomes a governing event, so the decision to create dependence is itself a political decision.",
  },
  {
    numeral: "VI",
    proposition:
      "A right that exists on paper but costs more than the person can pay is not a right. Rights are measured by the price of exercising them.",
  },
  {
    numeral: "VII",
    proposition:
      "The people who bear a system's errors are owed a voice proportional to what they bear. Bearing the risk is the basis of the claim.",
  },
  {
    numeral: "VIII",
    proposition:
      "Being seen is not being heard. The obligation is not to publish failures but to let them change something.",
  },
  {
    numeral: "IX",
    proposition:
      "A supervisor without authority is an alibi. Naming a human in the loop distributes blame, not power.",
  },
  {
    numeral: "X",
    proposition:
      "Test the assembly that can hurt people, not the component that cannot. The unit of accountability is the system that decides, not the model that suggests.",
  },
  {
    numeral: "XI",
    proposition:
      "Success creates the dependence that demands supervision. The better a system works, the more its governance must grow, because success is what makes its failures structural.",
  },
  {
    numeral: "XII",
    proposition:
      "What can be contested must remain contestable. The power to change the rules of challenge is the first power that has to be limited.",
  },
];

export type MechanismColumn = {
  name: string;
  question: string;
  /** The framework's own cell is set apart visually. */
  own?: boolean;
};

export const mechanismColumns: MechanismColumn[] = [
  {
    name: "Markets",
    question:
      "After ten years of success, does competition still hold corrective power?",
  },
  {
    name: "Law",
    question:
      "After ten years of success, does the ruling still reach the rule?",
  },
  {
    name: "Management",
    question:
      "After ten years of success, does the manager still hold authority to correct?",
  },
  {
    name: "Technology",
    question:
      "After ten years, does the tool still let people correct the tool?",
  },
  {
    name: "This framework",
    question: "The same question, asked of its own instruments.",
    own: true,
  },
];
