// src/pages/settings/UserSettingsPage.tsx
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
// import PaymentInfo from "./PaymentInfo";

export default function UserSettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box className="p-6 w-full">
      <Typography variant="h5" fontWeight={700} mb={3}>
        User Settings
      </Typography>

      <Paper
        elevation={0}
        className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Profile Info" />
          <Tab label="Change Password" />
          {/* <Tab label="Payments" /> */}
        </Tabs>

        {tab === 0 && <ProfileForm />}
        {tab === 1 && <ChangePasswordForm />}
        {/* {tab === 2 && <PaymentInfo />} */}
      </Paper>
    </Box>
  );
}
