import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import {
  callAddTesterReward,
  callGetTesterStatus,
  callGetMyPaymentInfo,
} from "../../../../config/api";

interface Props {
  open: boolean;
  onClose: () => void;
  batchId: number;
  campaignId: number;
  onSuccess: () => void;
}

const CreateTesterRewardDialog: React.FC<Props> = ({
  open,
  onClose,
  batchId,
  campaignId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [bonusMap, setBonusMap] = useState<Record<number, number>>({});

  // ======================
  // LOAD FULL TABLE
  // ======================
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await callGetTesterStatus(String(campaignId));

        const eligibleTesters = res.data.filter((t: any) => t.progress === 100);

        // Build rows + load bank info per tester
        const rowsWithBank: any[] = [];

        for (let t of eligibleTesters) {
          let bankInfo = null;
          try {
            const bankRes = await callGetMyPaymentInfo(String(t.userId));
            bankInfo = bankRes.data;
          } catch {
            bankInfo = null;
          }

          rowsWithBank.push({
            testerCampaignId: t.testerCampaignId,
            userId: t.userId,
            testerName: t.testerName,
            reward: Number(t.reward) || 0,
            bankInfo,
          });
        }

        setRows(rowsWithBank);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  // ======================
  // SUBMIT (PER ROW)
  // ======================
  const handleAddReward = async (row: any) => {
    if (!row.bankInfo) {
      alert("Tester missing bank info!");
      return;
    }

    await callAddTesterReward({
      rewardBatchId: batchId,
      testerId: row.userId,
      rewardAmount: row.reward,
      bonusAmount: bonusMap[row.userId] || 0,

      bankAccountNumber: row.bankInfo.bankAccountNumber,
      bankAccountName: row.bankInfo.accountHolder,
      bankName: row.bankInfo.bankName,
    });

    onSuccess();
    alert("Reward added!");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Create Tester Reward</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        {loading ? (
          <Box textAlign="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #e5e7eb",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={th}>Tester</th>
                <th style={th}>Reward</th>
                <th style={th}>Bank</th>
                <th style={th}>Account Name</th>
                <th style={th}>Account Number</th>
                <th style={th}>Bonus</th>
                <th style={th}></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.userId}>
                  <td style={td}>{row.testerName}</td>
                  <td style={td}>${row.reward}</td>
                  <td style={td}>{row.bankInfo?.bankName || "-"}</td>
                  <td style={td}>{row.bankInfo?.accountHolder || "-"}</td>
                  <td style={td}>{row.bankInfo?.bankAccountNumber || "-"}</td>

                  <td style={td}>
                    <TextField
                      size="small"
                      type="number"
                      value={bonusMap[row.userId] || ""}
                      onChange={(e) =>
                        setBonusMap({
                          ...bonusMap,
                          [row.userId]: Number(e.target.value),
                        })
                      }
                      sx={{ width: "80px" }}
                    />
                  </td>

                  <td style={td}>
                    <Button
                      variant="contained"
                      disabled={!row.bankInfo}
                      onClick={() => handleAddReward(row)}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ==== STYLE ====
const th = {
  padding: "10px",
  textAlign: "left" as const,
  fontWeight: 600,
  fontSize: "14px",
};

const td = {
  padding: "10px",
  borderTop: "1px solid #e5e7eb",
  fontSize: "14px",
};

export default CreateTesterRewardDialog;
