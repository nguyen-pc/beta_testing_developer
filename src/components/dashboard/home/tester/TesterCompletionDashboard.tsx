import React, { useEffect, useState } from "react";
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
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  callGetTesterStatus,
  callUpdateProgressTester,
} from "../../../../config/api";
import { useParams } from "react-router-dom";

interface Tester {
  id: number; // testerCampaignId
  name: string;
  reward: string;
  bonus: string;
  score: number | null;
  surveys: string;
  bugs: number;
  messages: number | null;
  progress: number;
}

interface ApiResponse {
  testerName: string;
  reward: string;
  bonus: number;
  engagementScore: number;
  userId: number;
  campaignId: number;
  testerCampaignId: number;
  surveysCompleted: string;
  bugsSubmitted: number;
  messages: number | null;
}

const TesterCompletionDashboard: React.FC = () => {
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { campaignId } = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await callGetTesterStatus(campaignId!);
      if (res?.data) {
        const mapped: Tester[] = res.data.map((t: ApiResponse) => ({
          id: t.testerCampaignId,
          name: t.testerName,
          reward: `$${t.reward}`,
          bonus: `$${t.bonus}`,
          score: t.engagementScore ?? null,
          surveys: t.surveysCompleted,
          bugs: t.bugsSubmitted,
          messages: t.messages ?? 0,
          progress: t.progress ?? 0, 
        }));
        setTesters(mapped);
      }
    } catch (error) {
      console.error("❌ Error fetching tester data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  const handleMarkComplete = async (testerCampaignId: number) => {
    try {
      await callUpdateProgressTester(String(testerCampaignId), {
        progress: 100,
      });
      alert("Tester marked as complete!");
      setTesters((prev) =>
        prev.map((t) =>
          t.id === testerCampaignId ? { ...t, progress: 100 } : t
        )
      );
    } catch (error) {
      console.error("❌ Error updating progress:", error);
      alert("❌ Failed to update tester progress!");
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "reward", headerName: "Reward", flex: 0.8 },
    { field: "bonus", headerName: "Bonus", flex: 0.8 },
    {
      field: "progress",
      headerName: "Progress (%)",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={params.value}
            sx={{
              mt: 2,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e5e7eb",
              "& .MuiLinearProgress-bar": {
                backgroundColor: params.value === 100 ? "#16a34a" : "#8B5CF6",
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 0.3, fontSize: 12 }}
          >
            {params.value}%
          </Typography>
        </Box>
      ),
    },
    {
      field: "markComplete",
      headerName: "Mark Complete",
      flex: 1.4,
      renderCell: (params) => {
        const isComplete = params.row.progress === 100;
        return (
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={() => handleMarkComplete(params.row.id)}
            disabled={isComplete}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: isComplete ? "#16a34a" : "#8B5CF6",
              "&:hover": {
                backgroundColor: isComplete ? "#15803d" : "#7C3AED",
              },
            }}
          >
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        );
      },
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
        Tester Progress Dashboard
      </Typography>

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
          <Box flexGrow={1} />
          <Chip color="primary" label={`Total: ${testers.length}`} />
        </Stack>
      </Paper>

      <Paper>
        {loading ? (
          <Box textAlign="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={testers.filter((t) =>
              t.name.toLowerCase().includes(search.toLowerCase())
            )}
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
        )}
      </Paper>
    </Box>
  );
};

export default TesterCompletionDashboard;
