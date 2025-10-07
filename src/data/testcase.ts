export interface Testcase {
  id: number;
  title: string;
  description: string;
  testScenarioId: number;
  preCondition: string;
  dataTest:string;
  steps: string;
  expectedResult: string;
  priority: string;
  createdBy: string;
}

type ValidationResult = {
  issues: { message: string; path: (keyof Testcase)[] }[];
};

export function validate(testcase: Partial<Testcase>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!testcase.testcaseName) {
    issues = [
      ...issues,
      { message: "Testcase Name is required", path: ["testcaseName"] },
    ];
  }

  if (!testcase.description) {
    issues = [
      ...issues,
      { message: "Description is required", path: ["description"] },
    ];
  }

  if (!testcase.testScenarioId) {
    issues = [
      ...issues,
      { message: "Test Scenario selection is required", path: ["testScenarioId"] },
    ];
  }

  if (!testcase.precondition) {
    issues = [
      ...issues,
      { message: "Precondition is required", path: ["precondition"] },
    ];
  }

  if (!testcase.steps) {
    issues = [...issues, { message: "Steps are required", path: ["steps"] }];
  }

  if (!testcase.expectedResult) {
    issues = [
      ...issues,
      { message: "Expected Result is required", path: ["expectedResult"] },
    ];
  }

  if (!testcase.createdBy) {
    issues = [
      ...issues,
      { message: "Created By is required", path: ["createdBy"] },
    ];
  }

  return { issues };
}
