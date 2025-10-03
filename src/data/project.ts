export interface Project {
  id: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: boolean;
}

type ValidationResult = {
  issues: { message: string; path: (keyof Project)[] }[];
};

export function validate(project: Partial<Project>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!project.projectName) {
    issues = [...issues, { message: "Project Name is required", path: ["projectName"] }];
  }

  if (!project.description) {
    issues = [
      ...issues,
      { message: "Description is required", path: ["description"] },
    ];
  }

  if (!project.startDate) {
    issues = [
      ...issues,
      { message: "Start date is required", path: ["startDate"] },
    ];
  }

  if (!project.endDate) {
    issues = [
      ...issues,
      { message: "End date is required", path: ["endDate"] },
    ];
  }

  if (project.status === undefined) {
    issues = [...issues, { message: "Status is required", path: ["status"] }];
  }

  return { issues };
}
