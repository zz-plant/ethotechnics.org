export type TestCaseResult = {
  testCaseId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  evidence: string;
  notes: string;
};

export type SuiteRunnerState = {
  suiteSlug: string;
  systemName: string;
  startedAt: string;
  currentIndex: number;
  results: TestCaseResult[];
  isComplete: boolean;
};

export type RunSummary = {
  suiteTitle: string;
  systemName: string;
  completedAt: string;
  aggregateScore: number;
  grade: "PASS" | "CONDITIONAL" | "FAIL";
  results: TestCaseResult[];
};
