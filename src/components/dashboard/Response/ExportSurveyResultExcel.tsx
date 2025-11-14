import React, { useMemo } from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";

interface Props {
  responses: any[]; // data từ API results
  surveyId?: string | number;
}

const ExportSurveyResultExcel: React.FC<Props> = ({ responses, surveyId }) => {
  const buildQuestions = useMemo(() => {
    const map = new Map<number, string>();

    responses.forEach((tester) => {
      tester.response?.answers.forEach((ans: any) => {
        map.set(ans.question.questionId, ans.question.questionName);
      });
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [responses]);

  const exportExcel = () => {
    const rows: any[] = [];

    // ===== HEADER STYLES =====
    const yellow = {
      fill: { fgColor: { rgb: "FFF2CC" } },
      font: { bold: true, sz: 13 },
      alignment: { vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const headerBlue = {
      fill: { fgColor: { rgb: "D9E1F2" } },
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const cellStyle = {
      alignment: { wrapText: true, vertical: "top" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // ======= HEADER INFO ========
    rows.push([`Survey Report #${surveyId}`]);
    rows.push([`Total Responses: ${responses.length}`]);
    rows.push([]);
    
    // ======= TABLE HEADER ========
    const headerRow = [
      "Name",
      "Email",
      "Status",
      "Completion Date",
      ...buildQuestions.map((q) => q.name),
    ];

    rows.push(headerRow);

    // ====== FILL RESPONSES =======
    responses.forEach((tester) => {
      const row = [
        tester.username,
        tester.email,
        tester.completed ? "Completed" : "Pending",
        new Date(tester.completionDate).toLocaleString("vi-VN"),
      ];

      // Duyệt qua từng câu hỏi
      buildQuestions.forEach((q) => {
        const ans = tester.response?.answers.find(
          (a: any) => a.question.questionId === q.id
        );

        if (!ans) {
          row.push("—");
        } else {
          if (
            ans.question.questionType === "TEXT" ||
            ans.question.questionType === "LONG_TEXT"
          ) {
            row.push(ans.answerText || "—");
          } else {
            // nhiều choice → nối bằng dấu ,
            const choices = ans.choices?.map((c: any) => c.choiceText) || [];
            row.push(choices.join(", "));
          }
        }
      });

      rows.push(row);
    });

    // ====== BUILD SHEET ========
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // APPLY STYLES
    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        if (R === 0 || R === 1) ws[cellRef].s = yellow;
        else if (R === 3) ws[cellRef].s = headerBlue;
        else if (R > 3) ws[cellRef].s = cellStyle;
      }
    }

    // Auto column width
    ws["!cols"] = Array(headerRow.length).fill({ wch: 25 });

    // Freeze header
    ws["!freeze"] = { xSplit: 0, ySplit: 4 };

    // Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Results");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      `Survey_${surveyId}_Results.xlsx`
    );
  };

  return (
    <Button variant="contained" onClick={exportExcel}>
      Export Survey Excel
    </Button>
  );
};

export default ExportSurveyResultExcel;
