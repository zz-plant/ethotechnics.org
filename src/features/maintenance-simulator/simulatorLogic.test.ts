import { buildSimulationPlan, evaluateReadiness, scenarioTemplates, type CoverageChecklist } from './simulatorLogic';

const fullCoverage: CoverageChecklist = {
  escalationOwner: true,
  rollbackPlan: true,
  communicationsReady: true,
  appealPath: true,
  handoffPlan: true,
};

const missingCoverage: CoverageChecklist = {
  escalationOwner: false,
  rollbackPlan: false,
  communicationsReady: false,
  appealPath: false,
  handoffPlan: false,
};

describe('evaluateReadiness', () => {
  it('returns full score when coverage is complete at steady state', () => {
    const template = scenarioTemplates[0];
    const readiness = evaluateReadiness(fullCoverage, 'steady', template);

    expect(readiness.score).toBe(100);
    expect(readiness.gaps).toEqual([]);
  });

  it('returns gaps and reduced score when coverage is missing under stress', () => {
    const template = scenarioTemplates[1];
    const readiness = evaluateReadiness(missingCoverage, 'critical', template);

    expect(readiness.score).toBeLessThan(50);
    expect(readiness.gaps.length).toBeGreaterThanOrEqual(5);
    expect(readiness.gaps.some((gap) => gap.includes('time-to-halt'))).toBe(true);
  });
});

describe('buildSimulationPlan', () => {
  it('marks outage stages at risk without escalation owners or rollback lanes', () => {
    const template = scenarioTemplates.find((item) => item.id === 'overnight-outage');
    expect(template).toBeDefined();
    if (!template) return;

    const plan = buildSimulationPlan(template, missingCoverage, 'elevated');
    const outageStage = plan.stagePlan.find((stage) => stage.phase === 'Outage');

    expect(outageStage?.severity).toBe('at-risk');
    expect(outageStage?.blockers).toEqual(
      expect.arrayContaining([
        'No accountable escalation owner for the outage branch.',
        'Rollback lane is missing; set a halt timer before continuing.',
      ]),
    );
  });

  it('keeps stages ready when coverage exists and stress is steady', () => {
    const template = scenarioTemplates.find((item) => item.id === 'scheduled-maintenance');
    expect(template).toBeDefined();
    if (!template) return;

    const plan = buildSimulationPlan(template, fullCoverage, 'steady');

    expect(plan.stagePlan.every((stage) => stage.severity === 'ready')).toBe(true);
    expect(plan.gaps).toHaveLength(0);
  });
});
