import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RecruitMethodSection from "./RecruitMethodSection";
import DeviceSection from "./DeviceSection";
import AudienceProfileSection from "./AudienceProfileSection";
import { callCreateRecruitingCampaign } from "../../../../config/api";

export default function RecruitingCampaign() {
  const { campaignId, projectId } = useParams();
  const navigate = useNavigate();

  // --- Shared state ---
  const [recruitMethod, setRecruitMethod] = useState("panel");
  const [testerCount, setTesterCount] = useState(25);
  const [devices, setDevices] = useState<string>("iPhone, Android");
  const [whitelist, setWhitelist] = useState("no");
  const [audienceProfile, setAudienceProfile] = useState<any>({});

  // --- Save recruiting profile ---
  const handleSaveProfile = async () => {
    const payload = {
      recruitMethod,
      testerCount,
      devices,
      whitelist,
      ...audienceProfile,
      campaign: { id: campaignId },
    };
    console.log("🧾 Recruit Payload:", payload);
    await callCreateRecruitingCampaign(payload);
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/test-case`
    );
  };

  return (
    <Box sx={{ p: 4, mx: "auto" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Tester Recruiting
      </Typography>

      <RecruitMethodSection
        recruitMethod={recruitMethod}
        setRecruitMethod={setRecruitMethod}
        testerCount={testerCount}
        setTesterCount={setTesterCount}
        campaignId={campaignId}
      />

      <DeviceSection
        devices={devices}
        setDevices={setDevices}
        whitelist={whitelist}
        setWhitelist={setWhitelist}
      />

      <AudienceProfileSection setAudienceProfile={setAudienceProfile} />

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button variant="outlined">Cancel</Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000" }}
          onClick={handleSaveProfile}
        >
          Save and Continue
        </Button>
      </Box>
    </Box>
  );
}
