import React, { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RecruitMethodSection from "./RecruitMethodSection";
import DeviceSection from "./DeviceSection";
import AudienceProfileSection from "./AudienceProfileSection";
import {
  callCreateRecruitingCampaign,
  callGetRecruitingByCampaign,
  callUpdateRecruitingCampaign,
} from "../../../../config/api";

export default function RecruitingCampaign() {
  const { campaignId, projectId } = useParams();
  const navigate = useNavigate();

  // --- Shared state ---
  const [recruitMethod, setRecruitMethod] = useState("panel");
  const [testerCount, setTesterCount] = useState<number>(25);
  const [devices, setDevices] = useState<string>("iPhone, Android");
  const [whitelist, setWhitelist] = useState<string>("no");
  const [audienceProfile, setAudienceProfile] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [recruitingId, setRecruitingId] = useState<string | null>(null); // ✅ lưu id để update

  // --- Fetch recruiting data if exists ---
  useEffect(() => {
    const fetchRecruitProfile = async () => {
      try {
        if (!campaignId) return;
        setLoading(true);
        const res = await callGetRecruitingByCampaign(campaignId);

        if (res.data) {
          const data = res.data;
          console.log("🎯 Loaded Recruit Profile:", data);
          setRecruitingId(data.id?.toString() || null);
          setRecruitMethod(data.recruitMethod || "panel");
          setTesterCount(data.testerCount || 25);
          setDevices(data.devices || "");
          setWhitelist(data.whitelist || "no");

          // mapping phần audience profile
          setAudienceProfile({
            gender: data.gender || "",
            country: data.country || "",
            zipcode: data.zipcode || "",
            householdIncome: data.householdIncome || "",
            isChildren: data.isChildren || false,
            employment: data.employment || "",
            gamingGenres: data.gamingGenres || "",
            browsers: data.browsers || "",
            socialNetworks: data.socialNetworks || "",
            webExpertise: data.webExpertise || "",
            languages: data.languages || "",
            ownedDevices: data.ownedDevices || "",
          });
          setHasProfile(true);
        }
      } catch (error) {
        console.error("❌ Error fetching recruit profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruitProfile();
  }, [campaignId]);

  // --- Save or update recruiting profile ---
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

    try {
      if (hasProfile && recruitingId) {
        console.log(" Updating recruit profile...");
        await callUpdateRecruitingCampaign(recruitingId, payload);
      } else {
        console.log(" Creating recruit profile...");
        await callCreateRecruitingCampaign(payload);
      }

      navigate(
        `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/test-case`
      );
    } catch (error) {
      console.error("⚠️ Error saving recruit profile:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, mx: "auto" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        {hasProfile ? "Edit Recruiting Profile" : "Tester Recruiting"}
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

      <AudienceProfileSection
        audienceProfile={audienceProfile}
        setAudienceProfile={setAudienceProfile}
      />

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000" }}
          onClick={handleSaveProfile}
        >
          {hasProfile ? "Update and Continue" : "Save and Continue"}
        </Button>
      </Box>
    </Box>
  );
}
