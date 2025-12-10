import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";

import React from "react";
import axios from "axios";
import { callGetCampaign } from "../../../config/api";

const AnalysisBugAI = ({ bugs, campaignId }) => {
  const [campaign, setCampaign] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [ai, setAI] = React.useState<any>(null); // JSON đã format

  // Load campaign info
  React.useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await callGetCampaign(Number(campaignId));
        setCampaign(res.data);
      } catch (err) {
        console.error("❌ Error loading campaign:", err);
      }
    };
    fetchCampaign();
  }, [campaignId]);

  const handleAnalyze = async () => {
    if (!campaign) return;

    setOpen(true);
    setLoading(true);

    try {
      const payload = {
        campaign: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          instructions: campaign.instructions,
        },
        bugs: bugs,
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/bug/analyze",
        payload
      );
      setResult(res.data);

      // Parse JSON AI trả về
      try {
        const jsonAI = JSON.parse(res.data.ai_analysis);
        setAI(jsonAI);
      } catch {
        console.error("❌ AI JSON parse lỗi");
        setAI({ error: "Không thể phân tích dữ liệu AI" });
      }
    } catch (err) {
      console.error("❌ Lỗi AI phân tích bug:", err);
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, children }) => (
    <Box mt={2}>
      <Typography fontWeight={700} mb={1}>
        {title}
      </Typography>
      {children}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAnalyze}
        sx={{ ml: 2 }}
      >
        Analyze Bug AI
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>AI Phân Tích Bug – {campaign?.title}</DialogTitle>

        <DialogContent dividers>
          {loading && (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          )}

          {!loading && result && ai && (
            <Box sx={{ p: 1 }}>
              {/* Tổng quan */}
              {/* Tổng quan */}
              <Section title=" Tổng quan">
                <Typography>{ai.tong_quan}</Typography>
              </Section>

              {/* Rủi ro */}
              <Section title="Mức độ rủi ro">
                <Chip
                  label={ai.muc_do_rui_ro}
                  color={ai.muc_do_rui_ro === "Critical" ? "error" : "warning"}
                />
              </Section>

              {/* Severity */}
              <Section title=" Thống kê mức độ lỗi (Severity)">
                {Object.entries(result.severity_overview).map(
                  ([sev, count]) => (
                    <Chip
                      key={sev}
                      label={`${sev}: ${count}`}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )
                )}
              </Section>

              {/* Nguyên nhân */}
              <Section title=" Nguyên nhân có thể">
                <Stack spacing={1}>
                  {ai.nguyen_nhan_kha_nang?.map((item, idx) => (
                    <Typography key={idx}>• {item}</Typography>
                  ))}
                </Stack>
              </Section>

              {/* Ưu tiên sửa lỗi */}
              <Section title=" Ưu tiên sửa lỗi">
                <Stack spacing={1}>
                  {ai.goi_y_uu_tien_sua_loi?.map((fix, idx) => (
                    <Typography key={idx}>
                      Bug #{fix.bugId} → Ưu tiên: <b>{fix.suggestedPriority}</b>
                    </Typography>
                  ))}
                </Stack>
              </Section>

              {/* Đề xuất cải thiện */}
              <Section title=" Đề xuất cải thiện">
                <Stack spacing={1}>
                  {ai.de_xuat?.map((rec, idx) => (
                    <Typography key={idx}>• {rec}</Typography>
                  ))}
                </Stack>
              </Section>

              {/* Đánh giá báo cáo */}
              <Section title=" Đánh giá chất lượng báo cáo lỗi">
                <Typography>{ai.danh_gia_chat_luong_bao_cao}</Typography>
              </Section>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnalysisBugAI;
