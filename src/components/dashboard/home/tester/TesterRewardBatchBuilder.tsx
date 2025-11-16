import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  callApproveRewardBatch,
  callCreateRewardBatch,
  callCreateRewardBatchEvidence,
  callGetBatchByCampaign,
  callGetListRewardTesterInBatch,
  callUpdateTesterRewardStatus,
  callGetRewardEvidence,
} from "../../../../config/api";

import axios from "axios";
import { useParams } from "react-router-dom";
import CreateTesterRewardDialog from "./CreateTesterRewardDialog";
import RewardStatusActions from "./RewardStatusActions";
import RewardMarkPaidDialog from "./RewardMarkPaidDialog";
import RewardMarkFailedDialog from "./RewardMarkFailedDialog";
import RewardBatchEvidenceDialog from "./RewardBatchEvidenceDialog";
import { formatChatTime, formatChatTimeEmail } from "../../../../util/timeFormatter";

const TesterRewardBatchBuilder: React.FC = () => {
  const { campaignId } = useParams();

  const [loading, setLoading] = useState(true);

  const [batchId, setBatchId] = useState<number | null>(null);
  const [batchInfo, setBatchInfo] = useState<any>(null);
  const [rewardList, setRewardList] = useState<any[]>([]);

  const [evidence, setEvidence] = useState<any>(null);

  const [openBatchDialog, setOpenBatchDialog] = useState(false);
  const [openRewardDialog, setOpenRewardDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openEvidenceDialog, setOpenEvidenceDialog] = useState(false);

  const [batchNote, setBatchNote] = useState("");

  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [openPaid, setOpenPaid] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  // ----------------------------------------------------------
  // LOAD DATA: batch + reward list + evidence
  // ----------------------------------------------------------
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const batchRes = await callGetBatchByCampaign(campaignId!);

      if (batchRes.data?.length > 0) {
        const batch = batchRes.data[0];
        setBatchId(batch.id);
        setBatchInfo(batch);

        // ⭐ load reward list
        const rewardRes = await callGetListRewardTesterInBatch(batch.id);
        setRewardList(rewardRes.data);

        // ⭐ load evidence
        const evidenceRes = await callGetRewardEvidence(batch.id);
        console.log("Loaded evidence:", evidenceRes.data);
        setEvidence(evidenceRes.data || null);
      } else {
        setBatchId(null);
        setBatchInfo(null);
        setRewardList([]);
        setEvidence(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [campaignId]);

  // ----------------------------------------------------------
  // CREATE BATCH
  // ----------------------------------------------------------
  const handleCreateBatch = async () => {
    try {
      const res = await callCreateRewardBatch({
        campaignId: Number(campaignId),
        note: batchNote,
      });

      setBatchId(res.data.id);
      setBatchInfo(res.data);
      setOpenBatchDialog(false);
      fetchAllData();
      alert("Reward batch created!");
    } catch {
      alert("Failed to create batch");
    }
  };

  // ----------------------------------------------------------
  // APPROVE BATCH
  // ----------------------------------------------------------
  const handleApproveBatch = async () => {
    try {
      const res = await callApproveRewardBatch(batchId!);
      setBatchInfo(res.data);
      setOpenApproveDialog(false);
      fetchAllData();
      alert("Batch approved!");
    } catch {
      alert("Failed to approve batch");
    }
  };

  // ----------------------------------------------------------
  // MARK PAID
  // ----------------------------------------------------------
  const handleMarkPaid = async (reward: any, evidenceFileName: string) => {
    try {
      await callUpdateTesterRewardStatus(reward.id, {
        status: "PAID",
        evidenceUrl: evidenceFileName,
        failureReason: null,
      });

      alert("Marked as PAID successfully!");
      fetchAllData();
      setOpenPaid(false);
    } catch {
      alert("Failed to mark PAID!");
    }
  };

  // ----------------------------------------------------------
  // TABLE COLUMNS
  // ----------------------------------------------------------
  const columns: GridColDef[] = [
    { field: "testerId", headerName: "Tester ID", flex: 0.4 },
    {
      field: "amount",
      headerName: "Reward",
      flex: 0.5,
      renderCell: (p) => `$${p.value}`,
    },
    {
      field: "bonusAmount",
      headerName: "Bonus",
      flex: 0.5,
      renderCell: (p) => `$${p.value || 0}`,
    },
    { field: "bankName", headerName: "Bank", flex: 0.7 },
    { field: "bankAccountName", headerName: "Account Name", flex: 1 },
    { field: "bankAccountNumber", headerName: "Account Number", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={p.value === "PENDING" ? "warning" : "success"}
        />
      ),
    },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <RewardStatusActions
          row={params.row}
          onPaid={(row) => {
            setSelectedReward(row);
            setOpenPaid(true);
          }}
          onFailed={(row) => {
            setSelectedReward(row);
            setOpenFailed(true);
          }}
        />
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Reward Batch
      </Typography>

      {/* ACTION BAR ------------------------------------------------ */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {batchId ? (
            <Chip label={`Batch ID: ${batchId}`} color="primary" />
          ) : (
            <Button
              variant="contained"
              onClick={() => setOpenBatchDialog(true)}
            >
              Create Batch
            </Button>
          )}

          <Button
            variant="outlined"
            color="warning"
            disabled={!batchId || batchInfo?.status === "APPROVED"}
            onClick={() => setOpenRewardDialog(true)}
          >
            Create Tester Reward
          </Button>

          <Button
            variant="contained"
            color="success"
            disabled={!batchId || batchInfo?.status === "APPROVED"}
            onClick={() => setOpenApproveDialog(true)}
          >
            Approve Batch
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            disabled={!batchId || batchInfo?.status !== "APPROVED" || evidence}
            onClick={() => setOpenEvidenceDialog(true)}
          >
            {evidence ? "Evidence Uploaded" : "Upload Evidence"}
          </Button>

          <Box flexGrow={1} />
          <Chip label={`Items: ${rewardList.length}`} />
        </Stack>
      </Paper>

      {/* EXISTING BATCH INFO -------------------------------------- */}
      {batchInfo && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2}>
            <Chip label={`Status: ${batchInfo.status}`} color="info" />
            <Chip label={`Note: ${batchInfo.note}`} />
          </Stack>

          {batchInfo.status === "APPROVED" && (
            <Typography mt={1} color="green" fontWeight={600}>
              Approved At: {formatChatTimeEmail(batchInfo.approvedAt)}
            </Typography>
          )}

          {/* EVIDENCE DISPLAY */}
          {evidence && (
            <Box mt={2}>
              <Typography fontWeight={600}>Uploaded Evidence</Typography>

              {evidence.fileName.endsWith(".pdf") ? (
                <Button
                  variant="outlined"
                  href={`http://localhost:8081/storage/reward-evidences/${evidence.fileUrl}`}
                  target="_blank"
                  sx={{ mt: 1 }}
                >
                  View PDF Evidence
                </Button>
              ) : (
                <img
                  src={`http://localhost:8081/storage/reward-evidences/${evidence.fileUrl}`}
                  style={{
                    maxWidth: 300,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                />
              )}

              <Typography mt={1}>Note: {evidence.note}</Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* TABLE ----------------------------------------------------- */}
      <Paper>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid autoHeight rows={rewardList} columns={columns} />
        )}
      </Paper>

      {/* CREATE BATCH DIALOG */}
      <Dialog open={openBatchDialog} onClose={() => setOpenBatchDialog(false)}>
        <DialogTitle>Create Reward Batch</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Batch Note"
            value={batchNote}
            onChange={(e) => setBatchNote(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBatchDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBatch}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE TESTER REWARD DIALOG */}
      <CreateTesterRewardDialog
        open={openRewardDialog}
        onClose={() => setOpenRewardDialog(false)}
        batchId={batchId!}
        campaignId={Number(campaignId)}
        onSuccess={() => fetchAllData()}
      />

      {/* APPROVE DIALOG */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
      >
        <DialogTitle>Approve Reward Batch</DialogTitle>
        <DialogContent>
          <Typography>
            Approving this batch will lock all tester rewards.
          </Typography>
          <Box mt={2}>
            <Typography>Total Testers: {rewardList.length}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApproveBatch}
          >
            Approve Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* PAID / FAILED dialogs */}
      <RewardMarkPaidDialog
        open={openPaid}
        onClose={() => setOpenPaid(false)}
        reward={selectedReward}
        onSubmit={(evidenceFileName) =>
          handleMarkPaid(selectedReward, evidenceFileName)
        }
      />

      <RewardMarkFailedDialog
        open={openFailed}
        onClose={() => setOpenFailed(false)}
        reward={selectedReward}
        onSubmit={async (reason) => {
          await axios.post(
            `/api/v1/tester-rewards/${selectedReward.id}/status`,
            {
              status: "FAILED",
              failureReason: reason,
              evidenceUrl: null,
            }
          );
          setOpenFailed(false);
          fetchAllData();
        }}
      />

      {/* BATCH EVIDENCE UPLOAD */}
      <RewardBatchEvidenceDialog
        open={openEvidenceDialog}
        onClose={() => setOpenEvidenceDialog(false)}
        batchId={batchId!}
        callCreateEvidence={callCreateRewardBatchEvidence}
        onSubmit={() => fetchAllData()}
      />
    </Box>
  );
};

export default TesterRewardBatchBuilder;
