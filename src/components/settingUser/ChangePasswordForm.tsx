// src/pages/settings/ChangePasswordForm.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { callChangeUserPassword, callLogout } from "../../config/api";
import { setLogoutAction } from "../../redux/slice/accountSlide";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleLogout = async () => {
    const res = await callLogout();
    console.log("handleLogout", res);
    if (res && res && +res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      <Alert variant="filled" severity="success">
        Đăng xuất thành công!
      </Alert>;
      navigate("/signin");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isPasswordStrong = (pwd: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setAlert({ type: "error", msg: "Please fill in all fields!" });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setAlert({ type: "error", msg: "Passwords do not match!" });
      return;
    }
    if (!isPasswordStrong(form.newPassword)) {
      setAlert({
        type: "error",
        msg: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: user?.id,
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      };

      const res = await callChangeUserPassword(payload);
      console.log("change password response", res);
      setTimeout(() => {
        handleLogout();
      }, 2000);

      if (res) {
        setAlert({ type: "success", msg: "Password updated successfully!" });

        // 🧹 Reset form
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setAlert({
          type: "error",
          msg: "Failed to update password!",
        });
      }
    } catch (err: any) {
      console.error("❌ Update password failed:", err);
      setAlert({
        type: "error",
        msg: "Failed to update password!",
      });
    } finally {
      setLoading(false);
    }
  };

  // 👁 Toggle visibility
  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <Box>
      <Typography variant="subtitle1" mb={2} fontWeight={600}>
        Change Password
      </Typography>

      <Grid container spacing={2}>
        {/* Current Password */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type={showPassword.current ? "text" : "password"}
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleShow("current")} edge="end">
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* New Password */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type={showPassword.new ? "text" : "password"}
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            helperText="Min 8 chars, incl. uppercase, number, symbol"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleShow("new")} edge="end">
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Confirm Password */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type={showPassword.confirm ? "text" : "password"}
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleShow("confirm")} edge="end">
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box textAlign="right" mt={3}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(135deg, #111827, #1f2937)",
            color: "white",
            borderRadius: "8px",
            px: 3,
            py: 1.2,
            "&:hover": {
              background: "linear-gradient(135deg, #1f2937, #374151)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Update Password"
          )}
        </Button>
      </Box>

      {/* 🔔 Snackbar for notifications */}
      <Snackbar
        open={!!alert}
        autoHideDuration={4000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {alert && <Alert severity={alert.type}>{alert.msg}</Alert>}
      </Snackbar>
    </Box>
  );
}
