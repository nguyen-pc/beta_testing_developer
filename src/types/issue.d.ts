export interface Issue {
  bugId: number;
  summary: string;
  updated: string;
  type: string;
  priority: string;
  status: string;
  assignee: string;
  tester: string;
  linked: number;
  expected?: string;
  actual?: string;
  device?: string;
  os?: string;
  browser?: string;
  attachments?: string[];
}
