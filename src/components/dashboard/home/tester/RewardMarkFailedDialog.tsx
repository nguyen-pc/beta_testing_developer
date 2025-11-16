import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  reward: any | null;
  onSubmit: (reason: string) => void;
}

const RewardMarkFailedDialog: React.FC<Props> = ({
  open,
  onClose,
  reward,
  onSubmit,
}) => {
  const [reason, setReason] = React.useState("");

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Mark as FAILED</DialogTitle>

      <DialogContent>
        <TextField
          label="Failure Reason"
          fullWidth
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" color="error" onClick={() => onSubmit(reason)}>
          Confirm Failed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardMarkFailedDialog;
