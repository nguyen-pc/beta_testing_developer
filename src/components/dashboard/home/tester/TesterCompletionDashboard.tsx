import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Chip,
  Paper,
  Rating,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Tester {
  id: number;
  name: string;
  reward: string;
  bonus: string;
  score: number | null;
  surveys: string;
  bugs: number;
  messages: number;
}

const TesterCompletionDashboard: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const testers: Tester[] = [
    {
      id: 1,
      name: "jasonhuska",
      reward: "$20",
      bonus: "$0",
      score: 4,
      surveys: "2 / 2",
      bugs: 1,
      messages: 0,
    },
    {
      id: 2,
      name: "Roy Y",
      reward: "$20",
      bonus: "$0",
      score: 2,
      surveys: "2 / 2",
      bugs: 0,
      messages: 0,
    },
    {
      id: 3,
      name: "Hailey K",
      reward: "$20",
      bonus: "$0",
      score: 5,
      surveys: "2 / 2",
      bugs: 0,
      messages: 0,
    },
    {
      id: 4,
      name: "Michy B",
      reward: "$0",
      bonus: "$0",
      score: null,
      surveys: "2 / 2",
      bugs: 1,
      messages: 0,
    },
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "reward", headerName: "Reward", flex: 0.8 },
    { field: "bonus", headerName: "Bonus", flex: 0.8 },
    {
      field: "markComplete",
      headerName: "Mark Complete",
      flex: 1.4,
      renderCell: () => (
        <Button
          variant="contained"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            backgroundColor: "#8B5CF6",
            "&:hover": { backgroundColor: "#7C3AED" },
          }}
        >
          Mark Complete
        </Button>
      ),
    },
    {
      field: "score",
      headerName: "Engagement Score",
      flex: 1.2,
      renderCell: (params) =>
        params.value ? (
          <Rating
            value={params.value}
            precision={0.5}
            readOnly
            sx={{ color: "#FBBF24" }}
          />
        ) : (
          "-"
        ),
    },
    { field: "surveys", headerName: "Surveys Completed", flex: 1 },
    { field: "bugs", headerName: "Bugs Submitted", flex: 1 },
    { field: "messages", headerName: "Messages", flex: 1 },
  ];

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Testers
      </Typography>

      {/* Filter Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          flexWrap="wrap"
        >
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            }}
            sx={{ width: { xs: "100%", sm: "200px" } }}
            onChange={(e) => setSearch(e.target.value)}
          />

          {["Tester Status", "Devices", "Tags", "Demographics"].map((label) => (
            <FormControl size="small" key={label} sx={{ minWidth: 140 }}>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="All">{label}</MenuItem>
                <MenuItem value="Option1">Option 1</MenuItem>
                <MenuItem value="Option2">Option 2</MenuItem>
              </Select>
            </FormControl>
          ))}
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Export
          </Button>

          <Box flexGrow={1} />
        </Stack>
        <div className="mt-3">
          <Stack direction="row" spacing={1}>
            <Chip label="Incomplete: 2" />
            <Chip label="Pending Review: 17" />
            <Chip label="Stuck: 1" />
            <Chip color="primary" label="Total: 20" />
          </Stack>
        </div>
      </Paper>

      {/* Table */}
      <Paper>
        <DataGrid
          autoHeight
          rows={testers}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              fontSize: 14,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default TesterCompletionDashboard;
