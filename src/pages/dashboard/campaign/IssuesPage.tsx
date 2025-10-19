// import React, { useState } from "react";
// import { IssueDetailView } from "../../../components/dashboard/issue/IssueDetailView";
// import type { Issue } from "../../../types/issue";
// import IssueGridView from "../../../components/dashboard/issue/IssueGridView";

// const mockData: Issue[] = [
//   {
//     bugId: 20818,
//     summary: "Keyboard shows up when i opening a apps",
//     updated: "May 25, 2023 17:36pm",
//     type: "UI",
//     priority: "Low",
//     status: "Complete",
//     assignee: "-",
//     tester: "Daniel C",
//     linked: 8,
//     expected: "Keyboard should appear only when typing.",
//     actual: "Keyboard pops up on open.",
//     device: "Android Mobile",
//     os: "Android 10",
//     browser: "Chrome 122",
//     attachments: ["bnav-debug-2023.zip"],
//   },
// ];

// export default function IssuesPage() {
//   const [selected, setSelected] = useState<Issue | null>(null);

//   return (
//     <>
//       {!selected ? (
//         <IssueGridView  onSelectIssue={(i) => setSelected(i)} />
//       ) : (
//         <IssueDetailView issue={selected} onBack={() => setSelected(null)} />
//       )}
//     </>
//   );
// }
