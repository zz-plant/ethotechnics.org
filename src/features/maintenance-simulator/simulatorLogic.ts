export type RiskLevel = 'steady' | 'elevated' | 'critical';

export interface CoverageChecklist {
  escalationOwner: boolean;
  rollbackPlan: boolean;
  communicationsReady: boolean;
  appealPath: boolean;
  handoffPlan: boolean;
}

export interface StageTemplate {
  id: string;
  name: string;
  phase: 'Outage' | 'Maintenance window' | 'Handoff';
  focus: string;
  expectedOwner: string;
  tasks: string[];
}

export interface CommunicationTemplate {
  audience: string;
  trigger: string;
  message: string;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  summary: string;
  timeToHalt: string;
  stressSignals: string[];
  stages: StageTemplate[];
  communications: CommunicationTemplate[];
}

export interface StagePlan extends StageTemplate {
  blockers: string[];
  severity: 'ready' | 'watch' | 'at-risk';
}

export interface SimulationPlan {
  template: ScenarioTemplate;
  readinessScore: number;
  gaps: string[];
  stagePlan: StagePlan[];
}

export const coverageItems: { key: keyof CoverageChecklist; label: string; detail: string }[] = [
  {
    key: 'escalationOwner',
    label: 'Escalation owner',
    detail: 'Single accountable owner for outage and maintenance branches.',
  },
  {
    key: 'rollbackPlan',
    label: 'Rollback and halt lane',
    detail: 'Documented stop rule with a rollback timer and contingencies.',
  },
  {
    key: 'communicationsReady',
    label: 'Communication templates',
    detail: 'Pre-written updates tied to severity, audiences, and cadence.',
  },
  {
    key: 'appealPath',
    label: 'Appeal and refusal path',
    detail: 'Teams can decline the window when risk spikes or context is missing.',
  },
  {
    key: 'handoffPlan',
    label: 'Handoff plan',
    detail: 'Checklist for closing the window, rotation coverage, and follow-up.',
  },
];

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: 'scheduled-maintenance',
    name: 'Scheduled maintenance window',
    summary: 'Planned change with a clear window and limited customer impact when it goes well.',
    timeToHalt: '20 minutes',
    stressSignals: [
      'Overlapping releases or approvals are unclear.',
      'Runbook drift means steps differ across teams.',
      'Fallback owners cannot be reached during the window.',
    ],
    stages: [
      {
        id: 'announce-window',
        name: 'Pre-flight and announcements',
        phase: 'Maintenance window',
        focus: 'Publish the window, freeze risky work, and stage rollback artifacts.',
        expectedOwner: 'Maintenance lead',
        tasks: ['Publish the window and point to the appeal path.', 'Stage rollback assets and backup checkpoints.'],
      },
      {
        id: 'execute',
        name: 'Live window execution',
        phase: 'Maintenance window',
        focus: 'Track live signals, pause risky steps, and keep comms on cadence.',
        expectedOwner: 'On-call engineer',
        tasks: ['Watch saturation and rollback timers.', 'Hold back on high-risk changes when signals spike.'],
      },
      {
        id: 'handoff',
        name: 'Handoff and verification',
        phase: 'Handoff',
        focus: 'Confirm rollback readiness before closing and hand off logs to follow-up owners.',
        expectedOwner: 'Handoff owner',
        tasks: ['Verify rollback path after the last step.', 'Schedule the care retrospective and log follow-ups.'],
      },
    ],
    communications: [
      {
        audience: 'Internal teams',
        trigger: '72h before window',
        message: 'Share scope, freeze list, appeal path, and owner roster.',
      },
      {
        audience: 'Customers or partners',
        trigger: '24h before window',
        message: 'Surface expected impact, timings, and how to reach live support.',
      },
      {
        audience: 'Leadership',
        trigger: 'At start and mid-window',
        message: 'Post status with risk color, deviations, and halt timer.',
      },
    ],
  },
  {
    id: 'degraded-service',
    name: 'Degraded vendor or dependency',
    summary: 'Partner outage raises error rates; you need to decide whether to halt, reroute, or wait.',
    timeToHalt: '10 minutes',
    stressSignals: [
      'Dependency SLOs are hidden or out of date.',
      'Escalation to the vendor is unclear or slow.',
      'Frontline teams have no script for degraded behavior.',
    ],
    stages: [
      {
        id: 'triage',
        name: 'Detect and triage',
        phase: 'Outage',
        focus: 'Capture blast radius, start a rollback timer, and put someone on vendor comms.',
        expectedOwner: 'Incident commander',
        tasks: ['Confirm degradation path and disable risky features.', 'Assign a liaison to the vendor status channel.'],
      },
      {
        id: 'reroute',
        name: 'Reroute or halt',
        phase: 'Maintenance window',
        focus: 'Select the safest branch: reroute, slow down, or halt until the vendor recovers.',
        expectedOwner: 'Technical lead',
        tasks: ['Pick a branch with explicit time-to-halt.', 'Update frontline teams on expected user impact.'],
      },
      {
        id: 'stabilize',
        name: 'Stabilize and hand off',
        phase: 'Handoff',
        focus: 'Publish a summary with rollback timings, remediations, and who owns cleanup.',
        expectedOwner: 'Support lead',
        tasks: ['Record mitigation decisions in the repair log.', 'Schedule a review of dependency coverage and debt.'],
      },
    ],
    communications: [
      {
        audience: 'Frontline support',
        trigger: 'Once degradation confirmed',
        message: 'Provide scripts, refusal rules, and approved workarounds.',
      },
      {
        audience: 'Vendor or partner',
        trigger: 'Within first 10 minutes',
        message: 'Share diagnostics, request status cadence, and confirm escalation owner.',
      },
      {
        audience: 'Impacted users',
        trigger: 'After first status update',
        message: 'Publish expected symptoms, mitigation path, and next update time.',
      },
    ],
  },
  {
    id: 'overnight-outage',
    name: 'Overnight outage',
    summary: 'Critical service drops during low staffing; you need a controlled halt and safe recovery.',
    timeToHalt: '5 minutes',
    stressSignals: [
      'Alert fatigue or paging thresholds hide the outage.',
      'No clear handoff for off-hours responders.',
      'Rollback steps are gated on unavailable reviewers.',
    ],
    stages: [
      {
        id: 'contain',
        name: 'Contain and slow down',
        phase: 'Outage',
        focus: 'Throttle risky automations and get the right responders online.',
        expectedOwner: 'First responder',
        tasks: ['Throttle workloads and queue non-critical jobs.', 'Page secondary responders and legal/PR if needed.'],
      },
      {
        id: 'halt',
        name: 'Halt safely',
        phase: 'Maintenance window',
        focus: 'Execute the halt play, protecting downstream teams from cascading failures.',
        expectedOwner: 'Incident commander',
        tasks: ['Follow the halt checklist with timing stamps.', 'Document who can authorize resuming traffic.'],
      },
      {
        id: 'recover',
        name: 'Recovery and review',
        phase: 'Handoff',
        focus: 'Restore service with clear rollback, then hand off to daytime owners.',
        expectedOwner: 'Recovery lead',
        tasks: ['Verify rollback before resuming throughput.', 'Hand off to daytime owners with a recovery brief.'],
      },
    ],
    communications: [
      {
        audience: 'Executives and legal',
        trigger: 'Within 15 minutes',
        message: 'Share halt decision, customer impact, and approval path for resuming.',
      },
      {
        audience: 'Customers',
        trigger: 'After halt path chosen',
        message: 'Explain user-facing impact, safety valves, and where to appeal.',
      },
      {
        audience: 'Internal responders',
        trigger: 'Every 20 minutes',
        message: 'Status cadence with blockers, needs, and next checkpoint.',
      },
    ],
  },
];

const coverageImpact: Record<keyof CoverageChecklist, { penalty: number; gap: string }> = {
  escalationOwner: {
    penalty: 18,
    gap: 'Assign a single escalation owner who can move between outage, maintenance, and halt branches.',
  },
  rollbackPlan: { penalty: 18, gap: 'Document rollback steps with a timer for when to halt safely.' },
  communicationsReady: {
    penalty: 14,
    gap: 'Prepare templates for internal, customer, and leadership updates tied to severity.',
  },
  appealPath: {
    penalty: 10,
    gap: 'Clarify refusal and appeal paths so teams can decline risky windows.',
  },
  handoffPlan: { penalty: 10, gap: 'Capture who closes the window and how follow-ups return to owners.' },
};

const riskPenalty: Record<RiskLevel, number> = {
  steady: 0,
  elevated: 6,
  critical: 12,
};

const severityFromBlockers = (blockers: string[], riskLevel: RiskLevel): StagePlan['severity'] => {
  if (blockers.length > 0 || riskLevel === 'critical') return 'at-risk';
  if (riskLevel === 'elevated') return 'watch';
  return 'ready';
};

export const evaluateReadiness = (
  coverage: CoverageChecklist,
  riskLevel: RiskLevel,
  template: ScenarioTemplate,
): { score: number; gaps: string[] } => {
  const missing = Object.entries(coverageImpact).filter(([key]) => !coverage[key as keyof CoverageChecklist]);
  const penalties = missing.map(([, value]) => value.penalty).reduce((total, penalty) => total + penalty, 0);
  const baseScore = Math.max(0, 100 - penalties - riskPenalty[riskLevel]);
  const gaps = missing.map(([, value]) => value.gap);

  if (riskLevel !== 'steady') {
    gaps.push(
      `Stress level set to ${riskLevel}. Reconfirm the ${template.timeToHalt} time-to-halt expectation before running.`,
    );
  }

  return { score: baseScore, gaps };
};

export const buildSimulationPlan = (
  template: ScenarioTemplate,
  coverage: CoverageChecklist,
  riskLevel: RiskLevel,
): SimulationPlan => {
  const coverageGaps = evaluateReadiness(coverage, riskLevel, template);

  const stagePlan: StagePlan[] = template.stages.map((stage) => {
    const blockers: string[] = [];

    if (!coverage.escalationOwner && stage.phase === 'Outage') {
      blockers.push('No accountable escalation owner for the outage branch.');
    }

    if (!coverage.rollbackPlan && stage.phase !== 'Handoff') {
      blockers.push('Rollback lane is missing; set a halt timer before continuing.');
    }

    if (!coverage.communicationsReady) {
      blockers.push('Communication templates are missing for this phase.');
    }

    if (!coverage.appealPath && stage.phase === 'Maintenance window') {
      blockers.push('Appeal path is unclear if the window needs to be paused.');
    }

    if (!coverage.handoffPlan && stage.phase === 'Handoff') {
      blockers.push('Handoff plan is missing; assign who closes the window.');
    }

    const severity = severityFromBlockers(blockers, riskLevel);

    return { ...stage, blockers, severity };
  });

  return {
    template,
    readinessScore: coverageGaps.score,
    gaps: coverageGaps.gaps,
    stagePlan,
  };
};
