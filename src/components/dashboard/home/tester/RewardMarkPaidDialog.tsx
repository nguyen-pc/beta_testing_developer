import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import EvidenceUploadField from "./EvidenceUploadField";

interface Props {
  open: boolean;
  onClose: () => void;
  reward: any | null;
  onSubmit: (evidenceFileName: string | null) => void;
}

const RewardMarkPaidDialog: React.FC<Props> = ({
  open,
  onClose,
  reward,
  onSubmit,
}) => {
  const [evidence, setEvidence] = useState<string | null>(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Mark Reward as PAID</DialogTitle>

      <DialogContent>
        <Typography fontWeight={600} mb={1}>
          Upload payment evidence (image or PDF)
        </Typography>

        {/* ⭐ Upload Evidence Component */}
        <EvidenceUploadField
          folder="reward-evidences"
          value={evidence}
          onChange={(fileName) => setEvidence(fileName)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          color="success"
          disabled={!evidence} // bắt buộc phải upload
          onClick={() => onSubmit(evidence)}
        >
          Confirm Paid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardMarkPaidDialog;
