import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Checkbox,
} from "@mui/material";

interface Props {
  audienceProfile?: any; // 👈 thêm prop nhận dữ liệu edit
  setAudienceProfile: (v: any) => void;
}

const AudienceProfileSection: React.FC<Props> = ({
  audienceProfile,
  setAudienceProfile,
}) => {
  // --- local state cho form ---
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [income, setIncome] = useState("");
  const [isParent, setIsParent] = useState("");
  const [employment, setEmployment] = useState("");
  const [gamingGenres, setGamingGenres] = useState("");
  const [browsers, setBrowsers] = useState("");
  const [socialNetworks, setSocialNetworks] = useState("");
  const [webExpertise, setWebExpertise] = useState("");
  const [languages, setLanguages] = useState("");
  const [ownedDevices, setOwnedDevices] = useState("");

  const [isInitialized, setIsInitialized] = useState(false);

  // Prefill data once
  useEffect(() => {
    if (
      audienceProfile &&
      Object.keys(audienceProfile).length > 0 &&
      !isInitialized
    ) {
      setGender(audienceProfile.gender || "");
      setCountry(audienceProfile.country || "");
      setZip(audienceProfile.zipcode || "");
      setIncome(audienceProfile.householdIncome || "");
      setIsParent(audienceProfile.isChildren ? "true" : "false");
      setEmployment(audienceProfile.employment || "");
      setGamingGenres(audienceProfile.gamingGenres || "");
      setBrowsers(audienceProfile.browsers || "");
      setSocialNetworks(audienceProfile.socialNetworks || "");
      setWebExpertise(audienceProfile.webExpertise || "");
      setLanguages(audienceProfile.languages || "");
      setOwnedDevices(audienceProfile.ownedDevices || "");
      setIsInitialized(true); // ✅ chỉ chạy 1 lần
    }
  }, [audienceProfile, isInitialized]);

  // Sync ngược về cha chỉ khi user thay đổi sau khi prefill
  useEffect(() => {
    if (!isInitialized) return; // ✅ chặn vòng lặp
    setAudienceProfile({
      gender,
      country,
      zipcode: zip,
      householdIncome: income,
      isChildren: isParent === "true",
      employment,
      gamingGenres,
      browsers,
      socialNetworks,
      webExpertise,
      languages,
      ownedDevices,
    });
  }, [
    gender,
    country,
    zip,
    income,
    isParent,
    employment,
    gamingGenres,
    browsers,
    socialNetworks,
    webExpertise,
    languages,
    ownedDevices,
    isInitialized,
  ]);

  // --- toggle giá trị string có dạng "a, b, c" ---
  const toggleStringValue = (
    value: string,
    current: string,
    setter: (v: string) => void
  ) => {
    const arr = current ? current.split(", ").filter((v) => v.trim()) : [];
    if (arr.includes(value)) setter(arr.filter((v) => v !== value).join(", "));
    else setter([...arr, value].join(", "));
  };

  // --- đồng bộ dữ liệu ngược về cha ---
  useEffect(() => {
    setAudienceProfile({
      gender,
      country,
      zipcode: zip,
      householdIncome: income,
      isChildren: isParent === "true",
      employment,
      gamingGenres,
      browsers,
      socialNetworks,
      webExpertise,
      languages,
      ownedDevices,
    });
  }, [
    gender,
    country,
    zip,
    income,
    isParent,
    employment,
    gamingGenres,
    browsers,
    socialNetworks,
    webExpertise,
    languages,
    ownedDevices,
  ]);

  return (
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

      {/* Country & Zip */}
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
          label="Household income"
          onChange={(e) => setIncome(e.target.value)}
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
        <FormControlLabel value="true" control={<Radio />} label="Yes" />
        <FormControlLabel value="false" control={<Radio />} label="No" />
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
      <Typography fontWeight={600}>Devices Owned</Typography>
      <FormGroup row>
        {["Mac", "Windows", "Android phone", "iPhone", "iPad"].map((d) => (
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
    </Card>
  );
};

export default AudienceProfileSection;
