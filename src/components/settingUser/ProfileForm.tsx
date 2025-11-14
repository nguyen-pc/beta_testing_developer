import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { callGetUserSettings, callUpdateUserSettings } from "../../config/api";

export default function ProfileForm() {
  const user = useAppSelector((state) => state.account.user);

  const [form, setForm] = useState({
    id: 0,
    name: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await callGetUserSettings(user.id);
        const u = res?.data; 
        if (u) {
          setForm({
            id: u.id,
            name: u.name || "",
            phoneNumber: u.phoneNumber || "",
            address: u.address || "",
            gender: u.gender || "",
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
        setAlert({ type: "error", msg: "Failed to load user info." });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        setAlert({ type: "error", msg: "Name cannot be empty!" });
        return;
      }
      setUpdating(true);
      const res = await callUpdateUserSettings(form);

      if (res?.data) {
        setAlert({ type: "success", msg: "Profile updated successfully!" });
      } else {
        setAlert({
          type: "error",
          msg: res?.data?.message || "Update failed.",
        });
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      setAlert({ type: "error", msg: "Failed to update profile." });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box textAlign="right" mt={3}>
        <Button
          variant="contained"
          disabled={updating}
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
          onClick={handleSubmit}
        >
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      {/* 🔔 Snackbar for notifications */}
      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {alert && <Alert severity={alert.type}>{alert.msg}</Alert>}
      </Snackbar>
    </Box>
  );
}
