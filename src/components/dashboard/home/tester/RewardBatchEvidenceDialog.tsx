import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import EvidenceUploadField from "./EvidenceUploadField";

interface Props {
  open: boolean;
  onClose: () => void;
  batchId: number;
  callCreateEvidence: (batchId: number, data: any) => Promise<any>;
  onSubmit: () => void;
}

const RewardBatchEvidenceDialog: React.FC<Props> = ({
  open,
  onClose,
  batchId,
  onSubmit,
  callCreateEvidence,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleUploadEvidence = async () => {
    if (!fileName) {
      alert("Please upload a file first!");
      return;
    }

    await callCreateEvidence(batchId, {
      type: "BANK_STATEMENT",
      fileUrl: fileName, // backend tự build URL
      fileName: fileName,
      note: note,
    });

    onSubmit();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Upload Batch Payment Evidence</DialogTitle>

      <DialogContent>
        <Typography mb={1}>
          Upload bank statement / transfer proof for this batch.
        </Typography>

        {/* ⭐ TÍCH HỢP COMPONENT UPLOAD */}
        <EvidenceUploadField
          folder="reward-evidences"
          value={fileName}
          onChange={(val) => setFileName(val)}
        />

        <TextField
          label="Note"
          fullWidth
          sx={{ mt: 2 }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          disabled={!fileName}
          onClick={handleUploadEvidence}
        >
          Submit Evidence
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardBatchEvidenceDialog;
