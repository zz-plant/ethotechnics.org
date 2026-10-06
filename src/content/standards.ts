import type { AnchorLink, PageWithPermalink } from "./types";

export type StandardEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "Draft" | "Stable" | "Deprecated";
  // Standards without a published page stay in the registry so clauses and
  // changelogs keep resolving, but must not surface in the catalog or sitemap.
  listedOnSite?: boolean;
  version: string;
  changelogHref?: string;
  changelogEntries?: {
    version: string;
    date: string;
    summary: string;
    href?: string;
  }[];
  stableCriteria: string;
  deprecatedBy?: {
    id: string;
    slug: string;
    title: string;
  }[];
  effectiveDate: string;
  published: string;
};

export type DoctrineEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  ctaLabel: string;
};

export type StandardsContent = PageWithPermalink & {
  anchorLinks: AnchorLink[];
  standards: StandardEntry[];
  doctrine: DoctrineEntry[];
};

export type ClauseRequirementLevel = "MUST" | "SHOULD";
export type ClauseType = "right" | "obligation";

export type StandardClause = {
  id: string;
  standardId: string;
  displayId: string;
  type: ClauseType;
  requirementLevel: ClauseRequirementLevel;
  condition: string;
  obligation: string;
  evidenceRequired: string[];
  timeBound: string;
  failureModes?: string[];
  relatedMechanisms: string[];
  relatedValidators: string[];
};

export const standardsContent: StandardsContent = {
  pageTitle: "Standards — Ethotechnics Institute",
  pageDescription:
    "Draft standards for records a running system must keep: an answer to every objection, authority that expires, a published time cost. None binds until adopted.",
  permalink: "/standards",
  anchorLinks: [
    { href: "#register", label: "The register" },
    { href: "#code-example", label: "Code & schema example" },
    { href: "#crosswalks", label: "Regulatory crosswalks" },
    { href: "#doctrine", label: "Foundations and references" },
    {
      href: "#adopted-standards",
      label: "Where existing frameworks fall short",
    },
    { href: "#implementation-examples", label: "Domain-by-domain comparisons" },
    { href: "#referenced-by", label: "Where the standards are cited" },
  ],
  standards: [
    {
      id: "STD-01",
      slug: "std-01-temporal-rights",
      title: "The Temporal Bill of Rights",
      description:
        "Seven rights that protect a person's time from automated systems: to stop a process, to exit, to a bounded wait, to reversal, to wait without coercion, to reach a human, and to see the burden.",
      status: "Draft",
      version: "1.0.1",
      changelogHref: "/standards/std-01-temporal-rights",
      changelogEntries: [
        {
          version: "1.0.1",
          date: "2026-10-06",
          summary:
            'Editorial revision. Article VI is retitled the right to reach a human, to match what it grants. §1.2 now holds the paused state for the duration declared under §3.1 in place of a "reasonable duration". Requirement wording uses must and must not throughout, and the register for §7.2 now matches the text.',
        },
        {
          version: "1.0",
          date: "2026-01-01",
          summary: "Ratification draft released for public review.",
        },
      ],
      stableCriteria:
        "Requires two independent implementation reports and a decision recorded through the RFC process.",
      effectiveDate: "January 2026",
      published: "2026-01-01",
    },
    {
      id: "STD-02",
      slug: "std-02-contestability-recourse",
      title: "The Contestability & Recourse Standard",
      description:
        "How a person challenges an automated decision: the reasons they are owed, an appeal path, a review clock, remedy, and who has standing to appeal.",
      status: "Draft",
      version: "1.3.1",
      changelogHref:
        "/standards/std-02-contestability-recourse#publication-history",
      changelogEntries: [
        {
          version: "1.3.1",
          date: "2026-10-06",
          summary:
            "Editorial revision; no obligation changed. The clause register now matches §1.1–§5.3 as written, and Articles I–V open with a plain statement in place of a slogan.",
        },
        {
          version: "1.3",
          date: "2026-10-03",
          summary:
            "Publishes Articles VI and VII: review infrastructure, liability, and capacity (§6.1–§7.3).",
        },
        {
          version: "1.2",
          date: "2026-09-22",
          summary:
            "Adds reasons that belong to the decision, with explanations written afterward labeled as accounts (§1.4), and bounds a decision class's issue rate by the responder's capacity to answer (§8.6).",
        },
        {
          version: "1.1",
          date: "2026-09-07",
          summary:
            "Adds the depth of consent: standing for parties who became affected after adoption, and the disclosure owed when dependence has materially deepened since consent was given.",
        },
        {
          version: "1.0",
          date: "2026-09-06",
          summary:
            "Adds the standing mechanism (seven fields, standard of review, possible state transitions, error-bearing parties, procedural force) and prospective auditability.",
        },
        {
          version: "0.9",
          date: "2026-01-01",
          summary: "Peer review draft aligned to evidence and remedy clocks.",
        },
      ],
      stableCriteria:
        "Requires successful red-team recourse simulation and two external peer reviewers.",
      effectiveDate: "TBD",
      published: "2026-01-01",
    },
    {
      id: "MVC-01",
      slug: "minimum-viable-contestability",
      title: "Minimum viable contestability standard",
      description:
        "A one-page baseline of eight commitments: standing, reasons, records, timelines, a named responder and standard of review, defined effects, remedies, and non-retaliation.",
      // Marked Stable at publication, but none of its stable criteria was ever
      // recorded as met, which the status model requires. Draft until they are.
      status: "Draft",
      version: "1.0.1",
      changelogHref: "/standards/minimum-viable-contestability",
      changelogEntries: [
        {
          version: "1.0",
          date: "2025-01-01",
          summary:
            "Initial publication of baseline contestability controls, then marked stable.",
        },
        {
          version: "1.0",
          date: "2026-10-01",
          summary:
            "Status corrected to Draft. No production deployment report, audit template validation, or approval decision has been recorded. The text is unchanged.",
        },
        {
          version: "1.0.1",
          date: "2026-10-06",
          summary:
            "Editorial revision; no requirement changed. The description names all eight commitments, and the duplicate text-only version of the page is removed.",
        },
      ],
      stableCriteria:
        "Requires one production deployment report, audit template validation, and a decision recorded through the RFC process.",
      effectiveDate: "Immediate",
      published: "2025-01-01",
    },
    {
      id: "PM-01",
      slug: "pm-01-failure-postmortem-template",
      title: "Institutional Failure Postmortem Template",
      description:
        "A one-page postmortem template: how long the harm ran, whether it could be reversed, who carried the burden, and how it was repaired.",
      // Same correction as MVC-01: stable on release, with no record of the
      // three retrospectives its criteria ask for.
      status: "Draft",
      version: "1.0.1",
      changelogHref: "/standards/pm-01-failure-postmortem-template",
      changelogEntries: [
        {
          version: "1.0",
          date: "2026-04-15",
          summary:
            "Initial release of the institutional postmortem template, then marked stable.",
        },
        {
          version: "1.0",
          date: "2026-10-01",
          summary:
            "Status corrected to Draft. No use in three incident retrospectives with governance sign-off has been recorded. The text is unchanged.",
        },
        {
          version: "1.0.1",
          date: "2026-10-06",
          summary:
            "Publisher name corrected to Ethotechnics Institute. The template is unchanged.",
        },
      ],
      stableCriteria:
        "Requires use in three incident retrospectives with documented governance sign-off.",
      effectiveDate: "Immediate",
      published: "2026-04-15",
    },
    {
      id: "STD-03",
      slug: "std-03-justice-slos",
      title: "Justice SLOs (Targets, Budgets, and Breach Actions)",
      description:
        "Each justice metric, such as time-to-halt, gets a target, a measurement window, a breach action set in advance, and a named owner.",
      status: "Draft",
      version: "0.6.1",
      changelogHref: "/standards/std-03-justice-slos",
      changelogEntries: [
        {
          version: "0.6.1",
          date: "2026-10-06",
          summary:
            "Editorial revision: the page uses one name, justice SLO, throughout, and defines each metric. No requirement changed.",
        },
        {
          version: "0.6",
          date: "2026-01-01",
          summary:
            "Review draft introducing justice error-budget breach actions.",
        },
      ],
      stableCriteria:
        "Requires pilot metrics from two sectors and reviewer consensus on breach thresholds.",
      effectiveDate: "TBD",
      published: "2026-01-01",
    },
    {
      id: "STD-04",
      slug: "fhir-profile-set",
      title: "FHIR profile set for contestability artifacts",
      description:
        "FHIR profiles for decision records, appeal events, and repair outcomes with governance metadata.",
      status: "Deprecated",
      version: "0.3",
      changelogHref: "/standards/fhir-profile-set",
      changelogEntries: [
        {
          version: "0.3",
          date: "2026-02-15",
          summary:
            "Profile draft superseded by consolidated VC + FHIR release plan.",
        },
      ],
      stableCriteria:
        "N/A while deprecated; the replacement standard should be adopted for new implementations.",
      deprecatedBy: [
        {
          id: "STD-05",
          slug: "w3c-vc-schemas",
          title: "W3C Verifiable Credential schemas for contestability",
        },
      ],
      // A withdrawn profile has no date it comes into effect; it has the
      // date it stopped being the recommendation.
      effectiveDate: "Withdrawn 2026-02-15",
      published: "2026-02-15",
    },
    {
      id: "STD-05",
      slug: "w3c-vc-schemas",
      title: "W3C Verifiable Credential schemas for contestability",
      description:
        "Verifiable Credential schemas and JSON-LD contexts for decision records, appeals, and remedies.",
      status: "Draft",
      version: "0.3",
      changelogHref: "/standards/w3c-vc-schemas",
      changelogEntries: [
        {
          version: "0.3",
          date: "2026-02-15",
          summary:
            "Alignment draft for contestability credentials and context definitions.",
        },
      ],
      stableCriteria:
        "Requires interoperability testing across two verifier implementations and one public registry.",
      effectiveDate: "TBD",
      published: "2026-02-15",
    },
    {
      id: "STD-06",
      slug: "std-06-human-impact-safety-case",
      title: "Human Impact Safety Case",
      description:
        "A safety case for human impact: a standard set of tests with thresholds declared in advance, the evidence each produces, and the limits past which a system does not deploy.",
      status: "Draft",
      version: "0.6.1",
      changelogHref:
        "/standards/std-06-human-impact-safety-case#publication-history",
      changelogEntries: [
        {
          version: "0.6.1",
          date: "2026-10-06",
          summary:
            "Publisher name corrected to Ethotechnics Institute. No clause changed.",
        },
        {
          version: "0.6",
          date: "2026-09-11",
          summary:
            "Adds §2.4, discovery without a claim: per-population error, reversal, and remedy rates measured on a cadence, with a materially worse rate treated as a threshold breach.",
        },
        {
          version: "0.5",
          date: "2026-09-06",
          summary:
            "First published page, plus Article V: dependency record, exposure score, reversibility at three levels, preserved capacities, do-not-expand condition, and rehearsal cadence.",
        },
        {
          version: "0.4",
          date: "2026-03-01",
          summary:
            "Review draft defining do-not-deploy thresholds and evidence artifacts.",
        },
      ],
      stableCriteria:
        "Requires passing safety-case drills in two live programs and independent assurance review.",
      effectiveDate: "TBD",
      published: "2026-03-01",
    },
    {
      id: "STD-07",
      slug: "std-07-revisable-delegation-record",
      title: "Revisable Delegation Record",
      description:
        "One append-only record shape for what an institution believed, could do, authorized, did, saw diverge, and revised.",
      status: "Draft",
      version: "0.1.1",
      changelogHref:
        "/standards/std-07-revisable-delegation-record#conformance",
      changelogEntries: [
        {
          version: "0.1.1",
          date: "2026-10-06",
          summary:
            "Publisher name corrected to Ethotechnics Institute. No clause changed.",
        },
        {
          version: "0.1",
          date: "2026-09-06",
          summary:
            "Working draft: record kinds, two clocks, authority, invalidation, standing, integrity, and four conformance levels.",
        },
      ],
      stableCriteria:
        "Requires two independent systems emitting Level 1 records that a third party has verified by hash, and one accepted objection answered within its clock.",
      effectiveDate: "TBD",
      published: "2026-09-06",
    },
    {
      id: "STD-08",
      slug: "std-08-delegation",
      title: "Delegation",
      description:
        "What must stay true while an automated system acts for an institution: its authority expires unless renewed, the policies behind it are rechecked when facts change, human oversight names what the human can actually change, and the capacity to correct errors grows with the authority granted.",
      status: "Draft",
      version: "0.3.1",
      changelogHref: "/standards/std-08-delegation#relationship-to-std-07",
      changelogEntries: [
        {
          version: "0.3.1",
          date: "2026-10-06",
          summary:
            "Editorial revision. §3.5 now says the operator sets and publishes the approval-rate and reading-time thresholds it applies; no number is added. §4.5 no longer restates the seven components of §4.1, and anti-pattern notes are labeled as caveats.",
        },
        {
          version: "0.3",
          date: "2026-09-22",
          summary:
            "Adds three clauses for typed decision models: content does not carry authority (§1.5), a decision threshold is a policy (§2.6), and a routing threshold is part of the intervention specification (§3.6).",
        },
        {
          version: "0.2",
          date: "2026-09-07",
          summary:
            "Adds correction capacity as a recorded field rechecked whenever scope changes, and the separation of execution from evaluation.",
        },
        {
          version: "0.1",
          date: "2026-09-06",
          summary:
            "Working draft: renewal and expansion of authority, policy validity, intervention specifications, and correction symmetry. Adds only what STD-07 leaves open.",
        },
      ],
      stableCriteria:
        "Requires two institutions operating grant and policy registers with recorded expansion decisions, and one intervention specification whose measured approval behavior produced a reconsideration.",
      effectiveDate: "TBD",
      published: "2026-09-06",
    },
    {
      id: "STD-09",
      slug: "std-09-agent-chains",
      title: "Agent Chains",
      description:
        "What must hold when a consequential decision passes through a chain of agents and services that no single person oversees: the whole chain is treated as one delegation, delays add up across it, and it can correct errors only as well as its weakest link.",
      status: "Draft",
      version: "0.2.1",
      changelogHref: "/standards/std-09-agent-chains#publication-history",
      changelogEntries: [
        {
          version: "0.2.1",
          date: "2026-10-06",
          summary:
            "Editorial revision; no obligation changed. §1.4 now states Law XI correctly, the scope's list of laws matches the part headings, and anti-pattern notes are labeled as caveats.",
        },
        {
          version: "0.2",
          date: "2026-09-22",
          summary:
            "Adds two clauses on hops that shape rather than make the decision: routing, ranking, and filtering hops are enumerated (§1.5), and a hop that selects the delegate enumerates its whole range (§1.6).",
        },
        {
          version: "0.1",
          date: "2026-09-11",
          summary:
            "Working draft: enumerated hops on the head grant, liability terminating at the head, composed latency, counterparty answerability, and chain correction capacity as the weakest hop.",
        },
      ],
      stableCriteria:
        "Requires one recorded chain across two institutions with a measured composed-latency window, one boundary intervention halt receipt covering every hop, and one chain-level correction-capacity assessment.",
      effectiveDate: "TBD",
      published: "2026-09-11",
    },
  ],
  doctrine: [
    {
      id: "core-axioms",
      title: "Core axioms",
      description:
        "The five axioms every standard rests on (finitude, consent, stewardship, reversibility, and legibility) and the premises they assume.",
      href: "/standards/core-axioms",
      eyebrow: "Foundations",
      ctaLabel: "View axioms",
    },
    {
      id: "laws",
      title: "Laws for Engineering Delegated Intelligence",
      description:
        "The twelve laws the standards enforce, the one-sentence rule that sums them up, and the six things a system must keep in step as it grows.",
      href: "/standards/laws",
      eyebrow: "Foundations",
      ctaLabel: "Read the laws",
    },
    {
      id: "ethotechnics-for-agents",
      title: "Ethotechnics for Agents",
      description:
        "How to implement STD-01 and STD-02 in agent systems, mechanism by mechanism, with recourse a person can enforce.",
      href: "/standards/ethotechnics-for-agents",
      eyebrow: "Practice",
      ctaLabel: "View practice",
    },
    {
      id: "std-01-mapping-artifact",
      title: "STD-01 mapping artifact",
      description:
        "One invented case traced from each harm to the STD-01 right it breaks, the check that catches it, and the change that fixes it.",
      href: "/standards/std-01-mapping-artifact",
      eyebrow: "STD-01 reference",
      ctaLabel: "Open mapping",
    },
    {
      id: "std-01-rights-matrix",
      title: "STD-01 rights matrix",
      description:
        "Each STD-01 right, the validators that test it, and the mechanisms that implement it.",
      href: "/standards/std-01-rights-matrix",
      eyebrow: "STD-01 reference",
      ctaLabel: "View matrix",
    },
    {
      id: "std-01-minimum-binding-set",
      title: "STD-01 minimum binding set",
      description:
        "The least each STD-01 right requires before a system can claim it, with clause references and examples that fall short.",
      href: "/standards/std-01-minimum-binding-set",
      eyebrow: "STD-01 reference",
      ctaLabel: "Review binding set",
    },
    {
      id: "where-this-binds",
      title: "Citing the standards in contracts and audits",
      description:
        "How to write these standards into contracts, procurement terms, and audits.",
      href: "/standards/where-this-binds",
      eyebrow: "Governance",
      ctaLabel: "See guidance",
    },
    {
      id: "enforceable-governance-crosswalks",
      title: "Enforceable governance crosswalks",
      description:
        "Each Ethotechnics control mapped to the EU AI Act, NIST AI RMF, and ISO/IEC 42001, with the evidence a buyer or auditor should request.",
      href: "/standards/enforceable-governance-crosswalks",
      eyebrow: "Governance",
      ctaLabel: "Open crosswalks",
    },
    {
      id: "glossary",
      title: "Glossary",
      description:
        "Definitions of the terms the standards use, each at a stable URL.",
      href: "/glossary",
      eyebrow: "Reference",
      ctaLabel: "Browse glossary",
    },
  ],
};

export const standardClauses: Record<string, StandardClause[]> = {
  "STD-01": [
    {
      id: "STD-01.1.1",
      standardId: "STD-01",
      displayId: "§1.1",
      type: "right",
      requirementLevel: "MUST",
      condition: "an automated process is in progress",
      obligation: "provide a visible, universally accessible halt control",
      evidenceRequired: ["ui_control", "event_log"],
      timeBound: "immediate",
      relatedMechanisms: ["MEC-05"],
      relatedValidators: ["VAL-01"],
    },
    {
      id: "STD-01.1.2",
      standardId: "STD-01",
      displayId: "§1.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "a process is halted by the user",
      obligation:
        "save the paused state so the user can return without penalty; never destroy data as a penalty for halting",
      evidenceRequired: ["state_snapshot", "retention_policy"],
      timeBound:
        "for the maximum duration declared for the paused state under §3.1",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-01"],
    },
    {
      id: "STD-01.1.3",
      standardId: "STD-01",
      displayId: "§1.3",
      type: "right",
      requirementLevel: "MUST",
      condition: "a user is in a multi-step flow",
      obligation: "offer a permanent exit option on every screen",
      evidenceRequired: ["ui_state", "interaction_map"],
      timeBound: "continuous",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.2.1",
      standardId: "STD-01",
      displayId: "§2.1",
      type: "right",
      requirementLevel: "MUST",
      condition: "a user seeks to end their relationship with a system",
      obligation: "allow exit with equal or less friction than entry",
      evidenceRequired: ["journey_map", "time_cost_log"],
      timeBound: "on demand",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-01"],
    },
    {
      id: "STD-01.2.2",
      standardId: "STD-01",
      displayId: "§2.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "entry required a single step",
      obligation: "require no more than one step to exit",
      evidenceRequired: ["journey_map", "ui_state"],
      timeBound: "on demand",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.2.3",
      standardId: "STD-01",
      displayId: "§2.3",
      type: "right",
      requirementLevel: "MUST",
      condition: "a user starts to cancel or leave",
      obligation:
        "do not require retention flows, exit surveys, or confirmations of loss before exit",
      evidenceRequired: ["journey_map", "policy"],
      timeBound: "on demand",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.3.1",
      standardId: "STD-01",
      displayId: "§3.1",
      type: "right",
      requirementLevel: "MUST",
      condition: "a process has pending, processing, or review states",
      obligation: "define a maximum duration for each state",
      evidenceRequired: ["system_sla", "event_log"],
      timeBound: "state-specific",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: ["VAL-03"],
    },
    {
      id: "STD-01.3.2",
      standardId: "STD-01",
      displayId: "§3.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "a request is not resolved within its declared timeframe",
      obligation: "default to a failure state or to human escalation",
      evidenceRequired: ["escalation_policy", "event_log"],
      timeBound: "at timeout",
      relatedMechanisms: ["MEC-04", "MEC-06"],
      relatedValidators: ["VAL-03"],
    },
    {
      id: "STD-01.3.3",
      standardId: "STD-01",
      displayId: "§3.3",
      type: "right",
      requirementLevel: "MUST",
      condition: "a user is asked to commit to a process",
      obligation:
        "declare the estimated time to completion before the user commits",
      evidenceRequired: ["ui_copy", "journey_map"],
      timeBound: "pre-commitment",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: ["VAL-03"],
    },
    {
      id: "STD-01.4.1",
      standardId: "STD-01",
      displayId: "§4.1",
      type: "right",
      requirementLevel: "MUST",
      condition:
        "a user takes an action with consequential effects, such as deletion, transfer, or publication",
      obligation:
        "provide a grace period in which the action can be reversed without administrative intervention",
      evidenceRequired: ["ui_state", "policy"],
      timeBound: "defined window",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-01"],
    },
    {
      id: "STD-01.4.2",
      standardId: "STD-01",
      displayId: "§4.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "a system removes user data",
      obligation:
        "archive it by default (soft delete); never destroy it permanently on a single input",
      evidenceRequired: ["data_retention_policy", "event_log"],
      timeBound: "default behavior",
      relatedMechanisms: ["MEC-02"],
      relatedValidators: ["VAL-01"],
    },
    {
      id: "STD-01.5.1",
      standardId: "STD-01",
      displayId: "§5.1",
      type: "right",
      requirementLevel: "MUST",
      condition: "a user is placed in a waiting state",
      obligation:
        "show accurate, real-time queue position and expected wait time",
      evidenceRequired: ["ui_state", "queue_metrics"],
      timeBound: "continuous",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.5.2",
      standardId: "STD-01",
      displayId: "§5.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "a system shows progress or waiting status",
      obligation:
        "do not use fake progress bars, placebo buttons, or looping animations to simulate activity while idle or stalled",
      evidenceRequired: ["ui_state", "event_log"],
      timeBound: "continuous",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.5.3",
      standardId: "STD-01",
      displayId: "§5.3",
      type: "right",
      requirementLevel: "MUST",
      condition: "a wait exceeds five minutes",
      obligation:
        "offer a callback or notification so the user need not hold an active connection",
      evidenceRequired: ["ui_state", "journey_map"],
      timeBound: "five minutes",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.5.4",
      standardId: "STD-01",
      displayId: "§5.4",
      type: "right",
      requirementLevel: "MUST",
      condition:
        "a stated clock for an application, appeal, or prior-authorization request expires without a decision",
      obligation:
        "resolve the request in the applicant's favor, or escalate to a human reviewer where the default outcome falls harder on the applicant than on the institution; a clock with no stated consequence is not a clock",
      evidenceRequired: ["expiry_rule", "expired_request_log"],
      timeBound: "at clock expiry",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: ["VAL-03"],
    },
    {
      id: "STD-01.6.1",
      standardId: "STD-01",
      displayId: "§6.1",
      type: "right",
      requirementLevel: "MUST",
      condition:
        "an automated decision denies a user access, service, or property",
      obligation: "provide a clearly defined path to appeal to a human agent",
      evidenceRequired: ["policy", "support_workflow"],
      timeBound: "on request",
      relatedMechanisms: ["MEC-06"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.6.2",
      standardId: "STD-01",
      displayId: "§6.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "an automated agent errs or delays",
      obligation:
        "accept full liability as the operating institution; algorithmic error is not a defense",
      evidenceRequired: ["policy", "governance_record"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: ["VAL-02"],
    },
    {
      id: "STD-01.7.1",
      standardId: "STD-01",
      displayId: "§7.1",
      type: "right",
      requirementLevel: "MUST",
      condition: "a system imposes a compliance or usage burden on the public",
      obligation: "measure and publish the time tax it imposes",
      evidenceRequired: ["burden_report", "time_cost_log"],
      timeBound: "scheduled reporting",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: ["VAL-01"],
    },
    {
      id: "STD-01.7.2",
      standardId: "STD-01",
      displayId: "§7.2",
      type: "right",
      requirementLevel: "MUST",
      condition: "a major system update is made",
      obligation:
        "audit it to confirm it does not increase the cognitive load or time required for existing tasks",
      evidenceRequired: ["burden_impact_statement", "time_cost_log"],
      timeBound: "at each major update",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: ["VAL-01"],
    },
  ],
  "STD-02": [
    {
      id: "STD-02.1.1",
      standardId: "STD-02",
      displayId: "§1.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an automated decision is made",
      obligation:
        "produce a decision object containing reason codes, evidence sources, and scope boundaries",
      evidenceRequired: ["decision_object", "decision_log"],
      timeBound: "at the moment of decision",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.1.2",
      standardId: "STD-02",
      displayId: "§1.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "reasons are given to the person a decision affects",
      obligation:
        "write them in language a layperson can understand; legalese and internal codes are insufficient",
      evidenceRequired: ["ui_notice", "decision_object"],
      timeBound: "at the moment of decision",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.1.3",
      standardId: "STD-02",
      displayId: "§1.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an automated decision is made",
      obligation:
        "make its reasons available at the moment of decision; an explanation deferred until requested does not comply",
      evidenceRequired: ["ui_notice", "decision_log"],
      timeBound: "at the moment of decision",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.1.4",
      standardId: "STD-02",
      displayId: "§1.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a reason is given for a consequential decision, or the component that decided gives no reasons",
      obligation:
        "state what the decision actually rested on; label any explanation written afterward by another component as an account; where the decider gives no reasons, record that on the decision object with the policy, threshold, and inputs, and add evidential support to the class's standards of review",
      evidenceRequired: [
        "decision_record.decision",
        "decision_record.policy_refs",
        "decision_record.evidence_basis",
        "standing_register.decision_classes.standard_of_review",
      ],
      timeBound: "at the moment of decision",
      failureModes: [
        "a language model writes a plausible rationale for a score it did not produce",
        "a classifier's decision presented to the affected person with reasons nobody derived from it",
      ],
      relatedMechanisms: ["MEC-01", "MEC-08"],
      relatedValidators: [],
    },
    {
      id: "STD-02.2.1",
      standardId: "STD-02",
      displayId: "§2.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a decision is sent or shown to the person it affects",
      obligation:
        "make the appeal path reachable directly from the decision notification or interface",
      evidenceRequired: ["ui_state", "journey_map"],
      timeBound: "at the moment of decision",
      relatedMechanisms: ["MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.2.2",
      standardId: "STD-02",
      displayId: "§2.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an appeal path is offered",
      obligation: "name the accountable authority that holds reversal power",
      evidenceRequired: ["appeal_policy", "authority_matrix"],
      timeBound: "published with the appeal path",
      relatedMechanisms: ["MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.2.3",
      standardId: "STD-02",
      displayId: "§2.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an appeal path is offered",
      obligation:
        "publish appeal deadlines, bound them in time, and enforce them",
      evidenceRequired: ["sla_doc", "ui_copy", "event_log"],
      timeBound: "published with the appeal path",
      relatedMechanisms: ["MEC-04", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.3.1",
      standardId: "STD-02",
      displayId: "§3.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a decision can be reviewed",
      obligation: "declare the maximum duration of the review",
      evidenceRequired: ["sla_doc", "review_policy"],
      timeBound: "published before review begins",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-02.3.2",
      standardId: "STD-02",
      displayId: "§3.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "the review clock expires without a resolution",
      obligation:
        "escalate the case automatically to a higher authority, or default to reversal",
      evidenceRequired: ["escalation_policy", "event_log"],
      timeBound: "at clock expiry",
      relatedMechanisms: ["MEC-04", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.3.3",
      standardId: "STD-02",
      displayId: "§3.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a review is pending",
      obligation:
        "give the affected party provisional protection: continued access, the status quo, or a safe fallback",
      evidenceRequired: ["interim_protection_policy", "case_log"],
      timeBound: "until the review is resolved",
      relatedMechanisms: ["MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.4.1",
      standardId: "STD-02",
      displayId: "§4.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an appeal is upheld",
      obligation:
        "reverse the contested decision unless safety criteria explicitly prohibit it",
      evidenceRequired: ["appeal_outcome_log", "remedy_policy"],
      timeBound: "when the appeal is upheld",
      relatedMechanisms: ["MEC-10"],
      relatedValidators: [],
    },
    {
      id: "STD-02.4.2",
      standardId: "STD-02",
      displayId: "§4.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a decision causes wrongful harm",
      obligation:
        "issue credits, fee waivers, or restitution automatically, without requiring a separate claim",
      evidenceRequired: ["remedy_policy", "remediation_log"],
      timeBound: "on the finding of wrongful harm",
      relatedMechanisms: ["MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.4.3",
      standardId: "STD-02",
      displayId: "§4.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a remedy is delivered",
      obligation:
        "record delivery with timestamps and have the affected party verify it",
      evidenceRequired: ["remediation_log", "case_log"],
      timeBound: "at delivery",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.4.4",
      standardId: "STD-02",
      displayId: "§4.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a defect is found to arise from a rule, a model, or a notice rather than from one decision",
      obligation:
        "reach every affected case without a further claim; enumerate the affected population from the institution's own records, correct those cases, and tell each person what was corrected",
      evidenceRequired: [
        "affected_population",
        "remediation_log",
        "notification_log",
      ],
      timeBound: "on finding the defect",
      relatedMechanisms: ["MEC-23"],
      relatedValidators: [],
    },
    {
      id: "STD-02.5.1",
      standardId: "STD-02",
      displayId: "§5.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a decision is made",
      obligation:
        "emit a receipt with a timestamp, the owner, and a reference to the decision object",
      evidenceRequired: ["receipt_template", "decision_log"],
      timeBound: "at the moment of decision",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.5.2",
      standardId: "STD-02",
      displayId: "§5.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "appeals are decided",
      obligation:
        "publish appeal passage rates and reversal rates, and use them to improve decisions",
      evidenceRequired: ["appeal_outcome_log", "published_metrics"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.5.3",
      standardId: "STD-02",
      displayId: "§5.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a decision is contested",
      obligation:
        "keep an audit trail linking the decision to its evidence, reviewers, and outcome",
      evidenceRequired: ["audit_trail", "case_log"],
      timeBound: "for every contested case",
      relatedMechanisms: ["MEC-01", "MEC-10"],
      relatedValidators: [],
    },
    {
      id: "STD-02.5.4",
      standardId: "STD-02",
      displayId: "§5.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "an objection is answered with a burden score, safety-case result, audit finding, or other measurement the challenged party did not produce",
      obligation:
        "treat it as evidence and not a bar; do not cite it to dispose of the objection or to establish that the person's account is unfounded; route the conflict between a score and an account to a named reviewer holding authority to resolve it",
      evidenceRequired: [
        "objection_record",
        "review_assignment",
        "score_provenance",
      ],
      timeBound: "at the objection",
      relatedMechanisms: ["MEC-08"],
      relatedValidators: [],
    },
    {
      id: "STD-02.6.1",
      standardId: "STD-02",
      displayId: "§6.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "an automated system denies a claim or takes a consequential action",
      obligation:
        "offer human review on request, with no new evidence, additional form, or stated reason required",
      evidenceRequired: ["review_policy", "support_workflow"],
      timeBound: "on request",
      relatedMechanisms: ["MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.6.2",
      standardId: "STD-02",
      displayId: "§6.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "reviewers are evaluated",
      obligation:
        "do not reward upheld denials, closure speed, or any other metric that biases against remedies; disclose the evaluation policy",
      evidenceRequired: ["performance_policy", "incentive_plan"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.6.3",
      standardId: "STD-02",
      displayId: "§6.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "logs support review or redress",
      obligation:
        "retain them, tamper-evident, for at least the full review and appeal period plus the limitation window",
      evidenceRequired: ["audit_trail", "retention_policy"],
      timeBound: "retention term",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.7.1",
      standardId: "STD-02",
      displayId: "§7.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "automation causes an error or a delay",
      obligation:
        "accept liability for the resulting harm as the operating institution",
      evidenceRequired: ["policy", "governance_record"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.7.2",
      standardId: "STD-02",
      displayId: "§7.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a vendor operates the logs, the models, or the controls",
      obligation:
        "still guarantee the affected person's access and remedy as the operating institution",
      evidenceRequired: ["vendor_contract", "access_policy"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.7.3",
      standardId: "STD-02",
      displayId: "§7.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "automation increases the throughput of decisions",
      obligation:
        "fund review capacity in proportion to the actions taken, and include the capacity plan in the deployment's evidence",
      evidenceRequired: ["capacity_plan", "case_volume_metrics"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.8.1",
      standardId: "STD-02",
      displayId: "§8.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a class of consequential decision is contestable",
      obligation:
        "publish a standing register entry naming who may challenge, what may be challenged, admissible evidence, the obliged responder, the response deadline, the standard of review, and the possible state transitions",
      evidenceRequired: [
        "standing_register.who_may_challenge",
        "standing_register.responder",
        "standing_register.response_deadline",
        "standing_register.standard_of_review",
        "standing_register.possible_state_transitions",
      ],
      timeBound: "published before the decision class runs",
      failureModes: [
        "channel published without an obliged responder",
        "seven fields spread across documents that never compose into a route",
      ],
      relatedMechanisms: ["MEC-08", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.8.2",
      standardId: "STD-02",
      displayId: "§8.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a responder is obliged to answer a challenge",
      obligation:
        "state the standard the answer is decided against: policy conformance, policy correctness, evidentiary support, or reasonableness of outcome",
      evidenceRequired: [
        "standing_register.standard_of_review",
        "appeal_outcome_log",
      ],
      timeBound: "published with the register entry",
      failureModes: [
        "responder decides whether the process ran rather than whether the outcome was right",
        "standard varies case to case and is never written down",
      ],
      relatedMechanisms: ["MEC-08", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.8.3",
      standardId: "STD-02",
      displayId: "§8.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a challenge can succeed",
      obligation:
        "enumerate the state transitions success can produce: stand, narrow, suspend, reverse, correct, or expand or withdraw the grant behind the decision",
      evidenceRequired: [
        "standing_register.possible_state_transitions",
        "reconsideration.outcome",
      ],
      timeBound: "published with the register entry",
      failureModes: [
        "challenge route produces correspondence and no state change",
        "reversal available in theory but not reachable by the responder",
      ],
      relatedMechanisms: ["MEC-08", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.8.4",
      standardId: "STD-02",
      displayId: "§8.4",
      type: "right",
      requirementLevel: "MUST",
      condition: "a party absorbs the system's errors",
      obligation:
        "grant standing proportional to exposure, including operators who handle exceptions, work the queues, and perform the manual repair the automation assumes",
      evidenceRequired: [
        "standing_register.who_may_challenge",
        "exception_handling_roster",
        "case_log",
      ],
      timeBound: "on request",
      failureModes: [
        "standing limited to the named subject of the decision",
        "internal exception handlers routed to a suggestions box",
      ],
      relatedMechanisms: ["MEC-08", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.8.5",
      standardId: "STD-02",
      displayId: "§8.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a party with standing files a challenge",
      obligation:
        "guarantee receipt, an answer within the deadline, and a decision against the published standard, without granting the power to compel the outcome",
      evidenceRequired: [
        "standing_register.response_deadline",
        "appeal_outcome_log",
        "policy",
      ],
      timeBound: "within the published response deadline",
      failureModes: [
        "standing described as a veto and therefore never granted",
        "receipt issued with no answer owed",
      ],
      relatedMechanisms: ["MEC-08", "MEC-06"],
      relatedValidators: [],
    },
    {
      id: "STD-02.8.6",
      standardId: "STD-02",
      displayId: "§8.6",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a consequential decision class issues decisions faster than challenges to them can be answered",
      obligation:
        "state answer capacity per period on the register entry; where issue rate times measured or stated error rate exceeds it, treat the class as uncontestable in practice until capacity rises or issue rate falls, without narrowing standing",
      evidenceRequired: [
        "standing_register.decision_classes.response_deadline",
        "standing_register.decision_classes.responder",
        "challenge_load_ledger",
        "decision_issue_log",
      ],
      timeBound: "each period, and before the issue rate is raised",
      failureModes: [
        "a decision model makes more consequential decisions in a day than the appeals team can hear in a year",
        "low challenge volume read as low error when the deadline made challenge impractical",
        "congestion met by narrowing who may challenge",
      ],
      relatedMechanisms: ["MEC-23", "MEC-11"],
      relatedValidators: [],
    },
    {
      id: "STD-02.9.1",
      standardId: "STD-02",
      displayId: "§9.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "records are retained for a consequential delegation",
      obligation:
        "retain what is needed to decide whether the delegation still deserves to stand: the authority it ran under, the policy versions that authority rested on, the assumptions declared, the correction capacity claimed, and the challenges received and answered",
      evidenceRequired: [
        "authority_grant.evidence_basis",
        "policy_record.version",
        "policy_record.assumptions",
        "audit_trail",
      ],
      timeBound: "retention term",
      failureModes: [
        "audit trail retains outputs and discards justifications",
        "policy versions overwritten, so the basis cannot be reconstructed",
      ],
      relatedMechanisms: ["MEC-01", "MEC-14"],
      relatedValidators: [],
    },
    {
      id: "STD-02.9.2",
      standardId: "STD-02",
      displayId: "§9.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a component is supplied by a third party",
      obligation:
        "keep the retained set sufficient for the operating institution to answer the standing question without that supplier's cooperation",
      evidenceRequired: ["vendor_contract", "access_policy", "audit_trail"],
      timeBound: "ongoing",
      failureModes: [
        "justification assembled only by the party whose product is under review",
        "evidence access ends with the contract",
      ],
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-02.9.3",
      standardId: "STD-02",
      displayId: "§9.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a delegation is live",
      obligation:
        "ask whether it still deserves to stand on a published cadence and record the answer, dated, whether or not anything changed",
      evidenceRequired: ["review_cadence_policy", "governance_record"],
      timeBound: "each published cadence",
      failureModes: [
        "standing question asked only after an incident",
        "review held but no record produced when nothing changed",
      ],
      relatedMechanisms: ["MEC-01", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-02.10.1",
      standardId: "STD-02",
      displayId: "§10.1",
      type: "right",
      requirementLevel: "MUST",
      condition:
        "a party became affected after adoption, without consenting or without any new decision by them",
      obligation:
        "extend standing to that party; the enumeration of affected parties made at adoption records who was affected then and does not define who may challenge now",
      evidenceRequired: [
        "standing_register.who_may_challenge",
        "dependency_record.dependents",
        "case_log",
      ],
      timeBound: "on request",
      failureModes: [
        "affected set frozen at the adoption decision and never reopened",
        "parties who never consented routed to the consenting party's channel",
      ],
      relatedMechanisms: ["MEC-08", "MEC-18"],
      relatedValidators: [],
    },
    {
      id: "STD-02.10.2",
      standardId: "STD-02",
      displayId: "§10.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "any level of reversibility has moved from evidenced to not evidenced, or exposure_score or substitution_cost has risen by a quarter or more, against the values recorded when consent was given",
      obligation:
        "disclose the change to the consenting party, naming which measure moved, by how much, and the standing route; stop treating the original consent as covering the new degree of dependence",
      evidenceRequired: [
        "dependency_record.exposure_score",
        "dependency_record.substitution_cost",
        "dependency_record.reversibility",
        "consent_record",
      ],
      timeBound:
        "within 30 days of the dependency record entry showing the move",
      failureModes: [
        "deepening dependence treated as covered by the adoption agreement",
        "exposure score rising in the safety case with nothing said to the party living under it",
      ],
      relatedMechanisms: ["MEC-08", "MEC-18"],
      relatedValidators: [],
    },
  ],
  "STD-06": [
    {
      id: "STD-06.1.1",
      standardId: "STD-06",
      displayId: "§1.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a safety case is authored",
      obligation:
        "state the impact class of the deployment: who is affected, in what capacity, and the worst plausible outcome for one of them",
      evidenceRequired: ["safety_case.impact_class"],
      timeBound: "before launch and at each case refresh",
      failureModes: [
        "who is affected stated as a population rather than as people who can be harmed",
        "worst outcome described as a likelihood instead of a bounded harm",
      ],
      relatedMechanisms: [],
      relatedValidators: [],
    },
    {
      id: "STD-06.1.2",
      standardId: "STD-06",
      displayId: "§1.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "components are excluded from the case",
      obligation:
        "name each excluded component with the reason, so an exclusion is visible rather than assumed",
      evidenceRequired: ["safety_case.scope", "safety_case.exclusions"],
      timeBound: "before launch",
      failureModes: [
        "exclusions counted but never named",
        "exclusion reasons recorded after the case is challenged",
      ],
      relatedMechanisms: [],
      relatedValidators: [],
    },
    {
      id: "STD-06.1.3",
      standardId: "STD-06",
      displayId: "§1.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a safety case has an owner",
      obligation:
        "give it one accountable owner who can halt the deployment, not a committee that can recommend halting it",
      evidenceRequired: ["safety_case.owner", "kill_authority_roster"],
      timeBound: "before launch",
      failureModes: [
        "ownership split across a committee with no halt authority",
        "owner changed without the case being re-adopted",
      ],
      relatedMechanisms: ["MEC-05"],
      relatedValidators: [],
    },
    {
      id: "STD-06.2.1",
      standardId: "STD-06",
      displayId: "§2.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a safety case is authored",
      obligation:
        "run and record the standard test battery, and state any test omitted and why",
      evidenceRequired: ["safety_case.test_battery", "battery_results"],
      timeBound: "before launch and at each case refresh",
      failureModes: [
        "a test omitted for cost and the omission not stated",
        "battery run once at launch and read as current",
      ],
      relatedMechanisms: ["MEC-12"],
      relatedValidators: [],
    },
    {
      id: "STD-06.2.2",
      standardId: "STD-06",
      displayId: "§2.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a test in the battery is run",
      obligation:
        "declare each test's threshold before the test is run, with the action that follows a breach",
      evidenceRequired: ["threshold_dashboard", "breach_action"],
      timeBound: "before the test is run",
      failureModes: [
        "threshold set after the result is known",
        "breach action undefined, so a breach is observed and absorbed",
      ],
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-06.2.3",
      standardId: "STD-06",
      displayId: "§2.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "time-to-halt or time-to-remedy is reported",
      obligation:
        "measure it against a clock rather than accept the attestation of the team that owns the control",
      evidenceRequired: [
        "time_to_halt_log",
        "time_to_remedy_log",
        "stopwatch_receipt",
      ],
      timeBound: "at each case refresh",
      failureModes: [
        "the owning team attests its own latency",
        "measured once at launch and attested thereafter",
      ],
      relatedMechanisms: ["MEC-07", "MEC-12"],
      relatedValidators: [],
    },
    {
      id: "STD-06.2.4",
      standardId: "STD-06",
      displayId: "§2.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "the deployment touches populations that differ in their likelihood of complaining",
      obligation:
        "measure error, reversal, and remedy rates per affected population on a declared cadence from records the operator retains, and treat a materially worse rate for any population as a threshold breach under §2.2",
      evidenceRequired: [
        "per_population_rate_series",
        "discovery_cadence",
        "silent_harm_discovery_report",
      ],
      timeBound: "on the declared cadence, and at each case refresh",
      failureModes: [
        "harm is found only when someone complains",
        "populations merged in reporting so a worse rate hides in the average",
      ],
      relatedMechanisms: ["MEC-09"],
      relatedValidators: [],
    },
    {
      id: "STD-06.3.1",
      standardId: "STD-06",
      displayId: "§3.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "evidence artifacts are produced",
      obligation:
        "export them as PDF and as JSON or CSV with stable ids, and carry a plain-language summary for affected people",
      evidenceRequired: ["artifact_exports", "plain_language_summary"],
      timeBound: "before launch",
      failureModes: [
        "artifacts readable only inside the vendor's console",
        "summary written for regulators and not for the people affected",
      ],
      relatedMechanisms: ["MEC-08"],
      relatedValidators: [],
    },
    {
      id: "STD-06.3.2",
      standardId: "STD-06",
      displayId: "§3.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an artifact is presented as current",
      obligation:
        "carry the date it was last refreshed and report a stale artifact as stale rather than current",
      evidenceRequired: ["artifact.refreshed_at", "staleness_flag"],
      timeBound: "at each case refresh",
      failureModes: [
        "stale artifact presented with no date",
        "refresh date present but never compared against the decision it supports",
      ],
      relatedMechanisms: [],
      relatedValidators: [],
    },
    {
      id: "STD-06.3.3",
      standardId: "STD-06",
      displayId: "§3.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a failure was caught by a person before it reached anyone else",
      obligation:
        "record it as an occurrence with the near-miss condition, the person who caught it, the labor spent catching it, and whether the source condition was later fixed; a repeated rescue against an unfixed condition is evidence about the condition, not about the person catching it",
      evidenceRequired: [
        "rescue_register.rescues[]",
        "near_miss_condition",
        "source_condition_fixed",
      ],
      timeBound: "at each occurrence",
      relatedMechanisms: ["MEC-24"],
      relatedValidators: [],
    },
    {
      id: "STD-06.4.1",
      standardId: "STD-06",
      displayId: "§4.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "do-not-deploy boundaries exist",
      obligation:
        "enumerate them in a register, each with the condition that constitutes a breach and the last remediation review date",
      evidenceRequired: ["boundary_register"],
      timeBound: "before launch",
      failureModes: [
        "boundaries held as tribal knowledge",
        "register entries with no breach condition",
      ],
      relatedMechanisms: [],
      relatedValidators: [],
    },
    {
      id: "STD-06.4.2",
      standardId: "STD-06",
      displayId: "§4.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a boundary breach is active",
      obligation:
        "stop the deployment or the expansion; do not convert the breach into a monitored risk by a sign-off",
      evidenceRequired: ["boundary_register.breach", "launch_decision"],
      timeBound: "at the launch or expansion decision",
      failureModes: [
        "breach accepted as a risk on the strength of a signature",
        "breach discovered post-launch and managed rather than paused",
      ],
      relatedMechanisms: ["MEC-05"],
      relatedValidators: [],
    },
    {
      id: "STD-06.4.3",
      standardId: "STD-06",
      displayId: "§4.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an exception to a boundary is granted",
      obligation:
        "bound it in time, give it an owner, and review it on expiry rather than rolling it forward",
      evidenceRequired: [
        "boundary_exception.expiry",
        "boundary_exception.owner",
        "exception_review",
      ],
      timeBound: "at expiry",
      failureModes: [
        "exception rolled forward without review",
        "exception owned by the team that requested it",
      ],
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.1",
      standardId: "STD-06",
      displayId: "§5.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a deployment is consequential enough to require a safety case",
      obligation:
        "carry a dependency record naming dependents, substitution cost, retained expertise, alternatives, last withdrawal rehearsal, and correction latency",
      evidenceRequired: [
        "dependency_record.dependents",
        "dependency_record.substitution_cost",
        "dependency_record.expertise_retained",
        "dependency_record.alternatives",
        "dependency_record.correction_latency",
      ],
      timeBound: "before launch and at each case refresh",
      failureModes: [
        "dependence estimated by whoever was asked, with no record",
        "downstream software dependents omitted because they are not people",
      ],
      relatedMechanisms: ["MEC-18", "MEC-15"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.2",
      standardId: "STD-06",
      displayId: "§5.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a dependency record exists",
      obligation:
        "compute and publish the exposure score as dependency depth times substitution cost times correction latency, recording each input",
      evidenceRequired: [
        "dependency_record.exposure_score",
        "dependency_record.correction_latency",
      ],
      timeBound: "at each case refresh",
      failureModes: [
        "score published without its inputs, so it cannot be challenged",
        "rising score reported alongside an unchanged safety case",
      ],
      relatedMechanisms: ["MEC-18"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.3",
      standardId: "STD-06",
      displayId: "§5.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "reversibility is claimed for a deployment",
      obligation:
        "evidence it separately at the technical, operational, and institutional levels; an unevidenced level is recorded as not evidenced rather than as feasible",
      evidenceRequired: [
        "dependency_record.reversibility",
        "dependency_record.last_withdrawal_rehearsal",
      ],
      timeBound: "before launch and at each case refresh",
      failureModes: [
        "a working stop control presented as institutional reversibility",
        "operational level assessed by the team that would not have to absorb it",
      ],
      relatedMechanisms: ["MEC-15", "MEC-10"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.4",
      standardId: "STD-06",
      displayId: "§5.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "the institution relies on capacities to question or replace the system",
      obligation:
        "list them as preserved capacities with the reason each is preserved and a named owner, and record erosion as a governance event",
      evidenceRequired: [
        "dependency_record.preserved_capacities",
        "governance_record",
      ],
      timeBound: "ongoing",
      failureModes: [
        "retained expertise cut as duplication",
        "capacity owned by nobody and therefore lost quietly",
      ],
      relatedMechanisms: ["MEC-18", "MEC-15"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.5",
      standardId: "STD-06",
      displayId: "§5.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "institutional reversibility is not evidenced",
      obligation:
        "do not expand the deployment's scope, population, or authority until it is; technical and operational reversibility do not substitute",
      evidenceRequired: [
        "dependency_record.reversibility",
        "authority_grant.state_history",
      ],
      timeBound: "at the expansion decision",
      failureModes: [
        "expansion approved on the strength of a technical rollback plan",
        "institutional level marked feasible with no evidence field populated",
      ],
      relatedMechanisms: ["MEC-15", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.6",
      standardId: "STD-06",
      displayId: "§5.6",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a withdrawal path is claimed",
      obligation:
        "rehearse it on a published cadence, at least annually where the exposure score is non-trivial and before any expansion decision, and report what the rehearsal showed at each level",
      evidenceRequired: [
        "dependency_record.last_withdrawal_rehearsal",
        "withdrawal_rehearsal_report",
      ],
      timeBound: "at least annually, and before expansion",
      failureModes: [
        "rehearsal scoped to a component nobody depends on",
        "last rehearsal predates the dependence it was meant to test",
      ],
      relatedMechanisms: ["MEC-15", "MEC-12"],
      relatedValidators: [],
    },
    {
      id: "STD-06.5.7",
      standardId: "STD-06",
      displayId: "§5.7",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "a renewal or expansion decision cites the dependency record",
      obligation:
        "refresh the record first; a record older than the decision it supports is not evidence for that decision",
      evidenceRequired: [
        "dependency_record.assessed_at",
        "authority_grant.state_history",
      ],
      timeBound: "before the decision",
      failureModes: [
        "last year's ledger cited for this year's expansion",
        "record refreshed only after the decision is taken",
      ],
      relatedMechanisms: ["MEC-18", "MEC-19"],
      relatedValidators: [],
    },
  ],
  "STD-07": [
    {
      id: "STD-07.1.1",
      standardId: "STD-07",
      displayId: "§1.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a system emits a record",
      obligation: "carry as_of and recorded_at as distinct fields",
      evidenceRequired: ["record_sample", "schema_validation"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.1.2",
      standardId: "STD-07",
      displayId: "§1.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a record needs to change",
      obligation:
        "append a new record that names the one it supersedes; never edit or delete",
      evidenceRequired: ["append_only_log", "supersedes_chain"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.1.3",
      standardId: "STD-07",
      displayId: "§1.3",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "a record's validity has a horizon",
      obligation:
        "declare valid_until and treat expiry as stale, not superseded",
      evidenceRequired: ["record_sample"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-07.2.1",
      standardId: "STD-07",
      displayId: "§2.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an action is recorded",
      obligation: "name the authorization record it ran under",
      evidenceRequired: ["record_sample", "authorization_link"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.2.2",
      standardId: "STD-07",
      displayId: "§2.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a capability is delegated",
      obligation:
        "record scope, holder, grantor, mode, ceiling, expiry, and revocation conditions",
      evidenceRequired: ["authorization_record"],
      timeBound: "at grant",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.2.3",
      standardId: "STD-07",
      displayId: "§2.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an actor acts for a principal",
      obligation:
        "name the principal in on_behalf_of so the chain reads back to a person or institution",
      evidenceRequired: ["record_sample"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.2.4",
      standardId: "STD-07",
      displayId: "§2.4",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "a record satisfies a published obligation",
      obligation: "cite the clause and pin its version in the system manifest",
      evidenceRequired: ["manifest", "record_sample"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.3.1",
      standardId: "STD-07",
      displayId: "§3.1",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "a belief, authorization, or action rests on other records",
      obligation: "list them in depends_on",
      evidenceRequired: ["dependency_graph"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.3.2",
      standardId: "STD-07",
      displayId: "§3.2",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "a belief, authorization, or action could be invalidated",
      obligation:
        "list the checkable conditions, where they are checked, and a clock",
      evidenceRequired: ["invalidation_conditions"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-07.3.3",
      standardId: "STD-07",
      displayId: "§3.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a discrepancy matches an invalidation condition on a live record",
      obligation:
        "produce a revision or an objection within the condition's clock",
      evidenceRequired: ["discrepancy_log", "revision_record"],
      timeBound: "within declared clock",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-07.3.4",
      standardId: "STD-07",
      displayId: "§3.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an authorization depends on a capability",
      obligation:
        "hold it valid only while the capability's latest record is verified, not merely configured",
      evidenceRequired: ["capability_record", "verification_log"],
      timeBound: "continuous",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.4.1",
      standardId: "STD-07",
      displayId: "§4.1",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "a record affects people outside the emitting system",
      obligation:
        "declare who has standing to object and where objections are accepted",
      evidenceRequired: ["contest_declaration"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.4.2",
      standardId: "STD-07",
      displayId: "§4.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an objection is accepted on the declared channel",
      obligation:
        "answer with a revision or a reasoned refusal record within the reversal clock",
      evidenceRequired: ["objection_record", "response_record"],
      timeBound: "within reversal clock",
      relatedMechanisms: ["MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-07.4.3",
      standardId: "STD-07",
      displayId: "§4.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a record is emitted",
      obligation: "carry visibility as public, internal, or private",
      evidenceRequired: ["record_sample"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.5.1",
      standardId: "STD-07",
      displayId: "§5.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a record is emitted",
      obligation: "carry the SHA-256 of its canonical serialization",
      evidenceRequired: ["hash_verification"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.5.2",
      standardId: "STD-07",
      displayId: "§5.2",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition: "records form one system's stream",
      obligation: "chain each record to the previous one by prior_hash",
      evidenceRequired: ["chain_verification"],
      timeBound: "at write",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-07.5.3",
      standardId: "STD-07",
      displayId: "§5.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a record identifier is minted",
      obligation: "never reuse it, even after supersession",
      evidenceRequired: ["identifier_policy"],
      timeBound: "ongoing",
      relatedMechanisms: ["MEC-01"],
      relatedValidators: [],
    },
  ],
  "STD-08": [
    {
      id: "STD-08.1.1",
      standardId: "STD-08",
      displayId: "§1.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a grant is up for renewal",
      obligation:
        "produce renewal evidence sized to the duration the grant has run and the consequence of the actions it authorizes, stated in renewal_basis before the review period begins",
      evidenceRequired: [
        "authority_grant.renewal_basis",
        "authority_grant.state_history",
        "reconsideration.evidence_delta",
      ],
      timeBound: "before expiry",
      failureModes: [
        "renewal bar set after the result is known",
        "long-running high-consequence grant renewed on the evidence a pilot produced",
      ],
      relatedMechanisms: ["MEC-13", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-08.1.2",
      standardId: "STD-08",
      displayId: "§1.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "no failure was observed during the review period",
      obligation:
        "refuse renewal on that basis alone; name what was examined, what would have been visible had the grant been failing, and who looked, or move the grant to review_required",
      evidenceRequired: [
        "authority_grant.renewal_basis",
        "authority_grant.state",
        "reconsideration.evidence_delta",
      ],
      timeBound: "at renewal",
      failureModes: [
        "quiet period read as evidence of correctness",
        "no one positioned to see the failure mode that matters",
      ],
      relatedMechanisms: ["MEC-13", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-08.1.3",
      standardId: "STD-08",
      displayId: "§1.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a grant's scope, population, action classes, or ceiling is widened",
      obligation:
        "take the widening as its own authorization decision with its own evidence_basis and its own correction-capacity check under STD-08.4.2",
      evidenceRequired: [
        "authority_grant.evidence_basis",
        "authority_grant.scope",
        "reconsideration.outcome",
      ],
      timeBound: "before the wider scope is exercised",
      failureModes: [
        "expansion inherits the original decision's evidence",
        "scope grows by accretion, each step too small to trigger review",
      ],
      relatedMechanisms: ["MEC-19", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.1.4",
      standardId: "STD-08",
      displayId: "§1.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an expansion decision is taken",
      obligation:
        "record it in state_history as a transition whose reason is expansion, with date, deciding authority, and evidence reference; scope that grew without such an entry is ungranted",
      evidenceRequired: [
        "authority_grant.state_history",
        "authority_grant.renewal_basis",
      ],
      timeBound: "at decision",
      failureModes: [
        "permissions widened in configuration with no transition recorded",
        "expansion logged as a renewal",
      ],
      relatedMechanisms: ["MEC-13", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-08.1.5",
      standardId: "STD-08",
      displayId: "§1.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a component decides whether an action is authorized, or material the delegation acts on claims an approval, permission, or consent",
      obligation:
        "read authority only from grant and authorization records; give the deciding component the authorization record, the proposed action, and the policy, mark any content it judges as content, and record an action authorized from content as unauthorized",
      evidenceRequired: [
        "authority_grant.scope",
        "authority_grant.action_classes",
        "decision_record.grant_ref",
      ],
      timeBound: "before the action runs",
      failureModes: [
        "a tool output claiming prior user approval moves a safety gate below its block threshold",
        "a retrieved document's instructions treated as the principal's request",
      ],
      relatedMechanisms: ["MEC-13", "MEC-17"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.1",
      standardId: "STD-08",
      displayId: "§2.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a grant relies on a policy",
      obligation:
        "hold that policy as a record with provenance, assumptions, review_triggers, expires_at, and status; a threshold held only in configuration cannot be cited as a grant's basis",
      evidenceRequired: [
        "policy_record.provenance",
        "policy_record.assumptions",
        "policy_record.review_triggers",
        "policy_record.expires_at",
      ],
      timeBound: "at grant issue",
      failureModes: [
        "policy exists only as a deployed threshold",
        "assumptions never written down, so nothing can falsify them",
      ],
      relatedMechanisms: ["MEC-14", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.2",
      standardId: "STD-08",
      displayId: "§2.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a grant's evidence basis depends on policy records",
      obligation: "list every one of them in policy_refs, pinned to a version",
      evidenceRequired: [
        "authority_grant.policy_refs",
        "policy_record.version",
      ],
      timeBound: "at grant issue",
      failureModes: [
        "unpinned reference silently follows the policy wherever it goes",
        "policy dependency known only to the team that wrote the grant",
      ],
      relatedMechanisms: ["MEC-13", "MEC-14"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.3",
      standardId: "STD-08",
      displayId: "§2.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a condition in a policy's review_triggers is met",
      obligation:
        "move the policy to review_required within the trigger's declared clock",
      evidenceRequired: [
        "policy_record.review_triggers",
        "policy_record.status",
      ],
      timeBound: "within the trigger's declared clock",
      failureModes: [
        "trigger fires into a dashboard and changes no state",
        "clock has no owner, so the status change waits for a meeting",
      ],
      relatedMechanisms: ["MEC-14"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.4",
      standardId: "STD-08",
      displayId: "§2.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a policy a grant depends on is in review_required or suspended",
      obligation:
        "move the dependent grant to review_required within the same clock and open a reconsideration against it; the grant may be confirmed back to allowed, but not left there undecided",
      evidenceRequired: [
        "authority_grant.state",
        "authority_grant.state_history",
        "reconsideration.subject",
      ],
      timeBound: "within the trigger's declared clock",
      failureModes: [
        "policy under review while the grants resting on it keep acting",
        "dependency graph not maintained, so no grant is found to follow",
      ],
      relatedMechanisms: ["MEC-14", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.5",
      standardId: "STD-08",
      displayId: "§2.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a policy is past its expires_at",
      obligation:
        "stop treating it as justification for a live grant; either renew it as a new version with fresh provenance or move the dependent grants to review_required",
      evidenceRequired: [
        "policy_record.expires_at",
        "policy_record.status",
        "authority_grant.state",
      ],
      timeBound: "at expiry",
      failureModes: [
        "expiry rendered as a warning banner rather than a status change",
        "policy renewed by editing the date",
      ],
      relatedMechanisms: ["MEC-14", "MEC-04"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.6",
      standardId: "STD-08",
      displayId: "§2.6",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a threshold, cut-off, or confidence floor decides whether an action runs unattended, goes to a person, or is refused",
      obligation:
        "hold the threshold as a policy record whose assumptions name the labeled cases it was set against, the pinned model version and question schema including option order, and the error it trades, with review triggers on any change to them",
      evidenceRequired: [
        "policy_record.assumptions",
        "policy_record.review_triggers",
        "policy_record.version",
        "authority_grant.policy_refs",
      ],
      timeBound:
        "before the threshold gates a live action, and at every trigger",
      failureModes: [
        "confidence floor held in a configuration file with no provenance",
        "threshold tuned against one model version and left in force after a silent upgrade",
        "enumerated options reordered without a new policy version",
      ],
      relatedMechanisms: ["MEC-14", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.2.7",
      standardId: "STD-08",
      displayId: "§2.7",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "evidence bearing on whether an enforced policy still serves its stated purpose is held anywhere in the institution",
      obligation:
        "treat the holding as a fired review trigger — the policy moves to review_required within §2.3's clock, which starts the day the evidence was held, and the grants naming it in policy_refs follow per §2.4",
      evidenceRequired: [
        "policy_record.review_triggers",
        "policy_record.status",
        "held_evidence.date_acquired",
        "authority_grant.policy_refs",
      ],
      timeBound:
        "within the trigger's declared clock, counted from when the evidence was held",
      failureModes: [
        "a coverage rule enforced after the institution's own guideline committee adopted its replacement",
        "review_triggers naming only internal events (model version, schema) and no class of outside evidence",
        "knowledge held in a clinical or specialist office that the enforcement pipeline never reads",
      ],
      relatedMechanisms: ["MEC-14", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.3.1",
      standardId: "STD-08",
      displayId: "§3.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a requirement, control description, or assurance claim says a human reviews, approves, supervises, or monitors a delegated action",
      obligation:
        "resolve it to an intervention specification naming owner, information_available, actions_preventable, states_alterable, on_disagreement, incentives, cost_to_exercise, and reach_time_target",
      evidenceRequired: [
        "intervention_spec.owner",
        "intervention_spec.information_available",
        "intervention_spec.actions_preventable",
        "intervention_spec.states_alterable",
        "intervention_spec.on_disagreement",
        "intervention_spec.reach_time_target",
      ],
      timeBound: "before the claim is relied on",
      failureModes: [
        "human in the loop named as a control with nothing behind it",
        "owner named as a team rather than a reachable person",
      ],
      relatedMechanisms: ["MEC-16"],
      relatedValidators: [],
    },
    {
      id: "STD-08.3.2",
      standardId: "STD-08",
      displayId: "§3.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a grant carries mode confirm, the mode STD-07 §2.2 requires the authorization to record",
      obligation:
        "carry intervention_ref pointing at the specification; a confirm mode with no specification behind it is recorded as unattended",
      evidenceRequired: [
        "authority_grant.mode",
        "authority_grant.intervention_ref",
        "intervention_spec.spec_id",
      ],
      timeBound: "at grant issue",
      failureModes: [
        "confirm mode used to describe a notification",
        "specification exists for the pilot but not for the scaled deployment",
      ],
      relatedMechanisms: ["MEC-16", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.3.3",
      standardId: "STD-08",
      displayId: "§3.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "states_alterable is empty, or the preventable actions are not the actions the delegation takes",
      obligation:
        "refuse to record the arrangement as a control, cite it in a safety case, or count it toward a correction-capacity claim; record it as advisory review under that name",
      evidenceRequired: [
        "intervention_spec.states_alterable",
        "intervention_spec.actions_preventable",
        "intervention_spec.mechanism",
      ],
      timeBound: "continuous",
      failureModes: [
        "reviewer can reject into a queue nobody drains while the action proceeds",
        "advisory review counted twice, as oversight and as correction capacity",
      ],
      relatedMechanisms: ["MEC-16", "MEC-05"],
      relatedValidators: [],
    },
    {
      id: "STD-08.3.4",
      standardId: "STD-08",
      displayId: "§3.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an intervention specification is in force",
      obligation:
        "measure per review period the approval rate, the median and tail time spent per approval, and the share of approvals reaching the owner inside reach_time_target",
      evidenceRequired: [
        "intervention_spec.reach_time_target",
        "intervention_spec.cost_to_exercise",
        "intervention_roster_metrics",
      ],
      timeBound: "each review period",
      failureModes: [
        "specification written once and never measured",
        "approval time measured as queue time rather than time spent",
      ],
      relatedMechanisms: ["MEC-16", "MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-08.3.5",
      standardId: "STD-08",
      displayId: "§3.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "approval rates sit at or near unanimity, or median approval time is too short for the information named to have been read, against thresholds the operator publishes with the specification before the review period",
      obligation:
        "open a reconsideration of the intervention specification; the finding is about the control, not the reviewer",
      evidenceRequired: [
        "intervention_spec.information_available",
        "intervention_spec.incentives",
        "reconsideration.subject",
      ],
      timeBound: "at the review period boundary",
      failureModes: [
        "high approval rate reported as evidence the system is safe",
        "reviewer disciplined instead of the specification being repaired",
      ],
      relatedMechanisms: ["MEC-16", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-08.3.6",
      standardId: "STD-08",
      displayId: "§3.6",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a score or threshold decides which decisions reach the owner",
      obligation:
        "treat the threshold as part of the intervention specification, record what the owner is shown and what never reaches them, reopen the specification when the threshold changes, and route a declared share of unreviewed decisions to review on a declared cadence, measured apart from the routed queue",
      evidenceRequired: [
        "intervention_spec.information_available",
        "intervention_spec.owner",
        "reconsideration.trigger",
      ],
      timeBound:
        "on the declared sampling cadence, and at every threshold change",
      failureModes: [
        "only low-confidence cases reach review, so confident errors are never seen",
        "threshold raised to cut review volume without reopening the specification",
        "reviewer shown the model's score and anchored by it, with no record that it was shown",
      ],
      relatedMechanisms: ["MEC-16", "MEC-07"],
      relatedValidators: [],
    },
    {
      id: "STD-08.4.1",
      standardId: "STD-08",
      displayId: "§4.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a consequential grant is issued",
      obligation:
        "state its correction capacity across detection, challenge, standing, review, authority to modify, reversible state transitions, and practical ability to operate after correction, each with named evidence",
      evidenceRequired: [
        "authority_grant.evidence_basis",
        "intervention_spec.states_alterable",
        "standing_register.possible_state_transitions",
        "dependency_record.correction_latency",
      ],
      timeBound: "at grant issue",
      failureModes: [
        "capacity asserted as a list of tools rather than a demonstrated route",
        "reversal possible in the system but not in the downstream records it wrote",
      ],
      relatedMechanisms: ["MEC-16", "MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-08.4.2",
      standardId: "STD-08",
      displayId: "§4.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an expansion decision is taken under STD-08.1.3",
      obligation:
        "evidence a matching expansion of correction capacity at the same decision, or refuse the expansion and narrow the scope to what the existing capacity covers",
      evidenceRequired: [
        "authority_grant.state_history",
        "dependency_record.correction_latency",
        "intervention_spec.states_alterable",
      ],
      timeBound: "at the expansion decision",
      failureModes: [
        "throughput multiplied while the review roster stays the same size",
        "capacity growth promised for a later quarter",
      ],
      relatedMechanisms: ["MEC-19", "MEC-16"],
      relatedValidators: [],
    },
    {
      id: "STD-08.4.3",
      standardId: "STD-08",
      displayId: "§4.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a grant is renewed under STD-08.1.1",
      obligation:
        "re-examine correction capacity against the volume and consequence of what the grant actually did in the period; degraded capacity moves the grant to review_required",
      evidenceRequired: [
        "authority_grant.state",
        "dependency_record.correction_latency",
        "intervention_spec.cost_to_exercise",
      ],
      timeBound: "at renewal",
      failureModes: [
        "capacity checked against forecast volume rather than actual volume",
        "attrition in the correcting roster invisible to the renewal",
      ],
      relatedMechanisms: ["MEC-13", "MEC-16"],
      relatedValidators: [],
    },
    {
      id: "STD-08.4.4",
      standardId: "STD-08",
      displayId: "§4.4",
      type: "obligation",
      requirementLevel: "SHOULD",
      condition:
        "the practical ability to operate after correction is claimed as capacity",
      obligation:
        "evidence it from the deployment's dependency record under STD-06, using correction_latency and the institutional level of reversibility; a correction the institution cannot afford is not capacity",
      evidenceRequired: [
        "dependency_record.reversibility",
        "dependency_record.correction_latency",
        "dependency_record.last_withdrawal_rehearsal",
      ],
      timeBound: "at grant issue and each renewal",
      failureModes: [
        "technical reversibility presented as institutional reversibility",
        "rehearsal never run, so the claim is untested",
      ],
      relatedMechanisms: ["MEC-16", "MEC-15"],
      relatedValidators: [],
    },
    {
      id: "STD-08.4.5",
      standardId: "STD-08",
      displayId: "§4.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a grant is issued or its scope changes",
      obligation:
        "record the seven components of §4.1 on the grant, each with its own evidence, and recheck capacity whenever scope changes; a grant whose scope has grown while its stated capacity is unchanged does not take effect until the capacity has been re-assessed",
      evidenceRequired: [
        "authority_grant.correction_capacity",
        "authority_grant.correction_capacity.assessed_at",
        "authority_grant.correction_capacity.detection",
        "authority_grant.correction_capacity.challenge",
        "authority_grant.correction_capacity.standing",
        "authority_grant.correction_capacity.review",
        "authority_grant.correction_capacity.authority_to_modify",
        "authority_grant.correction_capacity.reversible_transitions",
        "authority_grant.correction_capacity.operable_after_correction",
        "authority_grant.state_history",
      ],
      timeBound: "at grant issue and at every scope change",
      failureModes: [
        "capacity stated once at issue and carried unchanged through every widening",
        "components listed without dates, so a capacity never exercised reads as held",
      ],
      relatedMechanisms: ["MEC-13", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-08.4.6",
      standardId: "STD-08",
      displayId: "§4.6",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "one provider is necessary both to execute a consequential process and to evaluate it",
      obligation:
        "refuse to count detection as satisfied by instrumentation the executing provider alone supplies or controls, and record on the grant who evaluates and whether the evaluator is independent of the executor",
      evidenceRequired: [
        "authority_grant.correction_capacity.detection.independent_of_executor",
        "authority_grant.correction_capacity.detection.evaluator",
        "dependency_record.independent_evaluation",
      ],
      timeBound: "at grant issue and each renewal",
      failureModes: [
        "vendor telemetry counted as the detection component of its own performance",
        "independent evaluator named but reliant on the executor for the data it evaluates",
      ],
      relatedMechanisms: ["MEC-13", "MEC-18"],
      relatedValidators: [],
    },
  ],
  "STD-09": [
    {
      id: "STD-09.1.1",
      standardId: "STD-09",
      displayId: "§1.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a consequential decision is produced by a chain of delegations",
      obligation:
        "enumerate every contributing delegation in execution order on the head grant's chain field, each resolving to a full authority grant record; a decision whose chain cannot be enumerated must not run unattended",
      evidenceRequired: ["authority_grant.chain", "authority_grant_register"],
      timeBound: "before the chain runs unattended",
      failureModes: [
        "the chain exists in a vendor's architecture diagram but resolves to no grant ids",
        "a hop added after issue and never added to the enumeration",
      ],
      relatedMechanisms: ["MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-09.1.2",
      standardId: "STD-09",
      displayId: "§1.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a hop of a chain is recorded",
      obligation:
        "record it as a full delegation under STD-07 §2.2 with its own scope, mode, expiry, and revocation conditions; a hop with none is a transfer, and a chain containing a transfer is governed as a transfer",
      evidenceRequired: [
        "authority_grant.revocation_conditions",
        "authority_grant.until",
      ],
      timeBound: "at chain issue and at each hop change",
      failureModes: [
        "an internal service call treated as too internal to be a delegation",
        "a hop with no revocation conditions counted as a delegation because it has a grant id",
      ],
      relatedMechanisms: ["MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-09.1.3",
      standardId: "STD-09",
      displayId: "§1.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a chain is issued or renewed",
      obligation:
        "terminate it in one issuing authority and one liability record; the head grant's liability answers for every hop, and a counterparty's downstream acceptance is evidence, never a substitute",
      evidenceRequired: [
        "authority_grant.liability",
        "authority_grant.issuing_authority",
      ],
      timeBound: "at chain issue and each renewal",
      failureModes: [
        "liability diffused across hops so no one party answers",
        "a vendor's contractual acceptance recorded as relieving the head institution",
      ],
      relatedMechanisms: ["MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-09.1.4",
      standardId: "STD-09",
      displayId: "§1.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a hop's scope widens or its provider or composition changes",
      obligation:
        "move the head grant to review_required until the chain-level checks of Parts B and D are re-run",
      evidenceRequired: [
        "authority_grant.state_history",
        "authority_grant.chain",
      ],
      timeBound: "at the change, before the widened chain runs again",
      failureModes: [
        "a hop widened inside its own grant while the head grant still reads as issued",
        "a provider swap behind an unchanged interface recorded as no event at all",
      ],
      relatedMechanisms: ["MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-09.1.5",
      standardId: "STD-09",
      displayId: "§1.5",
      type: "obligation",
      requirementLevel: "MUST",
      condition:
        "a component routes, orders, ranks, filters, or drops the cases, inputs, or evidence a consequential decision is made on",
      obligation:
        "enumerate it as a hop under §1.1 and assess its consequence on the aggregate effect of its outputs, not on any single output",
      evidenceRequired: [
        "authority_grant.chain",
        "authority_grant.scope",
        "decision_record.evidence_refs",
      ],
      timeBound: "at chain issue, and whenever such a component is added",
      failureModes: [
        "a triage classifier treated as infrastructure because each routing call looks trivial",
        "retrieval filtering drops the evidence a reviewer would have needed, with no record it was dropped",
      ],
      relatedMechanisms: ["MEC-13", "MEC-01"],
      relatedValidators: [],
    },
    {
      id: "STD-09.1.6",
      standardId: "STD-09",
      displayId: "§1.6",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a hop chooses at run time which delegate makes a decision",
      obligation:
        "grant it as a delegation whose scope is the set it may choose from, enumerate every delegate in that set under §1.1, name the delegate that decided on each decision record, and treat adding a delegate as a chain event under §1.4",
      evidenceRequired: [
        "authority_grant.chain",
        "authority_grant.scope",
        "decision_record.owner",
        "authority_grant.state_history",
      ],
      timeBound: "at chain issue, and before a new delegate joins the set",
      failureModes: [
        "a model router's candidate list extended by a gateway vendor with no grant recorded",
        "decision records name the router but not the model that actually decided",
      ],
      relatedMechanisms: ["MEC-13", "MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-09.2.1",
      standardId: "STD-09",
      displayId: "§2.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a human window is claimed for a chain decision",
      obligation:
        "compute it as the intervention window minus the latency already consumed by upstream hops, measured from decision records; hops that run in series compose additively, and per-hop clocks must not be presented as parallel",
      evidenceRequired: [
        "decision_record.latency",
        "composed_window_measurement",
      ],
      timeBound:
        "at chain issue and whenever a hop's measured latency changes materially",
      failureModes: [
        "each hop promises a fast review while the composed latency consumes the human window",
        "nominal per-hop latencies summed as if the chain ran in parallel",
      ],
      relatedMechanisms: ["MEC-07", "MEC-20"],
      relatedValidators: [],
    },
    {
      id: "STD-09.2.2",
      standardId: "STD-09",
      displayId: "§2.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a chain's composed latency leaves no measured human window",
      obligation:
        "run it mode confirm at the chain boundary, or narrow it until a window exists; it must not run unattended",
      evidenceRequired: [
        "authority_grant.mode",
        "intervention_spec",
        "composed_window_measurement",
      ],
      timeBound: "before the chain runs unattended",
      failureModes: [
        "unattended mode justified by per-hop clocks no human can act within",
        "a confirm mode at one hop read as oversight of the whole chain",
      ],
      relatedMechanisms: ["MEC-16", "MEC-20"],
      relatedValidators: [],
    },
    {
      id: "STD-09.2.3",
      standardId: "STD-09",
      displayId: "§2.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "an intervention halts a chain",
      obligation:
        "make it one intervention at the chain boundary that halts every hop, with a halt receipt issued for the chain rather than a segment",
      evidenceRequired: ["intervention_spec", "chain_halt_receipt"],
      timeBound: "within the intervention spec's reach time",
      failureModes: [
        "each hop has a working stop control and the composed process never stops",
        "downstream hops continue on the output of a stopped hop",
      ],
      relatedMechanisms: ["MEC-05", "MEC-16", "MEC-20"],
      relatedValidators: [],
    },
    {
      id: "STD-09.2.4",
      standardId: "STD-09",
      displayId: "§2.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a composed window is stated",
      obligation:
        "measure hop latencies from decision records on a cadence and recompute the composed window whenever any hop's measured latency changes materially",
      evidenceRequired: [
        "decision_record.latency",
        "composed_window_measurement",
      ],
      timeBound: "on the declared cadence",
      failureModes: [
        "a composed window stated at issue time and never re-measured",
        "latency measured by each hop about itself",
      ],
      relatedMechanisms: ["MEC-07"],
      relatedValidators: [],
    },
    {
      id: "STD-09.3.1",
      standardId: "STD-09",
      displayId: "§3.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a hop runs through a counterparty",
      obligation:
        "name the counterparty, the grant under which the hop runs, and where that counterparty's correction capacity is recorded; a hop whose interface exposes none is recorded as unauditable and must not carry a consequential action class",
      evidenceRequired: [
        "authority_grant.chain",
        "counterparty_grant_reference",
      ],
      timeBound: "before the hop carries a consequential class",
      failureModes: [
        "a counterparty's correction capacity asserted by the head institution without a record",
        "an unauditable hop carrying consequential actions because the interface is convenient",
      ],
      relatedMechanisms: ["MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-09.3.2",
      standardId: "STD-09",
      displayId: "§3.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a chain is evaluated",
      obligation:
        "keep execution and evaluation separated at chain level as STD-08 §4.6 requires per hop; no single provider may be necessary both to execute a hop and to evaluate the chain's outcomes",
      evidenceRequired: [
        "dependency_record.independent_evaluation",
        "authority_grant.correction_capacity.detection.evaluator",
      ],
      timeBound: "at chain issue and each renewal",
      failureModes: [
        "the chain's only evaluator is a provider whose revenue depends on the chain's continuation",
        "per-hop independence claimed while chain-level evaluation collapses to one provider",
      ],
      relatedMechanisms: ["MEC-18"],
      relatedValidators: [],
    },
    {
      id: "STD-09.3.3",
      standardId: "STD-09",
      displayId: "§3.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a challenge concerns a hop run by a counterparty",
      obligation:
        "have each counterparty able to answer within the chain's reversal clock; one that cannot is recorded as such, and the head institution narrows the chain or accepts the answerability gap on its own liability record",
      evidenceRequired: [
        "authority_grant.liability",
        "challenge_outcome_log",
        "composed_reversal_clock",
      ],
      timeBound: "within the chain's reversal clock",
      failureModes: [
        "answerability asserted contractually and never tested against the clock",
        "the gap real but recorded nowhere the harmed party can read",
      ],
      relatedMechanisms: ["MEC-08", "MEC-11"],
      relatedValidators: [],
    },
    {
      id: "STD-09.4.1",
      standardId: "STD-09",
      displayId: "§4.1",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "correction capacity is claimed for a chain",
      obligation:
        "record it at chain level on the head grant as the minimum across hops of the seven components STD-08 §4.1 requires, not as the head institution's own capacity",
      evidenceRequired: [
        "authority_grant.correction_capacity",
        "authority_grant.chain",
      ],
      timeBound: "at chain issue and at each capacity recheck",
      failureModes: [
        "the head institution's capacity recorded as the chain's",
        "capacity averaged across hops, so one broken component hides",
      ],
      relatedMechanisms: ["MEC-13", "MEC-18"],
      relatedValidators: [],
    },
    {
      id: "STD-09.4.2",
      standardId: "STD-09",
      displayId: "§4.2",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a chain's scope is declared",
      obligation:
        "state what the composition can actually produce, including what hops produce together that none produces alone, bounded by the head grant's declared scope",
      evidenceRequired: ["authority_grant.scope", "chain_composition_analysis"],
      timeBound: "at chain issue and each composition change",
      failureModes: [
        "scope declared as the union or intersection of hop scopes",
        "an effect no hop authorizes alone produced by the composition and authorized by nobody",
      ],
      relatedMechanisms: ["MEC-13"],
      relatedValidators: [],
    },
    {
      id: "STD-09.4.3",
      standardId: "STD-09",
      displayId: "§4.3",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a hop is added, replaced, widened, or re-ordered",
      obligation:
        "treat it as an authorization decision for the chain under STD-08 §1.3, with its own evidence and its own capacity check",
      evidenceRequired: [
        "authority_grant.state_history",
        "authority_grant.renewal_basis",
      ],
      timeBound: "at the composition change",
      failureModes: [
        "composition drift treated as operations rather than as authorization",
        "the chain's renewal burden set by its oldest hop's clock",
      ],
      relatedMechanisms: ["MEC-19"],
      relatedValidators: [],
    },
    {
      id: "STD-09.4.4",
      standardId: "STD-09",
      displayId: "§4.4",
      type: "obligation",
      requirementLevel: "MUST",
      condition: "a chain depends on external counterparties",
      obligation:
        "record chain counterparties among the dependency record's dependents and substitution constraints, with correction latency measured for the chain",
      evidenceRequired: [
        "dependency_record.dependents",
        "dependency_record.substitution_cost",
        "dependency_record.correction_latency",
      ],
      timeBound: "at chain issue and at each dependency refresh",
      failureModes: [
        "counterparties absent from the dependency record because they are contracts, not systems",
        "withdrawal feasibility asserted without pricing the provider's incentive to resist it",
      ],
      relatedMechanisms: ["MEC-15", "MEC-18"],
      relatedValidators: [],
    },
  ],
};

/**
 * Resolve a standard id such as "STD-08" to its entry, so callers can link by
 * slug. Lower-casing an id does not produce a slug: STD-08 lives at
 * /standards/std-08-delegation, and pages that guessed the slug from the id
 * emitted 404s for every standard they cited.
 */
export const getStandardById = (id: string): StandardEntry | undefined =>
  standardsContent.standards.find((standard) => standard.id === id);

export const getStandardBySlug = (slug: string): StandardEntry | undefined =>
  standardsContent.standards.find((standard) => standard.slug === slug);
