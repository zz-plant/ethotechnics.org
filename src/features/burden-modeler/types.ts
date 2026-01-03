export type BurdenCategoryId = 'task-load' | 'cognitive-load' | 'risk-exposure';

export type BurdenCategory = {
  id: BurdenCategoryId;
  label: string;
  description: string;
};

export type BurdenDriver = {
  id:
    | 'interruptions'
    | 'handoffs'
    | 'tooling'
    | 'runbooks'
    | 'incidents'
    | 'coverage'
    | 'decision-debt';
  label: string;
  prompt: string;
  category: BurdenCategoryId;
  weight: number;
  mitigations: string[];
};

export type BurdenRatings = Record<BurdenDriver['id'], number>;

export type DriverScore = {
  id: BurdenDriver['id'];
  label: string;
  category: BurdenCategoryId;
  rating: number;
  weightedScore: number;
  reliefEstimate: number;
  mitigations: string[];
};

export type CategoryScore = {
  id: BurdenCategoryId;
  label: string;
  value: number;
};

export type BurdenModelResult = {
  burdenIndex: number;
  burdenLevel: 'Healthy' | 'Watch' | 'Overloaded';
  categoryScores: CategoryScore[];
  hotspots: DriverScore[];
};
