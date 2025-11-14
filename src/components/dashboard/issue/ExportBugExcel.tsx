import React from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";

interface Props {
  bugs: any[];
  campaignId?: string | number;
}

const ExportBugExcel: React.FC<Props> = ({ bugs, campaignId }) => {
  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const exportExcel = () => {
    const rows: any[] = [];

    // ===== STYLE DEFINITIONS =====
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

    const blueHeader = {
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

    const cell = {
      alignment: { wrapText: true, vertical: "top" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // ===== HEADER INFO =====
    rows.push([`Bug Report Export - Campaign #${campaignId}`]);
    rows.push([`Total Bugs: ${bugs.length}`]);
    rows.push([]);

    // ===== TABLE HEADER =====
    const header = [
      "ID",
      "Title",
      "Tester",
      "Assignee",
      "Priority",
      "Severity",
      "Status",
      "Description",
      "Steps to Reproduce",
      "Expected Result",
      "Actual Result",
    ];

    rows.push(header);

    // ===== FILL BUG ROWS =====
    bugs.forEach((b) => {
      rows.push([
        b.id,
        b.title,
        b.testerUserName,
        b.assigneeName,
        b.priority,
        b.severity,
        b.status,
        stripHtml(b.description),
        stripHtml(b.stepsToReproduce),
        b.expectedResult,
        stripHtml(b.actualResult),
      ]);
    });

    // ===== BUILD WORKSHEET =====
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const ref = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[ref]) continue;

        if (R === 0 || R === 1) ws[ref].s = yellow;
        else if (R === 3) ws[ref].s = blueHeader;
        else if (R > 3) ws[ref].s = cell;

        // Highlight Priority
        if (R > 3 && C === 4) {
          if (ws[ref].v === "HIGH")
            ws[ref].s.fill = { fgColor: { rgb: "F8CBAD" } }; // đỏ nhạt
          if (ws[ref].v === "MEDIUM")
            ws[ref].s.fill = { fgColor: { rgb: "FCE4D6" } }; // cam nhạt
          if (ws[ref].v === "LOW")
            ws[ref].s.fill = { fgColor: { rgb: "E2EFDA" } }; // xanh lá nhạt
        }

        // Highlight Severity
        if (R > 3 && C === 5) {
          if (ws[ref].v === "CRITICAL")
            ws[ref].s.fill = { fgColor: { rgb: "FFC7CE" } }; // đỏ đậm
          if (ws[ref].v === "MAJOR")
            ws[ref].s.fill = { fgColor: { rgb: "F8CBAD" } };
          if (ws[ref].v === "MINOR")
            ws[ref].s.fill = { fgColor: { rgb: "E2EFDA" } };
        }
      }
    }

    // Auto width
    ws["!cols"] = header.map(() => ({ wch: 25 }));

    // Freeze header
    ws["!freeze"] = { xSplit: 0, ySplit: 4 };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bugs");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(new Blob([buf]), `BugReports_Campaign_${campaignId}.xlsx`);
  };

  return (
    <Button variant="contained" color="primary" onClick={exportExcel}>
      Export Bug Excel
    </Button>
  );
};

export default ExportBugExcel;
