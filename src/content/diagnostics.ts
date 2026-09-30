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
    "Self-serve diagnostics that take one workflow, record stream, or set of figures and return a scored readout you can link, copy, or export.",
  permalink: "/diagnostics",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-09-29T00:00:00Z",
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
    updated: "2026-09-29T00:00:00Z",
    version: "v1.4.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/web/*/https://ethotechnics.org/diagnostics",
    changelog: [
      {
        version: "v1.4.0",
        date: "2026-09-29",
        summary:
          "Added two optional context questions to the corrective capacity self-assessment: who holds authority over the conditions that produce workarounds, and whether the institution has priced a fix. They record a possible conflict of interest and do not change the score.",
      },
      {
        version: "v1.3.0",
        date: "2026-09-18",
        summary:
          "Added a self-assessment of action-capacity growth, challenge intake, reversal, revision, and workarounds using fixed categorical weights.",
      },
      {
        version: "v1.2.0",
        date: "2026-09-06",
        summary:
          "Added the Delegation Audit, which takes one workflow through six questions.",
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
      label: "CC BY-SA 4.0",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    attribution:
      "Credit Ethotechnics Institute Diagnostics Lab, include tool name + version, and link to the canonical permalink.",
  },
  valueProps: [
    {
      title: "One question per tool",
      description:
        "Each diagnostic answers one question about one workflow, and its method card states what it does not measure.",
    },
    {
      title: "A readout you can file",
      description:
        "Every tool returns a readout you can link, copy, or export and keep with the decision it informed.",
    },
    {
      title: "Named mechanisms",
      description:
        "Recommendations use the mechanism names from the library, so the team that acts on a finding and the team that reviews it use the same terms.",
    },
  ],
  facilitation: {
    title: "You bring one scenario and the decision it feeds.",
    description:
      "A facilitated session covers one scenario. It ends when the decision it was framed around has an answer or a named blocker.",
    steps: [
      {
        title: "Frame the question",
        detail:
          "We agree what a usable answer looks like and which decision it feeds.",
      },
      {
        title: "Run the tool together",
        detail:
          "You answer the prompts and supply the inputs. We record each gap and who owns it.",
      },
      {
        title: "Leave with a next step",
        detail:
          "You leave with a linkable readout, the mechanisms it cites, and one named next step.",
      },
    ],
    note: "Every diagnostic runs without a prior relationship, and the Institute publishes each one under CC BY-SA 4.0.",
  },
  tools: [
    {
      slug: "delegation-audit",
      title: "Delegation Audit",
      tier: "Belief level",
      description:
        "Walks a team through one workflow against six questions and returns an exposure score, the permissions nobody can justify, and whether its decisions can be undone. Start here when the system keeps no decision records yet; use the Record Conformance Checker once it does.",
      methodCards: {
        measures: [
          "Whether each action class has an identifiable authorizer, evidence basis, and end condition.",
          "Exposure from dependency depth, substitution cost, and correction latency.",
          "Reversibility at the technical, operational, and institutional levels.",
        ],
        doesNotMeasure: [
          "It records what the team in the room believes. It does not verify any of it.",
          "It is not an audit. Nothing here is evidence, and no finding is a compliance verdict.",
          "A permission nobody can justify is a finding to investigate, not a proven violation.",
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
          "Answer the six questions in order, in plain language.",
          "Read the exposure score with its three factors shown separately.",
          "Review the permissions nobody can justify, then the three reversibility levels, weakest first.",
          "Copy the readout or export the JSON snapshot for the record.",
        ],
        outputs: [
          "Exposure score in workflow staff-week hours with its three inputs.",
          "A rating for each of the six questions, with the reasons behind it.",
          "A list of permissions nobody can justify, and whether decisions can be undone at three levels: technical, operational, and institutional.",
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
          "Grounded: 70 or above out of 100 on that question.",
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
          "Treating a permission nobody can justify as a violation instead of an open question.",
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
          "List of permissions nobody can justify, with the reason for each.",
          "Reversibility verdict naming the weakest of the three levels.",
        ],
      },
      bestFor:
        "Teams who need to know whether the system's permission to decide is still justified, not whether the model is accurate.",
      readiness: [
        "Run before an expansion decision, at renewal, or after an incident that a human was supposed to catch.",
        "Bring the person who authorized the system and the person who cleans up after it.",
      ],
      outputs: [
        "Exposure score with its three factors and the units on screen.",
        "A rating for each of capability, authority, evidence, dependency, standing (who can challenge a decision), and correction.",
        "Permissions nobody can justify, and a reversibility verdict at three levels with the weakest called out.",
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
        "Reads a system's STD-07 decision records, checks them against the schema, recomputes the hashes, and compares the conformance level the records earn with the level the system claims. Use it when a system already produces records; use the Delegation Audit when it does not.",
      methodCards: {
        measures: [
          "Whether every record validates against the published STD-07 schema.",
          "Whether the hashes recompute and the prior_hash chain links, so a removed or edited record shows.",
          "Whether beliefs, authorizations and actions state what would end them, and whether a discrepancy was ever answered inside its clock.",
          "Whether the emitter's own manifest agrees with its stream: the level it declares, and the record kinds it claims to emit.",
        ],
        doesNotMeasure: [
          "It cannot tell whether a belief was correct or an authorization wise. A stream does not contain that, and scoring it anyway would make this tool the safeguard-on-paper it exists to catch.",
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
          "Does every record say who has standing to object, and has an objection ever been accepted?",
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
      slug: "burden-modeler",
      title: "Burden Modeler",
      description:
        "Rate seven sources of workload, such as interruptions, handoffs, and incidents. Get a burden score out of 100 and the three places where reducing load would help most.",
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
          "Inputs reflect cross-functional consensus, not a single point of view.",
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
          "Rate each driver with the people who carry the work.",
          "Read the burden index and the hotspot ranking.",
          "Pick mitigations and read the relief estimate for each.",
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
          "A rating from 0 to 10 for each of seven drivers: interruptions, handoffs, tooling, runbooks, incidents, coverage, and decision debt.",
        ],
        rubric: [
          "Each driver carries a fixed weight, from 1.0 for decision debt to 1.4 for interruptions.",
          "Drivers roll up into three categories: task load, cognitive friction, and risk exposure.",
        ],
        scoringLogic: [
          "Burden index = weighted sum of the ratings over the maximum possible, as a score out of 100. Below 35 is Healthy, below 70 is Watch, and 70 or more is Overloaded.",
          "Hotspots are the three drivers with the highest weighted scores.",
          "Each driver shows a relief estimate, scaled from its rating and weight and capped at 30 points.",
        ],
      },
      validation: {
        pilotNotes:
          "Driver weights are fixed in the tool, from 1.0 for decision debt to 1.4 for interruptions. Change them only in the source, where the change is visible.",
        reliability:
          "Ratings are self-reported, so two groups rating the same workflow can score it differently. Rate together and record the reason for each rating.",
        failureModes: [
          "Over-weighting a single friction point can skew results.",
          "Underspecified task volume leads to low-confidence outputs.",
          "High uncertainty if scenario owners are not present for scoring.",
        ],
      },
      replicability: {
        runSteps: [
          "Gather a cross-functional scoring group.",
          "Use the prompt list and rubric to score the scenario.",
          "Record weighting decisions and rationale.",
          "Check the hotspots against the incidents the team has already had.",
        ],
        exampleOutputs: [
          "Sample burden index readout with hotspots and relief estimates.",
          "Anonymized scenario summary and mitigation plan.",
        ],
      },
      bestFor:
        "Leads who need to see where workload concentrates before a team runs past its capacity.",
      readiness: [
        "Run when burden is rising across roles or release cycles and nobody has named where.",
        "Rate with the support and operations staff who handle the escalations.",
      ],
      outputs: [
        "Burden index score with plain-language findings tied to your scenario.",
        "Ranked hotspots with mitigation paths and expected relief per action.",
        "JSON export of the index, hotspots, and mitigations.",
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
      slug: "corrective-debt-calculator",
      title: "Corrective capacity self-assessment",
      description:
        "Scores five self-reported answers: how fast the system's reach grew, how challenges are received, how fast decisions are reversed, whether exceptions change the rules, and whether staff workarounds are tracked. The score is a starting point for discussion, not a measurement of the institution's ability to correct itself.",
      methodCards: {
        measures: [
          "The action-capacity growth band selected by the operator.",
          "Reported challenge intake, reversal latency, upstream revision, and workaround handling.",
          "A fixed-weight concern score derived from those answers.",
        ],
        doesNotMeasure: [
          "Exact financial exposure or legal liability.",
          "Whether any single past decision was right or wrong.",
          "Model quality: retraining and accuracy are action capacity, not correction.",
          "Whether the institution has an interest in keeping the arrangement. Two optional context questions record it and do not enter the score.",
        ],
        assumptions: [
          "Inputs describe the last twelve months, not the deployment plan.",
          "Corrective capacity is measured where challenges arrive, not where the org chart says they should.",
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
          "Normalize the fixed category weights to a 0–100 concern score.",
          "Display the reported growth band alongside the concern score.",
        ],
        outputs: [
          "Heuristic concern score and tier.",
          "The five answers used to derive the score.",
          "Reported action-capacity growth: compounding, steady, or flat.",
        ],
      },
      instrument: {
        prompts: [
          "Action-capacity growth: compounding, steady, or flat over twelve months.",
          "Challenge intake: dedicated resourced team, shared inbox, or no route.",
          "Reversal latency: same day, days to weeks, unknown or unbounded.",
          "Upstream revision: never, occasionally, or regularly.",
          "Workaround register: inventoried and reviewed, informal only, or none.",
          "Optional, not scored: who holds authority over budget, staffing, and priorities for the conditions that produce the workarounds.",
          "Optional, not scored: whether the institution has priced fixing the underlying deficiency, and what it decided.",
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
          "The score does not estimate how much extra work staff take on to cover for the system, financial cost, or a future trajectory.",
          "The two context questions never change the score. They add a readout line that says whether the answers describe an institution that lacks information or one that holds sole authority and has chosen to keep the arrangement.",
        ],
      },
      validation: {
        pilotNotes:
          "Each band carries a fixed weight in the calculator. The score is only as sound as the bands chosen, so record the figures behind each choice.",
        reliability:
          "No empirical calibration or predictive validity is established for these weights.",
        failureModes: [
          "Counting the appeals queue as corrective capacity when it resolves cases and changes nothing upstream.",
          "Reading workarounds as resilience, and scaling the system on staff quietly covering for it.",
          "Reading a high score as missing information when the institution already has the numbers. Where it holds sole authority and has priced and declined a fix, better measurement will not change the outcome.",
          "Using model metrics — accuracy, retraining — as evidence of corrective capacity.",
        ],
      },
      replicability: {
        runSteps: [
          "Collect the growth band and the four corrective-capacity bands.",
          "State challenge volume and correction staffing for the same period.",
          "Record the selected answers and concern tier, with the evidence needed to check them.",
          "Re-run after a scope expansion and compare answers.",
        ],
        exampleOutputs: [
          "Self-assessment with a concern tier and reported growth band.",
          "An explicit limit: it does not measure how much of the system's failure staff cover for.",
        ],
      },
      bestFor:
        "Governance leads comparing what a system can do to people with what people can do back, before the next expansion decision.",
      readiness: [
        "Use before approving a scope expansion or an automation increase.",
        "Pair with the exception-learning eval to trace whether any challenge changed an upstream rule.",
      ],
      outputs: [
        "Heuristic concern tier from self-reported answers.",
        "Reported growth band and workaround-register status.",
        "Shareable link for the expansion review.",
      ],
      estimatedTime: "10–12 minutes",
      prepChecklist: [
        "Decision volume and automation growth for the last year.",
        "Challenge intake route, staffing, and reversal latency.",
        "The last time a handled exception changed an upstream rule.",
      ],
      studioNote:
        "Ethotechnics Studio can run this comparison with your team and trace whether handled exceptions ever changed a rule.",
      ctaLabel: "Start the corrective capacity self-assessment",
      ctaHref: "/diagnostics/corrective-debt-calculator",
      ctaAriaLabel:
        "Start the corrective capacity self-assessment diagnostic tool",
      exampleLabel: "View sample output",
      exampleHref: "/diagnostics#output-baseline",
      deliveryType: "self-serve",
    },
  ],
};
