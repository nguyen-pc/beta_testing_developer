import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import { callGetCompanyUsers } from "../../../config/api";
import { useAppSelector } from "../../../redux/hooks";
import CompanyEditForm from "../../../components/dashboard/companyProfile/CompanyEditForm"; // 🧩 import component chỉnh sửa riêng

interface CompanyProfile {
  id: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhoneNumber: string;
  companyWebsite: string;
  companyMST: string;
  companyAddressMST: string;
  companyDateMST: string;
  description: string;
  logo: string;
  banner: string;
  active: boolean;
}

export default function CompanyProfileView() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const user = useAppSelector((state) => state.account.user);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!user?.id) return;
        setLoading(true);
        const res = await callGetCompanyUsers(user.id);
        if (res?.data?.result) setCompany(res.data.result);
        else if (res?.data) setCompany(res.data);
        else setCompany(null);
      } catch (error) {
        console.error("❌ Lỗi khi lấy companyProfile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (!company)
    return (
      <Typography variant="h6" color="error" mt={5} textAlign="center">
        Không tìm thấy thông tin công ty
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: "100%", p: 3 }}>
      {company.banner && (
        <CardMedia
          component="img"
          height="220"
          image={company.banner}
          alt="Banner"
          sx={{ borderRadius: 2, objectFit: "cover", mb: 3 }}
        />
      )}

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} textAlign="center">
              <CardMedia
                component="img"
                image={company.logo || "/no-logo.png"}
                alt="Logo"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #eee",
                  mx: "auto",
                }}
              />
              <Chip
                label={company.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                color={company.active ? "success" : "default"}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "900px",
                  mb: 1,
                }}
              >
                <Box display="flex" alignItems="center">
                  <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h5" fontWeight="bold" noWrap>
                    {company.companyName}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{ ml: "auto" }}
                  onClick={() => setOpenEdit(true)}
                >
                  Chỉnh sửa
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography sx={{ mb: 1 }}>
                <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                {company.companyEmail}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                {company.companyPhoneNumber || "—"}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
                {company.companyWebsite || "—"}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <HomeIcon sx={{ mr: 1, color: "primary.main" }} />
                {company.companyAddress || "—"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                 Thông tin đăng ký thuế
              </Typography>
              <Typography>
                <strong>MST:</strong> {company.companyMST || "—"}
              </Typography>
              <Typography>
                <strong>Địa chỉ MST:</strong> {company.companyAddressMST || "—"}
              </Typography>
              <Typography>
                <strong>Ngày đăng ký:</strong>{" "}
                {company.companyDateMST
                  ? new Date(company.companyDateMST).toLocaleDateString("vi-VN")
                  : "—"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                 Giới thiệu
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                {company.description || "Chưa có mô tả."}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 🧩 Form chỉnh sửa */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin công ty</DialogTitle>
        <DialogContent>
          <CompanyEditForm
            company={company}
            onClose={() => setOpenEdit(false)}
            onUpdated={(updated) => setCompany(updated)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
