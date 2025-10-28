export interface Message {
  from: "user" | "bot";
  text: string;
  options?: string[];
}

export interface RawHistory {
  id: number;
  question?: string | null;
  answer?: string | null;
  createdAt: string;
}

export const defaultWelcome: Message[] = [
  {
    from: "bot",
    text:
      "👋 **Hello! I’m BetaBot** — ready for bug analysis.\n\n" +
      "Please provide these details:\n" +
      "- **Bug ID/Title**\n" +
      "- **Description**\n" +
      "- **Steps to Reproduce**\n" +
      "- **Expected Result**\n" +
      "- **Actual Result**\n" +
      "- **Environment/Device** (OS, Browser/App version, Device)\n" +
      "- **Attachments** (logs / screenshots / video)\n\n" +
      "Once I have the details, I’ll proceed with the analysis ✅",
    options: [
      "Bug Analysis",
      "Feedback Insight",
      "Generate Use Case",
      "Survey Creation",
    ],
  },
];

export const normalizeHistoryToMessages = (items: RawHistory[]): Message[] => {
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const out: Message[] = [];
  for (const h of sorted) {
    if (h.question?.trim()) out.push({ from: "user", text: h.question });
    if (h.answer?.trim()) out.push({ from: "bot", text: h.answer });
  }
  return out;
};

// Session key helpers
export const sessionKey = (userId?: number) => `chat_session_id_${userId ?? "guest"}`;
export const readSession = (userId?: number) => localStorage.getItem(sessionKey(userId));
export const writeSession = (sid: string, userId?: number) =>
  localStorage.setItem(sessionKey(userId), sid);
export const removeSession = (userId?: number) =>
  localStorage.removeItem(sessionKey(userId));
