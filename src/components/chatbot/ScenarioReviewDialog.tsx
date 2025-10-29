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
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { callCreateScenario } from "../../config/api";

interface ScenarioReviewDialogProps {
  open: boolean;
  onClose: () => void;
  rawJson: string;
  useCaseId?: number;
}

export default function ScenarioReviewDialog({
  open,
  onClose,
  rawJson,
  useCaseId,
}: ScenarioReviewDialogProps) {
  const [scenarios, setScenarios] = useState<any[]>([]);

  useEffect(() => {
    if (!rawJson?.trim()) return;
    try {
      const data = JSON.parse(rawJson);
      if (Array.isArray(data)) setScenarios(data);
    } catch (err) {
      console.error("❌ Invalid JSON:", err);
    }
  }, [rawJson]);

  const handleUpdate = (i: number, field: string, value: string) => {
    setScenarios((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );
  };

  const handleDelete = (i: number) => {
    setScenarios((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleAdd = () => {
    setScenarios((prev) => [
      ...prev,
      { title: "", description: "", precondition: "" },
    ]);
  };

  const handleCreate = async () => {
    try {
      for (const s of scenarios) {
        if (!s.title?.trim()) continue;
        await callCreateScenario({
          title: s.title,
          description: s.description || "",
          precondition: s.precondition || "",
          useCase: { id: useCaseId },
        });
      }
      alert("Created Scenarios successfully!");
      window.dispatchEvent(new CustomEvent("scenario-reload"));
      onClose();
    } catch (err) {
      alert("❌ Failed to create scenarios!");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Review & Edit Scenarios</DialogTitle>
      <DialogContent dividers>
        {scenarios.length === 0 ? (
          <Typography color="text.secondary">
            No scenarios to review.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {scenarios.map((s, i) => (
              <Box
                key={i}
                sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Scenario #{i + 1}
                  </Typography>
                  <IconButton color="error" onClick={() => handleDelete(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <TextField
                  label="Title"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={s.title}
                  onChange={(e) => handleUpdate(i, "title", e.target.value)}
                />
                <TextField
                  label="Description"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={s.description}
                  onChange={(e) =>
                    handleUpdate(i, "description", e.target.value)
                  }
                />
                <TextField
                  label="Precondition"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={s.precondition}
                  onChange={(e) =>
                    handleUpdate(i, "precondition", e.target.value)
                  }
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAdd}
              variant="outlined"
            >
              Add Scenario
            </Button>
          </Stack>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={scenarios.length === 0}
        >
            Create Scenarios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
