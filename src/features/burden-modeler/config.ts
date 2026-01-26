import type { BurdenCategory, BurdenDriver } from './types';

export const MAX_DRIVER_SCORE = 10;
export const SEGMENT_IMBALANCE_THRESHOLD = 12;

export const burdenCategories: BurdenCategory[] = [
  {
    id: 'task-load',
    label: 'Task load',
    description: 'Queues, staffing coverage, and surprise work that stack load on operators.',
  },
  {
    id: 'cognitive-load',
    label: 'Cognitive friction',
    description: 'Context switching, missing runbooks, and unclear decisions that slow people down.',
  },
  {
    id: 'risk-exposure',
    label: 'Risk exposure',
    description: 'Incidents, safety-critical steps, and escalation loops that increase harm potential.',
  },
];

export const burdenDrivers: BurdenDriver[] = [
  {
    id: 'interruptions',
    label: 'Interruptions and escalations',
    prompt: 'How often are responders pulled into unplanned escalations or urgent asks?',
    category: 'task-load',
    weight: 1.4,
    mitigations: [
      'Route interrupt-heavy work to rotating buffers or guardrail teams.',
      'Block focus windows for deep work and align escalation paths.',
    ],
  },
  {
    id: 'handoffs',
    label: 'Handoffs and context switching',
    prompt: 'How fragmented is work across channels, tickets, or roles?',
    category: 'cognitive-load',
    weight: 1.25,
    mitigations: [
      'Trim the number of active lanes and clarify who owns each decision.',
      'Collapse duplicative queues with a single routing checklist.',
    ],
  },
  {
    id: 'tooling',
    label: 'Tooling friction',
    prompt: 'How much time disappears to brittle tools, permissions, or missing automation?',
    category: 'cognitive-load',
    weight: 1.15,
    mitigations: [
      'Automate repetitive steps and retire unused dashboards or queues.',
      'Pair painful tools with annotated runbooks and fast support paths.',
    ],
  },
  {
    id: 'runbooks',
    label: 'Runbooks and guardrails',
    prompt: 'How often do people improvise because guardrails or playbooks are missing?',
    category: 'risk-exposure',
    weight: 1.1,
    mitigations: [
      'Write light-weight runbooks for the top three failure modes.',
      'Add pre-flight checklists for safety-critical or consent-sensitive steps.',
    ],
  },
  {
    id: 'incidents',
    label: 'Incident frequency',
    prompt: 'How frequently do incidents, abuse reports, or outages hit this team?',
    category: 'risk-exposure',
    weight: 1.3,
    mitigations: [
      'Add protective friction and clearer refusal policies to lower incoming risk.',
      'Staff backup responders or on-call rotations during known spikes.',
    ],
  },
  {
    id: 'coverage',
    label: 'Coverage and staffing',
    prompt: 'How thin is staffing coverage across time zones and critical roles?',
    category: 'task-load',
    weight: 1.2,
    mitigations: [
      'Set intake limits and pre-negotiate refusal windows during thin coverage.',
      'Cross-train adjacent teams and rotate shadowers into the queue.',
    ],
  },
  {
    id: 'decision-debt',
    label: 'Decision debt',
    prompt: 'How many past decisions or ambiguous policies keep re-opening work?',
    category: 'cognitive-load',
    weight: 1,
    mitigations: [
      'Document precedent and link decisions to owners and review cadences.',
      'Retire outdated policies and add appeal paths when decisions stall.',
    ],
  },
];
