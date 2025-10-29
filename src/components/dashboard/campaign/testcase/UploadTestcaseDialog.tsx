import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import * as XLSX from "xlsx";
import { callCreateTestcase } from "../../../../config/api";

interface UploadTestcaseDialogProps {
  open: boolean;
  onClose: () => void;
  testScenarioId: string;
  onUploaded: () => void;
}

export default function UploadTestcaseDialog({
  open,
  onClose,
  testScenarioId,
  onUploaded,
}: UploadTestcaseDialogProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("⚠️ Please select an Excel file first!");
    try {
      setLoading(true);
      const data = await readExcel(file);

      for (const row of data) {
        const payload = {
          title: row.title || row.name || "",
          description: row.description || "",
          preCondition: row.preCondition || "",
          dataTest: row.dataTest || "",
          steps: row.steps || "",
          expectedResult: row.expectedResult || "",
          testScenario: { id: testScenarioId },
        };
        await callCreateTestcase(payload);
      }

      alert(`✅ Imported ${data.length} test cases successfully!`);
      onUploaded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to import test cases.");
    } finally {
      setLoading(false);
    }
  };

  const readExcel = (file: File) =>
    new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const cleaned = jsonData.map((row: any) => {
          const obj: any = {};
          Object.keys(row).forEach((k) => {
            obj[k.trim()] = row[k];
          });
          return obj;
        });

        resolve(cleaned);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>📤 Upload Excel - Test Cases</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Upload an Excel file (.xlsx / .xls) with columns:
        </Typography>
        <ul className="list-disc ml-6 text-sm mb-3 text-gray-600">
          <li><b>title</b> — Test Case title</li>
          <li><b>description</b> — Description</li>
          <li><b>preCondition</b> — Optional</li>
          <li><b>steps</b> — Steps of execution</li>
          <li><b>expectedResult</b> — Expected output</li>
        </ul>

        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
