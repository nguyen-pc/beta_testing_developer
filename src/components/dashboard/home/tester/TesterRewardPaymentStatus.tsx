import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  callGetRewardsInBatch,
  callUpdateTesterRewardStatus,
} from "../../../../config/api";
import { useParams } from "react-router-dom";

const TesterRewardPaymentStatus: React.FC = () => {
  const { batchId } = useParams();
  const [testers, setTesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [status, setStatus] = useState("PAID");
  const [failureReason, setFailureReason] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const loadRewards = async () => {
    try {
      const res = await callGetRewardsInBatch(batchId!);
      setTesters(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  const handleSubmit = async () => {
    try {
      await callUpdateTesterRewardStatus(selectedReward.id, {
        status,
        failureReason: status === "FAILED" ? failureReason : null,
        evidenceUrl: status === "PAID" ? evidenceUrl : null,
      });

      alert("Updated successfully!");
      setOpen(false);
      loadRewards();
    } catch (err) {
      alert("Failed to update!");
    }
  };

  if (loading)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600}>
        Mark Payments (Paid / Failed)
      </Typography>

      <Paper sx={{ mt: 2, p: 3 }}>
        {testers.map((t) => (
          <Box
            key={t.id}
            sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
          >
            <Typography>{t.testerName}</Typography>
            <Chip label={t.status} color="primary" />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedReward(t);
                setStatus("PAID");
                setFailureReason("");
                setEvidenceUrl("");
                setOpen(true);
              }}
            >
              Update
            </Button>
          </Box>
        ))}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <RadioGroup value={status} onChange={(e) => setStatus(e.target.value)}>
            <FormControlLabel value="PAID" control={<Radio />} label="Paid" />
            <FormControlLabel value="FAILED" control={<Radio />} label="Failed" />
          </RadioGroup>

          {status === "PAID" && (
            <TextField
              fullWidth
              label="Evidence URL"
              placeholder="Upload file & paste URL"
              sx={{ mt: 2 }}
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
            />
          )}

          {status === "FAILED" && (
            <TextField
              fullWidth
              label="Failure Reason"
              sx={{ mt: 2 }}
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
            />
          )}

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TesterRewardPaymentStatus;
