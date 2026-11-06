export type TestCaseResult = {
  testCaseId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  evidence: string;
  notes: string;
  severity?: "critical" | "high" | "medium" | "low";
};

export type RunSummary = {
  suiteTitle: string;
  systemName: string;
  completedAt: string;
  aggregateScore: number;
  grade: "PASS" | "CONDITIONAL" | "FAIL";
  results: TestCaseResult[];
};
