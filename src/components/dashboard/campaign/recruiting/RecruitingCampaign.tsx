import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { callCreateRecruitingCampaign } from "../../../../config/api";

export default function TesterRecruitForm() {
  const { campaignId, projectId } = useParams();
  const navigate = useNavigate();
  // --- Recruit section ---
  const [recruitMethod, setRecruitMethod] = useState("panel");
  const [testerCount, setTesterCount] = useState(25);
  const [devices, setDevices] = useState<string>("iPhone, Android");
  const [whitelist, setWhitelist] = useState("no");

  // --- Demographics ---
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [income, setIncome] = useState("");
  const [isParent, setIsParent] = useState("");

  // --- Profile / Audience info (chuỗi cách nhau bằng dấu phẩy) ---
  const [employment, setEmployment] = useState<string>("");
  const [gamingGenres, setGamingGenres] = useState<string>("");
  const [browsers, setBrowsers] = useState<string>("");
  const [socialNetworks, setSocialNetworks] = useState<string>("");
  const [webExpertise, setWebExpertise] = useState("");
  const [languages, setLanguages] = useState<string>("");
  const [ownedDevices, setOwnedDevices] = useState<string>("");

  // Helper để bật/tắt giá trị chuỗi
  const toggleStringValue = (
    value: string,
    current: string,
    setter: (val: string) => void
  ) => {
    const arr = current ? current.split(", ").filter((v) => v.trim()) : [];
    if (arr.includes(value)) {
      setter(arr.filter((v) => v !== value).join(", "));
    } else {
      setter([...arr, value].join(", "));
    }
  };

  // Lưu dữ liệu
  const handleSaveProfile = async () => {
    const profileData = {
      recruitMethod,
      testerCount,
      devices,
      whitelist,
      gender,
      country,
      zipcode: zip,
      householdIncome: income, // đổi tên biến
      isChildren: isParent, // đổi từ isParent sang isChildren
      employment: employment,
      gamingGenres: gamingGenres,
      browsers: browsers,
      socialNetworks: socialNetworks,
      webExpertise,
      languages: languages,
      ownedDevices: ownedDevices,
      campaign: {
        id: campaignId,
      },
    };

    console.log("🧾 Tester Profile Data:", profileData);

    // 👉 gọi API POST nếu muốn lưu backend
    const res = await callCreateRecruitingCampaign(profileData);
    console.log("Created recruiting profile:", res.data);
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/test-case`
    );
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Tester Recruiting
      </Typography>

      {/* ---------- SECTION 1: Recruit method ---------- */}
      <Card variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography fontWeight={600} mb={2}>
          How do you want to recruit testers?
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              id: "panel",
              title: "BetaTesting Panel",
              desc: "Recruit new testers from our panel of 400,000+ participants.",
            },
            {
              id: "email",
              title: "Invite via Email",
              desc: "Invite anyone via email by adding emails directly or uploading a file.",
            },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Card
                variant="outlined"
                onClick={() => setRecruitMethod(item.id)}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderWidth: recruitMethod === item.id ? 2 : 1,
                  borderColor:
                    recruitMethod === item.id ? "primary.main" : "divider",
                  bgcolor:
                    recruitMethod === item.id ? "action.selected" : "inherit",
                  "&:hover": { borderColor: "primary.light" },
                }}
              >
                <Typography fontWeight={600}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Typography fontWeight={600} mb={1}>
            How many testers would you like to recruit?
          </Typography>
          <TextField
            type="number"
            size="small"
            value={testerCount}
            onChange={(e) => setTesterCount(Number(e.target.value))}
            sx={{ width: 120 }}
          />
        </Box>
      </Card>

      {/* ---------- SECTION 2: Devices ---------- */}
      <Card variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography fontWeight={600} mb={2}>
          Which devices can testers use for your test?
        </Typography>
        <FormGroup>
          {[
            "iPhone",
            "Android",
            "iPad",
            "Android Tablet",
            "Windows",
            "Mac",
            "Linux",
          ].map((device) => (
            <FormControlLabel
              key={device}
              control={
                <Checkbox
                  checked={devices.includes(device)}
                  onChange={() =>
                    toggleStringValue(device, devices, setDevices)
                  }
                />
              }
              label={device}
            />
          ))}
        </FormGroup>

        <Typography variant="body2" color="text.secondary" mt={2}>
          Need an exact # of participants for each platform?{" "}
          <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>
            Show device quotas
          </a>
        </Typography>

        <Box mt={4}>
          <Typography fontWeight={600} mb={1}>
            Do you need to whitelist testers' emails?
          </Typography>
          <RadioGroup
            value={whitelist}
            onChange={(e) => setWhitelist(e.target.value)}
          >
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No, testers can get started immediately"
            />
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label="Yes, we need to collect each tester’s email and manually provide access"
            />
          </RadioGroup>
        </Box>
      </Card>

      {/* ---------- SECTION 3: Audience Profile ---------- */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Audience Profile
        </Typography>

        {/* Gender */}
        <Typography fontWeight={600}>Gender</Typography>
        <RadioGroup
          row
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="MALE" control={<Radio />} label="Male" />
          <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
          <FormControlLabel
            value="OTHER"
            control={<Radio />}
            label="Non-binary"
          />
        </RadioGroup>

        {/* Country & ZIP */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              fullWidth
              size="small"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ZIP / Postal code"
              fullWidth
              size="small"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Income */}
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>Household income</InputLabel>
          <Select
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            label="Household income"
          >
            {[
              "Under $25,000",
              "$25,000 - $50,000",
              "$50,000 - $100,000",
              "Above $100,000",
            ].map((range) => (
              <MenuItem key={range} value={range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Parent */}
        <Typography fontWeight={600}>
          Are you a parent or guardian of a child under 18?
        </Typography>
        <RadioGroup
          row
          value={isParent}
          onChange={(e) => setIsParent(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>

        {/* Employment */}
        <Typography fontWeight={600}>Employment / Industry</Typography>
        <FormGroup row sx={{ mb: 3 }}>
          {[
            "Software Developer",
            "QA Tester",
            "Project Manager",
            "Designer",
            "Researcher",
            "Student",
            "Freelancer",
            "Other",
          ].map((job) => (
            <FormControlLabel
              key={job}
              control={
                <Checkbox
                  checked={employment.includes(job)}
                  onChange={() =>
                    toggleStringValue(job, employment, setEmployment)
                  }
                />
              }
              label={job}
            />
          ))}
        </FormGroup>

        {/* Gaming genres */}
        <Typography fontWeight={600}>Gaming genres</Typography>
        <FormGroup row sx={{ mb: 3 }}>
          {["Arcade", "Casino", "Puzzles", "Simulation", "Ville"].map((g) => (
            <FormControlLabel
              key={g}
              control={
                <Checkbox
                  checked={gamingGenres.includes(g)}
                  onChange={() =>
                    toggleStringValue(g, gamingGenres, setGamingGenres)
                  }
                />
              }
              label={g}
            />
          ))}
        </FormGroup>

        {/* Browsers */}
        <Typography fontWeight={600}>Web browsers</Typography>
        <FormGroup row sx={{ mb: 3 }}>
          {["Chrome", "Firefox", "Safari", "Opera", "Edge"].map((b) => (
            <FormControlLabel
              key={b}
              control={
                <Checkbox
                  checked={browsers.includes(b)}
                  onChange={() => toggleStringValue(b, browsers, setBrowsers)}
                />
              }
              label={b}
            />
          ))}
        </FormGroup>

        {/* Social Networks */}
        <Typography fontWeight={600}>Social networks</Typography>
        <FormGroup row sx={{ mb: 3 }}>
          {["Facebook", "Twitter", "LinkedIn", "Pinterest"].map((s) => (
            <FormControlLabel
              key={s}
              control={
                <Checkbox
                  checked={socialNetworks.includes(s)}
                  onChange={() =>
                    toggleStringValue(s, socialNetworks, setSocialNetworks)
                  }
                />
              }
              label={s}
            />
          ))}
        </FormGroup>

        {/* Web Expertise */}
        <Typography fontWeight={600}>Web expertise</Typography>
        <RadioGroup
          row
          value={webExpertise}
          onChange={(e) => setWebExpertise(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="Beginner"
            control={<Radio />}
            label="Beginner"
          />
          <FormControlLabel
            value="Average"
            control={<Radio />}
            label="Average"
          />
          <FormControlLabel
            value="Advanced"
            control={<Radio />}
            label="Advanced"
          />
        </RadioGroup>

        {/* Languages */}
        <Typography fontWeight={600}>Languages</Typography>
        <FormGroup row sx={{ mb: 3 }}>
          {["English", "Spanish", "French", "German"].map((lang) => (
            <FormControlLabel
              key={lang}
              control={
                <Checkbox
                  checked={languages.includes(lang)}
                  onChange={() =>
                    toggleStringValue(lang, languages, setLanguages)
                  }
                />
              }
              label={lang}
            />
          ))}
        </FormGroup>

        {/* Owned Devices */}
        <Typography variant="h6" fontWeight={600} mt={3}>
          Devices you own
        </Typography>
        <FormGroup sx={{ mb: 3 }}>
          <Typography>Computer</Typography>
          <FormGroup row>
            {["Mac", "Windows"].map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={ownedDevices.includes(d)}
                    onChange={() =>
                      toggleStringValue(d, ownedDevices, setOwnedDevices)
                    }
                  />
                }
                label={d}
              />
            ))}
          </FormGroup>

          <Typography>Smartphone</Typography>
          <FormGroup row>
            {["Android phone", "iPhone", "Windows phone"].map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={ownedDevices.includes(d)}
                    onChange={() =>
                      toggleStringValue(d, ownedDevices, setOwnedDevices)
                    }
                  />
                }
                label={d}
              />
            ))}
          </FormGroup>

          <Typography>Tablet</Typography>
          <FormGroup row>
            {["Android tablet", "iPad", "Windows tablet"].map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={ownedDevices.includes(d)}
                    onChange={() =>
                      toggleStringValue(d, ownedDevices, setOwnedDevices)
                    }
                  />
                }
                label={d}
              />
            ))}
          </FormGroup>

          <Typography>Other</Typography>
          <FormGroup row>
            {[
              "Handheld game console",
              "Home game console",
              "Smart TV",
              "Streaming TV box",
            ].map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={ownedDevices.includes(d)}
                    onChange={() =>
                      toggleStringValue(d, ownedDevices, setOwnedDevices)
                    }
                  />
                }
                label={d}
              />
            ))}
          </FormGroup>
        </FormGroup>

        {/* Buttons */}
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
      </Card>
    </Box>
  );
}
