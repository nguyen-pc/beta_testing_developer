import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { callCreateTestcase } from "../../config/api";

interface TestcaseReviewDialogProps {
  open: boolean;
  onClose: () => void;
  rawJson: string;
  testScenarioId?: number;
}

export default function TestcaseReviewDialog({
  open,
  onClose,
  rawJson,
  testScenarioId,
}: TestcaseReviewDialogProps) {
  const [testcases, setTestcases] = useState<any[]>([]);

  useEffect(() => {
    if (!rawJson) return setTestcases([]);
    try {
      const data = JSON.parse(rawJson);
      if (Array.isArray(data)) setTestcases(data);
      else setTestcases([]);
    } catch {
      setTestcases([]);
    }
  }, [rawJson]);

  const handleUpdate = (index: number, field: string, value: string) => {
    setTestcases((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u))
    );
  };

  const handleDelete = (index: number) => {
    setTestcases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setTestcases((prev) => [
      ...prev,
      { title: "", steps: "", expectedResult: "", preCondition: "" },
    ]);
  };

  const handleCreate = async () => {
    try {
      for (const t of testcases) {
        if (!t.title?.trim()) continue;
        const stepsValue = Array.isArray(t.steps)
          ? t.steps.join("\n") // nối mảng thành chuỗi, mỗi phần tử 1 dòng
          : t.steps || "";

        const expectedValue = Array.isArray(t.expectedResult)
          ? t.expectedResult.join("\n")
          : t.expectedResult || "";

          console.log("Creating testcase with steps:", testScenarioId);

        const res = await callCreateTestcase({
          title: t.title,
          description: t.description || "",
          preCondition: t.preCondition || "",
          steps: stepsValue,
          expectedResult: expectedValue,
          testScenario: { id: testScenarioId },
        });
        console.log("Created testcase:", res);
      }
      alert("Test cases created successfully!");
      window.dispatchEvent(new CustomEvent("testcase-reload"));
      onClose();
    } catch (e) {
      console.error("❌ Failed to create testcases:", e);
      alert("❌ Failed to create testcases.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Review & Edit Test Cases</DialogTitle>
      <DialogContent dividers>
        {testcases.length === 0 ? (
          <Typography color="text.secondary">
            No test cases to review.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {testcases.map((t, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={600}>
                    TestCase #{i + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(i)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <TextField
                  label="Title"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={t.title || ""}
                  onChange={(e) => handleUpdate(i, "title", e.target.value)}
                />
                <TextField
                  label="Description"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={t.description || ""}
                  onChange={(e) =>
                    handleUpdate(i, "description", e.target.value)
                  }
                />
                <TextField
                  label="Precondition"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={t.preCondition || ""}
                  onChange={(e) =>
                    handleUpdate(i, "preCondition", e.target.value)
                  }
                />
                <TextField
                  label="Steps"
                  fullWidth
                  size="small"
                  multiline
                  sx={{ mt: 1 }}
                  value={t.steps || ""}
                  onChange={(e) => handleUpdate(i, "steps", e.target.value)}
                />
                <TextField
                  label="Expected Result"
                  fullWidth
                  size="small"
                  multiline
                  sx={{ mt: 1 }}
                  value={t.expectedResult || ""}
                  onChange={(e) =>
                    handleUpdate(i, "expectedResult", e.target.value)
                  }
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAdd}
              variant="outlined"
            >
              Add TestCase
            </Button>
          </Stack>
        )}
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={testcases.length === 0}
        >
          Create Test Cases
        </Button>
      </DialogActions>
    </Dialog>
  );
}
