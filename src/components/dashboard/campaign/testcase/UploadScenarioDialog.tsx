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
import { callCreateScenario } from "../../../../config/api";

interface UploadScenarioDialogProps {
  open: boolean;
  onClose: () => void;
  useCaseId: string;
  onUploaded: () => void;
}

export default function UploadScenarioDialog({
  open,
  onClose,
  useCaseId,
  onUploaded,
}: UploadScenarioDialogProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("⚠️ Please select an Excel file first!");
      return;
    }

    try {
      setLoading(true);
      const data = await readExcel(file);

      let successCount = 0;
      for (const row of data) {
        if (!row.title && !row.name) continue; // bỏ qua dòng trống

        const payload = {
          title: row.title || row.name || "",
          description: row.description || "",
          precondition: row.precondition || "",
          useCase: { id: useCaseId },
        };

        await callCreateScenario(payload);
        successCount++;
      }

      alert(`✅ Imported ${successCount} scenarios successfully!`);
      onUploaded();
      onClose();
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("❌ Failed to read or upload file.");
    } finally {
      setLoading(false);
    }
  };

  const readExcel = (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // 🔧 Loại bỏ khoảng trắng ở đầu/cuối key
        const cleaned = jsonData.map((row: any) => {
          const obj: any = {};
          Object.keys(row).forEach((k) => {
            obj[k.trim().toLowerCase()] = row[k];
          });
          return obj;
        });

        resolve(cleaned);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>📤 Upload Excel - Test Scenarios</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Upload an Excel file (.xlsx or .xls) with columns:
        </Typography>
        <ul className="list-disc ml-6 text-sm mb-3 text-gray-600">
          <li>
            <strong>title</strong> — Scenario title
          </li>
          <li>
            <strong>description</strong> — optional
          </li>
          <li>
            <strong>precondition</strong> — optional
          </li>
        </ul>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mt-2"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
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
