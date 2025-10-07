export interface Campaign {
  id: number;
  title: string;
  campaignType?: string;
  description: string;
  Instructions: string;
  startDate: string;
  endDate: string;
  estimatedTime: string;
  RewardValue: number;
  isPublic: boolean;
}

type ValidationResult = {
  issues: { message: string; path: (keyof Campaign)[] }[];
};

export function validate(campaign: Partial<Campaign>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!campaign.title) {
    issues.push({ message: "Campaign Name is required", path: ["campaignName"] });
  }

  if (!campaign.description) {
    issues.push({ message: "Description is required", path: ["description"] });
  }
  
  if (!campaign.campaignType) {
    issues.push({ message: "Campaign Type is required", path: ["campaignType"] });
  }

  if (!campaign.Instructions) {
    issues.push({ message: "Instructions are required", path: ["instructions"] });
  }

  if (!campaign.startDate) {
    issues.push({ message: "Start Date is required", path: ["startDate"] });
  }

  if (!campaign.endDate) {
    issues.push({ message: "End Date is required", path: ["endDate"] });
  }

  if (!campaign.estimatedTime) {
    issues.push({ message: "Estimated Time is required", path: ["estimatedTime"] });
  }

  if (campaign.RewardValue === undefined || campaign.RewardValue === null) {
    issues.push({ message: "Reward Value is required", path: ["RewardValue"] });
  } else if (campaign.RewardValue < 0) {
    issues.push({ message: "Reward Value cannot be negative", path: ["RewardValue"] });
  }

  if (campaign.isPublic === undefined) {
    issues.push({ message: "Status is required", path: ["isPublic"] });
  }

  return { issues };
}
