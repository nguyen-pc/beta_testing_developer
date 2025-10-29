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
import { callCreateUseCase } from "../../config/api";
import { useParams } from "react-router-dom";

interface UseCaseReviewDialogProps {
  open: boolean;
  onClose: () => void;
  rawJson: string;
  campaignId?: number;
}

export default function UseCaseReviewDialog({
  open,
  onClose,
  rawJson,
  campaignId,
}: UseCaseReviewDialogProps) {
  const [usecases, setUsecases] = useState<any[]>([]);
  console.log("🔍 campaignId in UseCaseReviewDialog:", campaignId);
  useEffect(() => {
    if (!rawJson || rawJson.trim() === "") {
      setUsecases([]);
      return;
    }
    try {
      const data = JSON.parse(rawJson);
      if (Array.isArray(data)) {
        console.log("✅ Parsed usecases:", data);
        setUsecases(data);
      } else {
        console.warn("⚠️ JSON is not an array:", data);
        setUsecases([]);
      }
    } catch (err) {
      console.error("❌ Failed to parse rawJson:", err);
      setUsecases([]);
    }
  }, [rawJson]);

  const handleUpdate = (index: number, field: string, value: string) => {
    setUsecases((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u))
    );
  };

  const handleDelete = (index: number) => {
    setUsecases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setUsecases((prev) => [...prev, { name: "", description: "" }]);
  };

  const handleCreate = async () => {
    try {
      for (const u of usecases) {
        if (!u.name?.trim()) continue;
        await callCreateUseCase({
          name: u.name,
          description: u.description || "",
          campaign: { id: campaignId },
        });
      }

      alert("Created successfully!");
      window.dispatchEvent(new CustomEvent("usecase-reload"));

      onClose();
    } catch (e) {
      console.error(e);
      alert("❌ Failed to create usecases.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Review & Edit UseCases</DialogTitle>
      <DialogContent dividers>
        {usecases.length === 0 ? (
          <Typography color="text.secondary">No usecases to review.</Typography>
        ) : (
          <Stack spacing={2}>
            {usecases.map((u, i) => (
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
                    UseCase #{i + 1}
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
                  label="Name"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  value={u.name || ""}
                  onChange={(e) => handleUpdate(i, "name", e.target.value)}
                />
                <TextField
                  label="Description"
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  multiline
                  value={u.description || ""}
                  onChange={(e) =>
                    handleUpdate(i, "description", e.target.value)
                  }
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAdd}
              variant="outlined"
            >
              Add UseCase
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
          disabled={usecases.length === 0}
        >
          💾 Create UseCases
        </Button>
      </DialogActions>
    </Dialog>
  );
}
