export interface UseCase {
  id: number;
  name: string;
  description: string;
}

type ValidationResult = {
  issues: { message: string; path: (keyof UseCase)[] }[];
};

export function validate(usecase: Partial<UsecCase>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!usecase.name) {
    issues = [
      ...issues,
      { message: "Usecase Name is required", path: ["name"] },
    ];
  }

  if (!usecase.description) {
    issues = [
      ...issues,
      { message: "Description is required", path: ["description"] },
    ];
  }

  return { issues };
}
