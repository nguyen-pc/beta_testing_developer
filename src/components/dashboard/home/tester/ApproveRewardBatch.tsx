import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  callGetBatchDetails,
  callApproveRewardBatch,
} from "../../../../config/api";

const ApproveRewardBatch: React.FC = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBatch = async () => {
    try {
      const res = await callGetBatchDetails(batchId!);
      setBatch(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatch();
  }, []);

  const handleApprove = async () => {
    try {
      await callApproveRewardBatch(batchId!);
      alert("Batch approved successfully!");
      navigate(`/company/reward-batches`);
    } catch (err) {
      alert("Failed to approve batch!");
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
        Approve Reward Batch
      </Typography>

      <Paper sx={{ mt: 2, p: 3 }}>
        <Typography variant="body1">
          <strong>Batch ID:</strong> {batch.id}
        </Typography>

        <Typography variant="body1">
          <strong>Campaign:</strong> {batch.campaignId}
        </Typography>

        <Typography variant="body1">
          <strong>Total Amount:</strong> ${batch.totalAmount}
        </Typography>

        <Typography variant="body1">
          <strong>Status:</strong>{" "}
          <Chip label={batch.status} color="primary" />
        </Typography>

        <Divider sx={{ my: 2 }} />

        {batch.status === "DRAFT" ? (
          <Button variant="contained" color="primary" onClick={handleApprove}>
            Approve Batch
          </Button>
        ) : (
          <Chip color="success" label="Batch Already Approved" />
        )}
      </Paper>
    </Box>
  );
};

export default ApproveRewardBatch;
