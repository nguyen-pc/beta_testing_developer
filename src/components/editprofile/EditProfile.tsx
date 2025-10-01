import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Grid,
  Typography,
  FormGroup,
} from "@mui/material";
interface ProfileData {
  birthYear: string;
  gender: string;
  country: string;
  zip: string;
  income: string;
  hasChildren: string;
  employment: string;
  gamingGenres: string[];
  browsers: string[];
  socialNetworks: string[];
  webExpertise: string;
  languages: string[];
  devices: {
    computer: string[];
    smartphone: string[];
    tablet: string[];
    other: string[];
  };
}

const defaultProfileData: ProfileData = {
  birthYear: "",
  gender: "",
  country: "",
  zip: "",
  income: "",
  hasChildren: "",
  employment: "",
  gamingGenres: [],
  browsers: [],
  socialNetworks: [],
  webExpertise: "",
  languages: [],
  devices: { computer: [], smartphone: [], tablet: [], other: [] },
};
interface EditProfileFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
  onCancel: () => void;
}
const gamingGenresOptions = [
  "Arcade",
  "Casino",
  "Puzzles",
  "Simulation",
  "Ville",
];
const browsersOptions = ["Chrome", "Firefox", "Safari", "Opera", "Edge"];
const socialNetworksOptions = ["Facebook", "Twitter", "Linkedin", "Pinterest"];
const languagesOptions = ["English", "Spanish", "French", "German"];
const computers = ["Mac", "Windows"];
const smartphones = ["Android phone", "iPhone", "Windows phone"];
const tablets = ["Android tablet", "iPad", "Windows tablet"];
const others = [
  "Handheld game console",
  "Home game console",
  "Smart TV",
  "Streaming TV box",
];
export default function EditProfileForm({
  initialData,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  const [form, setForm] = useState<ProfileData>(
    initialData || defaultProfileData
  );
  const handleChange = (field: keyof ProfileData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleCheckboxChange = (
    field: keyof ProfileData,
    value: string,
    nested?: keyof ProfileData["devices"]
  ) => {
    if (nested) {
      setForm((prev) => {
        const current = prev.devices[nested];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, devices: { ...prev.devices, [nested]: updated } };
      });
    } else {
      const current = (form[field] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setForm((prev) => ({ ...prev, [field]: updated }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 800, mx: "auto", p: 3 }}
    >
      {" "}
      <Typography variant="h5" gutterBottom>
        {" "}
        Demographics{" "}
      </Typography>{" "}
      {/* Birth year */}{" "}
      <TextField
        label="Birth year"
        type="number"
        value={form.birthYear}
        onChange={(e) => handleChange("birthYear", e.target.value)}
        fullWidth
        margin="normal"
      />{" "}
      {/* Gender */}{" "}
      <FormControl component="fieldset" margin="normal">
        {" "}
        <FormLabel>Gender</FormLabel>{" "}
        <RadioGroup
          row
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          {" "}
          <FormControlLabel
            value="Male"
            control={<Radio />}
            label="Male"
          />{" "}
          <FormControlLabel value="Female" control={<Radio />} label="Female" />{" "}
          <FormControlLabel
            value="Non-binary"
            control={<Radio />}
            label="Non-binary"
          />{" "}
        </RadioGroup>{" "}
      </FormControl>{" "}
      {/* Country + Zip */}{" "}
      <Grid container spacing={2}>
        {" "}
        <Grid item xs={6}>
          {" "}
          <TextField
            label="Country"
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            fullWidth
            margin="normal"
          />{" "}
        </Grid>{" "}
        <Grid item xs={6}>
          {" "}
          <TextField
            label="ZIP / Postal code"
            value={form.zip}
            onChange={(e) => handleChange("zip", e.target.value)}
            fullWidth
            margin="normal"
          />{" "}
        </Grid>{" "}
      </Grid>{" "}
      {/* Income */}{" "}
      <FormControl fullWidth margin="normal">
        {" "}
        <FormLabel>Household income</FormLabel>{" "}
        <Select
          value={form.income}
          onChange={(e) => handleChange("income", e.target.value)}
        >
          {" "}
          <MenuItem value="Less than $19,999">Less than $19,999</MenuItem>{" "}
          <MenuItem value="$20,000 - $49,999">$20,000 - $49,999</MenuItem>{" "}
          <MenuItem value="$50,000 - $99,999">$50,000 - $99,999</MenuItem>{" "}
          <MenuItem value="$100,000+">$100,000+</MenuItem>{" "}
        </Select>{" "}
      </FormControl>{" "}
      {/* Children */}{" "}
      <FormControl component="fieldset" margin="normal">
        {" "}
        <FormLabel>
          Are you a parent or guardian of a child under 18?
        </FormLabel>{" "}
        <RadioGroup
          row
          value={form.hasChildren}
          onChange={(e) => handleChange("hasChildren", e.target.value)}
        >
          {" "}
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />{" "}
          <FormControlLabel value="No" control={<Radio />} label="No" />{" "}
        </RadioGroup>{" "}
      </FormControl>{" "}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {" "}
        Occupation{" "}
      </Typography>{" "}
      <FormControl fullWidth margin="normal">
        {" "}
        <FormLabel>Employment status</FormLabel>{" "}
        <Select
          value={form.employment}
          onChange={(e) => handleChange("employment", e.target.value)}
        >
          {" "}
          <MenuItem value="Full time student">Full time student</MenuItem>{" "}
          <MenuItem value="Employed">Employed</MenuItem>{" "}
          <MenuItem value="Self-employed">Self-employed</MenuItem>{" "}
          <MenuItem value="Unemployed">Unemployed</MenuItem>{" "}
        </Select>{" "}
      </FormControl>{" "}
      {/* Gaming genres */}{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Gaming genres</FormLabel>{" "}
        {gamingGenresOptions.map((genre) => (
          <FormControlLabel
            key={genre}
            control={
              <Checkbox
                checked={form.gamingGenres.includes(genre)}
                onChange={() => handleCheckboxChange("gamingGenres", genre)}
              />
            }
            label={genre}
          />
        ))}{" "}
      </FormGroup>{" "}
      {/* Browsers */}{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Web browsers</FormLabel>{" "}
        {browsersOptions.map((browser) => (
          <FormControlLabel
            key={browser}
            control={
              <Checkbox
                checked={form.browsers.includes(browser)}
                onChange={() => handleCheckboxChange("browsers", browser)}
              />
            }
            label={browser}
          />
        ))}{" "}
      </FormGroup>{" "}
      {/* Social Networks */}{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Social networks</FormLabel>{" "}
        {socialNetworksOptions.map((sn) => (
          <FormControlLabel
            key={sn}
            control={
              <Checkbox
                checked={form.socialNetworks.includes(sn)}
                onChange={() => handleCheckboxChange("socialNetworks", sn)}
              />
            }
            label={sn}
          />
        ))}{" "}
      </FormGroup>{" "}
      {/* Web expertise */}{" "}
      <FormControl component="fieldset" margin="normal">
        {" "}
        <FormLabel>Web expertise</FormLabel>{" "}
        <RadioGroup
          row
          value={form.webExpertise}
          onChange={(e) => handleChange("webExpertise", e.target.value)}
        >
          {" "}
          <FormControlLabel
            value="Beginner"
            control={<Radio />}
            label="Beginner"
          />{" "}
          <FormControlLabel
            value="Average"
            control={<Radio />}
            label="Average"
          />{" "}
          <FormControlLabel
            value="Advanced"
            control={<Radio />}
            label="Advanced"
          />{" "}
        </RadioGroup>{" "}
      </FormControl>{" "}
      {/* Languages */}{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Languages</FormLabel>{" "}
        {languagesOptions.map((lang) => (
          <FormControlLabel
            key={lang}
            control={
              <Checkbox
                checked={form.languages.includes(lang)}
                onChange={() => handleCheckboxChange("languages", lang)}
              />
            }
            label={lang}
          />
        ))}{" "}
      </FormGroup>{" "}
      {/* Devices */}{" "}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Devices you own
      </Typography>{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Computer</FormLabel>{" "}
        {computers.map((c) => (
          <FormControlLabel
            key={c}
            control={
              <Checkbox
                checked={form.devices.computer.includes(c)}
                onChange={() => handleCheckboxChange("devices", c, "computer")}
              />
            }
            label={c}
          />
        ))}{" "}
      </FormGroup>{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Smartphone</FormLabel>{" "}
        {smartphones.map((s) => (
          <FormControlLabel
            key={s}
            control={
              <Checkbox
                checked={form.devices.smartphone.includes(s)}
                onChange={() =>
                  handleCheckboxChange("devices", s, "smartphone")
                }
              />
            }
            label={s}
          />
        ))}{" "}
      </FormGroup>{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Tablet</FormLabel>{" "}
        {tablets.map((t) => (
          <FormControlLabel
            key={t}
            control={
              <Checkbox
                checked={form.devices.tablet.includes(t)}
                onChange={() => handleCheckboxChange("devices", t, "tablet")}
              />
            }
            label={t}
          />
        ))}{" "}
      </FormGroup>{" "}
      <FormGroup row>
        {" "}
        <FormLabel sx={{ mr: 2 }}>Other</FormLabel>{" "}
        {others.map((o) => (
          <FormControlLabel
            key={o}
            control={
              <Checkbox
                checked={form.devices.other.includes(o)}
                onChange={() => handleCheckboxChange("devices", o, "other")}
              />
            }
            label={o}
          />
        ))}{" "}
      </FormGroup>{" "}
      {/* Buttons */}{" "}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        {" "}
        <Button variant="outlined" onClick={onCancel}>
          {" "}
          Cancel{" "}
        </Button>{" "}
        <Button type="submit" variant="contained" color="primary">
          {" "}
          Save profile{" "}
        </Button>{" "}
      </Box>{" "}
    </Box>
  );
}
