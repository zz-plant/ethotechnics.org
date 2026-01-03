import { burdenCategories, burdenDrivers, MAX_DRIVER_SCORE } from './config';
import type {
  BurdenCategoryId,
  BurdenModelResult,
  BurdenRatings,
  CategoryScore,
  DriverScore,
} from './types';

const clampRating = (value: number) => Math.min(Math.max(value, 0), MAX_DRIVER_SCORE);

const burdenLevelForIndex = (burdenIndex: number): BurdenModelResult['burdenLevel'] => {
  if (burdenIndex < 35) return 'Healthy';
  if (burdenIndex < 70) return 'Watch';
  return 'Overloaded';
};

const reliefEstimate = (rating: number, weight: number) => {
  const ceiling = 30;
  return Math.min(ceiling, Math.round((rating / MAX_DRIVER_SCORE) * weight * 10 + 6));
};

export const buildDefaultRatings = (): BurdenRatings => {
  return burdenDrivers.reduce<BurdenRatings>((ratings, driver) => {
    ratings[driver.id] = 5;
    return ratings;
  }, {} as BurdenRatings);
};

export const calculateBurdenModel = (ratings: BurdenRatings): BurdenModelResult => {
  const totalWeight = burdenDrivers.reduce((sum, driver) => sum + driver.weight, 0);
  const maxWeightedScore = totalWeight * MAX_DRIVER_SCORE;

  const driverScores: DriverScore[] = burdenDrivers.map((driver) => {
    const rating = clampRating(ratings[driver.id] ?? 0);
    const weightedScore = rating * driver.weight;

    return {
      id: driver.id,
      label: driver.label,
      category: driver.category,
      rating,
      weightedScore,
      reliefEstimate: reliefEstimate(rating, driver.weight),
      mitigations: driver.mitigations,
    };
  });

  const burdenIndex = Math.round(
    (driverScores.reduce((sum, driver) => sum + driver.weightedScore, 0) / maxWeightedScore) * 100,
  );

  const categoryScores = burdenCategories.map<CategoryScore>((category) => {
    const categoryDrivers = driverScores.filter((driver) => driver.category === category.id);
    const categoryWeight = categoryDrivers.reduce((sum, driver) => sum + driver.weightedScore, 0);
    const categoryMaxWeight = burdenDrivers
      .filter((driver) => driver.category === category.id)
      .reduce((sum, driver) => sum + driver.weight * MAX_DRIVER_SCORE, 0);

    return {
      id: category.id,
      label: category.label,
      value: Math.round((categoryWeight / categoryMaxWeight) * 100),
    };
  });

  const hotspots = driverScores
    .slice()
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, 3);

  return {
    burdenIndex,
    burdenLevel: burdenLevelForIndex(burdenIndex),
    categoryScores,
    hotspots,
  };
};

export const categoryDescription = (categoryId: BurdenCategoryId) =>
  burdenCategories.find((category) => category.id === categoryId)?.description ?? '';
