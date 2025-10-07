export interface TestScenario {
  id: number;
  title: string;
  description: string;
  precondition: string;
}

type ValidationResult = {
  issues: { message: string; path: (keyof TestScenario)[] }[];
};

export function validate(scenario: Partial<TestScenario>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!scenario.title) {
    issues = [
      ...issues,
      { message: "Title is required", path: ["title"] },
    ];
  }

  if (!scenario.description) {
    issues = [
      ...issues,
      { message: "Description is required", path: ["description"] },
    ];
  }

  if (!scenario.precondition) {
    issues = [
      ...issues,
      { message: "Precondition is required", path: ["precondition"] },
    ];
  }

  return { issues };
}
