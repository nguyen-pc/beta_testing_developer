export interface Survey {
  id: number;
  subTitle: string;
  subTitle?: string;
  description: string;
  startDate: string;
  endDate: string;
}

type ValidationResult = {
  issues: { message: string; path: (keyof Survey)[] }[];
};

export function validate(survey: Partial<Survey>): ValidationResult {
  let issues: ValidationResult["issues"] = [];
  if (!survey.surveyName) {
    issues.push({ message: "Survey Name is required", path: ["surveyName"] });
  }

  if (!survey.subTitle) {
    issues.push({ message: "Survey Subtitle is required", path: ["subTitle"] });
  }

  if (!survey.description) {
    issues.push({ message: "Description is required", path: ["description"] });
  }

  if (!survey.startDate) {
    issues.push({ message: "Start Date is required", path: ["startDate"] });
  }

  if (!survey.endDate) {
    issues.push({ message: "End Date is required", path: ["endDate"] });
  }

  return { issues };
}
