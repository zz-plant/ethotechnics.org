import { describe, expect, it } from 'vitest';

import type { OperationalMetrics, SimulationParams } from '../types';
import { projectCapacity } from './projectionEngine';
import { MODEL_CONFIG } from './modelConfig';

describe('projectCapacity', () => {
  const startDate = new Date('2024-01-15T00:00:00Z');

  it('applies base and metric decay across baseline and remediated curves', () => {
    const result = projectCapacity(
      { velocityIndex: 40, interruptionRate: 35, stability: 'DEGRADED' },
      { refusalWeeks: 4 },
      startDate,
    );

    expect(result.data).toHaveLength(MODEL_CONFIG.monthsToProject);

    const [monthZero, monthOne, monthTwo] = result.data;

    expect(monthZero.baseline).toBeCloseTo(0.9425, 4);
    expect(monthZero.remediated).toBeCloseTo(1, 4);

    expect(monthOne.baseline).toBeCloseTo(0.8883, 4);
    expect(monthOne.remediated).toBeCloseTo(0.9598, 4);

    expect(monthTwo.baseline).toBeCloseTo(0.8372, 4);
    expect(monthTwo.remediated).toBeCloseTo(0.9211, 4);

    expect(monthOne.remediated).toBeGreaterThan(monthOne.baseline);
    expect(monthTwo.remediated).toBeGreaterThan(monthTwo.baseline);
  });

  it('flags saturation when remediated capacity crosses the threshold', () => {
    const result = projectCapacity(
      { velocityIndex: 100, interruptionRate: 100, stability: 'UNSTABLE' },
      { refusalWeeks: 0 },
      startDate,
    );

    expect(result.saturationIndex).toBe(9);
    expect(result.data[result.saturationIndex].isSaturated).toBe(true);
    expect(result.data[result.saturationIndex - 1].isSaturated).toBe(false);
    expect(result.saturationDate).toBe('Oct 2024');
  });

  it('produces consistent date labels across timezones for fixed start dates', () => {
    const originalTZ = process.env.TZ;
    const metrics: OperationalMetrics = { velocityIndex: 20, interruptionRate: 10, stability: 'RESILIENT' };
    const params: SimulationParams = { refusalWeeks: 0 };

    try {
      process.env.TZ = 'UTC';
      const utcLabels = projectCapacity(metrics, params, startDate).data.map(({ dateLabel }) => dateLabel);

      process.env.TZ = 'America/New_York';
      const easternLabels = projectCapacity(metrics, params, startDate).data.map(({ dateLabel }) => dateLabel);

      process.env.TZ = 'Asia/Tokyo';
      const tokyoLabels = projectCapacity(metrics, params, startDate).data.map(({ dateLabel }) => dateLabel);

      expect(easternLabels).toEqual(utcLabels);
      expect(tokyoLabels).toEqual(utcLabels);
    } finally {
      process.env.TZ = originalTZ;
    }
  });
});
