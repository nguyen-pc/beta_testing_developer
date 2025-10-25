import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  Stack,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/RocketLaunch";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import { callPublishCampaign, callGetCampaign } from "../../../../config/api";

export default function CampaignLaunch() {
  const navigate = useNavigate();
  const {projectId, campaignId } = useParams(); // /dashboard/campaigns/:id/launch
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔹 Lấy thông tin campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await callGetCampaign(Number(campaignId));
        console.log("Fetched campaign:", res);  
        if (res?.data) {
          setCampaign(res.data);
        } else {
          setCampaign(res.data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy chiến dịch:", err);
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) fetchCampaign();
  }, [campaignId]);

  // 🔹 Gọi API publish + reload campaign
  const handleLaunch = async () => {
    if (!window.confirm("Bạn có chắc muốn xuất bản chiến dịch này không?"))
      return;

    try {
      setPublishing(true);
      const res = await callPublishCampaign(Number(campaignId));

      if (res?.statusCode === 200 || res?.data?.statusCode === 200) {
        setSnackbar({
          open: true,
          message: "🎉 Chiến dịch đã được xuất bản thành công!",
          severity: "success",
        });

        

        // Gọi lại API để cập nhật trạng thái mới nhất
        const updated = await callGetCampaign(Number(campaignId));
        setCampaign(updated?.data?.result || updated?.data);

        // Điều hướng sau 2s
        setTimeout(() => navigate(`/dashboard/projects/${projectId}/campaigns${campaignId}`), 2000);
      } else {
        setSnackbar({
          open: true,
          message: "Không thể xuất bản chiến dịch!",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("❌ Lỗi khi xuất bản:", err);
      setSnackbar({
        open: true,
        message: "Lỗi khi xuất bản chiến dịch!",
        severity: "error",
      });
    } finally {
      setPublishing(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (!campaign)
    return (
      <Typography color="error" textAlign="center" mt={5}>
        Không tìm thấy thông tin chiến dịch.
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        🚀 Xuất bản chiến dịch
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Kiểm tra lại các thông tin trước khi xuất bản chiến dịch Beta Test.
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        Sau khi xuất bản, chiến dịch sẽ mở cho tester đăng ký. Hãy chắc chắn
        rằng bạn đã hoàn tất TestCase, Surveys và cấu hình phần thưởng!
      </Alert>

      {/* Thông tin chiến dịch */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🧾 Thông tin chiến dịch
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Tên chiến dịch:</strong> {campaign.title}
              </Typography>
              <Typography variant="body2">
                <strong>Mô tả:</strong> {campaign.description || "—"}
              </Typography>
              <Typography variant="body2">
                <strong>Ngày bắt đầu:</strong>{" "}
                {campaign.startDate
                  ? new Date(campaign.startDate).toLocaleDateString("vi-VN")
                  : "—"}
              </Typography>
              <Typography variant="body2">
                <strong>Ngày kết thúc:</strong>{" "}
                {campaign.endDate
                  ? new Date(campaign.endDate).toLocaleDateString("vi-VN")
                  : "—"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Người tạo:</strong> {campaign.createdBy || "Admin"}
              </Typography>
              <Typography variant="body2">
                <strong>Phần thưởng:</strong> {campaign.rewardType || "—"}{" "}
                {campaign.rewardValue || ""}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Trạng thái hiện tại:</strong>{" "}
                <Chip
                  label={
                    campaign.isDraft
                      ? "Bản nháp"
                      : campaign.campaignStatus === "ACTIVE"
                      ? "Đã xuất bản"
                      : campaign.campaignStatus
                  }
                  color={
                    campaign.isDraft
                      ? "default"
                      : campaign.campaignStatus === "ACTIVE"
                      ? "success"
                      : "warning"
                  }
                  size="small"
                />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Nút hành động */}
      <Divider sx={{ mb: 3 }} />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          color="secondary"
          onClick={() => navigate(`/dashboard/campaigns/${id}/edit`)}
        >
          Quay lại chỉnh sửa
        </Button>
        <Button
          startIcon={<LaunchIcon />}
          variant="contained"
          color="success"
          disabled={publishing}
          onClick={handleLaunch}
        >
          {publishing ? "Đang xuất bản..." : "Xuất bản chiến dịch"}
        </Button>
      </Stack>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
