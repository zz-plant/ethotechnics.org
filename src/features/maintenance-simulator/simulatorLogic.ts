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

export interface ThresholdBand {
  id: string;
  label: string;
  rangeLabel: string;
  description: string;
  minScore: number;
  maxScore: number;
  actNow?: boolean;
  recommendedInterventions: string[];
}

export interface ThresholdPreset {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  bands: ThresholdBand[];
}

export interface ThresholdStatus {
  band: ThresholdBand;
  actNow: boolean;
  recommendedInterventions: string[];
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

export const thresholdPresets: ThresholdPreset[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Default thresholds that balance readiness with momentum.',
    tooltip:
      'Presets tune the readiness cutoffs that trigger watch or act-now modes. Balanced fits most tabletop runs.',
    bands: [
      {
        id: 'ready',
        label: 'Run-ready',
        rangeLabel: '85–100',
        description: 'Coverage is strong. Maintain cadence and watch for drift.',
        minScore: 85,
        maxScore: 100,
        recommendedInterventions: [
          'Confirm the halt timer and escalation owner are visible.',
          'Keep comms templates open during the window.',
          'Proceed with the run and log any deviations.',
        ],
      },
      {
        id: 'watch',
        label: 'Tighten coverage',
        rangeLabel: '70–84',
        description: 'Risk is rising. Close critical gaps before scheduling.',
        minScore: 70,
        maxScore: 84,
        recommendedInterventions: [
          'Assign missing owners and confirm the appeal path.',
          'Rehearse rollback steps with time-to-halt checkpoints.',
          'Delay the window until communication templates are ready.',
        ],
      },
      {
        id: 'act-now',
        label: 'Act now',
        rangeLabel: '0–69',
        description: 'Coverage is too thin. Pause until baseline protections exist.',
        minScore: 0,
        maxScore: 69,
        actNow: true,
        recommendedInterventions: [
          'Pause the window and brief leadership on the risk gap.',
          'Staff the escalation owner and rollback lane immediately.',
          'Re-run the tabletop after blockers are closed.',
        ],
      },
    ],
  },
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Higher thresholds for regulated or high-impact systems.',
    tooltip:
      'Conservative presets raise the bar so teams pause sooner in sensitive environments.',
    bands: [
      {
        id: 'ready',
        label: 'Run-ready',
        rangeLabel: '92–100',
        description: 'Only minor gaps remain; maintain heightened vigilance.',
        minScore: 92,
        maxScore: 100,
        recommendedInterventions: [
          'Confirm executive escalation coverage.',
          'Keep an extra reviewer on standby during the window.',
          'Schedule a post-run verification checkpoint.',
        ],
      },
      {
        id: 'watch',
        label: 'Hold and harden',
        rangeLabel: '80–91',
        description: 'Pause to harden coverage before a go decision.',
        minScore: 80,
        maxScore: 91,
        recommendedInterventions: [
          'Add backup owners for every phase.',
          'Revalidate rollback assets and approval flow.',
          'Delay the window until comms templates are reviewed.',
        ],
      },
      {
        id: 'act-now',
        label: 'Act now',
        rangeLabel: '0–79',
        description: 'Insufficient safeguards for high-impact work.',
        minScore: 0,
        maxScore: 79,
        actNow: true,
        recommendedInterventions: [
          'Freeze the maintenance plan and notify stakeholders.',
          'Close owner gaps before rescheduling.',
          'Require a fresh tabletop with leadership present.',
        ],
      },
    ],
  },
  {
    id: 'rapid',
    name: 'Rapid response',
    description: 'Lower thresholds for time-critical restoration work.',
    tooltip:
      'Rapid response presets accept lower readiness when urgency outweighs delay, but still flag act-now risks.',
    bands: [
      {
        id: 'ready',
        label: 'Run-ready',
        rangeLabel: '80–100',
        description: 'Adequate coverage for a fast-moving response.',
        minScore: 80,
        maxScore: 100,
        recommendedInterventions: [
          'Keep the halt timer visible throughout the run.',
          'Assign a comms lead to maintain cadence.',
          'Document decisions in real time.',
        ],
      },
      {
        id: 'watch',
        label: 'Shorten scope',
        rangeLabel: '65–79',
        description: 'Trim scope and add safeguards before proceeding.',
        minScore: 65,
        maxScore: 79,
        recommendedInterventions: [
          'Reduce the change scope to essentials only.',
          'Confirm escalation coverage and rollback checkpoints.',
          'Set an earlier decision point for halting.',
        ],
      },
      {
        id: 'act-now',
        label: 'Act now',
        rangeLabel: '0–64',
        description: 'Stop and stabilize before attempting restoration.',
        minScore: 0,
        maxScore: 64,
        actNow: true,
        recommendedInterventions: [
          'Stabilize the system and reassess staffing.',
          'Move to containment steps instead of restoration.',
          'Run the tabletop with updated incident context.',
        ],
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

export const getThresholdPreset = (presetId: string): ThresholdPreset =>
  thresholdPresets.find((preset) => preset.id === presetId) ?? thresholdPresets[0];

export const getThresholdStatus = (
  score: number,
  preset: ThresholdPreset,
): ThresholdStatus => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const matchedBand =
    preset.bands.find(
      (band) => normalizedScore >= band.minScore && normalizedScore <= band.maxScore,
    ) ?? preset.bands[preset.bands.length - 1];

  return {
    band: matchedBand,
    actNow: Boolean(matchedBand.actNow),
    recommendedInterventions: matchedBand.recommendedInterventions,
  };
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
