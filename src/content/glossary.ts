import type { PageWithPermalink, PublicationMetadata } from "./types";

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  appliesTo: string[];
};

export type GlossaryTerritory = {
  id: string;
  label: string;
  tooltip: string;
};

export type GlossaryResource = {
  label: string;
  href: string;
  type: string;
};

export type GlossaryEntry = {
  id: string;
  title: string;
  status: string | null;
  classes?: string[];
  bodyHtml: string;
  scope?: string;
  adjacentTerms?: string[];
  operationalTests?: string[];
  genealogy?: string;
  references?: GlossaryResource[];
  examples?: string[];
  tags?: string[];
  resources?: GlossaryResource[];
  relatedPatterns?: string[];
};

export type GlossaryCategory = {
  id: string;
  heading: string;
  descriptionHtml: string;
  comingSoon: boolean;
  entries: GlossaryEntry[];
};

export type GlossaryContent = PageWithPermalink & {
  publication: PublicationMetadata;
  territoryMap: GlossaryTerritory[];
  categories: GlossaryCategory[];
  starterTerms: { id: string; label: string; description: string }[];
  categoryHighlights: { id: string; label: string; description: string }[];
};

export const glossaryContent: GlossaryContent = {
  pageTitle:
    "Ethotechnics glossary \u2014 Moral system design definitions and terminology",
  pageDescription:
    "Ethotechnics glossary of moral system design and ethical technology: definitions, examples, and resources organized by territory with stable permalinks for research and policy teams.",
  permalink: "/glossary",
  publication: {
    authors: [
      {
        name: "Ethotechnics Institute Research Team",
        affiliation: "Ethotechnics Institute",
        email: "research@ethotechnics.org",
      },
    ],
    contact: "research@ethotechnics.org",
    published: "2025-12-03T00:00:00Z",
    updated: "2026-01-09T00:00:00Z",
    version: "v1.1.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/save/https://ethotechnics.org/glossary",
    changelog: [
      {
        version: "v1.1.0",
        date: "2026-01-09",
        summary:
          "Expanded scholarly metadata, operational tests, and provenance notes.",
      },
      {
        version: "v1.0.0",
        date: "2025-12-03",
        summary: "Initial glossary release with stable permalinks.",
      },
    ],
    license: {
      label: "CC BY-SA 4.0",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    attribution:
      "Credit Ethotechnics Institute, include the term title + version, and link to the glossary permalink.",
  },
  starterTerms: [
    {
      id: "ethotechnics",
      label: "Ethotechnics",
      description:
        "The discipline itself and how moral behavior becomes a system capability.",
    },
    {
      id: "moral-behavior",
      label: "Moral behavior",
      description:
        "How systems avoid harm and distribute responsibility in practice.",
    },
    {
      id: "consent-journey",
      label: "Consent journey",
      description:
        "The checkpoints that keep consent informed and reversible over time.",
    },
  ],
  categoryHighlights: [
    {
      id: "core-concepts",
      label: "Core concepts",
      description:
        "Start here for shared definitions and the core Ethotechnics framing.",
    },
    {
      id: "governance",
      label: "Governance & power",
      description:
        "Terms that explain escalation paths, stewardship, and decision authority.",
    },
    {
      id: "burden-load",
      label: "Burden & load",
      description:
        "Language for how effort and harm shift across people and systems.",
    },
    {
      id: "friction",
      label: "Friction & flow",
      description:
        "Where to slow, pause, or redirect experience to protect people.",
    },
  ],
  territoryMap: [
    {
      id: "core-concepts",
      label: "Core concepts",
      tooltip: "Shared language that defines Ethotechnics.",
    },
    {
      id: "failure-modes",
      label: "Failure modes",
      tooltip: "Characteristic patterns of harm Ethotechnics addresses.",
    },
    {
      id: "capabilities",
      label: "Capabilities",
      tooltip: "Abilities systems need to behave morally at scale.",
    },
    {
      id: "system-states",
      label: "System states",
      tooltip: "Operational postures and fault modes that shape risk.",
    },
    {
      id: "human-limits",
      label: "Human limits",
      tooltip: "Human constraints and experience systems must respect.",
    },
    {
      id: "burden-load",
      label: "Burden & load",
      tooltip: "Who carries effort, cost, and harm when systems run or fail.",
    },
    {
      id: "measures",
      label: "Measures & indicators",
      tooltip: "Metrics that make moral performance legible.",
    },
    {
      id: "governance",
      label: "Governance & power",
      tooltip: "Who sets boundaries, who can intervene, and how.",
    },
    {
      id: "friction",
      label: "Friction & flow",
      tooltip: "Where to slow, pause, or smooth flows to protect people.",
    },
    {
      id: "decision-states",
      label: "Decision states & edges",
      tooltip: "Where decisions tip from reversible to permanent.",
    },
    {
      id: "patterns",
      label: "Patterns & anti-patterns",
      tooltip: "System archetypes that demand special care.",
    },
    {
      id: "future-concepts",
      label: "Future concepts",
      tooltip: "Active and emerging research threads in Ethotechnics.",
    },
    {
      id: "principles",
      label: "Foundational principles",
      tooltip: "Early axioms that will anchor the discipline.",
    },
  ],
  categories: [
    {
      id: "core-concepts",
      heading: "A. Core concepts",
      descriptionHtml:
        "These terms define the Ethotechnics discipline itself and set expectations for moral system design.",
      comingSoon: false,
      entries: [
        {
          id: "ethotechnics",
          title: "Ethotechnics",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The craft of designing systems that can behave morally. Where ethics asks \u201cWhat should I do?\u201d and systems theory asks \u201cHow does it behave?\u201d, Ethotechnics asks: <strong>How can it behave well?</strong> Moral behavior is treated as an architectural capability, not a personal virtue.</p>",
          examples: [
            "A hospital release board adds Ethotechnic stop-checks before deploying triage updates to keep clinicians in control.",
          ],
          tags: ["hospitals", "platforms", "governance"],
          resources: [
            {
              label: "AI governance",
              href: "/ai-governance/",
              type: "Resource",
            },
            {
              label: "Healthcare readiness checklist",
              href: "/healthcare/",
              type: "Guide",
            },
          ],
        },
        {
          id: "moral-behavior",
          title: "Moral Behavior (of Systems)",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Observable patterns of system behavior that prevent harm, share burden fairly, and keep people contestable and whole. Moral behavior is evaluated through <a href="#moral-performance-indicators">MPIs</a> such as <a href="#time-to-halt">time-to-halt</a>, <a href="#reversibility">reversibility</a>, and <a href="#fair-burden-distribution">fair burden distribution</a>\u2014not by stated intent.</p>',
          examples: [
            "A payments platform throttles recommendations when fraud signals spike until human reviewers clear the backlog.",
          ],
          tags: ["platforms", "finance", "safety"],
          resources: [
            {
              label: "Civic services",
              href: "/civic-services/",
              type: "Essay",
            },
            {
              label: "Maintenance simulator",
              href: "/diagnostics/maintenance-simulator/",
              type: "Tool",
            },
          ],
        },
        {
          id: "ethical-load-path",
          title: "Ethical Load Path",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The route moral responsibility travels through a system\u2014across automation, humans, and institutions. A clear ethical load path shows who can stop, reverse, or repair harm at each stage, linking <a href="#design-authority">design authority</a>, <a href="#oversight-horizon">oversight horizons</a>, and the <a href="#repair-log">repair log</a>.</p>',
          examples: [
            "A transit authority publishes who can halt automated dispatch at each escalation step, including night-shift supervisors.",
          ],
          tags: ["transit", "ops-teams", "oversight"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
            {
              label: "Accountability architectures",
              href: "/accountability-architectures/",
              type: "Guide",
            },
          ],
        },
        {
          id: "ethotechnic-audit",
          title: "Ethotechnic Audit",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A structured assessment of a system\u2019s capacity to stop harm, reverse it, distribute burden fairly, remain contestable, and enable accountability. Audits surface where <a href="#stoppability">stoppability</a> or <a href="#reversibility">reversibility</a> fail and guide concrete remediation steps.</p>',
          examples: [
            "A platform review board runs an Ethotechnic audit after an outage to trace who could have halted or reversed the release.",
          ],
          tags: ["platforms", "audits", "sre"],
          resources: [
            {
              label: "AI governance",
              href: "/ai-governance/",
              type: "Guide",
            },
          ],
        },
        {
          id: "conviviality",
          title: "Conviviality",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The degree to which tools and institutions expand people\u2019s agency, cooperation, and right of refusal instead of enclosing them. Convivial systems keep <a href="#permission-surface">permission surfaces</a> wide and make opting out safe, so people can shape the service without being consumed by it.</p>',
          examples: [
            "A mutual aid platform lets neighbors pause notifications or change delivery preferences without losing access to support.",
          ],
          tags: ["community", "platforms", "mutual-aid"],
          resources: [
            {
              label: "Mechanisms catalog",
              href: "/mechanisms",
              type: "Reference",
            },
          ],
        },
        {
          id: "ethotechnic-maturity",
          title: "Ethotechnic Maturity",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A developmental scale describing how fully a system embodies Ethotechnic capabilities. Early maturity focuses on stopping acute harms; later stages add <a href="#graceful-degradation">graceful degradation</a>, <a href="#contestability">contestability</a>, and regular <a href="#care-retrospective">care retrospectives</a>. The highest level treats ethics as continuous operations, with published <a href="#service-level-indicators">SLJs</a> and funded maintenance practice.</p>',
          examples: [
            "A rail operator publishes service-level justice metrics and funds quarterly pause drills to keep reversibility fresh.",
          ],
          tags: ["rail", "sre", "maturity"],
          resources: [
            {
              label: "Maintenance guidance",
              href: "/docs/maintenance/",
              type: "Guide",
            },
            {
              label: "Maintenance playbooks",
              href: "/maintenance-playbooks/",
              type: "Resource",
            },
          ],
        },
        {
          id: "mechanism-first-analysis",
          title: "Mechanism-first Analysis",
          status: null,
          classes: [],
          bodyHtml:
            "<p>An approach that prioritizes system mechanics\u2014defaults, authority, clocks, reversibility\u2014over declared values or intentions, because mechanics determine outcomes under load.</p>",
        },
        {
          id: "architecture-over-values",
          title: "Architecture over Values",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The claim that \u201cethical\u201d outcomes depend less on what institutions say they value and more on the enforceable structure of how decisions are made and reversed.</p>",
        },
        {
          id: "state-plus-clocks-model",
          title: "State + Clocks Model",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A way of seeing power as state transitions plus time: who can change state, how quickly, and whether reversal is time-bound.</p>",
        },
        {
          id: "contestability-architecture",
          title: "Contestability Architecture",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The set of design features that make contestation real: decision objects, clock-start, binding authority, evidence parity, and guaranteed override paths.</p>",
        },
        {
          id: "control-loops-constraints-framing",
          title: "Control Loops (Constraints Framing)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A safety lens where governance is modeled as feedback: detect harm, trigger intervention, enforce constraints, and learn. Useful for translating Ethotechnics into engineering terms.</p>",
        },
        {
          id: "legibility",
          title: "Legibility",
          status: null,
          classes: [],
          bodyHtml:
            '<p>How understandable a system\u2019s actions, reasoning, and ownership are to the people affected by it. Legibility complements <a href="#explainability-for-accountability">explainability for accountability</a> and transparent <a href="#design-authority">design authority</a>.</p>',
          examples: [
            "Residents receive a plain-language notice that cites the office and policy behind a zoning decision.",
          ],
          tags: ["transparency", "governance", "users"],
          resources: [
            {
              label: "Civic services",
              href: "/civic-services/",
              type: "Essay",
            },
          ],
        },
        {
          id: "sociotechnical-alignment",
          title: "Sociotechnical Alignment",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Alignment achieved not just in the model, but across tools, interfaces, incentives, workflows, and organizational structures. Sociotechnical alignment keeps the <a href="#ethical-load-path">ethical load path</a> intact under pressure.</p>',
          examples: [
            "Policy, tooling, and incentives all enforce the same stoppability rules.",
          ],
          tags: ["organizations", "governance", "systems"],
          resources: [
            {
              label: "Accountability architectures",
              href: "/accountability-architectures/",
              type: "Guide",
            },
          ],
        },
      ],
    },
    {
      id: "failure-modes",
      heading: "B. Failure modes (why Ethotechnics exists)",
      descriptionHtml:
        "Common patterns where responsibility dissolves and harm accelerates.",
      comingSoon: false,
      entries: [
        {
          id: "moral-latency",
          title: "Moral Latency",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The delay between harm occurring and the system recognizing it. Automated systems create harms faster than human oversight can register, demanding <a href="#velocity-friction">velocity friction</a> and <a href="#ethical-interrupts">ethical interrupts</a>.</p>',
          examples: [
            "A clinic triage chatbot keeps routing people while harm reports queue for hours, hiding the moral latency from clinicians.",
          ],
          tags: ["hospitals", "automation", "latency"],
          resources: [
            {
              label: "Healthcare safeguards",
              href: "/healthcare/",
              type: "Guide",
            },
          ],
        },
        {
          id: "accountability-diffusion",
          title: "Accountability Diffusion",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Responsibility dissolves across teams, tools, and incentives until no one can intervene. A defining pattern of modern institutions and a direct threat to clear <a href="#design-authority">design authority</a>.</p>',
          examples: [
            "A support ticket bounces between a vendor and a hospital compliance team with no one empowered to pause the rollout.",
          ],
          tags: ["platforms", "governance", "hospitals"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
            {
              label: "Burden Modeler",
              href: "/diagnostics/burden-modeler",
              type: "Tool",
            },
          ],
        },
        {
          id: "extraction",
          title: "Extraction",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When a system pulls value\u2014data, attention, labor, or social capital\u2014without returning care, consent, or repair. Extraction hides true costs through <a href="#externalization">externalization</a> and steep <a href="#burden-gradient">burden gradients</a>, hollowing trust.</p>',
          examples: [
            "A data-labeling program offloads unpaid overnight verification to gig workers while the platform reports clean metrics.",
          ],
          tags: ["labor", "platforms", "ai"],
          resources: [
            {
              label: "AI governance",
              href: "/ai-governance/",
              type: "Guide",
            },
            {
              label: "Reference archive",
              href: "/resources/",
              type: "Essay",
            },
          ],
        },
        {
          id: "extraction-by-endurance",
          title: "Extraction by Endurance",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Systems that depend on workers or users absorbing fragility through burnout, emotional labor, or unpaid cognitive work\u2014often mislabeled as \u201cresilience.\u201d Ethotechnic practice aims to invert this burden with <a href="#fair-burden-distribution">fair burden distribution</a>.</p>',
        },
        {
          id: "drift",
          title: "Drift (System Drift)",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The natural tendency of systems to externalize harm over time unless constrained by <a href="#protective-friction">protective friction</a> and <a href="#moral-performance-indicators">moral performance indicators</a>.</p>',
        },
        {
          id: "externalization",
          title: "Externalization",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Pushing risk, cost, or harm onto other teams, communities, or the future so metrics look clean. Externalization shows up as pollution, shadow labor, or brittle dependencies that live outside audits.</p><p>Ethotechnics counters it with <a href="#oversight-horizon">oversight horizons</a>, <a href="#moral-performance-indicators">MPIs</a>, and transparent <a href="#repair-log">repair logs</a>.</p>',
        },
        {
          id: "brittleness",
          title: "Brittleness",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When a system shatters under real-world variance\u2014unexpected inputs, refusals, or edge cases\u2014forcing humans to absorb impact. Brittleness signals missing <a href="#soft-edges">soft edges</a>, thin <a href="#graceful-degradation">graceful degradation</a>, and poor <a href="#human-refusal-tolerance">refusal tolerance</a>.</p>',
          examples: [
            "A flight booking bot fails on hyphenated surnames, forcing airport agents to override tickets at the counter.",
          ],
          tags: ["aviation", "automation", "support"],
          resources: [],
        },
        {
          id: "optimization-myopia",
          title: "Optimization Myopia",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Metric-chasing that narrows attention to throughput or growth while ignoring <a href="#moral-performance-indicators">MPIs</a>. Myopic optimization erodes <a href="#contestability">contestability</a>, raises <a href="#failure-load">failure load</a>, and often fuels <a href="#extraction">extraction</a>.</p>',
        },
        {
          id: "precision-laundering",
          title: "Precision Laundering",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Using detailed metrics or probabilistic scores to disguise inequity as objectivity. Precision laundering hides <a href="#burden-gradient">burden gradients</a> and <a href="#externalization">externalization</a> behind statistical gloss, undermining <a href="#explainability-for-accountability">explainability for accountability</a>.</p>',
        },
        {
          id: "compliance-collapse",
          title: "Compliance Collapse",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When rigid policy checklists replace judgment, causing teams to follow rules while harm worsens. Compliance collapses occur when <a href="#design-authority">design authority</a> is weak and <a href="#contestability">contestability</a> is low, leaving no path to pause or repair.</p>',
        },
        {
          id: "unseen-harm",
          title: "Unseen Harm",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Harm that does not produce immediately legible signals\u2014silence, withdrawal, dropout, dissociation\u2014and is therefore misread as \u201cno issue.\u201d</p>",
        },
        {
          id: "ethics-debt",
          title: "Ethics Debt",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The accumulation of unresolved ethical risk from shipping capabilities faster than governance, ownership, and repair mechanisms. Ethics debt grows when <a href="#maintenance-debt">maintenance debt</a> outpaces the <a href="#repair-log">repair log</a>.</p>',
          examples: [
            "A recommender launches without consent review, adding unresolved risks to the repair log.",
          ],
          tags: ["governance", "risk", "maintenance"],
          resources: [
            {
              label: "Maintenance guidance",
              href: "/docs/maintenance/",
              type: "Guide",
            },
          ],
        },
        {
          id: "unowned-harm",
          title: "Unowned Harm",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Negative outcomes for which no clear individual or role is accountable, even though the system caused them. Unowned harm signals <a href="#accountability-diffusion">accountability diffusion</a> and weak <a href="#traceable-ownership">traceable ownership</a>.</p>',
          examples: [
            "Denied applicants cannot identify a responsible team to contest a decision.",
          ],
          tags: ["accountability", "governance", "harm"],
          resources: [
            {
              label: "Accountability architectures",
              href: "/accountability-architectures/",
              type: "Guide",
            },
          ],
        },
        {
          id: "capability-overhang",
          title: "Capability Overhang",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When a system\u2019s power exceeds the maturity of its controls, making failures likely even without malicious intent. Capability overhang shows up as strong automation but weak <a href="#stoppability">stoppability</a> or <a href="#reversibility">reversibility</a>.</p>',
          examples: [
            "A model can auto-approve loans, but rollback and auditing are manual and slow.",
          ],
          tags: ["risk", "safety", "governance"],
          resources: [
            {
              label: "Mechanisms catalog",
              href: "/mechanisms",
              type: "Reference",
            },
          ],
        },
        {
          id: "ethics-theater",
          title: "Ethics Theater",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Public displays of ethical concern without operational mechanisms that change system behavior. Ethics theater often masks <a href="#compliance-collapse">compliance collapse</a> and low <a href="#contestability">contestability</a>.</p>',
          examples: [
            "The team publishes a code of ethics but lacks monitoring or a repair log.",
          ],
          tags: ["governance", "trust", "risk"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
          ],
        },
      ],
    },
    {
      id: "capabilities",
      heading: "C. Ethotechnic capabilities (what systems must be able to do)",
      descriptionHtml:
        "Design requirements that keep people safe when systems scale.",
      comingSoon: false,
      entries: [
        {
          id: "stoppability",
          title: "Stoppability",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>A system\u2019s ability to halt harmful processes quickly and automatically\u2014without requiring heroism or escalation.</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Stoppability diagram</title>\n                            <rect x="10" y="30" width="70" height="20" rx="10" class="diagram-track"></rect>\n                            <circle cx="40" cy="40" r="22" class="diagram-stop"></circle>\n                            <line x1="85" y1="40" x2="110" y2="40" class="diagram-flow"></line>\n                            <path d="M40 28 L48 40 L40 52 L32 40 Z" class="diagram-stop-symbol"></path>\n                          </svg>\n                        </figure>',
          relatedPatterns: ["kill-switch", "maintenance-windowing"],
        },
        {
          id: "reversibility",
          title: "Reversibility",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>The ease with which a system can undo a harmful state change\u2014restore access, correct a record, reverse a flag\u2014without extraordinary effort or power. Reversibility is a governance property: it determines whether mistakes are survivable.</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Reversibility diagram</title>\n                            <path d="M70 24c12 4 20 15 18 27-2 15-17 27-34 22-17-5-24-25-14-40 8-12 24-16 37-10" class="diagram-loop"></path>\n                            <polyline points="70,24 70,42 52,42" class="diagram-loop-arrow"></polyline>\n                          </svg>\n                        </figure>',
        },
        {
          id: "fair-burden-distribution",
          title: "Fair Burden Distribution",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>Failures do not fall hardest on the most vulnerable. Burden is treated as a design variable and measured via the <a href="#user-burden-ratio">user burden ratio</a>.</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Fair burden distribution diagram</title>\n                            <line x1="20" y1="40" x2="100" y2="40" class="diagram-scale"></line>\n                            <circle cx="40" cy="40" r="16" class="diagram-scale-pan"></circle>\n                            <circle cx="80" cy="40" r="16" class="diagram-scale-pan"></circle>\n                            <rect x="56" y="18" width="8" height="44" class="diagram-pivot"></rect>\n                          </svg>\n                        </figure>',
        },
        {
          id: "contestability",
          title: "Contestability",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>The property of a system that allows affected people to force a decision to become a contestable object: something with reasons, a clock, an accountable authority, and a pathway to reversal. A system has contestability when \u201cthat\u2019s wrong\u201d can reliably become \u201chere is the specific decision, here is who can change it, and here is when they must respond.\u201d</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Contestability diagram</title>\n                            <path d="M24 64 L24 20 L48 20 L48 40 L72 40 L72 20 L96 20 L96 64" class="diagram-portal"></path>\n                            <circle cx="48" cy="52" r="8" class="diagram-voice"></circle>\n                            <line x1="48" y1="52" x2="64" y2="52" class="diagram-voice-line"></line>\n                          </svg>\n                        </figure>',
        },
        {
          id: "refusability",
          title: "Refusability",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A system\u2019s ability to let people say \u201cno\u201d without punishment or degradation\u2014including refusing data extraction, risky defaults, or coercive workflows\u2014while still preserving basic access and dignity. Refusability is not \u201copt-out exists\u201d; it\u2019s whether refusal is treated as a legitimate state rather than an error condition.</p>",
        },
        {
          id: "explainability-for-accountability",
          title: "Explainability for Accountability",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>Explanations that are actionable, not decorative. They reveal who made a decision and how it can be corrected, enabling <a href="#contestability">contestability</a> and <a href="#ethotechnic-audit">audits</a>.</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Explainability diagram</title>\n                            <rect x="18" y="18" width="84" height="44" rx="10" class="diagram-card"></rect>\n                            <circle cx="40" cy="40" r="10" class="diagram-focus"></circle>\n                            <line x1="52" y1="30" x2="84" y2="30" class="diagram-detail"></line>\n                            <line x1="52" y1="40" x2="84" y2="40" class="diagram-detail"></line>\n                            <line x1="52" y1="50" x2="74" y2="50" class="diagram-detail"></line>\n                          </svg>\n                        </figure>',
        },
        {
          id: "human-refusal-tolerance",
          title: "Human Refusal-Tolerance",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The system remains usable when people opt out, are confused, make mistakes, or withdraw cooperation. Refusal tolerance prevents <a href="#extraction-by-endurance">extraction by endurance</a> by ensuring refusals do not silently convert into extra unpaid work.</p>',
        },
        {
          id: "graceful-degradation",
          title: "Fail-soft / Graceful Degradation",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A design principle where systems degrade safely under stress\u2014reduced capability rather than catastrophic denial\u2014especially under accessibility constraints.</p>",
        },
        {
          id: "soft-edges",
          title: "Soft Edges",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Boundary conditions designed to cushion people instead of penalizing them\u2014graduated responses, warnings before lockouts, and reversible defaults. Soft edges reduce <a href="#failure-load">failure load</a> and guard against <a href="#brittleness">brittleness</a>.</p>',
        },
        {
          id: "governability",
          title: "Governability",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The degree to which a system can be steered, paused, audited, corrected, or shut down after deployment. High governability requires <a href="#stoppability">stoppability</a>, <a href="#reversibility">reversibility</a>, and durable <a href="#contestability">contestability</a>.</p>',
          examples: [
            "The city\u2019s benefits system can be paused, rolled back, and audited within hours.",
          ],
          tags: ["governance", "controls", "safety"],
          resources: [
            {
              label: "Mechanisms catalog",
              href: "/mechanisms",
              type: "Reference",
            },
          ],
        },
        {
          id: "incident-literacy",
          title: "Incident Literacy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The ability to recognize failures as incidents (not anomalies) and respond with containment, logging, escalation, and repair. It pairs <a href="#ethical-interrupts">ethical interrupts</a> with a living <a href="#repair-log">repair log</a>.</p>',
          examples: [
            "A moderation team opens an incident ticket for bias spikes, not just a bug report.",
          ],
          tags: ["operations", "safety", "response"],
          resources: [
            {
              label: "Maintenance playbooks",
              href: "/maintenance-playbooks/",
              type: "Resource",
            },
          ],
        },
      ],
    },
    {
      id: "system-states",
      heading: "D. System states & architectures",
      descriptionHtml:
        "Operational postures that determine how harm is absorbed\u2014or amplified.",
      comingSoon: false,
      entries: [
        {
          id: "fail-safe",
          title: "Fail-Safe Mode",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The system defaults to the safest possible behavior when uncertain, prioritizing <a href="#stoppability">stoppability</a>.</p>',
        },
        {
          id: "fail-open",
          title: "Fail-Open Mode",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The system defaults to permissiveness under failure\u2014sometimes necessary, sometimes dangerous. Must be paired with <a href="#velocity-friction">velocity friction</a>.</p>',
        },
        {
          id: "fail-silent",
          title: "Fail-Silent Mode",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A harmful state where systems fail without signaling it; the worst possible form of failure because it hides <a href="#moral-latency">moral latency</a>.</p>',
        },
        {
          id: "crumple-zone",
          title: "Crumple Zone / Human-as-Crumple-Zone",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Originally: machines absorb force so people survive. Digitally: people absorb system failures so machines stay smooth. Ethotechnics reverses this direction of impact.</p>",
        },
        {
          id: "harm-visibility",
          title: "Harm Visibility",
          status: null,
          classes: [],
          bodyHtml:
            '<p>How plainly a system exposes the human impact of its decisions in real time. High harm visibility pairs logs, narratives, and alerts so <a href="#oversight-horizon">oversight horizons</a> extend beyond dashboards and <a href="#ethical-interrupts">ethical interrupts</a> trigger on lived effects, not just technical anomalies.</p>',
        },
        {
          id: "dead-zones",
          title: "Dead Zones / Moral Dead Zones",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Places in a system where harm occurs but no one can see, trace, or intervene. Closing dead zones is a goal of <a href="#oversight-horizon">oversight horizons</a>.</p>',
        },
        {
          id: "escalation-horizon",
          title: "Escalation Horizon",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The predefined point where automated control must yield to human judgment because risk, ambiguity, or <a href="#moral-latency">moral latency</a> is rising. Escalation horizons activate <a href="#ethical-interrupts">ethical interrupts</a> and route cases to accountable stewards before crossing an <a href="#irreversible-boundary">irreversible boundary</a>.</p>',
        },
        {
          id: "interaction-surface",
          title: "Interaction Surface",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The moments, interfaces, and channels where people experience system decisions and can intervene. Mapping the interaction surface reveals where to place <a href="#dignity-friction">dignity friction</a>, widen the <a href="#permission-surface">permission surface</a>, and detect <a href="#dead-user-zones">dead-user zones</a>.</p>',
        },
        {
          id: "maintenance-window",
          title: "Maintenance Window",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A scheduled calm state where teams intentionally slow or stop throughput so inspections, upgrades, and rehearsals can happen without crisis pressure. Maintenance windows make <a href="#stoppability">stoppability</a> routine instead of reactive.</p><p>Each window is negotiated with the people impacted, includes published service guarantees, and documents which safeguards were tested so unfinished work rolls into the shared <a href="#repair-log">repair log</a>.</p>',
        },
        {
          id: "care-retrospective",
          title: "Care Retrospective",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A facilitated reflection held while the system is still in a warning band to examine how maintenance load, emotional labor, and unresolved incidents are accumulating. Care retrospectives combine telemetry with frontline testimony.</p><p>They redistribute responsibilities before burnout or harm escalates, triggering new <a href="#maintenance-window">maintenance windows</a> or policy fixes when the team cannot keep absorbing risk.</p>',
        },
        {
          id: "repair-log",
          title: "Repair Log",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A living record of every mitigation, decision, and resource commitment made after a fault. Repair logs make accountability legible by linking people harmed, who intervened, and what evidence was used.</p><p>They inform future <a href="#care-retrospective">care retrospectives</a>, power audits, and service-level reports so follow-up work is traceable and burden does not drift back to the same communities.</p>',
        },
      ],
    },
    {
      id: "human-limits",
      heading: "E. Human limits & experience",
      descriptionHtml:
        "Design that honors the limits of human time, cognition, and care.",
      comingSoon: false,
      entries: [
        {
          id: "finitude",
          title: "Finitude",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The bodily, cognitive, emotional, and temporal limits all humans share. Ethotechnics treats finitude as a design input, not an inconvenience.</p>",
        },
        {
          id: "cognitive-saturation",
          title: "Cognitive Saturation Point",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The load level at which human decision quality collapses\u2014too many alerts, too little time, or excessive context switching. Ethotechnic design lowers saturation by adding <a href="#velocity-friction">velocity friction</a>, simplifying <a href="#interaction-surface">interaction surfaces</a>, and staffing to real <a href="#maintenance-metabolism">maintenance metabolism</a>.</p>',
        },
        {
          id: "compassion-bandwidth",
          title: "Compassion Bandwidth",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The sustainable amount of emotional labor a system asks of people\u2014care teams, moderators, frontline staff, or users. When compassion bandwidth is exceeded, <a href="#dread-work">dread work</a> grows and <a href="#extraction-by-endurance">extraction by endurance</a> sets in.</p>',
        },
        {
          id: "administrative-shame",
          title: "Administrative Shame",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The feeling of being personally at fault for harms produced by system design. Often a signal that <a href="#moral-overhead">moral overhead</a> is too high.</p>',
        },
        {
          id: "dread-work",
          title: "Dread Work",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Tasks people avoid because the system punishes mistakes or withholds relief. Dread work signals missing <a href="#soft-edges">soft edges</a>, low <a href="#contestability">contestability</a>, and declining <a href="#compassion-bandwidth">compassion bandwidth</a>.</p>',
        },
        {
          id: "executive-function-class-axis",
          title: "Executive Function (as a Class Axis)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The idea that modern systems sort people by their capacity to perform sustained administrative labor\u2014tracking tasks, managing documentation, navigating ambiguity\u2014making disability and burnout into structural disadvantage.</p>",
        },
        {
          id: "human-factors",
          title: "Human Factors",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A discipline that studies how systems interact with real human limits\u2014fatigue, confusion, stress\u2014often revealing that \u201cuser error\u201d is actually design failure.</p>",
        },
        {
          id: "operator-centered",
          title: "Operator-centered",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Design that treats front-line workers as key safety components and ensures they have authority, tools, and non-punitive reporting to prevent harm.</p>",
        },
        {
          id: "legibility-illegibility",
          title: "Legibility / Illegibility",
          status: null,
          classes: [],
          bodyHtml:
            "<p><strong>Legibility:</strong> being representable in the system\u2019s categories and workflows.</p><p><strong>Illegibility:</strong> being real but not representable, leading to churn, delay, or denial.</p>",
        },
        {
          id: "refusal-budget",
          title: "Refusal Budget",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The number of times a person can decline, pause, or question a request without retaliation. Healthy refusal budgets, backed by <a href="#human-refusal-tolerance">refusal tolerance</a> and <a href="#right-of-exit">rights of exit</a>, prevent coercion and surface <a href="#heat-maps-of-refusal">heat maps of refusal</a>.</p>',
        },
        {
          id: "behavioral-shaping",
          title: "Behavioral Shaping",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The way systems nudge, constrain, or normalize user behavior through defaults and design choices. Behavioral shaping is amplified by <a href="#velocity-friction">velocity friction</a> and narrow <a href="#permission-surface">permission surfaces</a>.</p>',
          examples: [
            "Default opt-ins normalize data sharing even when users are uncertain.",
          ],
          tags: ["ux", "behavior", "policy"],
          resources: [
            {
              label: "AI governance",
              href: "/ai-governance/",
              type: "Resource",
            },
          ],
        },
      ],
    },
    {
      id: "burden-load",
      heading: "F. Burden & load",
      descriptionHtml: "How systems allocate the cost of operation or failure.",
      comingSoon: false,
      entries: [
        {
          id: "burden-distribution",
          title: "Burden Distribution",
          status: null,
          classes: [],
          bodyHtml:
            "<p>How a system allocates the cost of operation or failure\u2014time, attention, stress, and emotional labor.</p>",
        },
        {
          id: "burden-gradient",
          title: "Burden Gradient",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The slope of effort and risk across roles or communities. A steep burden gradient means those with the least power carry the heaviest operational load while decision-makers feel little friction.</p><p>Mapping the gradient exposes where to redistribute work through <a href="#fair-burden-distribution">fair burden distribution</a> and reduce <a href="#moral-overhead">moral overhead</a>.</p>',
        },
        {
          id: "failure-load",
          title: "Failure Load",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The amount of harm generated when the system fails. Ethotechnics seeks low-failure-load architectures supported by <a href="#graceful-degradation">graceful degradation</a>.</p>',
        },
        {
          id: "burden-transfer-event",
          title: "Burden Transfer Event",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Moments when system failure pushes labor onto humans, often triggering <a href="#moral-overhead">moral overhead</a>.</p>',
        },
        {
          id: "cost-assignment",
          title: "Cost Assignment / Burden Shifting",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A mechanism where systems offload the labor of safety, clarity, and follow-through onto individuals (forms, documentation, vigilance) while keeping institutional obligation low. It\u2019s how \u201cchoice\u201d becomes unpaid work.</p>",
        },
        {
          id: "attention-tax",
          title: "Attention Tax",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The ongoing monitoring burden imposed on individuals to prevent harm: checking portals, tracking deadlines, resubmitting documents, watching for silent rule changes. Attention becomes a cost of staying eligible.</p>",
        },
        {
          id: "maintenance-metabolism",
          title: "Maintenance Metabolism",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The baseline flow of upkeep\u2014patching, cleaning, rehearsing, and caring\u2014that keeps a service alive when nothing is on fire. Healthy maintenance metabolism is budgeted, scheduled, and shared rather than squeezed between crises.</p><p>Falling below it signals rising <a href="#maintenance-debt">maintenance debt</a> and invites <a href="#maintenance-window">maintenance windows</a> before fragility compounds.</p>',
        },
        {
          id: "maintenance-debt",
          title: "Maintenance Debt",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Accumulated obligations from skipping basic upkeep. The interest is paid in slower recovery, brittle systems, and people burning out to keep things running.</p><p>Paying it down requires restoring the <a href="#maintenance-metabolism">maintenance metabolism</a>, scheduling <a href="#maintenance-window">maintenance windows</a>, and tracking work in the <a href="#repair-log">repair log</a>.</p>',
        },
        {
          id: "moral-overhead",
          title: "Moral Overhead",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Extra work users or operators must do to behave ethically within a bad system.</p>",
        },
        {
          id: "temporal-exaction",
          title: "Temporal Exaction",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Uncompensated seizure of life-hours (time, attention, opportunity cost) as the price of accessing a right or correction.</p><p>Temporal exaction is a form of <a href="#extraction">extraction</a> that inflates the <a href="#user-burden-ratio">user burden ratio</a>.</p>',
        },
        {
          id: "asymmetric-sustaining",
          title: "Asymmetric Sustaining",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When one group continually absorbs the toil of keeping a system alive so another group can move fast or claim success. It often hides behind gratitude for \u201cresilience\u201d while masking <a href="#extraction">extraction</a>.</p><p>Ethotechnic practice flattens this by lowering the <a href="#burden-gradient">burden gradient</a> and designing for <a href="#stoppability">stoppability</a> so resilience is institutional, not personal.</p>',
        },
        {
          id: "fragility-subsidy",
          title: "Fragility Subsidy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The unpaid labor, vigilance, or emotional buffering people contribute to keep brittle systems functioning. Fragility subsidies hide true costs, inflate success metrics, and deepen <a href="#asymmetric-sustaining">asymmetric sustaining</a>.</p>',
        },
        {
          id: "burden-index",
          title: "Burden Index",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A composite measure of how much effort, time, and emotional labor people expend to use or recover from a system.</p><p>Inputs include the <a href="#user-burden-ratio">user burden ratio</a>, <a href="#human-substitution-index">human substitution index</a>, and <a href="#failure-load">failure load</a>; rising scores signal extraction or <a href="#asymmetric-sustaining">asymmetric sustaining</a>.</p>',
        },
        {
          id: "harm-internalization",
          title: "Harm Internalization",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Designing systems so creators and operators bear the costs of failures instead of externalizing them to users or society. Harm internalization improves <a href="#fair-burden-distribution">fair burden distribution</a> and prevents <a href="#externalization">externalization</a>.</p>',
          examples: [
            "A vendor funds remediation and user support when their model causes harm.",
          ],
          tags: ["accountability", "burden", "governance"],
          resources: [
            {
              label: "Accountability architectures",
              href: "/accountability-architectures/",
              type: "Guide",
            },
          ],
        },
        {
          id: "maintenance-ethics",
          title: "Maintenance Ethics",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The idea that ethical responsibility continues after deployment through monitoring, updates, incident response, and repair. Maintenance ethics turns <a href="#maintenance-metabolism">maintenance metabolism</a> and the <a href="#repair-log">repair log</a> into ongoing commitments.</p>',
          examples: [
            "Teams publish repair logs and schedule maintenance windows after each major release.",
          ],
          tags: ["maintenance", "governance", "operations"],
          resources: [
            {
              label: "Maintenance guidance",
              href: "/docs/maintenance/",
              type: "Guide",
            },
          ],
        },
      ],
    },
    {
      id: "measures",
      heading: "G. Measures & indicators",
      descriptionHtml: "Metrics that track moral performance across systems.",
      comingSoon: false,
      entries: [
        {
          id: "moral-performance-indicators",
          title: "Moral Performance Indicators (MPIs)",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>Key metrics that show a system\u2019s ethical functioning: time-to-halt (TTH), reversibility rate, appeal success rate, burden ratios, and more. MPIs complement traditional KPIs by tracking how safely and fairly a system operates, not just how fast it grows.</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Moral performance indicators diagram</title>\n                            <polyline points="16,58 40,36 60,44 84,24 104,32" class="diagram-metric"></polyline>\n                            <circle cx="40" cy="36" r="5" class="diagram-metric-point"></circle>\n                            <circle cx="84" cy="24" r="5" class="diagram-metric-point"></circle>\n                          </svg>\n                        </figure>',
        },
        {
          id: "service-level-indicators",
          title: "Service-Level Indicators of Justice (SLJs)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Operational metrics tied directly to fairness, safety, and dignity. SLJs should sit alongside uptime and latency commitments.</p>",
        },
        {
          id: "institutional-metabolism-mapping",
          title: "Institutional Metabolism Mapping",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A diagnostic mapping of where energy, care, time, and money circulate inside an institution. It visualizes maintenance metabolism, <a href="#burden-gradient">burden gradients</a>, and points of <a href="#extraction">extraction</a>.</p><p>Teams use the map to set <a href="#service-level-indicators">SLJs</a>, redesign roles, and decide where to invest new <a href="#maintenance-window">maintenance windows</a>.</p>',
        },
        {
          id: "time-to-halt",
          title: "Time-to-Halt (TTH)",
          status: null,
          classes: ["glossary-entry--diagram"],
          bodyHtml:
            '<p>Seconds between a harmful process beginning and the system stopping it\u2014an essential complement to <a href="#stoppability">stoppability</a>.</p>\n                        <figure class="micro-diagram" aria-hidden="true">\n                          <svg viewBox="0 0 120 80" role="presentation">\n                            <title>Time to halt diagram</title>\n                            <line x1="20" y1="50" x2="100" y2="50" class="diagram-axis"></line>\n                            <circle cx="40" cy="50" r="6" class="diagram-event"></circle>\n                            <rect x="40" y="32" width="46" height="12" class="diagram-timer"></rect>\n                            <polygon points="86,38 100,50 86,62" class="diagram-stop-flag"></polygon>\n                          </svg>\n                        </figure>',
          relatedPatterns: ["kill-switch"],
        },
        {
          id: "time-to-restore",
          title: "Time-to-Restore (TTR)",
          status: null,
          classes: [],
          bodyHtml:
            '<p>How long it takes to reverse harm and return a person to their prior state. Low TTR is a signal of effective <a href="#reversibility">reversibility</a>.</p>',
        },
        {
          id: "appeal-passage-rate",
          title: "Appeal Passage Rate",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The percentage of appeals resolved <em>in favor of the user</em>, a leading indicator of true <a href="#contestability">contestability</a>.</p>',
        },
        {
          id: "irreversibility-index",
          title: "Irreversibility Index",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The share of system actions that cannot be undone. Aim to keep this as low as possible through <a href="#reversibility">reversibility</a> and <a href="#graceful-degradation">graceful degradation</a>.</p>',
        },
        {
          id: "user-burden-ratio",
          title: "User Burden Ratio",
          status: null,
          classes: [],
          bodyHtml:
            '<p>How much work a user must perform to correct or navigate system errors. This metric feeds directly into <a href="#fair-burden-distribution">fair burden distribution</a>.</p>',
        },
        {
          id: "human-substitution-index",
          title: "Human Substitution Index",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A measure of how often humans must step in to compensate for system shortcomings\u2014manual reviews, ad-hoc patches, or empathy work. A rising index exposes <a href="#heroism-dependent-systems">heroism-dependent systems</a> and motivates investment in <a href="#graceful-degradation">graceful degradation</a>.</p>',
        },
        {
          id: "moral-debt",
          title: "Moral Debt",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The accumulated harm a system has caused but not repaired. Moral debt accrues interest as <a href="#moral-latency">moral latency</a> grows and people lose trust; it is paid down through <a href="#pathways-to-restitution">pathways to restitution</a>, transparent <a href="#repair-log">repair logs</a>, and lowered <a href="#time-to-restore">time-to-restore</a>.</p>',
        },
        {
          id: "signal-credibility",
          title: "Signal Credibility",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The trustworthiness of alerts, metrics, and reports used to govern a system.</p><p>High signal credibility pairs transparent sampling, <a href="#explainability-for-accountability">explainability for accountability</a>, and human testimony so warnings trigger action instead of alert fatigue or dismissal.</p>',
        },
        {
          id: "reversal-cost",
          title: "Reversal Cost",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The time, money, emotional labor, documentation, and social risk required to undo an outcome. High reversal cost makes errors durable and turns \u201crights\u201d into luxuries.</p>",
        },
        {
          id: "durability-of-error",
          title: "Durability of Error",
          status: null,
          classes: [],
          bodyHtml:
            "<p>How long a wrong state persists once created, and how far it propagates (downstream systems, eligibility, reputation). A system is dangerous when it can create durable errors quickly but correct them slowly.</p>",
        },
      ],
    },
    {
      id: "governance",
      heading: "H. Governance & power",
      descriptionHtml:
        "Structures that determine who sets moral boundaries and who can intervene.",
      comingSoon: false,
      entries: [
        {
          id: "design-authority",
          title: "Design Authority",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The accountable power to set moral constraints, choose safeguards, and fund enforcement. Clear design authority aligns incentives, protects <a href="#contestability">contestability</a>, and prevents <a href="#accountability-diffusion">accountability diffusion</a>.</p>',
        },
        {
          id: "oversight-horizon",
          title: "Oversight Horizon",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The distance regulators, auditors, or affected communities can see into a system\u2019s decisions and their effects. Extending the horizon\u2014through <a href="#harm-visibility">harm visibility</a>, traceable models, and shared <a href="#repair-log">repair logs</a>\u2014shrinks <a href="#dead-zones">dead zones</a>.</p>',
        },
        {
          id: "permission-surface",
          title: "Permission Surface",
          status: null,
          classes: [],
          bodyHtml:
            '<p>What users can do without institutional approval \u2014 a measure of autonomy and a prerequisite for <a href="#contestability">contestability</a>.</p>',
        },
        {
          id: "bounded-autonomy",
          title: "Bounded Autonomy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Autonomy granted only within explicit limits; approaching or crossing those limits must trigger escalation to <a href="#design-authority">design authority</a> or a documented <a href="#oversight-horizon">oversight horizon</a>.</p>',
          examples: [
            "A claims assistant can approve payouts up to $500, but anything higher is routed to a supervisor.",
          ],
          tags: ["governance", "autonomy", "escalation"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
          ],
        },
        {
          id: "earned-autonomy",
          title: "Earned Autonomy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Autonomy that expands only after demonstrated reliability, monitoring, and accountability. Permission surfaces widen as <a href="#traceable-ownership">traceable ownership</a> and <a href="#repair-log">repair logs</a> prove the system can handle more scope.</p>',
          examples: [
            "After six months of clean audits, the escalation bot gains approval rights for low-risk cases.",
          ],
          tags: ["automation", "accountability", "governance"],
          resources: [
            {
              label: "Accountability architectures",
              href: "/accountability-architectures/",
              type: "Guide",
            },
          ],
        },
        {
          id: "scope-discipline",
          title: "Scope Discipline",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The practice of not exceeding one\u2019s mandate, even when doing so might appear helpful or efficient. Scope discipline enforces the <a href="#permission-surface">permission surface</a> and respects <a href="#bounded-autonomy">bounded autonomy</a>.</p>',
          examples: [
            "A support bot refuses to access customer data outside its assigned ticket.",
          ],
          tags: ["governance", "autonomy", "risk"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
          ],
        },
        {
          id: "right-of-exit",
          title: "Exit Rights",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Guaranteed, non-punitive ways to leave a system (or refuse a pathway) while preserving access to essentials, records, and future participation. Exit rights treat departure as a legitimate action, not a breach.</p>",
        },
        {
          id: "externalized-harm-channels",
          title: "Externalized Harm Channels",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The pathways an institution uses to push risk or cleanup onto others: contractors, users, bystanders, or future teams. Mapping these channels exposes <a href="#externalization">externalization</a> and informs <a href="#fair-burden-distribution">fair burden distribution</a>.</p>',
        },
        {
          id: "stewardship-window",
          title: "Stewardship Window",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A negotiated period where teams pause growth work to focus on care, maintenance, and accountability.</p><p>Stewardship windows bundle <a href="#maintenance-window">maintenance windows</a>, publish <a href="#service-level-indicators">SLJs</a> for the pause, and commit to closing items in the <a href="#repair-log">repair log</a> before resuming throughput.</p>',
        },
        {
          id: "stewardship",
          title: "Stewardship",
          status: null,
          classes: [],
          bodyHtml:
            '<p>An explicit, ongoing role responsible for system behavior over time, with authority to pause, fix, or retire it. Stewardship links <a href="#design-authority">design authority</a>, <a href="#stoppability">stoppability</a>, and <a href="#stewardship-window">stewardship windows</a>.</p>',
          examples: [
            "A named steward can pause a rollout and own the repair log.",
          ],
          tags: ["governance", "accountability", "operations"],
          resources: [
            {
              label: "Maintenance playbooks",
              href: "/maintenance-playbooks/",
              type: "Resource",
            },
          ],
        },
        {
          id: "governance-by-suspension",
          title: "Governance by Suspension",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Control exercised by keeping matters unresolved long enough that time itself produces the outcome.</p><p>Governance by suspension relies on <a href="#non-decision">non-decisions</a> and exploits <a href="#endurance-asymmetry">endurance asymmetry</a>.</p>',
        },
        {
          id: "endurance-asymmetry",
          title: "Endurance Asymmetry",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Institutions can persist indefinitely; humans cannot. This makes delay an allocation mechanism.</p><p>Endurance asymmetry underwrites <a href="#continuity-privilege">continuity privilege</a> and <a href="#punitive-friction">punitive friction</a>.</p>',
        },
        {
          id: "continuity-privilege",
          title: "Continuity Privilege",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Unequal access to enforceability produced by unequal capacity to maintain standing over time (attention, health, documentation, slack).</p><p>Continuity privilege steepens the <a href="#burden-gradient">burden gradient</a> for those without reserves.</p>',
        },
        {
          id: "proxy-privilege",
          title: "Proxy Privilege",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Unequal enforceability produced by unequal ability to delegate persistence (agents, intermediaries, automation).</p><p>Proxy privilege lets some parties bypass the <a href="#futility-threshold">futility threshold</a> that others face alone.</p>',
        },
        {
          id: "latency-as-action",
          title: "Latency-as-Action",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The principle that delay produced predictably by system rules (queues, resets, blocked escalation, absent deadlines) is attributable power, not mere inaction.</p><p>Latency-as-action frames delay as governance and grounds <a href="#decision-artifact">decision artifacts</a>.</p>',
        },
        {
          id: "bounded-duration",
          title: "Bounded Duration",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A fixed maximum time-to-resolution; breach triggers an enforceable disposition.</p><p>Bounded duration pairs with a <a href="#stable-clock">stable clock</a> and <a href="#time-transparency">time transparency</a>.</p>',
        },
        {
          id: "continuity-of-state",
          title: "Continuity of State",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A persistent cumulative record; no forced repetition of validated inputs.</p><p>Continuity of state reduces <a href="#temporal-exaction">temporal exaction</a> and protects <a href="#contestability">contestability</a>.</p>',
        },
        {
          id: "safe-pause",
          title: "Safe Pause / Status Quo During Pendency",
          status: null,
          classes: [],
          bodyHtml:
            '<p>No adverse consequences while review is pending (except narrow, reviewable emergency exception).</p><p>Safe pause preserves the <a href="#utility-window">utility window</a> and keeps people whole during appeal.</p>',
        },
        {
          id: "traceable-ownership",
          title: "Traceable Ownership",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A named responsible party with authority to override automation when bounds are breached.</p><p>Traceable ownership clarifies <a href="#design-authority">design authority</a> and accelerates <a href="#time-to-restore">time-to-restore</a>.</p>',
        },
        {
          id: "time-transparency",
          title: "Time Transparency",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Legible process state: current step, blocking condition, time remaining, next decision point, escalation triggers; no fake progress.</p><p>Time transparency supports <a href="#contestability">contestability</a> and a <a href="#stable-clock">stable clock</a>.</p>',
        },
        {
          id: "bindingness",
          title: "Bindingness",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The degree to which a system\u2019s outputs create enforceable obligations\u2014deadlines, duties, remedies, or reversals\u2014rather than mere communications. Bindingness is the difference between \u201cwe received your request\u201d and \u201cwe must decide by Friday or you win.\u201d</p>",
        },
        {
          id: "non-bindingness",
          title: "Non-bindingness / Nonbindingness",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The condition where a system can interact, respond, and even apologize without being compelled to change state. Non-bindingness is power without accountability: activity without obligation.</p>",
        },
        {
          id: "standing-vs-belief",
          title: "Standing (vs Belief)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Standing is the recognized right to make the system bind itself to engage, decide, and remedy\u2014regardless of whether your story is believed, liked, or emotionally legible. \u201cBelief\u201d is narrative validation; standing is enforceable access to decision power.</p>",
        },
        {
          id: "binding-authority",
          title: "Binding Authority",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A person or role that can change the underlying state and is obligated to respond. Binding authority is not \u201ca human is involved\u201d; it\u2019s a human with power + duty + traceable accountability.</p>",
        },
        {
          id: "evidence-parity",
          title: "Evidence Parity",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A condition where affected people have a fair chance to meet the evidentiary burden\u2014access to the relevant facts, rules, and records\u2014rather than being asked to prove things the institution can\u2019t or won\u2019t disclose. Without evidence parity, appeals become theater.</p>",
        },
        {
          id: "authority-chain",
          title: "Authority Chain",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The mapping of who can change what state, at which stage, under what constraints. Authority chains determine whether escalation is real.</p>",
        },
        {
          id: "authority-mutation",
          title: "Authority Mutation",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A pattern where escalation changes how the institution speaks without changing who has power to reverse outcomes. Authority mutates when the channel upgrades (more polite, more official, more complex) but the underlying ability to bind remains absent.</p>",
        },
        {
          id: "defaults-as-governance",
          title: "Defaults (as Governance)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The idea that the baseline state\u2014what happens if nobody intervenes\u2014is a primary allocator of outcomes and costs. Defaults govern by deciding who must spend time, attention, and stamina to avoid harm.</p>",
        },
        {
          id: "procedural-caste",
          title: "Procedural Caste",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A stratification system where people are divided by their ability to force binding action: who can start clocks, reach authorities, obtain reversals, and make claims legible. It\u2019s a caste system of enforceability, not worth.</p>",
        },
        {
          id: "escalation-without-authority",
          title: "Escalation (without Authority)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A channel change that does not increase binding power\u2014more forms, more tiers, more waiting\u2014while the underlying decision remains unchangeable. It\u2019s escalation as delay management, not remedy.</p>",
        },
        {
          id: "redress",
          title: "Redress",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The set of mechanisms that can correct harm: appeal, review, reversal, compensation, restoration. Redress is real when it is time-bound and reaches binding authority.</p>",
        },
        {
          id: "override-path",
          title: "Override Path",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A clearly defined mechanism that can supersede the default workflow when the default would cause harm\u2014e.g., human escalation with real authority, emergency reversal, exception handling with deadlines. Override paths are where \u201ccare\u201d becomes material.</p>",
        },
        {
          id: "structured-exit",
          title: "Structured Exit",
          status: null,
          classes: [],
          bodyHtml:
            "<p>An exit process designed to protect the leaver: clear steps, data portability, timelines, anti-retaliation constraints, and closure that doesn\u2019t require ongoing performance. Structured exit turns leaving into a governed pathway instead of an endurance test.</p>",
        },
        {
          id: "paywalled-rights",
          title: "Paywalled Rights",
          status: null,
          classes: [],
          bodyHtml:
            "<p>When access to contestation, speed, or binding review is effectively purchased\u2014through fees, premium support, lawyers, consultants, or time flexibility. Rights exist, but only for those who can pay in money or stamina.</p>",
        },
        {
          id: "logs-as-power",
          title: "Logs-as-power",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The idea that control over records\u2014what is logged, who can see it, what counts as evidence\u2014shapes who can contest outcomes. Recordkeeping is governance.</p>",
        },
        {
          id: "audit-trail",
          title: "Audit Trail",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A trace of events and decisions\u2014what happened, when, by whom, under what rule\u2014used for accountability. Audit trails matter only if they connect to reversal power.</p>",
        },
        {
          id: "administrative-reality",
          title: "Administrative Reality",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The world as the system recognizes it: what counts, what is recordable, what triggers action. Administrative reality often diverges from lived reality.</p>",
        },
        {
          id: "contract-of-adhesion",
          title: "Contract of Adhesion",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A take-it-or-leave-it contract offered by a more powerful party where negotiation is impossible; a common substrate for coerced \u201cchoice.\u201d</p>",
        },
        {
          id: "nda-retaliation-narrative-erasure",
          title: "NDA Retaliation / Narrative Erasure",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Mechanisms that suppress exit stories\u2014legal threats, informal retaliation, reputational control\u2014preventing systems from being held accountable by shared evidence.</p>",
        },
      ],
    },
    {
      id: "friction",
      heading: "I. Friction & flow",
      descriptionHtml:
        "Designing intentional friction that protects people while keeping harm contained.",
      comingSoon: false,
      entries: [
        {
          id: "protective-friction",
          title: "Protective Friction",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Friction that slows harmful processes and keeps <a href="#moral-latency">moral latency</a> within safe bounds.</p>',
        },
        {
          id: "punitive-friction",
          title: "Punitive Friction",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Friction that punishes users\u2014often hidden in bureaucratic loops. Signals <a href="#extraction-by-endurance">extraction by endurance</a>.</p>',
        },
        {
          id: "dignity-friction",
          title: "Dignity Friction",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Friction that preserves autonomy, such as double checks on irreversible actions.</p>",
        },
        {
          id: "velocity-friction",
          title: "Velocity Friction",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Friction added specifically to prevent runaway system behaviors. Often implemented through <a href="#ethical-interrupts">ethical interrupts</a>.</p>',
        },
        {
          id: "safety-valve",
          title: "Safety Valve",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A deliberate release point that lets people slow, pause, or reroute automation before harm compounds.</p><p>Safety valves pair <a href="#stoppability">stoppability</a> with <a href="#dignity-friction">dignity friction</a> so high-stakes flows default to reversible states and route to humans without penalty.</p>',
          relatedPatterns: ["progressive-consent", "kill-switch"],
        },
        {
          id: "consent-journey",
          title: "Consent Journey",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The sequenced touchpoints where a person learns what a system will do, grants or denies permission, and can revise that choice over time.</p><p>Strong consent journeys use <a href="#anticipatory-consent">anticipatory consent</a>, visible <a href="#permission-surface">permission surfaces</a>, and healthy <a href="#refusal-budget">refusal budgets</a> so pausing or exiting does not jeopardize access or care.</p>',
        },
        {
          id: "coercive-consent",
          title: "Coercive Consent",
          status: null,
          classes: [],
          bodyHtml:
            "<p>\u201cAgreement\u201d obtained through defaults, asymmetry, or threats of exclusion\u2014consent produced by lack of viable refusal.</p>",
        },
        {
          id: "humane-friction",
          title: "Humane Friction",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The calibrated blend of protective, dignity, and velocity frictions.</p>",
        },
        {
          id: "appropriate-friction",
          title: "Appropriate Friction",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Deliberate slowdowns or checkpoints inserted where harm would be costly or irreversible. Appropriate friction treats <a href="#velocity-friction">velocity friction</a> and <a href="#ethical-interrupts">ethical interrupts</a> as safety features.</p>',
          examples: [
            "High-risk data exports require a second reviewer before completion.",
          ],
          tags: ["safety", "friction", "compliance"],
          resources: [
            {
              label: "Mechanisms catalog",
              href: "/mechanisms",
              type: "Reference",
            },
          ],
        },
        {
          id: "frictionless-harm",
          title: "Frictionless Harm",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Harms that spread unchecked because safeguards or pauses were stripped away. Frictionless harm is the inverse of <a href="#protective-friction">protective friction</a>; it appears when <a href="#velocity-friction">velocity friction</a> and <a href="#dignity-friction">dignity friction</a> are absent.</p>',
        },
      ],
    },
    {
      id: "decision-states",
      heading: "J. Decision states & edges",
      descriptionHtml:
        "Where and how decisions flip from reversible to permanent.",
      comingSoon: false,
      entries: [
        {
          id: "decision-edge",
          title: "Decision Edge",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The precise moment when a choice shifts from reversible to consequential. Making the decision edge visible enables <a href="#dignity-friction">dignity friction</a>, clearer consent, and routing to <a href="#ethical-interrupts">ethical interrupts</a> when risk spikes.</p>',
        },
        {
          id: "decision-surface",
          title: "Decision Surface",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The part of a system where decisions become visible, addressable, and contestable. Many systems minimize the decision surface to avoid accountability.</p>",
        },
        {
          id: "decision-artifact",
          title: "Decision Artifact",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A discrete, attributable, contestable output: outcome + reason + timestamp + accountable owner.</p><p>Decision artifacts anchor <a href="#traceable-ownership">traceable ownership</a> and make <a href="#contestability">contestability</a> measurable.</p>',
        },
        {
          id: "decision-object",
          title: "Decision Object",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A discrete, addressable unit of institutional action that can be challenged: what was decided, when, under which rule, by what authority, with what evidence. Decision objects are the \u201chandles\u201d that make contestation possible.</p>",
        },
        {
          id: "object-formation",
          title: "Object Formation",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The process by which a complaint, harm, or request becomes a decision object\u2014assigned an identifier, a category, an owner, a standard of review, and a clock. Systems often block accountability by preventing object formation (\u201cnothing exists to appeal\u201d).</p>",
        },
        {
          id: "non-decision",
          title: "Non-Decision",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A stable administrative disposition where a system withholds a contestable outcome (\u201cpending,\u201d \u201cin review\u201d) while consequences accrue.</p><p>Non-decisions stretch <a href="#moral-latency">moral latency</a> and erode <a href="#contestability">contestability</a> by keeping people in limbo.</p>',
        },
        {
          id: "pendingness",
          title: "Pending / Pendingness",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A default state where nothing is decided and no one is obligated\u2014often presented as neutral but functioning as an outcome allocator. Pendingness becomes harm when it lacks a clock, an owner, or a forced next step.</p>",
        },
        {
          id: "settlement",
          title: "Settlement",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The moment a claim becomes resolved in a way that changes the underlying state\u2014approved, denied with appeal rights, remediated, reversed, paid, restored, or otherwise closed with consequences. Settlement is not closure in the CRM; it\u2019s resolution that binds.</p>",
        },
        {
          id: "non-settlement",
          title: "Non-settlement / Nonsettlement",
          status: null,
          classes: [],
          bodyHtml:
            "<p>An institutional mode where claims are acknowledged and processed indefinitely without producing a binding resolution. The system offers intake, updates, and politeness while keeping obligation optional.</p>",
        },
        {
          id: "stable-clock",
          title: "Stable Clock",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A non-resettable timeline for a case; the system cannot restart time via re-ticketing, re-verification, or channel switching.</p><p>Stable clocks enforce <a href="#bounded-duration">bounded duration</a> and keep timelines legible.</p>',
        },
        {
          id: "clock-start-clock-mismatch",
          title: "Clock-start / Clock mismatch",
          status: null,
          classes: [],
          bodyHtml:
            "<p><strong>Clock-start:</strong> the moment a system becomes time-bound\u2014deadlines begin, obligations attach, escalation becomes meaningful.</p><p><strong>Clock mismatch:</strong> when institutional execution is fast (instant flags, freezes, denials) but redress is slow (weeks-months-human review), making errors durable and contestation scarce.</p>",
        },
        {
          id: "slow-redress-fast-execution",
          title: "Slow Redress / Fast Execution",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A governance asymmetry where harmful state changes are immediate but appeals are delayed, discretionary, and exhausting. This is one of the main engines of modern coercion.</p>",
        },
        {
          id: "utility-window",
          title: "Utility Window",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The time span during which relief can still prevent the relevant harm.</p><p>Designing for a clear utility window keeps <a href="#time-to-restore">time-to-restore</a> accountable.</p>',
        },
        {
          id: "utility-expiry",
          title: "Utility Expiry",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Crossing the utility window; relief arrives too late to matter.</p><p>Utility expiry converts support into paperwork and should trigger <a href="#constructive-denial">constructive denial</a> or repair.</p>',
        },
        {
          id: "futility-threshold",
          title: "Futility Threshold",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The point where time-on-task or repetition becomes so costly that valid claimants predictably abandon pursuit.</p><p>Systems that hit the futility threshold signal <a href="#punitive-friction">punitive friction</a> and low <a href="#contestability">contestability</a>.</p>',
        },
        {
          id: "constructive-denial",
          title: "Constructive Denial",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A legal state where delay is treated as refusal because it destroys utility or makes pursuit futile.</p><p>Constructive denial recognizes <a href="#utility-expiry">utility expiry</a> and forces accountable remedies.</p>',
        },
        {
          id: "critical-action",
          title: "Critical Action",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Any system action that meaningfully alters a person\u2019s status, access, or trajectory. Critical actions require <a href="#dignity-friction">dignity friction</a>.</p>',
        },
        {
          id: "irreversibility",
          title: "Irreversibility",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A state where reversal is practically unavailable (too slow, too expensive, too discretionary) even if it is theoretically possible. Irreversibility is often produced by missing clocks, missing authority, or asymmetric evidence demands.</p>",
        },
        {
          id: "irreversible-boundary",
          title: "Irreversible Boundary",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A threshold the system cannot automatically undo\u2014account closures, public releases, or data publication. Crossing it demands heightened <a href="#contestability">contestability</a>, audited <a href="#explainability-for-accountability">explanations</a>, and explicit <a href="#time-to-restore">time-to-restore</a> plans.</p>',
        },
        {
          id: "backstop",
          title: "Backstop",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A guaranteed fallback mechanism that triggers when the main process fails\u2014timeouts, automatic approvals, emergency restoration, or external review.</p>",
        },
        {
          id: "rollback",
          title: "Rollback",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A designed ability to revert the system to a prior safe state\u2014restoring access, undoing propagation, correcting records\u2014ideally with minimal friction.</p>",
        },
        {
          id: "auto-close-auto-renew-auto-share",
          title: "Auto-close / Auto-renew / Auto-share",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Default state transitions that happen without active consent\u2014closing claims, renewing contracts, expanding data use\u2014often presented as convenience while functioning as governance by inertia.</p>",
        },
        {
          id: "ethical-interrupts",
          title: "Ethical Interrupts",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Automatic system-level halts triggered by anomalies or harm indicators. Ethical interrupts operationalize <a href="#stoppability">stoppability</a>.</p>',
          relatedPatterns: ["kill-switch", "appeal-paths"],
        },
        {
          id: "actionability-threshold",
          title: "Actionability Threshold",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The level of confidence, authorization, and oversight required before information becomes action. Raising the actionability threshold protects against low-signal decisions and clarifies <a href="#design-authority">design authority</a>.</p>',
          examples: [
            "A fraud alert triggers action only after confidence and authorization checks.",
          ],
          tags: ["decision-making", "governance", "risk"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
          ],
        },
        {
          id: "normative-uncertainty",
          title: "Normative Uncertainty",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Situations where it is unclear what the \u201cright\u201d action is, requiring caution, clarification, or human judgment rather than confident automation. Normative uncertainty often triggers <a href="#ethical-interrupts">ethical interrupts</a> and a higher <a href="#actionability-threshold">actionability threshold</a>.</p>',
          examples: [
            "When guidance conflicts, the system pauses and requests human judgment.",
          ],
          tags: ["decision-making", "policy", "risk"],
          resources: [
            {
              label: "Governance playbook",
              href: "/docs/governance/",
              type: "Guide",
            },
          ],
        },
      ],
    },
    {
      id: "patterns",
      heading: "K. System patterns & anti-patterns",
      descriptionHtml:
        "Recurring structures that demand Ethotechnic countermeasures.",
      comingSoon: false,
      entries: [
        {
          id: "heroism-dependent-systems",
          title: "Heroism-Dependent Systems",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Systems that rely on extraordinary effort, unpaid care, or silent sacrifice to function. They mask poor <a href="#stoppability">stoppability</a> and high <a href="#failure-load">failure load</a>.</p>',
        },
        {
          id: "empathy-surrogacy",
          title: "Empathy Surrogacy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Simulated warmth\u2014chatbots, scripted apologies, tone guidelines\u2014used to mask structural harm or delay fixes. Empathy surrogacy diverts attention from <a href="#repair-log">repair</a> and weakens <a href="#contestability">contestability</a> by substituting sentiment for remedy.</p>',
        },
        {
          id: "error-cascades",
          title: "Error Cascades",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Small automated mistakes that amplify across the system. Prevented through <a href="#ethical-interrupts">ethical interrupts</a> and <a href="#service-level-indicators">SLJs</a>.</p>',
        },
        {
          id: "invisible-fallbacks",
          title: "Invisible Fallbacks",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Hidden behaviors that appear under stress\u2014shadow queues, silent throttling, or undocumented overrides. Invisible fallbacks obscure <a href="#ethical-load-path">ethical load paths</a> and should be surfaced through <a href="#graceful-rollback-lanes">graceful rollback lanes</a> and rehearsed in <a href="#maintenance-window">maintenance windows</a>.</p>',
        },
        {
          id: "dead-user-zones",
          title: "Dead-User Zones",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Places where people affected by decisions cannot contest, appeal, or exit\u2014opaque rankings, automated bans, or unmoderated queues. Closing dead-user zones requires widening the <a href="#permission-surface">permission surface</a> and raising <a href="#appeal-passage-rate">appeal passage rates</a>.</p>',
        },
        {
          id: "moral-lock-in",
          title: "Moral Lock-In",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When harmful defaults become entrenched through dependencies, network effects, or contracts that block reform. Moral lock-in is prevented by <a href="#moral-feature-gating">moral feature gating</a>, <a href="#contestability">contestability</a>, and vigilant <a href="#moral-drift-control">moral drift control</a>.</p>',
        },
        {
          id: "legitimacy-laundering",
          title: "Legitimacy Laundering",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The process of converting coercive or indifferent outcomes into reputational legitimacy through procedural signals\u2014case IDs, polite updates, \u201cin review\u201d\u2014without delivering binding resolution. The system looks responsible while staying unbound.</p>",
        },
        {
          id: "polite-coercion",
          title: "Polite Coercion",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Coercion delivered through soothing language and \u201chelpful\u201d workflows that make refusal costly or stigmatized. Polite coercion is power that avoids looking like power.</p>",
        },
        {
          id: "documentation-loop",
          title: "Documentation Loop / Resubmission Loop",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A repeating pattern where the system continually requests more evidence or re-uploads without moving toward a binding decision. Often used to shift labor onto claimants and to manufacture dropout.</p>",
        },
        {
          id: "precision-demands",
          title: "Precision Demands",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Requests for ever-greater specificity that function less as truth-seeking and more as denial hooks\u2014ways to keep a case non-objectified or non-decidable. Precision demands are a technique of delay.</p>",
        },
        {
          id: "procedural-alibi",
          title: "Procedural Alibi",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A record of \u201cprocess\u201d used to defend outcomes (\u201cwe followed procedure\u201d) even when the procedure cannot bind the institution to remedy. The alibi is the trace of activity, not accountability.</p>",
        },
        {
          id: "tone-policing",
          title: "Tone Policing (as Governance Technology)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The use of \u201cappropriate tone\u201d requirements to control access to remedy\u2014penalizing anger, urgency, neurodivergent communication, or exhaustion. Tone policing converts distress into disqualification.</p>",
        },
        {
          id: "dropout-as-legitimation",
          title: "Dropout-as-legitimation",
          status: null,
          classes: [],
          bodyHtml:
            "<p>When systems treat nonresponse, fatigue, or disappearance as consent or closure (\u201ccase closed\u2014no reply\u201d), laundering coercion into \u201cresolved.\u201d Dropout becomes the mechanism that protects the institution.</p>",
        },
        {
          id: "churn-as-closure",
          title: "Churn (as Closure Mechanism)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>The engineered cycling of people through forms, queues, and handoffs until they give up, miss a deadline, or become \u201cinactive,\u201d allowing the system to close without settlement.</p>",
        },
        {
          id: "paper-compliance",
          title: "Paper Compliance / Checkbox Governance",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Compliance regimes focused on producing documentation of doing the right thing rather than mechanisms that can actually prevent harm or force remedy. The paperwork stands in for power.</p>",
        },
        {
          id: "transparency-theater",
          title: "Transparency Theater",
          status: null,
          classes: [],
          bodyHtml:
            "<p>Disclosures that do not increase contestability\u2014more text, more dashboards, more \u201cexplanations\u201d\u2014without deadlines, authority, or reversal paths. Visibility substitutes for enforceability.</p>",
        },
        {
          id: "explainability-decoy",
          title: "Explainability Decoy",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A focus on explaining model decisions that distracts from the harder question: can the decision be contested, reversed, and time-bounded? The decoy offers epistemics where governance is needed.</p>",
        },
        {
          id: "human-in-the-loop-legitimacy",
          title: "Human-in-the-loop (as Legitimacy Artifact)",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A human reviewer inserted to create legitimacy while lacking binding authority, deadlines, or meaningful discretion. The loop becomes a comfort signal, not a power shift.</p>",
        },
        {
          id: "procedural-realism",
          title: "Procedural Realism",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A style of analysis (and sometimes art) that treats procedures, channels, and workflows as the real plot\u2014where power is shown through process.</p>",
        },
        {
          id: "intake-cinema",
          title: "Intake Cinema",
          status: null,
          classes: [],
          bodyHtml:
            "<p>A label for stories where the drama is the intake/eligibility channel\u2014forms, interviews, caseworkers, waiting rooms\u2014rather than a single decisive confrontation.</p>",
        },
      ],
    },
    {
      id: "future-concepts",
      heading: "L. Future concepts / research areas",
      descriptionHtml:
        "These placeholders signal Ethotechnics as an evolving field.",
      comingSoon: false,
      entries: [
        {
          id: "moral-drift-control",
          title: "Moral Drift Control",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Instrumentation and controls that detect when system behavior drifts from ethical baselines\u2014through <a href="#moral-performance-indicators">MPIs</a> or user testimony\u2014and automatically trigger <a href="#ethical-interrupts">interrupts</a> or design changes.</p>',
        },
        {
          id: "structural-gentleness-coefficients",
          title: "Structural Gentleness Coefficients",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Measures of how forgiving an infrastructure is to human variance: error tolerance, recovery time, and <a href="#soft-edges">soft edges</a>. Higher coefficients correlate with lower <a href="#failure-load">failure load</a> and safer <a href="#graceful-degradation">degradation</a>.</p>',
        },
        {
          id: "burden-elasticity",
          title: "Burden Elasticity",
          status: null,
          classes: [],
          bodyHtml:
            '<p>How effort and risk stretch or rebound between actors when conditions change. Mapping burden elasticity alongside the <a href="#burden-gradient">burden gradient</a> prevents crises from snapping back onto the least powerful.</p>',
        },
        {
          id: "care-redundancy",
          title: "Care Redundancy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Overlapping care pathways\u2014humans, automation, and policy\u2014that ensure someone is caught when another safeguard fails. Care redundancy pairs with <a href="#graceful-degradation">graceful degradation</a> to keep <a href="#failure-load">failure load</a> low.</p>',
        },
        {
          id: "meta-contestability",
          title: "Meta-Contestability",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Mechanisms that let people challenge not just outcomes but the rules of challenge themselves\u2014who may appeal, what evidence counts, and who sits on review panels. Meta-contestability keeps <a href="#contestability">contestability</a> from ossifying.</p>',
        },
        {
          id: "user-state-modeling",
          title: "User-State Modeling for Harm Prevention",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Inferring user states\u2014fatigue, distress, inattention\u2014to adapt pacing, add <a href="#protective-friction">protective friction</a>, or route to humans before harm compounds. Models must respect <a href="#anticipatory-consent">anticipatory consent</a> and avoid new <a href="#burden-transfer-event">burden transfers</a>.</p>',
        },
        {
          id: "ethical-latency",
          title: "Design for Ethical Latency",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Designing for unavoidable delay between action and ethical evaluation by staging risky steps, adding <a href="#velocity-friction">velocity friction</a>, or seeking <a href="#care-floor-guarantees">care floor guarantees</a> while fuller review occurs.</p>',
        },
        {
          id: "distributed-accountability-protocols",
          title: "Distributed Accountability Protocols",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Coordination methods that keep responsibility legible across teams and automation: shared playbooks, auditable handoffs, and <a href="#repair-log">repair logs</a>. Protocols prevent <a href="#accountability-diffusion">accountability diffusion</a> when work moves.</p>',
        },
        {
          id: "ethotechnic-failure-taxonomy",
          title: "Ethotechnic Failure Taxonomy",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A common vocabulary for classifying moral failure modes\u2014<a href="#optimization-myopia">optimization myopia</a>, <a href="#brittleness">brittleness</a>, <a href="#extraction">extraction</a>, and more\u2014so incidents can be compared, learned from, and prevented.</p>',
        },
        {
          id: "adaptive-refusal-pathways",
          title: "Adaptive Refusal Pathways",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Dynamic flows that reroute tasks when someone pauses or declines, preserving context and avoiding retaliation. Adaptive pathways extend <a href="#refusal-budget">refusal budgets</a> and strengthen <a href="#human-refusal-tolerance">refusal tolerance</a>.</p>',
        },
        {
          id: "aftercare-automation",
          title: "Aftercare Automation",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Automated follow-up that checks on impacted people after incidents, schedules remedies, and prompts humans to close the loop. Done well, it lowers <a href="#moral-debt">moral debt</a> without creating new <a href="#moral-overhead">moral overhead</a>.</p>',
        },
        {
          id: "alignment-dividend",
          title: "Alignment Dividend",
          status: null,
          classes: [],
          bodyHtml:
            '<p>The measurable upside\u2014trust, retention, safety\u2014generated when systems align with human values. Tracking the dividend builds the business case for sustained investment in <a href="#moral-performance-indicators">MPIs</a> and <a href="#maintenance-metabolism">maintenance metabolism</a>.</p>',
        },
        {
          id: "ambiguity-budgets",
          title: "Ambiguity Budgets",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Explicit allowances for uncertainty that prevent premature automation or brittle enforcement. Ambiguity budgets reserve time, human review, or <a href="#maintenance-window">maintenance windows</a> until context is sufficient.</p>',
        },
        {
          id: "anticipatory-consent",
          title: "Anticipatory Consent",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Consent models that preview future data uses and let people pre-approve, defer, or block them. Anticipatory consent supports <a href="#right-of-exit">rights of exit</a> and counters <a href="#precision-laundering">precision laundering</a> of unclear terms.</p>',
        },
        {
          id: "boundary-of-acceptable-harm",
          title: "Boundary of Acceptable Harm",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Dynamic thresholds defining when moral risk exceeds the system\u2019s mandate and operations must halt or escalate. Boundaries are tied to <a href="#service-level-indicators">SLJs</a> and enforced through <a href="#ethical-circuit-breakers">ethical circuit breakers</a>.</p>',
        },
        {
          id: "care-floor-guarantees",
          title: "Care Floor Guarantees",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Baseline commitments a service maintains even during outages or crises\u2014live support, data export, or safe defaults. Care floors protect users when <a href="#graceful-degradation">graceful degradation</a> activates.</p>',
        },
        {
          id: "compassion-telemetry",
          title: "Compassion Telemetry",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Signals that show whether interactions feel humane\u2014response tone, wait times during distress, quality of follow-up. Compassion telemetry complements technical metrics to protect <a href="#compassion-bandwidth">compassion bandwidth</a>.</p>',
        },
        {
          id: "conflict-observability",
          title: "Conflict Observability",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Instrumentation that makes value conflicts visible in logs and dashboards before they erupt\u2014flagging when <a href="#service-level-indicators">SLJs</a> trade off against throughput or when appeals spike. High observability enables earlier <a href="#moral-drift-control">moral drift control</a>.</p>',
        },
        {
          id: "counter-abuse-guardrails",
          title: "Counter-Abuse Guardrails",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Limits that prevent tools from being repurposed for harassment, exploitation, or coercion\u2014rate limits, anomaly detection, and <a href="#human-override-lanes">human override lanes</a> tuned for abuse scenarios.</p>',
        },
        {
          id: "crisis-rehearsal-loops",
          title: "Crisis Rehearsal Loops",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Regular drills that stress-test moral responses, not just uptime. They practice <a href="#ethical-interrupts">ethical interrupts</a>, validate <a href="#care-floor-guarantees">care floors</a>, and update <a href="#repair-log">repair logs</a> with lessons.</p>',
        },
        {
          id: "data-dignity-budgets",
          title: "Data Dignity Budgets",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Caps on data collection and use that respect personhood and context, not just legal checkbox consent. Budgets align with <a href="#anticipatory-consent">anticipatory consent</a> and guard against <a href="#extraction">extraction</a>.</p>',
        },
        {
          id: "decision-debt-ledger",
          title: "Decision Debt Ledger",
          status: null,
          classes: [],
          bodyHtml:
            '<p>A register of deferred decisions and their moral interest, reviewed before debt compounds into harm. The ledger feeds <a href="#maintenance-window">maintenance windows</a> and informs <a href="#moral-performance-indicators">MPIs</a>.</p>',
        },
        {
          id: "downstream-equity-buffers",
          title: "Downstream Equity Buffers",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Design slack that absorbs variance so marginalized groups do not pay first or most when errors occur. Buffers include staggered rollouts, <a href="#graceful-rollback-lanes">rollback lanes</a>, and targeted support funds.</p>',
        },
        {
          id: "ethical-circuit-breakers",
          title: "Ethical Circuit Breakers",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Automated stops that trip when moral risk indicators cross predefined set points\u2014surges in appeals, bias metrics, or <a href="#moral-debt">moral debt</a>. They are the safety counterpart to financial circuit breakers.</p>',
        },
        {
          id: "ethical-load-testing",
          title: "Ethical Load Testing",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Deliberate exercises that probe how systems behave under moral stress\u2014simulated harassment, mass appeals, or outage scenarios\u2014to validate <a href="#ethical-circuit-breakers">ethical circuit breakers</a> and <a href="#care-floor-guarantees">care floors</a>.</p>',
        },
        {
          id: "exhaustion-triggers",
          title: "Exhaustion Triggers",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Signals that detect operator or user fatigue\u2014error streaks, long queues, late-night decisions\u2014and automatically slow, pause, or hand off flows before mistakes multiply. Triggers protect <a href="#compassion-bandwidth">compassion bandwidth</a>.</p>',
        },
        {
          id: "friction-budgets",
          title: "Friction Budgets",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Planned allocations of <a href="#protective-friction">protective</a> and <a href="#dignity-friction">dignity</a> frictions across journeys to balance safety with usability, rather than defaulting to speed.</p>',
        },
        {
          id: "graceful-rollback-lanes",
          title: "Graceful Rollback Lanes",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Prepared routes to revert harmful decisions while preserving dignity, evidence, and service continuity. Rollback lanes keep <a href="#irreversibility-index">irreversibility indices</a> low and shorten <a href="#time-to-restore">time-to-restore</a>.</p>',
        },
        {
          id: "harm-amnesty-windows",
          title: "Harm Amnesty Windows",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Time-boxed periods where people can report or reverse harmful actions without penalty, encouraging disclosure and faster <a href="#repair-log">repair</a>. Amnesty windows often follow <a href="#crisis-rehearsal-loops">rehearsal loops</a> or incidents.</p>',
        },
        {
          id: "heat-maps-of-refusal",
          title: "Heat Maps of Refusal",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Visualizations showing where users opt out, churn, or appeal\u2014revealing coercion hotspots early. Heat maps help tune <a href="#refusal-budget">refusal budgets</a> and redesign <a href="#interaction-surface">interaction surfaces</a>.</p>',
        },
        {
          id: "human-override-lanes",
          title: "Human Override Lanes",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Guaranteed routes for human judgment to supersede automation when stakes are high or context is missing. Override lanes accompany <a href="#ethical-interrupts">ethical interrupts</a> and require clear <a href="#ethical-load-path">ethical load paths</a>.</p>',
        },
        {
          id: "incident-memory-chains",
          title: "Incident Memory Chains",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Linked records that keep lessons from past incidents attached to similar workflows so knowledge stays actionable. Memory chains inform <a href="#ethical-load-testing">ethical load tests</a> and prevent <a href="#moral-lock-in">moral lock-in</a> on bad patterns.</p>',
        },
        {
          id: "moral-dry-runs",
          title: "Moral Dry Runs",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Pre-launch walkthroughs that simulate ethical dilemmas to harden designs before they reach the public. Dry runs test <a href="#ethical-circuit-breakers">circuit breakers</a>, <a href="#graceful-rollback-lanes">rollback lanes</a>, and documentation.</p>',
        },
        {
          id: "moral-feature-gating",
          title: "Moral Feature Gating",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Controls that block feature launch until moral readiness criteria\u2014oversight plans, <a href="#contestability">contestability</a> pathways, and <a href="#care-floor-guarantees">care floors</a>\u2014are met.</p>',
        },
        {
          id: "pathways-to-restitution",
          title: "Pathways to Restitution",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Documented steps a system must take to repair harm: acknowledgement, remedy, verification, and follow-up. Pathways reduce <a href="#moral-debt">moral debt</a> and belong in the <a href="#repair-log">repair log</a>.</p>',
        },
        {
          id: "refusal-aware-routing",
          title: "Refusal-Aware Routing",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Routing logic that accounts for who can decline tasks and ensures refusals are respected without retaliation or silent penalization. It preserves <a href="#refusal-budget">refusal budgets</a> and keeps workflows humane.</p>',
        },
        {
          id: "relief-invariants",
          title: "Relief Invariants",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Assurances that regardless of pathway, people can access relief with predictable effort and support. Relief invariants are tested in <a href="#crisis-rehearsal-loops">crisis rehearsals</a> and anchored by <a href="#care-floor-guarantees">care floors</a>.</p>',
        },
        {
          id: "repair-quorums",
          title: "Repair Quorums",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Minimum participation rules for authorizing fixes so impacted communities have a seat in deciding remedies. Repair quorums counter <a href="#accountability-diffusion">accountability diffusion</a> and legitimize <a href="#pathways-to-restitution">restitution</a>.</p>',
        },
        {
          id: "rest-cycle-enforcement",
          title: "Rest Cycle Enforcement",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Built-in mechanisms that enforce rest and recovery\u2014rotation policies, cooldown timers, enforced downtime\u2014so fatigue does not translate into harm. Enforcement protects <a href="#maintenance-metabolism">maintenance metabolism</a> and <a href="#compassion-bandwidth">compassion bandwidth</a>.</p>',
        },
      ],
    },
    {
      id: "principles",
      heading: "M. Foundational Ethotechnic principles",
      descriptionHtml:
        "Axioms that will eventually define the discipline. Full definitions are in development.",
      comingSoon: false,
      entries: [
        {
          id: "conservancy-principle",
          title: "The Conservancy Principle",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Designers steward human dignity and collective resources; they must leave systems safer and more reparable than they found them. Conservancy prioritizes <a href="#repair-log">repair</a>, <a href="#stoppability">stoppability</a>, and minimizing <a href="#moral-debt">moral debt</a>.</p>',
        },
        {
          id: "burden-inversion-rule",
          title: "The Burden Inversion Rule",
          status: null,
          classes: [],
          bodyHtml:
            '<p>When harm occurs, the system shoulders effort before the person harmed does. Burden inversion lowers the <a href="#user-burden-ratio">user burden ratio</a> and demands rapid <a href="#time-to-restore">restoration</a>.</p>',
        },
        {
          id: "stop-before-explain-rule",
          title: "The Stop-Before-Explain Rule",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Halt harmful behavior first, then justify or refine it. Systems must trigger <a href="#ethical-interrupts">ethical interrupts</a> before offering explanations, preserving <a href="#reversibility">reversibility</a>.</p>',
        },
        {
          id: "maintenance-doctrine",
          title: "The Maintenance Doctrine",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Ethical performance depends on continuous upkeep\u2014funded <a href="#maintenance-metabolism">maintenance metabolism</a>, scheduled <a href="#maintenance-window">maintenance windows</a>, and transparent <a href="#repair-log">logs</a>.</p>',
        },
        {
          id: "low-failure-load-principle",
          title: "The Principle of Low-Failure-Load Design",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Design so that when failures occur, human impact is contained. This principle motivates <a href="#graceful-degradation">graceful degradation</a>, <a href="#care-floor-guarantees">care floors</a>, and low <a href="#irreversibility-index">irreversibility indices</a>.</p>',
        },
        {
          id: "reversibility-mandate",
          title: "The Reversibility Mandate",
          status: null,
          classes: [],
          bodyHtml:
            '<p>Critical actions must be undoable or paired with <a href="#graceful-rollback-lanes">rollback lanes</a>. The mandate aligns with <a href="#time-to-restore">time-to-restore</a> targets and <a href="#contestability">contestability</a>.</p>',
        },
        {
          id: "contestability-guarantee",
          title: "The Contestability Guarantee",
          status: null,
          classes: [],
          bodyHtml:
            '<p>People affected by system decisions can challenge, change, or overturn them\u2014and win. Guarantees include wide <a href="#permission-surface">permission surfaces</a>, high <a href="#appeal-passage-rate">appeal passage rates</a>, and transparent <a href="#design-authority">design authority</a>.</p>',
        },
      ],
    },
  ],
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "ethotechnics",
    term: "Ethotechnics",
    definition:
      "The craft of designing systems that can behave morally. Where ethics asks \u201cWhat should I do?\u201d and systems theory asks \u201cHow does it behave?\u201d, Ethotechnics asks: How can it behave well? Moral behavior is treated as an architectural capability, not a personal virtue.",
    appliesTo: ["hospitals", "platforms", "governance"],
  },
  {
    slug: "moral-behavior",
    term: "Moral Behavior (of Systems)",
    definition:
      "Observable patterns of system behavior that prevent harm, share burden fairly, and keep people contestable and whole. Moral behavior is evaluated through MPIs such as time-to-halt , reversibility , and fair burden distribution \u2014not by stated intent.",
    appliesTo: ["platforms", "finance", "safety"],
  },
  {
    slug: "ethical-load-path",
    term: "Ethical Load Path",
    definition:
      "The route moral responsibility travels through a system\u2014across automation, humans, and institutions. A clear ethical load path shows who can stop, reverse, or repair harm at each stage, linking design authority , oversight horizons , and the repair log .",
    appliesTo: ["transit", "ops-teams", "oversight"],
  },
  {
    slug: "ethotechnic-audit",
    term: "Ethotechnic Audit",
    definition:
      "A structured assessment of a system\u2019s capacity to stop harm, reverse it, distribute burden fairly, remain contestable, and enable accountability. Audits surface where stoppability or reversibility fail and guide concrete remediation steps.",
    appliesTo: ["platforms", "audits", "sre"],
  },
  {
    slug: "conviviality",
    term: "Conviviality",
    definition:
      "The degree to which tools and institutions expand people\u2019s agency, cooperation, and right of refusal instead of enclosing them. Convivial systems keep permission surfaces wide and make opting out safe, so people can shape the service without being consumed by it.",
    appliesTo: ["community", "platforms", "mutual-aid"],
  },
  {
    slug: "ethotechnic-maturity",
    term: "Ethotechnic Maturity",
    definition:
      "A developmental scale describing how fully a system embodies Ethotechnic capabilities. Early maturity focuses on stopping acute harms; later stages add graceful degradation , contestability , and regular care retrospectives . The highest level treats ethics as continuous operations, with published SLJs and funded maintenance practice.",
    appliesTo: ["rail", "sre", "maturity"],
  },
  {
    slug: "mechanism-first-analysis",
    term: "Mechanism-first Analysis",
    definition:
      "An approach that prioritizes system mechanics—defaults, authority, clocks, reversibility—over declared values or intentions, because mechanics determine outcomes under load.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "architecture-over-values",
    term: "Architecture over Values",
    definition:
      "The claim that “ethical” outcomes depend less on what institutions say they value and more on the enforceable structure of how decisions are made and reversed.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "state-plus-clocks-model",
    term: "State + Clocks Model",
    definition:
      "A way of seeing power as state transitions plus time: who can change state, how quickly, and whether reversal is time-bound.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "contestability-architecture",
    term: "Contestability Architecture",
    definition:
      "The set of design features that make contestation real: decision objects, clock-start, binding authority, evidence parity, and guaranteed override paths.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "control-loops-constraints-framing",
    term: "Control Loops (Constraints Framing)",
    definition:
      "A safety lens where governance is modeled as feedback: detect harm, trigger intervention, enforce constraints, and learn. Useful for translating Ethotechnics into engineering terms.",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "moral-latency",
    term: "Moral Latency",
    definition:
      "The delay between harm occurring and the system recognizing it. Automated systems create harms faster than human oversight can register, demanding velocity friction and ethical interrupts .",
    appliesTo: ["hospitals", "automation", "latency"],
  },
  {
    slug: "accountability-diffusion",
    term: "Accountability Diffusion",
    definition:
      "Responsibility dissolves across teams, tools, and incentives until no one can intervene. A defining pattern of modern institutions and a direct threat to clear design authority .",
    appliesTo: ["platforms", "governance", "hospitals"],
  },
  {
    slug: "extraction",
    term: "Extraction",
    definition:
      "When a system pulls value\u2014data, attention, labor, or social capital\u2014without returning care, consent, or repair. Extraction hides true costs through externalization and steep burden gradients , hollowing trust.",
    appliesTo: ["labor", "platforms", "ai"],
  },
  {
    slug: "extraction-by-endurance",
    term: "Extraction by Endurance",
    definition:
      "Systems that depend on workers or users absorbing fragility through burnout, emotional labor, or unpaid cognitive work\u2014often mislabeled as \u201cresilience.\u201d Ethotechnic practice aims to invert this burden with fair burden distribution .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "drift",
    term: "Drift (System Drift)",
    definition:
      "The natural tendency of systems to externalize harm over time unless constrained by protective friction and moral performance indicators .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "externalization",
    term: "Externalization",
    definition:
      "Pushing risk, cost, or harm onto other teams, communities, or the future so metrics look clean. Externalization shows up as pollution, shadow labor, or brittle dependencies that live outside audits. Ethotechnics counters it with oversight horizons , MPIs , and transparent repair logs .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "brittleness",
    term: "Brittleness",
    definition:
      "When a system shatters under real-world variance\u2014unexpected inputs, refusals, or edge cases\u2014forcing humans to absorb impact. Brittleness signals missing soft edges , thin graceful degradation , and poor refusal tolerance .",
    appliesTo: ["aviation", "automation", "support"],
  },
  {
    slug: "optimization-myopia",
    term: "Optimization Myopia",
    definition:
      "Metric-chasing that narrows attention to throughput or growth while ignoring MPIs . Myopic optimization erodes contestability , raises failure load , and often fuels extraction .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "precision-laundering",
    term: "Precision Laundering",
    definition:
      "Using detailed metrics or probabilistic scores to disguise inequity as objectivity. Precision laundering hides burden gradients and externalization behind statistical gloss, undermining explainability for accountability .",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "compliance-collapse",
    term: "Compliance Collapse",
    definition:
      "When rigid policy checklists replace judgment, causing teams to follow rules while harm worsens. Compliance collapses occur when design authority is weak and contestability is low, leaving no path to pause or repair.",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "unseen-harm",
    term: "Unseen Harm",
    definition:
      "Harm that does not produce immediately legible signals—silence, withdrawal, dropout, dissociation—and is therefore misread as “no issue.”",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "stoppability",
    term: "Stoppability",
    definition:
      "A system\u2019s ability to halt harmful processes quickly and automatically\u2014without requiring heroism or escalation. Stoppability diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "reversibility",
    term: "Reversibility",
    definition:
      "The ease with which a system can undo a harmful state change\u2014restore access, correct a record, reverse a flag\u2014without extraordinary effort or power. Reversibility is a governance property: it determines whether mistakes are survivable. Reversibility diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "fair-burden-distribution",
    term: "Fair Burden Distribution",
    definition:
      "Failures do not fall hardest on the most vulnerable. Burden is treated as a design variable and measured via the user burden ratio . Fair burden distribution diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "contestability",
    term: "Contestability",
    definition:
      "The property of a system that allows affected people to force a decision to become a contestable object: something with reasons, a clock, an accountable authority, and a pathway to reversal. A system has contestability when \u201cthat\u2019s wrong\u201d can reliably become \u201chere is the specific decision, here is who can change it, and here is when they must respond.\u201d Contestability diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "refusability",
    term: "Refusability",
    definition:
      "A system\u2019s ability to let people say \u201cno\u201d without punishment or degradation\u2014including refusing data extraction, risky defaults, or coercive workflows\u2014while still preserving basic access and dignity. Refusability is not \u201copt-out exists\u201d; it\u2019s whether refusal is treated as a legitimate state rather than an error condition.",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "explainability-for-accountability",
    term: "Explainability for Accountability",
    definition:
      "Explanations that are actionable, not decorative. They reveal who made a decision and how it can be corrected, enabling contestability and audits . Explainability diagram",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "human-refusal-tolerance",
    term: "Human Refusal-Tolerance",
    definition:
      "The system remains usable when people opt out, are confused, make mistakes, or withdraw cooperation. Refusal tolerance prevents extraction by endurance by ensuring refusals do not silently convert into extra unpaid work.",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "graceful-degradation",
    term: "Fail-soft / Graceful Degradation",
    definition:
      "A design principle where systems degrade safely under stress\u2014reduced capability rather than catastrophic denial\u2014especially under accessibility constraints.",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "soft-edges",
    term: "Soft Edges",
    definition:
      "Boundary conditions designed to cushion people instead of penalizing them\u2014graduated responses, warnings before lockouts, and reversible defaults. Soft edges reduce failure load and guard against brittleness .",
    appliesTo: [
      "C. Ethotechnic capabilities (what systems must be able to do)",
    ],
  },
  {
    slug: "fail-safe",
    term: "Fail-Safe Mode",
    definition:
      "The system defaults to the safest possible behavior when uncertain, prioritizing stoppability .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-open",
    term: "Fail-Open Mode",
    definition:
      "The system defaults to permissiveness under failure\u2014sometimes necessary, sometimes dangerous. Must be paired with velocity friction .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-silent",
    term: "Fail-Silent Mode",
    definition:
      "A harmful state where systems fail without signaling it; the worst possible form of failure because it hides moral latency .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "crumple-zone",
    term: "Crumple Zone / Human-as-Crumple-Zone",
    definition:
      "Originally: machines absorb force so people survive. Digitally: people absorb system failures so machines stay smooth. Ethotechnics reverses this direction of impact.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "harm-visibility",
    term: "Harm Visibility",
    definition:
      "How plainly a system exposes the human impact of its decisions in real time. High harm visibility pairs logs, narratives, and alerts so oversight horizons extend beyond dashboards and ethical interrupts trigger on lived effects, not just technical anomalies.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "dead-zones",
    term: "Dead Zones / Moral Dead Zones",
    definition:
      "Places in a system where harm occurs but no one can see, trace, or intervene. Closing dead zones is a goal of oversight horizons .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "escalation-horizon",
    term: "Escalation Horizon",
    definition:
      "The predefined point where automated control must yield to human judgment because risk, ambiguity, or moral latency is rising. Escalation horizons activate ethical interrupts and route cases to accountable stewards before crossing an irreversible boundary .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "interaction-surface",
    term: "Interaction Surface",
    definition:
      "The moments, interfaces, and channels where people experience system decisions and can intervene. Mapping the interaction surface reveals where to place dignity friction , widen the permission surface , and detect dead-user zones .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "maintenance-window",
    term: "Maintenance Window",
    definition:
      "A scheduled calm state where teams intentionally slow or stop throughput so inspections, upgrades, and rehearsals can happen without crisis pressure. Maintenance windows make stoppability routine instead of reactive. Each window is negotiated with the people impacted, includes published service guarantees, and documents which safeguards were tested so unfinished work rolls into the shared repair log .",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "care-retrospective",
    term: "Care Retrospective",
    definition:
      "A facilitated reflection held while the system is still in a warning band to examine how maintenance load, emotional labor, and unresolved incidents are accumulating. Care retrospectives combine telemetry with frontline testimony. They redistribute responsibilities before burnout or harm escalates, triggering new maintenance windows or policy fixes when the team cannot keep absorbing risk.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "repair-log",
    term: "Repair Log",
    definition:
      "A living record of every mitigation, decision, and resource commitment made after a fault. Repair logs make accountability legible by linking people harmed, who intervened, and what evidence was used. They inform future care retrospectives , power audits, and service-level reports so follow-up work is traceable and burden does not drift back to the same communities.",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "finitude",
    term: "Finitude",
    definition:
      "The bodily, cognitive, emotional, and temporal limits all humans share. Ethotechnics treats finitude as a design input, not an inconvenience.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "cognitive-saturation",
    term: "Cognitive Saturation Point",
    definition:
      "The load level at which human decision quality collapses\u2014too many alerts, too little time, or excessive context switching. Ethotechnic design lowers saturation by adding velocity friction , simplifying interaction surfaces , and staffing to real maintenance metabolism .",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "compassion-bandwidth",
    term: "Compassion Bandwidth",
    definition:
      "The sustainable amount of emotional labor a system asks of people\u2014care teams, moderators, frontline staff, or users. When compassion bandwidth is exceeded, dread work grows and extraction by endurance sets in.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "administrative-shame",
    term: "Administrative Shame",
    definition:
      "The feeling of being personally at fault for harms produced by system design. Often a signal that moral overhead is too high.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "dread-work",
    term: "Dread Work",
    definition:
      "Tasks people avoid because the system punishes mistakes or withholds relief. Dread work signals missing soft edges , low contestability , and declining compassion bandwidth .",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "executive-function-class-axis",
    term: "Executive Function (as a Class Axis)",
    definition:
      "The idea that modern systems sort people by their capacity to perform sustained administrative labor—tracking tasks, managing documentation, navigating ambiguity—making disability and burnout into structural disadvantage.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "human-factors",
    term: "Human Factors",
    definition:
      "A discipline that studies how systems interact with real human limits—fatigue, confusion, stress—often revealing that “user error” is actually design failure.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "operator-centered",
    term: "Operator-centered",
    definition:
      "Design that treats front-line workers as key safety components and ensures they have authority, tools, and non-punitive reporting to prevent harm.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "legibility-illegibility",
    term: "Legibility / Illegibility",
    definition:
      "Legibility: being representable in the system’s categories and workflows. Illegibility: being real but not representable, leading to churn, delay, or denial.",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "refusal-budget",
    term: "Refusal Budget",
    definition:
      "The number of times a person can decline, pause, or question a request without retaliation. Healthy refusal budgets, backed by refusal tolerance and rights of exit , prevent coercion and surface heat maps of refusal .",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "burden-distribution",
    term: "Burden Distribution",
    definition:
      "How a system allocates the cost of operation or failure\u2014time, attention, stress, and emotional labor.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-gradient",
    term: "Burden Gradient",
    definition:
      "The slope of effort and risk across roles or communities. A steep burden gradient means those with the least power carry the heaviest operational load while decision-makers feel little friction. Mapping the gradient exposes where to redistribute work through fair burden distribution and reduce moral overhead .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "failure-load",
    term: "Failure Load",
    definition:
      "The amount of harm generated when the system fails. Ethotechnics seeks low-failure-load architectures supported by graceful degradation .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-transfer-event",
    term: "Burden Transfer Event",
    definition:
      "Moments when system failure pushes labor onto humans, often triggering moral overhead .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "cost-assignment",
    term: "Cost Assignment / Burden Shifting",
    definition:
      "A mechanism where systems offload the labor of safety, clarity, and follow-through onto individuals (forms, documentation, vigilance) while keeping institutional obligation low. It’s how “choice” becomes unpaid work.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "attention-tax",
    term: "Attention Tax",
    definition:
      "The ongoing monitoring burden imposed on individuals to prevent harm: checking portals, tracking deadlines, resubmitting documents, watching for silent rule changes. Attention becomes a cost of staying eligible.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-metabolism",
    term: "Maintenance Metabolism",
    definition:
      "The baseline flow of upkeep\u2014patching, cleaning, rehearsing, and caring\u2014that keeps a service alive when nothing is on fire. Healthy maintenance metabolism is budgeted, scheduled, and shared rather than squeezed between crises. Falling below it signals rising maintenance debt and invites maintenance windows before fragility compounds.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-debt",
    term: "Maintenance Debt",
    definition:
      "Accumulated obligations from skipping basic upkeep. The interest is paid in slower recovery, brittle systems, and people burning out to keep things running. Paying it down requires restoring the maintenance metabolism , scheduling maintenance windows , and tracking work in the repair log .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-overhead",
    term: "Moral Overhead",
    definition:
      "Extra work users or operators must do to behave ethically within a bad system.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "temporal-exaction",
    term: "Temporal Exaction",
    definition:
      "Uncompensated seizure of life-hours (time, attention, opportunity cost) as the price of accessing a right or correction. Temporal exaction is a form of extraction that inflates the user burden ratio.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-index",
    term: "Burden Index",
    definition:
      "A composite measure of how much effort, time, and emotional labor people expend to use or recover from a system. Inputs include the user burden ratio , human substitution index , and failure load ; rising scores signal extraction or asymmetric sustaining .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "asymmetric-sustaining",
    term: "Asymmetric Sustaining",
    definition:
      "When one group continually absorbs the toil of keeping a system alive so another group can move fast or claim success. It often hides behind gratitude for \u201cresilience\u201d while masking extraction . Ethotechnic practice flattens this by lowering the burden gradient and designing for stoppability so resilience is institutional, not personal.",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "fragility-subsidy",
    term: "Fragility Subsidy",
    definition:
      "The unpaid labor, vigilance, or emotional buffering people contribute to keep brittle systems functioning. Fragility subsidies hide true costs, inflate success metrics, and deepen asymmetric sustaining .",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-performance-indicators",
    term: "Moral Performance Indicators (MPIs)",
    definition:
      "Key metrics that show a system\u2019s ethical functioning: time-to-halt (TTH), reversibility rate, appeal success rate, burden ratios, and more. MPIs complement traditional KPIs by tracking how safely and fairly a system operates, not just how fast it grows. Moral performance indicators diagram",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "service-level-indicators",
    term: "Service-Level Indicators of Justice (SLJs)",
    definition:
      "Operational metrics tied directly to fairness, safety, and dignity. SLJs should sit alongside uptime and latency commitments.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "institutional-metabolism-mapping",
    term: "Institutional Metabolism Mapping",
    definition:
      "A diagnostic mapping of where energy, care, time, and money circulate inside an institution. It visualizes maintenance metabolism, burden gradients , and points of extraction . Teams use the map to set SLJs , redesign roles, and decide where to invest new maintenance windows .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-halt",
    term: "Time-to-Halt (TTH)",
    definition:
      "Seconds between a harmful process beginning and the system stopping it\u2014an essential complement to stoppability . Time to halt diagram",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-restore",
    term: "Time-to-Restore (TTR)",
    definition:
      "How long it takes to reverse harm and return a person to their prior state. Low TTR is a signal of effective reversibility .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "appeal-passage-rate",
    term: "Appeal Passage Rate",
    definition:
      "The percentage of appeals resolved in favor of the user , a leading indicator of true contestability .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "irreversibility-index",
    term: "Irreversibility Index",
    definition:
      "The share of system actions that cannot be undone. Aim to keep this as low as possible through reversibility and graceful degradation .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "user-burden-ratio",
    term: "User Burden Ratio",
    definition:
      "How much work a user must perform to correct or navigate system errors. This metric feeds directly into fair burden distribution .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "human-substitution-index",
    term: "Human Substitution Index",
    definition:
      "A measure of how often humans must step in to compensate for system shortcomings\u2014manual reviews, ad-hoc patches, or empathy work. A rising index exposes heroism-dependent systems and motivates investment in graceful degradation .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "signal-credibility",
    term: "Signal Credibility",
    definition:
      "The trustworthiness of alerts, metrics, and reports used to govern a system. High credibility pairs transparent sampling, explainability for accountability , and human testimony so warnings trigger action instead of alert fatigue or dismissal.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "reversal-cost",
    term: "Reversal Cost",
    definition:
      "The time, money, emotional labor, documentation, and social risk required to undo an outcome. High reversal cost makes errors durable and turns “rights” into luxuries.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "durability-of-error",
    term: "Durability of Error",
    definition:
      "How long a wrong state persists once created, and how far it propagates (downstream systems, eligibility, reputation). A system is dangerous when it can create durable errors quickly but correct them slowly.",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "moral-debt",
    term: "Moral Debt",
    definition:
      "The accumulated harm a system has caused but not repaired. Moral debt accrues interest as moral latency grows and people lose trust; it is paid down through pathways to restitution , transparent repair logs , and lowered time-to-restore .",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "design-authority",
    term: "Design Authority",
    definition:
      "The accountable power to set moral constraints, choose safeguards, and fund enforcement. Clear design authority aligns incentives, protects contestability , and prevents accountability diffusion .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "oversight-horizon",
    term: "Oversight Horizon",
    definition:
      "The distance regulators, auditors, or affected communities can see into a system\u2019s decisions and their effects. Extending the horizon\u2014through harm visibility , traceable models, and shared repair logs \u2014shrinks dead zones .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "permission-surface",
    term: "Permission Surface",
    definition:
      "What users can do without institutional approval \u2014 a measure of autonomy and a prerequisite for contestability .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "right-of-exit",
    term: "Exit Rights",
    definition:
      "Guaranteed, non-punitive ways to leave a system (or refuse a pathway) while preserving access to essentials, records, and future participation. Exit rights treat departure as a legitimate action, not a breach.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "externalized-harm-channels",
    term: "Externalized Harm Channels",
    definition:
      "The pathways an institution uses to push risk or cleanup onto others: contractors, users, bystanders, or future teams. Mapping these channels exposes externalization and informs fair burden distribution .",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "stewardship-window",
    term: "Stewardship Window",
    definition:
      "A negotiated period where teams pause growth work to focus on care, maintenance, and accountability. Stewardship windows bundle maintenance windows , publish SLJs for the pause, and commit to closing items in the repair log before resuming throughput.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "governance-by-suspension",
    term: "Governance by Suspension",
    definition:
      "Control exercised by keeping matters unresolved long enough that time itself produces the outcome. Governance by suspension relies on non-decisions and exploits endurance asymmetry.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "endurance-asymmetry",
    term: "Endurance Asymmetry",
    definition:
      "Institutions can persist indefinitely; humans cannot. This makes delay an allocation mechanism that underwrites continuity privilege and punitive friction.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-privilege",
    term: "Continuity Privilege",
    definition:
      "Unequal access to enforceability produced by unequal capacity to maintain standing over time (attention, health, documentation, slack). Continuity privilege steepens the burden gradient for those without reserves.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "proxy-privilege",
    term: "Proxy Privilege",
    definition:
      "Unequal enforceability produced by unequal ability to delegate persistence (agents, intermediaries, automation). Proxy privilege lets some parties bypass futility thresholds that others face alone.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "latency-as-action",
    term: "Latency-as-Action",
    definition:
      "The principle that delay produced predictably by system rules (queues, resets, blocked escalation, absent deadlines) is attributable power, not mere inaction.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bounded-duration",
    term: "Bounded Duration",
    definition:
      "A fixed maximum time-to-resolution; breach triggers an enforceable disposition. Bounded duration pairs with stable clocks and time transparency.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-of-state",
    term: "Continuity of State",
    definition:
      "A persistent cumulative record; no forced repetition of validated inputs. Continuity of state reduces temporal exaction and protects contestability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "safe-pause",
    term: "Safe Pause / Status Quo During Pendency",
    definition:
      "No adverse consequences while review is pending (except narrow, reviewable emergency exception). Safe pause preserves the utility window and keeps people whole during appeal.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "traceable-ownership",
    term: "Traceable Ownership",
    definition:
      "A named responsible party with authority to override automation when bounds are breached. Traceable ownership clarifies design authority and accelerates time-to-restore.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "time-transparency",
    term: "Time Transparency",
    definition:
      "Legible process state: current step, blocking condition, time remaining, next decision point, escalation triggers; no fake progress. Time transparency supports contestability and stable clocks.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bindingness",
    term: "Bindingness",
    definition:
      "The degree to which a system’s outputs create enforceable obligations—deadlines, duties, remedies, or reversals—rather than mere communications. Bindingness is the difference between “we received your request” and “we must decide by Friday or you win.”",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "non-bindingness",
    term: "Non-bindingness / Nonbindingness",
    definition:
      "The condition where a system can interact, respond, and even apologize without being compelled to change state. Non-bindingness is power without accountability: activity without obligation.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standing-vs-belief",
    term: "Standing (vs Belief)",
    definition:
      "Standing is the recognized right to make the system bind itself to engage, decide, and remedy—regardless of whether your story is believed, liked, or emotionally legible. “Belief” is narrative validation; standing is enforceable access to decision power.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "binding-authority",
    term: "Binding Authority",
    definition:
      "A person or role that can change the underlying state and is obligated to respond. Binding authority is not “a human is involved”; it’s a human with power + duty + traceable accountability.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "evidence-parity",
    term: "Evidence Parity",
    definition:
      "A condition where affected people have a fair chance to meet the evidentiary burden—access to the relevant facts, rules, and records—rather than being asked to prove things the institution can’t or won’t disclose. Without evidence parity, appeals become theater.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-chain",
    term: "Authority Chain",
    definition:
      "The mapping of who can change what state, at which stage, under what constraints. Authority chains determine whether escalation is real.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-mutation",
    term: "Authority Mutation",
    definition:
      "A pattern where escalation changes how the institution speaks without changing who has power to reverse outcomes. Authority mutates when the channel upgrades (more polite, more official, more complex) but the underlying ability to bind remains absent.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "defaults-as-governance",
    term: "Defaults (as Governance)",
    definition:
      "The idea that the baseline state—what happens if nobody intervenes—is a primary allocator of outcomes and costs. Defaults govern by deciding who must spend time, attention, and stamina to avoid harm.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-caste",
    term: "Procedural Caste",
    definition:
      "A stratification system where people are divided by their ability to force binding action: who can start clocks, reach authorities, obtain reversals, and make claims legible. It’s a caste system of enforceability, not worth.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "escalation-without-authority",
    term: "Escalation (without Authority)",
    definition:
      "A channel change that does not increase binding power—more forms, more tiers, more waiting—while the underlying decision remains unchangeable. It’s escalation as delay management, not remedy.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "redress",
    term: "Redress",
    definition:
      "The set of mechanisms that can correct harm: appeal, review, reversal, compensation, restoration. Redress is real when it is time-bound and reaches binding authority.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "override-path",
    term: "Override Path",
    definition:
      "A clearly defined mechanism that can supersede the default workflow when the default would cause harm—e.g., human escalation with real authority, emergency reversal, exception handling with deadlines. Override paths are where “care” becomes material.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "structured-exit",
    term: "Structured Exit",
    definition:
      "An exit process designed to protect the leaver: clear steps, data portability, timelines, anti-retaliation constraints, and closure that doesn’t require ongoing performance. Structured exit turns leaving into a governed pathway instead of an endurance test.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "paywalled-rights",
    term: "Paywalled Rights",
    definition:
      "When access to contestation, speed, or binding review is effectively purchased—through fees, premium support, lawyers, consultants, or time flexibility. Rights exist, but only for those who can pay in money or stamina.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "logs-as-power",
    term: "Logs-as-power",
    definition:
      "The idea that control over records—what is logged, who can see it, what counts as evidence—shapes who can contest outcomes. Recordkeeping is governance.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "audit-trail",
    term: "Audit Trail",
    definition:
      "A trace of events and decisions—what happened, when, by whom, under what rule—used for accountability. Audit trails matter only if they connect to reversal power.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "administrative-reality",
    term: "Administrative Reality",
    definition:
      "The world as the system recognizes it: what counts, what is recordable, what triggers action. Administrative reality often diverges from lived reality.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contract-of-adhesion",
    term: "Contract of Adhesion",
    definition:
      "A take-it-or-leave-it contract offered by a more powerful party where negotiation is impossible; a common substrate for coerced “choice.”",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "nda-retaliation-narrative-erasure",
    term: "NDA Retaliation / Narrative Erasure",
    definition:
      "Mechanisms that suppress exit stories—legal threats, informal retaliation, reputational control—preventing systems from being held accountable by shared evidence.",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "protective-friction",
    term: "Protective Friction",
    definition:
      "Friction that slows harmful processes and keeps moral latency within safe bounds.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "punitive-friction",
    term: "Punitive Friction",
    definition:
      "Friction that punishes users\u2014often hidden in bureaucratic loops. Signals extraction by endurance .",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "dignity-friction",
    term: "Dignity Friction",
    definition:
      "Friction that preserves autonomy, such as double checks on irreversible actions.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "velocity-friction",
    term: "Velocity Friction",
    definition:
      "Friction added specifically to prevent runaway system behaviors. Often implemented through ethical interrupts .",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "safety-valve",
    term: "Safety Valve",
    definition:
      "A deliberate release point that lets people slow, pause, or reroute automation before harm compounds. Safety valves pair stoppability with dignity friction so high-stakes flows default to reversible states and route to humans without penalty.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "consent-journey",
    term: "Consent Journey",
    definition:
      "The sequenced touchpoints where a person learns what a system will do, grants or denies permission, and can revise that choice over time. Strong consent journeys use anticipatory consent , visible permission surfaces , and healthy refusal budgets so pausing or exiting does not jeopardize access or care.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "coercive-consent",
    term: "Coercive Consent",
    definition:
      "“Agreement” obtained through defaults, asymmetry, or threats of exclusion—consent produced by lack of viable refusal.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "humane-friction",
    term: "Humane Friction",
    definition:
      "The calibrated blend of protective, dignity, and velocity frictions.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "frictionless-harm",
    term: "Frictionless Harm",
    definition:
      "Harms that spread unchecked because safeguards or pauses were stripped away. Frictionless harm is the inverse of protective friction ; it appears when velocity friction and dignity friction are absent.",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "decision-edge",
    term: "Decision Edge",
    definition:
      "The precise moment when a choice shifts from reversible to consequential. Making the decision edge visible enables dignity friction , clearer consent, and routing to ethical interrupts when risk spikes.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-surface",
    term: "Decision Surface",
    definition:
      "The part of a system where decisions become visible, addressable, and contestable. Many systems minimize the decision surface to avoid accountability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-artifact",
    term: "Decision Artifact",
    definition:
      "A discrete, attributable, contestable output: outcome + reason + timestamp + accountable owner. Decision artifacts anchor traceable ownership and make contestability measurable.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-object",
    term: "Decision Object",
    definition:
      "A discrete, addressable unit of institutional action that can be challenged: what was decided, when, under which rule, by what authority, with what evidence. Decision objects are the “handles” that make contestation possible.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "object-formation",
    term: "Object Formation",
    definition:
      "The process by which a complaint, harm, or request becomes a decision object—assigned an identifier, a category, an owner, a standard of review, and a clock. Systems often block accountability by preventing object formation (“nothing exists to appeal”).",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-decision",
    term: "Non-Decision",
    definition:
      "A stable administrative disposition where a system withholds a contestable outcome (pending, in review) while consequences accrue. Non-decisions stretch moral latency and keep people in limbo.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "pendingness",
    term: "Pending / Pendingness",
    definition:
      "A default state where nothing is decided and no one is obligated—often presented as neutral but functioning as an outcome allocator. Pendingness becomes harm when it lacks a clock, an owner, or a forced next step.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "settlement",
    term: "Settlement",
    definition:
      "The moment a claim becomes resolved in a way that changes the underlying state—approved, denied with appeal rights, remediated, reversed, paid, restored, or otherwise closed with consequences. Settlement is not closure in the CRM; it’s resolution that binds.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-settlement",
    term: "Non-settlement / Nonsettlement",
    definition:
      "An institutional mode where claims are acknowledged and processed indefinitely without producing a binding resolution. The system offers intake, updates, and politeness while keeping obligation optional.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "stable-clock",
    term: "Stable Clock",
    definition:
      "A non-resettable timeline for a case; the system cannot restart time via re-ticketing, re-verification, or channel switching. Stable clocks enforce bounded duration and keep timelines legible.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "clock-start-clock-mismatch",
    term: "Clock-start / Clock mismatch",
    definition:
      "Clock-start: the moment a system becomes time-bound—deadlines begin, obligations attach, escalation becomes meaningful. Clock mismatch: when institutional execution is fast (instant flags, freezes, denials) but redress is slow (weeks-months-human review), making errors durable and contestation scarce.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "slow-redress-fast-execution",
    term: "Slow Redress / Fast Execution",
    definition:
      "A governance asymmetry where harmful state changes are immediate but appeals are delayed, discretionary, and exhausting. This is one of the main engines of modern coercion.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-window",
    term: "Utility Window",
    definition:
      "The time span during which relief can still prevent the relevant harm. Designing for a clear utility window keeps time-to-restore accountable.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-expiry",
    term: "Utility Expiry",
    definition:
      "Crossing the utility window; relief arrives too late to matter. Utility expiry should trigger constructive denial or repair.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "futility-threshold",
    term: "Futility Threshold",
    definition:
      "The point where time-on-task or repetition becomes so costly that valid claimants predictably abandon pursuit. Systems that hit the futility threshold signal punitive friction and low contestability.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "constructive-denial",
    term: "Constructive Denial",
    definition:
      "A legal state where delay is treated as refusal because it destroys utility or makes pursuit futile. Constructive denial recognizes utility expiry and forces accountable remedies.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "critical-action",
    term: "Critical Action",
    definition:
      "Any system action that meaningfully alters a person\u2019s status, access, or trajectory. Critical actions require dignity friction .",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "irreversibility",
    term: "Irreversibility",
    definition:
      "A state where reversal is practically unavailable (too slow, too expensive, too discretionary) even if it is theoretically possible. Irreversibility is often produced by missing clocks, missing authority, or asymmetric evidence demands.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "irreversible-boundary",
    term: "Irreversible Boundary",
    definition:
      "A threshold the system cannot automatically undo\u2014account closures, public releases, or data publication. Crossing it demands heightened contestability , audited explanations , and explicit time-to-restore plans.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "backstop",
    term: "Backstop",
    definition:
      "A guaranteed fallback mechanism that triggers when the main process fails—timeouts, automatic approvals, emergency restoration, or external review.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "rollback",
    term: "Rollback",
    definition:
      "A designed ability to revert the system to a prior safe state—restoring access, undoing propagation, correcting records—ideally with minimal friction.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "auto-close-auto-renew-auto-share",
    term: "Auto-close / Auto-renew / Auto-share",
    definition:
      "Default state transitions that happen without active consent—closing claims, renewing contracts, expanding data use—often presented as convenience while functioning as governance by inertia.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "ethical-interrupts",
    term: "Ethical Interrupts",
    definition:
      "Automatic system-level halts triggered by anomalies or harm indicators. Ethical interrupts operationalize stoppability .",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "heroism-dependent-systems",
    term: "Heroism-Dependent Systems",
    definition:
      "Systems that rely on extraordinary effort, unpaid care, or silent sacrifice to function. They mask poor stoppability and high failure load .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "empathy-surrogacy",
    term: "Empathy Surrogacy",
    definition:
      "Simulated warmth\u2014chatbots, scripted apologies, tone guidelines\u2014used to mask structural harm or delay fixes. Empathy surrogacy diverts attention from repair and weakens contestability by substituting sentiment for remedy.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "error-cascades",
    term: "Error Cascades",
    definition:
      "Small automated mistakes that amplify across the system. Prevented through ethical interrupts and SLJs .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "invisible-fallbacks",
    term: "Invisible Fallbacks",
    definition:
      "Hidden behaviors that appear under stress\u2014shadow queues, silent throttling, or undocumented overrides. Invisible fallbacks obscure ethical load paths and should be surfaced through graceful rollback lanes and rehearsed in maintenance windows .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "dead-user-zones",
    term: "Dead-User Zones",
    definition:
      "Places where people affected by decisions cannot contest, appeal, or exit\u2014opaque rankings, automated bans, or unmoderated queues. Closing dead-user zones requires widening the permission surface and raising appeal passage rates .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "moral-lock-in",
    term: "Moral Lock-In",
    definition:
      "When harmful defaults become entrenched through dependencies, network effects, or contracts that block reform. Moral lock-in is prevented by moral feature gating , contestability , and vigilant moral drift control .",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "legitimacy-laundering",
    term: "Legitimacy Laundering",
    definition:
      "The process of converting coercive or indifferent outcomes into reputational legitimacy through procedural signals—case IDs, polite updates, “in review”—without delivering binding resolution. The system looks responsible while staying unbound.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "polite-coercion",
    term: "Polite Coercion",
    definition:
      "Coercion delivered through soothing language and “helpful” workflows that make refusal costly or stigmatized. Polite coercion is power that avoids looking like power.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "documentation-loop",
    term: "Documentation Loop / Resubmission Loop",
    definition:
      "A repeating pattern where the system continually requests more evidence or re-uploads without moving toward a binding decision. Often used to shift labor onto claimants and to manufacture dropout.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "precision-demands",
    term: "Precision Demands",
    definition:
      "Requests for ever-greater specificity that function less as truth-seeking and more as denial hooks—ways to keep a case non-objectified or non-decidable. Precision demands are a technique of delay.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "procedural-alibi",
    term: "Procedural Alibi",
    definition:
      "A record of “process” used to defend outcomes (“we followed procedure”) even when the procedure cannot bind the institution to remedy. The alibi is the trace of activity, not accountability.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "tone-policing",
    term: "Tone Policing (as Governance Technology)",
    definition:
      "The use of “appropriate tone” requirements to control access to remedy—penalizing anger, urgency, neurodivergent communication, or exhaustion. Tone policing converts distress into disqualification.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "dropout-as-legitimation",
    term: "Dropout-as-legitimation",
    definition:
      "When systems treat nonresponse, fatigue, or disappearance as consent or closure (“case closed—no reply”), laundering coercion into “resolved.” Dropout becomes the mechanism that protects the institution.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "churn-as-closure",
    term: "Churn (as Closure Mechanism)",
    definition:
      "The engineered cycling of people through forms, queues, and handoffs until they give up, miss a deadline, or become “inactive,” allowing the system to close without settlement.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "paper-compliance",
    term: "Paper Compliance / Checkbox Governance",
    definition:
      "Compliance regimes focused on producing documentation of doing the right thing rather than mechanisms that can actually prevent harm or force remedy. The paperwork stands in for power.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "transparency-theater",
    term: "Transparency Theater",
    definition:
      "Disclosures that do not increase contestability—more text, more dashboards, more “explanations”—without deadlines, authority, or reversal paths. Visibility substitutes for enforceability.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "explainability-decoy",
    term: "Explainability Decoy",
    definition:
      "A focus on explaining model decisions that distracts from the harder question: can the decision be contested, reversed, and time-bounded? The decoy offers epistemics where governance is needed.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "human-in-the-loop-legitimacy",
    term: "Human-in-the-loop (as Legitimacy Artifact)",
    definition:
      "A human reviewer inserted to create legitimacy while lacking binding authority, deadlines, or meaningful discretion. The loop becomes a comfort signal, not a power shift.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "procedural-realism",
    term: "Procedural Realism",
    definition:
      "A style of analysis (and sometimes art) that treats procedures, channels, and workflows as the real plot—where power is shown through process.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "intake-cinema",
    term: "Intake Cinema",
    definition:
      "A label for stories where the drama is the intake/eligibility channel—forms, interviews, caseworkers, waiting rooms—rather than a single decisive confrontation.",
    appliesTo: ["K. System patterns & anti-patterns"],
  },
  {
    slug: "moral-drift-control",
    term: "Moral Drift Control",
    definition:
      "Instrumentation and controls that detect when system behavior drifts from ethical baselines\u2014through MPIs or user testimony\u2014and automatically trigger interrupts or design changes.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "structural-gentleness-coefficients",
    term: "Structural Gentleness Coefficients",
    definition:
      "Measures of how forgiving an infrastructure is to human variance: error tolerance, recovery time, and soft edges . Higher coefficients correlate with lower failure load and safer degradation .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "burden-elasticity",
    term: "Burden Elasticity",
    definition:
      "How effort and risk stretch or rebound between actors when conditions change. Mapping burden elasticity alongside the burden gradient prevents crises from snapping back onto the least powerful.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "care-redundancy",
    term: "Care Redundancy",
    definition:
      "Overlapping care pathways\u2014humans, automation, and policy\u2014that ensure someone is caught when another safeguard fails. Care redundancy pairs with graceful degradation to keep failure load low.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "meta-contestability",
    term: "Meta-Contestability",
    definition:
      "Mechanisms that let people challenge not just outcomes but the rules of challenge themselves\u2014who may appeal, what evidence counts, and who sits on review panels. Meta-contestability keeps contestability from ossifying.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "user-state-modeling",
    term: "User-State Modeling for Harm Prevention",
    definition:
      "Inferring user states\u2014fatigue, distress, inattention\u2014to adapt pacing, add protective friction , or route to humans before harm compounds. Models must respect anticipatory consent and avoid new burden transfers .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethical-latency",
    term: "Design for Ethical Latency",
    definition:
      "Designing for unavoidable delay between action and ethical evaluation by staging risky steps, adding velocity friction , or seeking care floor guarantees while fuller review occurs.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "distributed-accountability-protocols",
    term: "Distributed Accountability Protocols",
    definition:
      "Coordination methods that keep responsibility legible across teams and automation: shared playbooks, auditable handoffs, and repair logs . Protocols prevent accountability diffusion when work moves.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethotechnic-failure-taxonomy",
    term: "Ethotechnic Failure Taxonomy",
    definition:
      "A common vocabulary for classifying moral failure modes\u2014 optimization myopia , brittleness , extraction , and more\u2014so incidents can be compared, learned from, and prevented.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "adaptive-refusal-pathways",
    term: "Adaptive Refusal Pathways",
    definition:
      "Dynamic flows that reroute tasks when someone pauses or declines, preserving context and avoiding retaliation. Adaptive pathways extend refusal budgets and strengthen refusal tolerance .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "aftercare-automation",
    term: "Aftercare Automation",
    definition:
      "Automated follow-up that checks on impacted people after incidents, schedules remedies, and prompts humans to close the loop. Done well, it lowers moral debt without creating new moral overhead .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "alignment-dividend",
    term: "Alignment Dividend",
    definition:
      "The measurable upside\u2014trust, retention, safety\u2014generated when systems align with human values. Tracking the dividend builds the business case for sustained investment in MPIs and maintenance metabolism .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ambiguity-budgets",
    term: "Ambiguity Budgets",
    definition:
      "Explicit allowances for uncertainty that prevent premature automation or brittle enforcement. Ambiguity budgets reserve time, human review, or maintenance windows until context is sufficient.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "anticipatory-consent",
    term: "Anticipatory Consent",
    definition:
      "Consent models that preview future data uses and let people pre-approve, defer, or block them. Anticipatory consent supports rights of exit and counters precision laundering of unclear terms.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "boundary-of-acceptable-harm",
    term: "Boundary of Acceptable Harm",
    definition:
      "Dynamic thresholds defining when moral risk exceeds the system\u2019s mandate and operations must halt or escalate. Boundaries are tied to SLJs and enforced through ethical circuit breakers .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "care-floor-guarantees",
    term: "Care Floor Guarantees",
    definition:
      "Baseline commitments a service maintains even during outages or crises\u2014live support, data export, or safe defaults. Care floors protect users when graceful degradation activates.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "compassion-telemetry",
    term: "Compassion Telemetry",
    definition:
      "Signals that show whether interactions feel humane\u2014response tone, wait times during distress, quality of follow-up. Compassion telemetry complements technical metrics to protect compassion bandwidth .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "conflict-observability",
    term: "Conflict Observability",
    definition:
      "Instrumentation that makes value conflicts visible in logs and dashboards before they erupt\u2014flagging when SLJs trade off against throughput or when appeals spike. High observability enables earlier moral drift control .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "counter-abuse-guardrails",
    term: "Counter-Abuse Guardrails",
    definition:
      "Limits that prevent tools from being repurposed for harassment, exploitation, or coercion\u2014rate limits, anomaly detection, and human override lanes tuned for abuse scenarios.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "crisis-rehearsal-loops",
    term: "Crisis Rehearsal Loops",
    definition:
      "Regular drills that stress-test moral responses, not just uptime. They practice ethical interrupts , validate care floors , and update repair logs with lessons.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "data-dignity-budgets",
    term: "Data Dignity Budgets",
    definition:
      "Caps on data collection and use that respect personhood and context, not just legal checkbox consent. Budgets align with anticipatory consent and guard against extraction .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "decision-debt-ledger",
    term: "Decision Debt Ledger",
    definition:
      "A register of deferred decisions and their moral interest, reviewed before debt compounds into harm. The ledger feeds maintenance windows and informs MPIs .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "downstream-equity-buffers",
    term: "Downstream Equity Buffers",
    definition:
      "Design slack that absorbs variance so marginalized groups do not pay first or most when errors occur. Buffers include staggered rollouts, rollback lanes , and targeted support funds.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethical-circuit-breakers",
    term: "Ethical Circuit Breakers",
    definition:
      "Automated stops that trip when moral risk indicators cross predefined set points\u2014surges in appeals, bias metrics, or moral debt . They are the safety counterpart to financial circuit breakers.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "ethical-load-testing",
    term: "Ethical Load Testing",
    definition:
      "Deliberate exercises that probe how systems behave under moral stress\u2014simulated harassment, mass appeals, or outage scenarios\u2014to validate ethical circuit breakers and care floors .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "exhaustion-triggers",
    term: "Exhaustion Triggers",
    definition:
      "Signals that detect operator or user fatigue\u2014error streaks, long queues, late-night decisions\u2014and automatically slow, pause, or hand off flows before mistakes multiply. Triggers protect compassion bandwidth .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "friction-budgets",
    term: "Friction Budgets",
    definition:
      "Planned allocations of protective and dignity frictions across journeys to balance safety with usability, rather than defaulting to speed.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "graceful-rollback-lanes",
    term: "Graceful Rollback Lanes",
    definition:
      "Prepared routes to revert harmful decisions while preserving dignity, evidence, and service continuity. Rollback lanes keep irreversibility indices low and shorten time-to-restore .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "harm-amnesty-windows",
    term: "Harm Amnesty Windows",
    definition:
      "Time-boxed periods where people can report or reverse harmful actions without penalty, encouraging disclosure and faster repair . Amnesty windows often follow rehearsal loops or incidents.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "heat-maps-of-refusal",
    term: "Heat Maps of Refusal",
    definition:
      "Visualizations showing where users opt out, churn, or appeal\u2014revealing coercion hotspots early. Heat maps help tune refusal budgets and redesign interaction surfaces .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "human-override-lanes",
    term: "Human Override Lanes",
    definition:
      "Guaranteed routes for human judgment to supersede automation when stakes are high or context is missing. Override lanes accompany ethical interrupts and require clear ethical load paths .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "incident-memory-chains",
    term: "Incident Memory Chains",
    definition:
      "Linked records that keep lessons from past incidents attached to similar workflows so knowledge stays actionable. Memory chains inform ethical load tests and prevent moral lock-in on bad patterns.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "moral-dry-runs",
    term: "Moral Dry Runs",
    definition:
      "Pre-launch walkthroughs that simulate ethical dilemmas to harden designs before they reach the public. Dry runs test circuit breakers , rollback lanes , and documentation.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "moral-feature-gating",
    term: "Moral Feature Gating",
    definition:
      "Controls that block feature launch until moral readiness criteria\u2014oversight plans, contestability pathways, and care floors \u2014are met.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "pathways-to-restitution",
    term: "Pathways to Restitution",
    definition:
      "Documented steps a system must take to repair harm: acknowledgement, remedy, verification, and follow-up. Pathways reduce moral debt and belong in the repair log .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "refusal-aware-routing",
    term: "Refusal-Aware Routing",
    definition:
      "Routing logic that accounts for who can decline tasks and ensures refusals are respected without retaliation or silent penalization. It preserves refusal budgets and keeps workflows humane.",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "relief-invariants",
    term: "Relief Invariants",
    definition:
      "Assurances that regardless of pathway, people can access relief with predictable effort and support. Relief invariants are tested in crisis rehearsals and anchored by care floors .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "repair-quorums",
    term: "Repair Quorums",
    definition:
      "Minimum participation rules for authorizing fixes so impacted communities have a seat in deciding remedies. Repair quorums counter accountability diffusion and legitimize restitution .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "rest-cycle-enforcement",
    term: "Rest Cycle Enforcement",
    definition:
      "Built-in mechanisms that enforce rest and recovery\u2014rotation policies, cooldown timers, enforced downtime\u2014so fatigue does not translate into harm. Enforcement protects maintenance metabolism and compassion bandwidth .",
    appliesTo: ["L. Future concepts / research areas"],
  },
  {
    slug: "conservancy-principle",
    term: "The Conservancy Principle",
    definition:
      "Designers steward human dignity and collective resources; they must leave systems safer and more reparable than they found them. Conservancy prioritizes repair , stoppability , and minimizing moral debt .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "burden-inversion-rule",
    term: "The Burden Inversion Rule",
    definition:
      "When harm occurs, the system shoulders effort before the person harmed does. Burden inversion lowers the user burden ratio and demands rapid restoration .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "stop-before-explain-rule",
    term: "The Stop-Before-Explain Rule",
    definition:
      "Halt harmful behavior first, then justify or refine it. Systems must trigger ethical interrupts before offering explanations, preserving reversibility .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "maintenance-doctrine",
    term: "The Maintenance Doctrine",
    definition:
      "Ethical performance depends on continuous upkeep\u2014funded maintenance metabolism , scheduled maintenance windows , and transparent logs .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "low-failure-load-principle",
    term: "The Principle of Low-Failure-Load Design",
    definition:
      "Design so that when failures occur, human impact is contained. This principle motivates graceful degradation , care floors , and low irreversibility indices .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "reversibility-mandate",
    term: "The Reversibility Mandate",
    definition:
      "Critical actions must be undoable or paired with rollback lanes . The mandate aligns with time-to-restore targets and contestability .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
  {
    slug: "contestability-guarantee",
    term: "The Contestability Guarantee",
    definition:
      "People affected by system decisions can challenge, change, or overturn them\u2014and win. Guarantees include wide permission surfaces , high appeal passage rates , and transparent design authority .",
    appliesTo: ["M. Foundational Ethotechnic principles"],
  },
];

const glossaryIndex = glossaryTerms.reduce<Record<string, GlossaryTerm>>(
  (index, term) => {
    index[term.slug] = term;
    return index;
  },
  {},
);

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const getGlossaryLabel = (slug: string) =>
  glossaryIndex[slug]?.term ?? formatSlug(slug);
