import * as React from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

type NavItem = {
  label: string;
  path: string;
};

const NAV_ITEMS: NavItem[] = [
  // MAIN LAYOUT
  { label: "Home", path: "/" },
  { label: "Team Members", path: "/team-members" },
  { label: "Projects", path: "/projects" },
  { label: "Tasks", path: "/tasks" },

  // TRONG CAMPAIGN
  { label: "Tester", path: "/campaign/testers" },
  { label: "Surveys", path: "/campaign/surveys" },
  { label: "Bugs", path: "/campaign/bugs" },
  { label: "Test Cases", path: "/campaign/test-cases" },
  { label: "Email", path: "/campaign/email" },
  { label: "Secure Files", path: "/campaign/secure-files" },
];

// Global search trên navbar
export default function Search() {
  const navigate = useNavigate();

  return (
    <Autocomplete
      size="small"
      sx={{
        width: { xs: "100%", md: "30ch" },
        "& .MuiAutocomplete-popupIndicator": { display: "none" },
        "& .MuiAutocomplete-clearIndicator": { display: "none" },
      }}
      options={NAV_ITEMS}
      getOptionLabel={(option) => option.label}
      onChange={(_, value) => {
        if (value) navigate(value.path);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search pages..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "text.primary" }}>
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
