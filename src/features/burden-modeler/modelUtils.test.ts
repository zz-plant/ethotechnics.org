import { describe, expect, it } from 'vitest';
import { burdenDrivers } from './config';
import { buildDefaultRatings, calculateBurdenModel } from './modelUtils';
import type { BurdenRatings } from './types';

const withUniformRating = (rating: number): BurdenRatings =>
  burdenDrivers.reduce<BurdenRatings>((acc, driver) => {
    acc[driver.id] = rating;
    return acc;
  }, {} as BurdenRatings);

describe('calculateBurdenModel', () => {
  it('returns a healthy burden level for low scores', () => {
    const result = calculateBurdenModel(withUniformRating(1));

    expect(result.burdenLevel).toBe('Healthy');
    expect(result.burdenIndex).toBeGreaterThan(0);
    expect(result.hotspots).toHaveLength(3);
  });

  it('raises the burden index as scores climb', () => {
    const baseline = calculateBurdenModel(withUniformRating(2)).burdenIndex;
    const elevated = calculateBurdenModel(withUniformRating(8)).burdenIndex;

    expect(elevated).toBeGreaterThan(baseline);
  });

  it('builds default ratings at midpoint', () => {
    const defaults = buildDefaultRatings();
    const values = Object.values(defaults);

    expect(values).toHaveLength(burdenDrivers.length);
    expect(values.every((value) => value === 5)).toBe(true);
  });
});
