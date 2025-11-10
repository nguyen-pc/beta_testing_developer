import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../../internals/components/Copyright";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedTreeView from "./CustomizedTreeView";
import CustomizedDataGrid from "./CustomizedDataGrid";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";
import type { StatCardProps } from "./StatCard";
import BugSeverityChart from "./campaign/dashboard_campaign/BugSeverityChart";
import { useParams } from "react-router-dom";
import TesterCompletionCard from "./campaign/dashboard_campaign/CompletionChart";
import { Button, Chip, CircularProgress, Paper } from "@mui/material";
import { callGetCampaign, callGetRejectReasons } from "../../config/api";
import parse from "html-react-parser";
import RejectChatDialog from "./RejectChatDialog";
const data: StatCardProps[] = [
  // {
  //   title: 'Users',
  //   value: '14k',
  //   interval: 'Last 30 days',
  //   trend: 'up',
  //   data: [
  //     200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
  //     360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
  //   ],
  // },
  {
    title: "Conversions",
    value: "325",
    interval: "Last 30 days",
    trend: "down",
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
      820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
      220,
    ],
  },
  {
    title: "Event count",
    value: "200k",
    interval: "Last 30 days",
    trend: "neutral",
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
      530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function MainGridCampaign() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = React.useState<any>(null);
  const [rejectReasons, setRejectReasons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openChat, setOpenChat] = React.useState(false);
  const [selectedReason, setSelectedReason] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callGetCampaign(Number(campaignId));
        setCampaign(res.data);
        if (res.data.campaignStatus === "REJECTED") {
          const rejectRes = await callGetRejectReasons(campaignId!);
          setRejectReasons(rejectRes.data || []);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy chiến dịch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );

  if (!campaign)
    return (
      <Typography textAlign="center" color="text.secondary" mt={4}>
        Không tìm thấy chiến dịch.
      </Typography>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          borderLeft: `6px solid ${
            campaign.campaignStatus === "APPROVED"
              ? "#4caf50"
              : campaign.campaignStatus === "REJECTED"
              ? "#f44336"
              : "#ff9800"
          }`,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {campaign.title}
        </Typography>
        <Chip
          label={campaign.campaignStatus}
          color={
            campaign.campaignStatus === "APPROVED"
              ? "success"
              : campaign.campaignStatus === "REJECTED"
              ? "default"
              : "warning"
          }
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary">
          {parse(campaign.description) || "Không có mô tả chi tiết"}
        </Typography>

        {campaign.campaignStatus === "REJECTED" && (
          <Box mt={3}>
            <Typography variant="subtitle1" color="error.main" gutterBottom>
              ⚠️ Chiến dịch đã bị từ chối
            </Typography>

            {rejectReasons.length > 0 ? (
              <Stack spacing={2}>
                {rejectReasons.map((reason, index) => {
                  let reasonText = reason.initialReason;
                  try {
                    const parsed = JSON.parse(reason.initialReason);
                    if (parsed.reason) reasonText = parsed.reason;
                  } catch (e) {
                    // ignore parse error
                  }

                  return (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "grey.50",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "grey.100",
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body1" fontWeight={600}>
                          💬 {reasonText}
                        </Typography>
                        <Chip
                          label={new Date(reason.createdAt).toLocaleString(
                            "vi-VN"
                          )}
                          size="small"
                          color="default"
                          sx={{ fontSize: 12 }}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Được gửi bởi: <b>{reason.createdBy || "Hệ thống"}</b>
                      </Typography>

                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                          mt: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                        onClick={() => {
                          setSelectedReason(reason);
                          setOpenChat(true);
                        }}
                      >
                        Xem phản hồi
                      </Button>
                    </Paper>
                  );
                })}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Không có lý do cụ thể được ghi nhận.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TesterCompletionCard campaignId={Number(campaignId)} />
        </Grid>
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <SessionsChart /> */}
          <BugSeverityChart campaignId={campaignId} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      {/* ====== MODAL PHẢN HỒI ====== */}
      {selectedReason && (
        <RejectChatDialog
          open={openChat}
          onClose={() => setOpenChat(false)}
          reason={selectedReason}
        />
      )}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
