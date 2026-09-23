import type {
  PageWithPermalink,
  PublicationMetadata,
  PublishedContent,
} from "./types";

export type DiagnosticMethodCards = {
  measures: string[];
  doesNotMeasure: string[];
  assumptions: string[];
};

export type DiagnosticMethodOverview = {
  inputs: string[];
  procedure: string[];
  outputs: string[];
};

export type DiagnosticInstrument = {
  prompts: string[];
  rubric: string[];
  scoringLogic: string[];
};

export type DiagnosticValidation = {
  pilotNotes: string;
  reliability: string;
  failureModes: string[];
};

export type DiagnosticReplicability = {
  runSteps: string[];
  exampleOutputs: string[];
};

export type DiagnosticTool = {
  slug: string;
  title: string;
  /** Measurement tier the tool reports at ("Belief level", "Evidence level"). */
  tier?: string;
  description: string;
  methodCards: DiagnosticMethodCards;
  methodOverview: DiagnosticMethodOverview;
  instrument: DiagnosticInstrument;
  validation: DiagnosticValidation;
  replicability: DiagnosticReplicability;
  bestFor: string;
  readiness: string[];
  outputs: string[];
  estimatedTime: string;
  prepChecklist: string[];
  studioNote?: string;
  ctaLabel: string;
  ctaHref: string;
  ctaAriaLabel?: string;
  exampleLabel: string;
  exampleHref: string;
  deliveryType: "self-serve" | "studio";
};

export type DiagnosticsContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    tools: DiagnosticTool[];
    valueProps: { title: string; description: string }[];
    facilitation: {
      title: string;
      description: string;
      steps: { title: string; detail: string }[];
      note: string;
    };
  };

export const diagnosticsContent: DiagnosticsContent = {
  pageTitle: "Diagnostics — Ethotechnics",
  pageDescription:
    "Pick a diagnostic, bring one question about a system you run, and leave with a readout you can check and rerun.",
  permalink: "/diagnostics",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-09-18T00:00:00Z",
  publication: {
    authors: [
      {
        name: "Ethotechnics Institute Diagnostics Lab",
        affiliation: "Ethotechnics Institute",
        email: "diagnostics@ethotechnics.org",
      },
    ],
    contact: "diagnostics@ethotechnics.org",
    published: "2025-12-03T00:00:00Z",
    updated: "2026-09-18T00:00:00Z",
    version: "v1.3.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/web/*/https://ethotechnics.org/diagnostics",
    changelog: [
      {
        version: "v1.3.0",
        date: "2026-09-18",
        summary:
          "Added the Corrective Debt Calculator, which prices the gap between action capacity and corrective capacity on two axes, with the absorption share and the workaround presumption as inputs.",
      },
      {
        version: "v1.2.0",
        date: "2026-09-06",
        summary:
          "Added the Delegation Audit, which walks one workflow through the six state variables.",
      },
      {
        version: "v1.1.0",
        date: "2026-01-09",
        summary:
          "Published method cards, transparency notes, and replicability guidance for each diagnostic.",
      },
      {
        version: "v1.0.0",
        date: "2025-12-03",
        summary: "Initial diagnostics suite release.",
      },
    ],
    license: {
      label: "CC BY 4.0",
      href: "https://creativecommons.org/licenses/by/4.0/",
    },
    attribution:
      "Credit the Ethotechnics Institute Diagnostics Lab, name the tool and its version, and link to the canonical permalink.",
  },
  valueProps: [
    {
      title: "One question per tool",
      description:
        "Each diagnostic answers one question about one system, so the readout stays short enough for an executive or a regulator to read in full.",
    },
    {
      title: "A readout with its own link",
      description:
        "Every tool produces a report at its own link, which you can send to leadership, a regulator, or a partner.",
    },
    {
      title: "Findings name the mechanism",
      description:
        "Each recommendation links to a mechanism in the library, so product, policy, and operations teams work from the same definition.",
    },
  ],
  facilitation: {
    title: "You bring the scenario. We help you reach the decision.",
    description:
      "Each session covers one question about one system. The scope stays that narrow so the session does not become a new process to maintain.",
    steps: [
      {
        title: "Frame the question",
        detail:
          "We define what a good answer looks like and what needs to be decided after the diagnostic.",
      },
      {
        title: "Run the tool together",
        detail:
          "You walk through prompts, inputs, and trade-offs while we map gaps and risks.",
      },
      {
        title: "Leave with a next step",
        detail:
          "You leave with a readout at its own link, the mechanisms it cites, and the next decision to make.",
      },
    ],
    note: "You need no prior relationship with the Institute to use a diagnostic. Every tool is licensed CC BY 4.0.",
  },
  tools: [
    {
      slug: "delegation-audit",
      title: "Delegation Audit",
      tier: "Belief level",
      description:
        "Walks a team through one workflow against the six state variables and returns an exposure score, the grants nobody can ground, and a reversibility verdict at three levels. Start here when you have no records to hand; use the Record Conformance Checker once you do.",
      methodCards: {
        measures: [
          "Whether each action class has an identifiable authorizer, evidence basis, and end condition.",
          "Exposure from dependency depth, substitution cost, and correction latency.",
          "Reversibility at the technical, operational, and institutional levels.",
        ],
        doesNotMeasure: [
          "It records what the team in the room believes. It does not verify any of it.",
          "It is not an audit. Nothing here is evidence, and no finding is a compliance verdict.",
          "An ungrounded grant is a finding to investigate, not a proven violation.",
        ],
        assumptions: [
          "The scope is one named workflow, not a whole system or product.",
          "Substitution cost and correction latency are stated in staff-weeks and hours.",
          "The people answering can name who authorized each action class, or admit that nobody can.",
        ],
      },
      methodOverview: {
        inputs: [
          "The name of one workflow the system takes part in.",
          "Each action class with its authorizer, evidence basis, affected people, and end condition.",
          "Dependents with criticality, substitution cost in staff-weeks, and correction latency in hours.",
          "Standing and correction answers: who bears errors, who answers, what can be stopped.",
        ],
        procedure: [
          "Walk the six state variables in order and answer in plain language.",
          "Read the exposure score with its three factors shown separately.",
          "Review the ungrounded grants and the reversibility ladder, weakest level first.",
          "Copy the readout or export the JSON snapshot for the record.",
        ],
        outputs: [
          "Exposure score in workflow staff-week hours with its three inputs.",
          "A rating per state variable with the reasons behind it.",
          "A list of ungrounded grants and a reversibility verdict at three levels.",
          "Findings linked to the STD-08 and STD-06 clause, the mechanism, and the eval suite.",
        ],
      },
      instrument: {
        prompts: [
          "What can this system do in this workflow, and is that list separate from what it may do?",
          "For each action class: who authorized it, on what evidence, for whom, and until when?",
          "Does the policy it applies have a review trigger and an expiry, and when was it last reviewed?",
          "What depends on this system, how long would the workflow take without it, and when was the alternative last run?",
          "Who bears the errors, can they raise one, who must answer, and by when?",
          "Can you stop it, can the institution keep functioning if you do, and does anyone still hold the expertise?",
        ],
        rubric: [
          "Grounded: 70 or above out of 100 on that state variable.",
          "Partial: 40 to 69.",
          "Weak: below 40.",
          "Reversibility at each level is evidenced, not evidenced, or not feasible. An unevidenced level is never recorded as feasible.",
        ],
        scoringLogic: [
          "Exposure score = dependency depth (count of high and critical dependents) x substitution cost (staff-weeks) x correction latency (hours).",
          "Authority = share of action classes with an authorizer (60) plus a weighted end-condition share (40).",
          "Evidence = share with an evidence basis (50) plus recency weight (30) plus policy trigger (10) plus policy expiry (10).",
          "The weakest reversibility level sets the verdict, and the institutional level breaks ties.",
        ],
      },
      validation: {
        pilotNotes:
          "Built against the STD-08 clauses and the STD-06 Article V dependency record so every finding maps to a clause that already exists.",
        reliability:
          "Answers are self-reported, so two teams describing the same workflow can score differently. Re-run it with the people who hold the answers rather than the people who own the system.",
        failureModes: [
          "Scoping the audit to a whole product instead of one workflow.",
          "Estimating substitution cost without having run the alternative.",
          "Recording an untested stop as working reversibility.",
          "Treating an ungrounded grant as a violation instead of an open question.",
        ],
      },
      replicability: {
        runSteps: [
          "Name one workflow and gather the people who know how it runs.",
          "Answer the six sections in order without skipping the blanks.",
          "Export the JSON snapshot and keep it with the safety case.",
          "Re-run after the next expansion decision and compare exposure scores.",
        ],
        exampleOutputs: [
          "Exposure score with dependency depth, substitution cost, and correction latency stated.",
          "Ungrounded grant list with the reason each grant is ungrounded.",
          "Reversibility verdict naming the weakest of the three levels.",
        ],
      },
      bestFor:
        "Teams who need to know whether a delegation still holds, not whether the model is accurate.",
      readiness: [
        "Run before an expansion decision, at renewal, or after an incident that a human was supposed to catch.",
        "Bring the person who authorized the system and the person who cleans up after it.",
      ],
      outputs: [
        "Exposure score with its three factors and the units on screen.",
        "Per-variable rating across capability, authority, evidence, dependency, standing, and correction.",
        "Ungrounded grants and a three-level reversibility verdict with the weakest level called out.",
      ],
      estimatedTime: "20-30 minutes",
      prepChecklist: [
        "One named workflow, not a system or a product.",
        "The list of actions the system takes in it.",
        "Who authorized each one, if anyone can be named.",
        "A rough count of staff-weeks to run the workflow without it.",
      ],
      ctaLabel: "Start the Delegation Audit",
      ctaHref: "/diagnostics/delegation-audit",
      ctaAriaLabel: "Start the Delegation Audit diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref:
        "https://github.com/zz-plant/ethotechnics.org/blob/main/docs/diagnostics-outputs.md#delegation-audit",
      deliveryType: "self-serve",
    },
    {
      slug: "record-conformance",
      title: "Record Conformance Checker",
      tier: "Evidence level",
      description:
        "Parses a stream of STD-07 delegation records, validates it against the schema, recomputes the hashes, and returns the conformance level it actually earns against the level its emitter declares. Reach for it when a system already emits records; the Delegation Audit covers the case where it does not.",
      methodCards: {
        measures: [
          "Whether every record validates against the published STD-07 schema.",
          "Whether the hashes recompute and the prior_hash chain links, so a removed or edited record shows.",
          "Whether beliefs, authorizations and actions state what would end them, and whether a discrepancy was ever answered inside its clock.",
          "Whether the emitter's own manifest agrees with its stream: the level it declares, and the record kinds it claims to emit.",
        ],
        doesNotMeasure: [
          "It cannot tell whether a belief was correct or an authorization wise. A stream does not contain that, and scoring it would make this the nominal safeguard it exists to catch.",
          "It reads what the records say about each other, not what the system did. A conforming log can describe a badly run institution.",
          "A dangling reference is usually a partial export, not a defect.",
        ],
        assumptions: [
          "The stream is the emitter's own output, exported whole rather than filtered.",
          "Clocks are judged against the export time, not against when the page is opened.",
          "The declared level is what the emitter publishes in its own manifest, read from the manifest itself when one is supplied.",
        ],
      },
      methodOverview: {
        inputs: [
          "A record stream as newline-delimited JSON, a JSON array, or an object with a records array.",
          "Optionally the emitter's manifest, whatever its shape: the declaration is found by its fields rather than by a fixed path.",
          "The conformance level the emitter declares, if it declares one.",
          "The moment to judge clocks against, defaulting to now.",
        ],
        procedure: [
          "Paste or load the stream. Nothing is uploaded; the audit runs in the page.",
          "Set the declared level so an overclaim can be contradicted.",
          "Read the findings blocking first, then the note-level observations.",
          "Copy the readout and keep it with whatever the emitter published.",
        ],
        outputs: [
          "The level the stream earns, and what holds it below the next one.",
          "Findings graded blocking, finding, or note, each citing the clause it comes from.",
          "The record ids each finding applies to.",
          "A contradiction when the declared level is higher than the earned level.",
        ],
      },
      instrument: {
        prompts: [
          "Does every record validate against the schema the standard publishes?",
          "Do the hashes recompute, and does each record chain to the one before it?",
          "Does every belief, authorization and action say what would end it?",
          "Was every discrepancy answered by a revision or an objection, inside the clock the record declared?",
          "Does every record say who has standing to object, and has an objection ever actually been accepted?",
          "Is the level the emitter declares the level this stream supports?",
        ],
        rubric: [
          "Level 0: every record validates, with as_of kept apart from recorded_at.",
          "Level 1: Level 0, and nothing edited — every record hashed, and chained through prior_hash.",
          "Level 2: Level 1, and beliefs, authorizations and actions carry invalidated_by, with every discrepancy answered inside its clock.",
          "Level 3: Level 2, and standing declared on every record, with at least one objection accepted and answered.",
        ],
        scoringLogic: [
          "Blocking: an invalid record, a hash that does not recompute, a broken chain, a discrepancy never answered, or a declared level above the earned one.",
          "Finding: an ungrounded grant, an answer that arrived after the clock, or records hashed but not chained.",
          "Note: a reference resolving outside the stream, a root record resting on nothing, or a condition with no clock to be judged against.",
          "The earned level is the highest whose requirements carry no blocking finding.",
        ],
      },
      validation: {
        pilotNotes:
          "Built against the two systems that emit the shape today, using the exported output of one of them as the worked example rather than a fixture written to pass.",
        reliability:
          "Deterministic. The same stream and the same as-of time give the same readout, because every check is mechanical and none of them asks for a judgement.",
        failureModes: [
          "Auditing a filtered export and reading the resulting chain break as tampering.",
          "Judging clocks against now rather than the export time, which fails a record for the reviewer's lateness.",
          "Reading a clean readout as evidence the institution is well run. It is evidence the log is well formed.",
          "Treating a note as a defect. Most notes are properties of the export, not of the system.",
        ],
      },
      replicability: {
        runSteps: [
          "Export the stream from the emitting system, whole rather than filtered.",
          "Load it here and set the level that system declares.",
          "Set the as-of time to the export time if any clock is close.",
          "Copy the readout and file it beside the emitter's own conformance claim.",
        ],
        exampleOutputs: [
          "Level 2 earned, Level 2 declared, and no blocking findings.",
          "Level 3 blocked because no objection appears in the stream, so acceptance from outside cannot be observed.",
          "A contradiction naming the earned level when the declaration is higher.",
        ],
      },
      bestFor:
        "Anyone holding a conformance claim they cannot currently check, including the team that published it.",
      readiness: [
        "Run it on your own stream before publishing a level, and on someone else's before relying on one.",
        "Re-run after any change to how records are serialized; a format can drift while every field stays right.",
      ],
      outputs: [
        "The earned conformance level and what blocks the next one.",
        "Findings by severity, each citing its clause and the records it applies to.",
        "A copyable readout to keep beside the emitter's declaration.",
      ],
      estimatedTime: "5 minutes",
      prepChecklist: [
        "A record stream exported from the system that emits it.",
        "The conformance level that system publishes, if any.",
        "The time the export was taken.",
      ],
      ctaLabel: "Open the Record Conformance Checker",
      ctaHref: "/diagnostics/record-conformance",
      ctaAriaLabel: "Open the Record Conformance Checker diagnostic tool",
      exampleLabel: "Read STD-07",
      exampleHref: "/standards/std-07-revisable-delegation-record",
      deliveryType: "self-serve",
    },
    {
      slug: "system-auditor",
      title: "System Audit & Guardrail Synthesizer",
      description:
        "Checks a system prompt or decision spec against 80+ governance failure modes, then drafts guardrail code and contract SLA clauses for each gap it finds.",
      methodCards: {
        measures: [
          "Exposure to Unearned Closure, Administrative Shame, and Dead-User Zones, as the glossary defines them.",
          "Numeric ceilings on time-to-halt (TTH) and on time to reverse a decision.",
          "Whether the system meets the temporal rights and recourse clauses of STD-01.",
        ],
        doesNotMeasure: [
          "Model token throughput or inference latency.",
          "Whether the training data was cleared for copyright.",
          "Jailbreaks that do not touch how decisions are governed.",
        ],
        assumptions: [
          "The prompt or spec you paste is what is actually deployed.",
          "The hazard tier you pick matches what the people affected stand to lose.",
          "Each decision changes some downstream state that someone can observe.",
        ],
      },
      methodOverview: {
        inputs: [
          "System prompt, policy rules, or workflow specification.",
          "Autonomy tier: advisory, semi-autonomous, or autonomous.",
          "Domain hazard tier: low, medium, high, or critical.",
        ],
        procedure: [
          "Match the text against the Ethotechnics structural failure classifiers.",
          "Compute numeric SLA bounds for halting and reversal.",
          "Generate guardrail middleware in TypeScript, Python, and JSON Schema.",
        ],
        outputs: [
          "A governance health score from 0 to 100 and a risk level.",
          "A card for each failure mode found, with a remedy for it.",
          "Guardrail code and contract clauses you can copy.",
        ],
      },
      instrument: {
        prompts: [
          "Paste a system prompt or load an industry preset.",
          "Pick the autonomy tier and the domain hazard tier.",
          "Review the breach vectors found and the SLA limits computed.",
        ],
        rubric: [
          "Critical: no route to contest a decision, or a denial that cannot be reversed.",
          "Elevated: the system closes cases on its own or shifts the burden onto the claimant.",
          "Low: the claimant confirms resolution and a rollback path is in active use.",
        ],
        scoringLogic: [
          "Start at 100 and subtract a weighted penalty for each failure vector found.",
        ],
      },
      validation: {
        pilotNotes:
          "Tested against customer support, clinical benefits triage, credit underwriting, and content moderation pipelines.",
        reliability:
          "Deterministic. Classification is rule-based across 80+ classes in the Ethotechnics failure taxonomy, so the same input gives the same result.",
        failureModes: [
          "Unearned Closure",
          "Dead-User Zones",
          "Administrative Shame",
          "Heroism-Dependent Systems",
        ],
      },
      replicability: {
        runSteps: [
          "Open the System Auditor.",
          "Pick a preset or paste your system prompt.",
          "Export the JSON receipt for the verified decision object.",
        ],
        exampleOutputs: [
          "Audit report as a JSON receipt.",
          "TypeScript Express/Fastify guardrail middleware.",
          "SLA clauses drafted for a contract.",
        ],
      },
      bestFor:
        "Engineers, compliance leads, and product architects designing an AI system whose decisions carry high stakes.",
      readiness: [
        "You have the system prompt or workflow spec in hand.",
        "You know how much autonomy the system is meant to have.",
        "You know which domain carries the main hazard.",
      ],
      outputs: [
        "A governance health score that recomputes as you change the inputs.",
        "A matrix of numeric SLA limits.",
        "Guardrail code written for production use.",
      ],
      estimatedTime: "5 minutes",
      prepChecklist: [
        "The system prompt or the decision policy document.",
        "How escalations and disputes are handled today.",
      ],
      ctaLabel: "Open the System Auditor",
      ctaHref: "/diagnostics/system-auditor",
      exampleLabel: "View methodology",
      exampleHref: "/standards/std-01-temporal-rights",
      deliveryType: "self-serve",
    },
    {
      slug: "burden-modeler",
      title: "Burden Modeler",
      description:
        "Scores task load, cognitive friction, and risk exposure across a workflow, and ranks the steps where toil piles up before people burn out.",
      methodCards: {
        measures: [
          "Task load volume across roles and handoffs.",
          "Cognitive friction introduced by tooling or policy complexity.",
          "Risk exposure across the workflow with weighted severity.",
        ],
        doesNotMeasure: [
          "Individual performance or productivity.",
          "Legal compliance posture or audit readiness.",
          "Long-term cultural or morale shifts beyond the scenario window.",
        ],
        assumptions: [
          "Inputs reflect what several functions agree on, not one person's view.",
          "Task volume estimates are directionally accurate for the period.",
          "Risk weights reflect the scenario’s actual severity bands.",
        ],
      },
      methodOverview: {
        inputs: [
          "Scenario name and primary workflow.",
          "Estimated task volume and handoff counts.",
          "Known friction points and escalation paths.",
        ],
        procedure: [
          "Weight task load, friction, and risk sliders with the scenario team.",
          "Review the computed burden index and hotspot ranking.",
          "Select mitigation paths and estimate relief impact.",
        ],
        outputs: [
          "Burden index score with plain-language findings.",
          "Ranked hotspot list with mitigation recommendations.",
          "Relief estimates tied to the selected mitigations.",
        ],
      },
      instrument: {
        prompts: [
          "Scenario name and workflow summary.",
          "Weekly task volume or queue size.",
          "Number of handoffs or escalation checkpoints.",
          "Friction rating (1–5) for key steps.",
          "Risk exposure rating (1–5) for each stage.",
        ],
        rubric: [
          "Task load, friction, and risk scored on 1–5 scales.",
          "Risk weights adjusted via criticality slider.",
        ],
        scoringLogic: [
          "Burden index = weighted average of load, friction, and risk.",
          "Hotspots rank by combined load and risk scores.",
          "Relief estimate computed from mitigations selected.",
        ],
      },
      validation: {
        pilotNotes:
          "Piloted across support, operations, and research scenarios to calibrate weights and language.",
        reliability:
          "Raters agree more after a shared calibration pass, and scores vary less on a second run.",
        failureModes: [
          "Over-weighting a single friction point can skew results.",
          "Underspecified task volume leads to low-confidence outputs.",
          "High uncertainty if scenario owners are not present for scoring.",
        ],
      },
      replicability: {
        runSteps: [
          "Gather scorers from more than one function.",
          "Use the prompt list and rubric to score the scenario.",
          "Record weighting decisions and rationale.",
          "Compare output against historical incidents for calibration.",
        ],
        exampleOutputs: [
          "Sample burden index readout with hotspots and relief estimates.",
          "Anonymized scenario summary and mitigation plan.",
        ],
      },
      bestFor:
        "Leaders who need a picture of workload before a team reaches burnout.",
      readiness: [
        "Run when leaders need to see how burden accumulates across roles or release cycles.",
        "Weight the inputs with the support and operations teams, who know where the friction is worst.",
      ],
      outputs: [
        "Burden index score with plain-language findings tied to your scenario.",
        "Ranked hotspots with mitigation paths and expected relief per action.",
        "A PDF summary to send to whoever approves the mitigations.",
      ],
      estimatedTime: "10–15 minutes",
      prepChecklist: [
        "Scenario name and primary workflow.",
        "Rough task volume or handoff counts.",
        "Known friction points or escalation paths.",
      ],
      ctaLabel: "Start the Burden Modeler",
      ctaHref: "/diagnostics/burden-modeler",
      ctaAriaLabel: "Start the Burden Modeler diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref:
        "https://github.com/zz-plant/ethotechnics.org/blob/main/docs/diagnostics-outputs.md#burden-modeler",
      deliveryType: "self-serve",
    },
    {
      slug: "maintenance-simulator",
      title: "Maintenance Simulator",
      description:
        "A tabletop exercise that plays through an outage, a maintenance window, or a handoff and shows where nobody owns the next step.",
      methodCards: {
        measures: [
          "Whether each outage and maintenance branch has a named owner.",
          "How fast an escalation can halt the system.",
          "Whether a communication cadence is set for each risk level.",
        ],
        doesNotMeasure: [
          "Actual system uptime or performance metrics.",
          "Incident response SLA compliance in production.",
          "Staffing coverage outside the simulated scenario.",
        ],
        assumptions: [
          "Scenario reflects likely outage or maintenance conditions.",
          "The people in the room hold the main escalation roles.",
          "The communication templates match current policy.",
        ],
      },
      methodOverview: {
        inputs: [
          "Scenario description and stress level.",
          "Escalation owners and the people who handle communications.",
          "Known dependencies and rollback paths.",
        ],
        procedure: [
          "Run tabletop branches for outage or maintenance.",
          "Log ownership, escalation, and timing decisions.",
          "Capture gaps and draft mitigation actions.",
        ],
        outputs: [
          "Scenario walkthrough with ownership gaps.",
          "Communication templates aligned to risk levels.",
          "Coverage and escalation summary for follow-up.",
        ],
      },
      instrument: {
        prompts: [
          "Scenario selection and risk level.",
          "Escalation owner confirmation.",
          "Rollback and communication template prompts.",
        ],
        rubric: [
          "Ownership clarity score (1–5).",
          "Escalation readiness score (1–5).",
          "Communication readiness score (1–5).",
        ],
        scoringLogic: [
          "Average readiness score across the three rubric areas.",
          "Flag any score ≤2 as a critical mitigation item.",
          "Summarize follow-ups by escalation owner.",
        ],
      },
      validation: {
        pilotNotes:
          "Piloted with operations and support teams to check that tabletop runs expose real coverage gaps.",
        reliability:
          "Facilitators reconcile their notes after each run. Agreement improves when everyone uses the same templates.",
        failureModes: [
          "Skipping escalation owners leads to incomplete coverage maps.",
          "Outdated communication templates skew readiness scores.",
          "Unrealistic scenarios understate actual risk.",
        ],
      },
      replicability: {
        runSteps: [
          "Select a scenario and risk level.",
          "Confirm the escalation owners and who handles communications.",
          "Run the tabletop and capture decisions in the log.",
          "Export the summary and send it to each escalation owner.",
        ],
        exampleOutputs: [
          "Maintenance run log with ownership notes.",
          "Communication template pack for a high-risk window.",
        ],
      },
      bestFor:
        "Operations leads rehearsing outage response and who owns each escalation.",
      readiness: [
        "Use during planning to settle coverage, escalation, and staffing with partner teams.",
        "Test appeal paths, safety valves, and service-level guarantees before launch.",
      ],
      outputs: [
        "Scenario runs with an owner, mitigation branches, and a time-to-halt expectation for each step.",
        "Communication templates mapped to risk levels, roles, and escalation routes.",
        "A coverage map showing each team's readiness gaps.",
      ],
      estimatedTime: "20–30 minutes",
      prepChecklist: [
        "Upcoming maintenance or outage scenario.",
        "A named escalation owner and a named communications lead.",
        "Known dependency or rollback risks.",
      ],
      ctaLabel: "Start the Maintenance Simulator",
      ctaHref: "/diagnostics/maintenance-simulator",
      ctaAriaLabel: "Start the Maintenance Simulator diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref:
        "https://github.com/zz-plant/ethotechnics.org/blob/main/docs/diagnostics-outputs.md#maintenance-simulator",
      deliveryType: "self-serve",
    },
    {
      slug: "maintenance-debt-calculator",
      title: "Maintenance Debt Calculator",
      description:
        "Scores decision speed, intervention readiness, and revenue exposure to estimate how much maintenance debt a system carries and what it could cost.",
      methodCards: {
        measures: [
          "Decision speed relative to escalation capacity.",
          "Intervention readiness and recovery coverage.",
          "Revenue exposed if the system takes an action nobody can stop.",
        ],
        doesNotMeasure: [
          "Exact financial outcomes or legal liability.",
          "Market share shifts unrelated to the incident.",
          "Individual or team performance accountability.",
        ],
        assumptions: [
          "Inputs reflect realistic ranges for the scenario.",
          "Revenue exposure estimates are directional, not audited.",
          "Intervention coverage mirrors current runbooks.",
        ],
      },
      methodOverview: {
        inputs: [
          "Decision speed band for the system.",
          "Intervention readiness and response window.",
          "Revenue exposure tier and recovery cost.",
        ],
        procedure: [
          "Score decision speed, readiness, and exposure.",
          "Calculate maintenance debt risk tier.",
          "Generate cost delta between uncontrolled and stoppable actions.",
        ],
        outputs: [
          "Maintenance debt score and tier.",
          "Estimated uncontrolled action cost range.",
          "A summary link to bring to budget discussions.",
        ],
      },
      instrument: {
        prompts: [
          "Decision speed band (milliseconds, seconds, minutes).",
          "Intervention readiness coverage.",
          "Escalation response window.",
          "Revenue exposure tier.",
        ],
        rubric: [
          "Decision speed scored on rapid / steady / deliberate.",
          "Readiness scored on limited / partial / comprehensive.",
          "Response window scored on under 5 minutes / 15–60 minutes / over 1 hour.",
          "Revenue exposure scored on low / medium / high.",
        ],
        scoringLogic: [
          "Total score combines speed, readiness, response window, and exposure.",
          "Debt tier mapped to score thresholds.",
          "Cost delta derived from exposure tier multiplied by debt factor.",
        ],
      },
      validation: {
        pilotNotes:
          "Calibrated with budget planning sessions and post-incident finance reviews.",
        reliability:
          "Scores stabilize once the scenario owners agree on exposure ranges and response windows.",
        failureModes: [
          "Overstated revenue exposure inflates cost deltas.",
          "Understated response windows hide readiness gaps.",
          "Outdated runbooks skew intervention readiness inputs.",
        ],
      },
      replicability: {
        runSteps: [
          "Collect decision speed and response window inputs.",
          "Confirm intervention readiness with operations leads.",
          "Estimate revenue exposure tier and recovery costs.",
          "Send the readout to finance or the governance team.",
        ],
        exampleOutputs: [
          "Maintenance debt scorecard with cost delta.",
          "A one-slide summary for the leadership budget review.",
        ],
      },
      bestFor:
        "Ethics leads and executives who need to state maintenance debt in the terms a budget is decided in.",
      readiness: [
        "Use before budgeting cycles to size safety engineering investment.",
        "Pair with incident retrospectives to calibrate exposure assumptions.",
      ],
      outputs: [
        "A maintenance debt tier stated in the terms a CFO uses.",
        "Estimated cost delta between uncontrolled and stoppable actions.",
        "A link to cite in budget and governance briefs.",
      ],
      estimatedTime: "10–12 minutes",
      prepChecklist: [
        "Decision speed estimates for the system.",
        "Runbook response window and escalation plan.",
        "Revenue exposure range or recovery cost estimate.",
      ],
      studioNote:
        "The studio can help turn a debt tier into funding scenarios.",
      ctaLabel: "Start the Maintenance Debt Calculator",
      ctaHref: "/diagnostics/maintenance-debt-calculator",
      ctaAriaLabel: "Start the Maintenance Debt Calculator diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref: "/diagnostics#output-baseline",
      deliveryType: "self-serve",
    },
    {
      slug: "corrective-debt-calculator",
      title: "Corrective Debt Calculator",
      description:
        "Prices the gap between an institution's capacity to act on people and its capacity to hear from them when it is wrong.",
      methodCards: {
        measures: [
          "How fast action capacity — decisions automated, data integrated, downstream dependence — compounded over the last year.",
          "Corrective capacity on its own axis: challenge intake, reversal latency, upstream revision, and workaround handling.",
          "The accumulated gap between the two, with its trajectory.",
        ],
        doesNotMeasure: [
          "Exact financial exposure or legal liability.",
          "Whether any single past decision was right or wrong.",
          "Model quality: retraining and accuracy are action capacity, not correction.",
        ],
        assumptions: [
          "Inputs describe the last twelve months, not the deployment plan.",
          "Corrective capacity is measured where challenges actually arrive, not where the org chart says they should.",
          "A recurring workaround is a presumption of upstream design failure, which the inputs treat as evidence.",
        ],
      },
      methodOverview: {
        inputs: [
          "Action-capacity growth band for the last year.",
          "How challenges and exceptions are received and answered.",
          "Reversal latency from challenge to restored state.",
          "Whether handled exceptions ever change the rule that produced them.",
          "Whether recurring workarounds are inventoried and reviewed.",
        ],
        procedure: [
          "Score action-capacity growth and each corrective-capacity component.",
          "Compute the corrective debt score and its trajectory.",
          "Estimate the absorption share: corrective effort that changed nothing upstream.",
        ],
        outputs: [
          "Corrective debt score and tier.",
          "Absorption share estimate.",
          "Debt trajectory: compounding, steady, or flat.",
        ],
      },
      instrument: {
        prompts: [
          "Action-capacity growth: compounding, steady, or flat over twelve months.",
          "Challenge intake: dedicated resourced team, shared inbox, or no route.",
          "Reversal latency: same day, days to weeks, unknown or unbounded.",
          "Upstream revision: never, occasionally, or regularly.",
          "Workaround register: inventoried and reviewed, informal only, or none.",
        ],
        rubric: [
          "Growth scored on compounding / steady / flat.",
          "Intake scored on none / shared inbox / dedicated team.",
          "Reversal scored on unbounded / days-to-weeks / same-day.",
          "Revision scored on never / occasionally / regularly.",
          "Workarounds scored on none / informal / inventoried.",
        ],
        scoringLogic: [
          "Each component contributes its band weight; the total normalizes to 0–100.",
          "Tiers: critical, high, moderate, low.",
          "Absorption share derives from intake, revision, and workaround bands.",
        ],
      },
      validation: {
        pilotNotes:
          "Calibrated against the casebook: the cases that scored worst on the six state variables also produce the highest debt bands here.",
        reliability:
          "Scores stabilize when the operator states correction staffing in numbers rather than intentions.",
        failureModes: [
          "Counting the appeals queue as corrective capacity when it resolves cases and changes nothing upstream.",
          "Reading workarounds as resilience and scaling the system on absorbed labor.",
          "Using model metrics — accuracy, retraining — as evidence of corrective capacity.",
        ],
      },
      replicability: {
        runSteps: [
          "Collect the growth band and the four corrective-capacity bands.",
          "State challenge volume and correction staffing for the same period.",
          "Run the calculator and record the tier with the absorption share.",
          "Re-run after any scope expansion and compare trajectories.",
        ],
        exampleOutputs: [
          "Corrective debt scorecard with tier and trajectory.",
          "Absorption share with the exception classes that produced it.",
        ],
      },
      bestFor:
        "Governance leads comparing what a system can do to people with what people can do back, before the next expansion decision.",
      readiness: [
        "Use before approving a scope expansion or an automation increase.",
        "Pair with the exception-learning eval to trace whether any challenge changed an upstream object.",
      ],
      outputs: [
        "Corrective debt tier with the gap stated on two axes.",
        "Absorption share estimate with its sources.",
        "A link to cite in the expansion review.",
      ],
      estimatedTime: "10–12 minutes",
      prepChecklist: [
        "Decision volume and automation growth for the last year.",
        "Challenge intake route, staffing, and reversal latency.",
        "The last time a handled exception changed an upstream rule.",
      ],
      studioNote:
        "The studio can help run the two-axis comparison and trace exception-to-revision paths.",
      ctaLabel: "Start the Corrective Debt Calculator",
      ctaHref: "/diagnostics/corrective-debt-calculator",
      ctaAriaLabel: "Start the Corrective Debt Calculator diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref: "/diagnostics#output-baseline",
      deliveryType: "self-serve",
    },
    {
      slug: "capacity-forecaster",
      title: "Technical Capacity Forecaster",
      description:
        "Projects how capacity decays over 24 months with and without remediation and refusal windows, and marks where the team would saturate.",
      methodCards: {
        measures: [
          "Projected capacity decay over a 24-month horizon.",
          "Impact of remediation timing on saturation risk.",
          "Effect of refusal windows on delivery throughput.",
        ],
        doesNotMeasure: [
          "Real-time operational performance or incident rates.",
          "Budget constraints outside the modeled inputs.",
          "External market or policy changes affecting demand.",
        ],
        assumptions: [
          "Baseline capacity is stable absent remediation.",
          "Refusal windows accurately represent pause periods.",
          "Remediation effects scale linearly over time.",
        ],
      },
      methodOverview: {
        inputs: [
          "Baseline capacity and delivery targets.",
          "Remediation timing and intensity.",
          "Refusal windows and recovery assumptions.",
        ],
        procedure: [
          "Model baseline and remediated trajectories.",
          "Compare saturation points across scenarios.",
          "Export a PDF summary with the saturation points marked.",
        ],
        outputs: [
          "Baseline vs. remediated capacity curves.",
          "Saturation risk marked at each decision point.",
          "A PDF snapshot of both projections.",
        ],
      },
      instrument: {
        prompts: [
          "Baseline capacity and decay rate.",
          "Remediation schedule and effect size.",
          "Refusal window timing and duration.",
        ],
        rubric: [
          "Capacity scales normalized to 0–100.",
          "Remediation impact scored as low/medium/high.",
        ],
        scoringLogic: [
          "Projected capacity = baseline - decay + remediation offsets.",
          "Saturation flagged when capacity drops below threshold.",
          "PDF summary generated from projection tables.",
        ],
      },
      validation: {
        pilotNotes:
          "Benchmarked against historical delivery timelines to calibrate decay and remediation curves.",
        reliability:
          "Scenario comparisons agree when the baseline data is consistent. Uncertain inputs widen the spread.",
        failureModes: [
          "Overly optimistic remediation inputs understate saturation.",
          "Incomplete refusal windows distort capacity troughs.",
          "Baseline data drift makes longitudinal comparisons unreliable.",
        ],
      },
      replicability: {
        runSteps: [
          "Collect baseline capacity and delivery targets.",
          "Input remediation timing and refusal windows.",
          "Run simulations for baseline and mitigation cases.",
          "Export the PDF summary and archive the inputs.",
        ],
        exampleOutputs: [
          "Capacity forecast PDF with saturation points marked.",
          "Scenario comparison table used in a portfolio review.",
        ],
      },
      bestFor:
        "Delivery leads deciding whether a long-term stability plan fits the capacity the team has.",
      readiness: [
        "Use when a delivery team needs to see what each remediation path costs in stability.",
        "Bring it to portfolio reviews to check refusal policies against operating capacity.",
      ],
      outputs: [
        "Side-by-side baseline and remediated capacity projections.",
        "A PDF export with saturation points marked, for the person who approves the plan.",
        "A scenario table that shows leadership what each timing choice gives up.",
      ],
      estimatedTime: "15–20 minutes",
      prepChecklist: [
        "Current capacity baseline or recent burn rates.",
        "Known remediation options or refusal windows.",
        "The person who will read the PDF and decide on the plan.",
      ],
      ctaLabel: "Start the Technical Capacity Forecaster",
      ctaHref: "/diagnostics/capacity-forecaster",
      ctaAriaLabel: "Start the Technical Capacity Forecaster diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref:
        "https://github.com/zz-plant/ethotechnics.org/blob/main/docs/diagnostics-outputs.md#technical-capacity-forecaster",
      deliveryType: "self-serve",
    },
  ],
};
