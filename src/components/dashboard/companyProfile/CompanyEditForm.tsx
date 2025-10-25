import React, { useState } from "react";
import { Box, Button, TextField, Grid, Avatar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { callUpdateCompany } from "../../../config/api";

interface CompanyEditFormProps {
  company: any;
  onClose: () => void;
  onUpdated: (data: any) => void;
}

export default function CompanyEditForm({
  company,
  onClose,
  onUpdated,
}: CompanyEditFormProps) {
  const [saving, setSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(company.logo || "");
  const [previewBanner, setPreviewBanner] = useState(company.banner || "");

  const companySchema = yup.object().shape({
    companyName: yup.string().required("Vui lòng nhập tên công ty"),
    companyEmail: yup
      .string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email công ty"),
    companyAddress: yup.string().required("Vui lòng nhập địa chỉ công ty"),
    companyMST: yup.string().required("Vui lòng nhập mã số thuế"),
  });

  const handleFileChange = (
    e: any,
    field: "logo" | "banner",
    setFieldValue: any
  ) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue(field, file);
      const reader = new FileReader();
      reader.onload = () => {
        field === "logo"
          ? setPreviewLogo(reader.result as string)
          : setPreviewBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value as any)
      );

      const res = await callUpdateCompany(company.id, formData);
      if (res?.status === 200) {
        alert("Cập nhật thành công!");
        onUpdated({ ...company, ...values });
        onClose();
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật công ty:", error);
      alert("Có lỗi khi cập nhật công ty!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Formik
      initialValues={company}
      validationSchema={companySchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 1 }}>
            {/* ==== HÀNG 1: Logo | Tên công ty | Banner ==== */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3} textAlign="center">
                <Avatar
                  src={previewLogo}
                  alt="Logo"
                  sx={{
                    width: 100,
                    height: 100,
                    border: "2px solid #ccc",
                    margin: "auto",
                  }}
                />
                <Button component="label" variant="outlined" sx={{ mt: 1 }}>
                  Tải logo
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => handleFileChange(e, "logo", setFieldValue)}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center" ml="100px" mr="100px">
                <Box
                  sx={{
                    border: previewBanner
                      ? "1px solid #ccc"
                      : "1px dashed #aaa",
                    borderRadius: 1.5,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {previewBanner ? (
                    <img
                      src={previewBanner}
                      alt="Banner"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "Chưa có banner"
                  )}
                </Box>
                <Button component="label" variant="outlined" sx={{ mt: 1 }}>
                  Tải banner
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e, "banner", setFieldValue)
                    }
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Tên công ty"
                  name="companyName"
                  fullWidth
                  value={values.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.companyName && !!errors.companyName}
                  helperText={touched.companyName && errors.companyName}
                />
              </Grid>
            </Grid>

            {/* ==== HÀNG 2: Email | SĐT | Website ==== */}
            <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Email công ty"
                  name="companyEmail"
                  fullWidth
                  value={values.companyEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.companyEmail && !!errors.companyEmail}
                  helperText={touched.companyEmail && errors.companyEmail}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Số điện thoại"
                  name="companyPhoneNumber"
                  fullWidth
                  value={values.companyPhoneNumber || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Website"
                  name="companyWebsite"
                  fullWidth
                  value={values.companyWebsite || ""}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* ==== HÀNG 3: Địa chỉ | Địa chỉ MST | Mã số thuế ==== */}
            <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Địa chỉ công ty"
                  name="companyAddress"
                  fullWidth
                  value={values.companyAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.companyAddress && !!errors.companyAddress}
                  helperText={touched.companyAddress && errors.companyAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Địa chỉ MST"
                  name="companyAddressMST"
                  fullWidth
                  value={values.companyAddressMST || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Mã số thuế"
                  name="companyMST"
                  fullWidth
                  value={values.companyMST}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* ==== HÀNG 4: Mô tả ==== */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <TextField
                  label="Giới thiệu / Mô tả"
                  name="description"
                  multiline
                  rows={2}
                  fullWidth
                  value={values.description || ""}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* ==== BUTTONS ==== */}
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button onClick={onClose} sx={{ mr: 2 }}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
}
