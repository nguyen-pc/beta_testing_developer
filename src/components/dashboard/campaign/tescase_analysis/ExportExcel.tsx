import React from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";

interface Props {
  project: any;
  useCases: any[];
  executions: any[];
}

const ExportExcel: React.FC<Props> = ({ project, useCases, executions }) => {
  const exportToExcel = () => {
    const rows: any[] = [];

    // ======= HEADER ZONE (YELLOW QA STYLE) ==========
    const yellow = {
      fill: { fgColor: { rgb: "FFF2CC" } },
      font: { bold: true },
      alignment: { vertical: "center", wrapText: true },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const headerRows = [
      ["Project Name", project?.projectName],
      ["Reference Document", "Tài liệu yêu cầu hệ thống"],
      ["Created By", project?.createdBy],
      ["Date of Creation", project?.startDate],
      ["Date of Review", project?.endDate],
    ];

    headerRows.forEach((r) => rows.push(r));
    rows.push([]);

    // =========== TABLE HEADER (BLUE QA STYLE) ============
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

    const tableHeader = [
      "Test Case ID",
      "Scenario",
      "Title",
      "PreCondition",
      "Description",
      "Data Test",
      "Steps",
      "Expected Result",
      "Priority",
      "Total Execution",
      "% Passed",
      "% Failed",
    ];

    rows.push(tableHeader);

    // ============ ROW BORDER STYLE ============
    const rowStyle = {
      alignment: { wrapText: true, vertical: "top" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // ============ FILL DATA ===================
    useCases.forEach((uc) => {
      uc.testScenarios?.forEach((sc: any) => {
        sc.testCases?.forEach((tc: any) => {
          const execList = executions.filter((e) => e.testCaseId === tc.id);

          const total = execList.length;
          const pass = execList.filter((e) => e.status).length;
          const fail = total - pass;

          const percentPass =
            total > 0 ? ((pass / total) * 100).toFixed(1) + "%" : "0%";
          const percentFail =
            total > 0 ? ((fail / total) * 100).toFixed(1) + "%" : "0%";

          rows.push([
            "TC_" + tc.id,
            `${uc.name} - ${sc.title}`,
            tc.title,
            tc.preCondition,
            tc.description,
            tc.dataTest,
            tc.steps ?? "",
            tc.expectedResult ?? "",
            tc.priority ?? "P2",
            total,
            percentPass,
            percentFail,
          ]);
        });
      });
    });

    // =========== CONVERT TO SHEET ============
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Apply styles
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        // Yellow zone (first 5 rows)
        if (R <= 4) {
          ws[cellRef].s = yellow;
        }

        // Blue header table
        if (R === 6) {
          ws[cellRef].s = headerBlue;
        }

        // Data rows
        if (R > 6) {
          ws[cellRef].s = rowStyle;

          // Priority color
          if (C === 8) {
            const p = ws[cellRef].v;
            if (p === "P1")
              ws[cellRef].s.fill = { fgColor: { rgb: "F8CBAD" } }; // đỏ nhạt
            if (p === "P2")
              ws[cellRef].s.fill = { fgColor: { rgb: "FCE4D6" } }; // cam nhạt
            if (p === "P3")
              ws[cellRef].s.fill = { fgColor: { rgb: "E2EFDA" } }; // xanh lá nhạt
          }

          // Pass / Fail color
          if (C === 10) {
            if (ws[cellRef].v.includes("%") && parseFloat(ws[cellRef].v) > 0)
              ws[cellRef].s.fill = { fgColor: { rgb: "C6EFCE" } }; // xanh
          }
          if (C === 11) {
            if (ws[cellRef].v.includes("%") && parseFloat(ws[cellRef].v) > 0)
              ws[cellRef].s.fill = { fgColor: { rgb: "FFC7CE" } }; // đỏ nhạt
          }
        }
      }
    }

    // Auto width
    const colWidth = tableHeader.map((_) => ({ wch: 25 }));
    ws["!cols"] = colWidth;

    // Freeze header
    ws["!freeze"] = { xSplit: 0, ySplit: 7 };

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Testcases");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `Testcase_${project.projectName}_${new Date()
        .toISOString()
        .substring(0, 10)}.xlsx`
    );
  };

  return (
    <Button variant="contained" onClick={exportToExcel}>
      Export Excel
    </Button>
  );
};

export default ExportExcel;
