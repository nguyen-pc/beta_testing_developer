import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  IconButton,
  Toolbar,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDefs } from "@mui/x-data-grid";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
interface Tester {
  id: number;
  name: string;
  status: string;
  gender: string;
  location: string;
  education: string;
  income: string;
  device: string;
  property: string;
}
const TesterRecruitingResults: React.FC = () => {
  const [filter, setFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const testers: Tester[] = [
    {
      id: 1,
      name: "Anna S",
      status: "Pending",
      gender: "Female",
      location: "NC - United States",
      education: "Masters degree",
      income: "$80,000",
      device: "iOS",
      property: "Single family home",
    },
    {
      id: 2,
      name: "Jenny Y",
      status: "Pending",
      gender: "Female",
      location: "54739 - United States",
      education: "Associate degree",
      income: "$80,000",
      device: "iOS",
      property: "Single family home",
    },
    {
      id: 3,
      name: "Christine H",
      status: "Pending",
      gender: "Female",
      location: "MT - United States",
      education: "High school graduate",
      income: "$100,000",
      device: "iOS",
      property: "Single family home",
    },
    {
      id: 4,
      name: "Yohanna R",
      status: "Pending",
      gender: "Female",
      location: "49509 - United States",
      education: "High school graduate",
      income: "$60,000",
      device: "iOS",
      property: "Single family home",
    },
  ];
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "status", headerName: "Applicant Status", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "location", headerName: "Location", flex: 1.5 },
    { field: "education", headerName: "Education", flex: 1.5 },
    { field: "income", headerName: "Income", flex: 1 },
    { field: "device", headerName: "Devices", flex: 1 },
    {
      field: "property",
      headerName: "In which type of property do",
      flex: 1.8,
    },
  ];
  return (
    <Box p={3}>
      {/* Title */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Recruiting Result
      </Typography>
      {/* Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, my: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputLabel>Applicant Status</InputLabel>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filter}
              label="Applicant Status"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <div className="mt-2">
          <Stack direction="row" spacing={2}>
            <Chip label="Accepted: 0" /> <Chip label="Rejected: 127" />
            <Chip color="primary" label="Pending: 200" />
            <Chip label="Applied: 327" /> <Chip label="Total: 15228" />
          </Stack>
        </div>
        <Box flexGrow={1} /> {/* Stats summary */}
      </Paper>
      {/* Action Buttons */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary">
          Accept to Test
        </Button>
        <Button variant="outlined" color="error">
          Reject
        </Button>
        <Button variant="outlined">Add Tag</Button>
        <Button variant="outlined">Remove Tag</Button>
        <Typography sx={{ ml: 2, alignSelf: "center" }}>
          {selected.length} testers selected
        </Typography>
        <Box flexGrow={1} />
        <Button variant="outlined">Edit Screening Survey</Button>
        <Button variant="outlined">Export</Button>
      </Stack>
      {/* DataGrid */}
      <Paper>
        <DataGrid
          autoHeight
          rows={testers}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelected(ids as number[])}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              fontWeight: "bold",
            },
          }}
        />
      </Paper>
    </Box>
  );
};
export default TesterRecruitingResults;
