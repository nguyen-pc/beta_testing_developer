import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import queryString from "query-string";
import { useParams, useNavigate } from "react-router-dom";
import { callGetBugReports } from "../../../config/api";
import ExportBugExcel from "./ExportBugExcel";

export default function IssueGridView() {
  // ---------------- State ----------------
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    severity: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { projectId, campaignId } = useParams();
  const navigate = useNavigate();

  // ---------------- Build query ----------------
  const buildQuery = (
    page = 0,
    size = 15,
    status?: string,
    priority?: string,
    severity?: string,
    campaignId?: number
  ) => {
    const queryObj: any = { page, size };
    if (status) queryObj.status = status;
    if (priority) queryObj.priority = priority;
    if (severity) queryObj.severity = severity;
    if (campaignId) queryObj.campaignId = campaignId;
    return queryString.stringify(queryObj);
  };

  // ---------------- API Wrapper ----------------
  const callFetchBugReports = async ({
    page = 0,
    size = 15,
    status,
    priority,
    severity,
    campaignId,
  }: {
    page?: number;
    size?: number;
    status?: string;
    priority?: string;
    severity?: string;
    campaignId?: number;
  }) => {
    const query = buildQuery(
      page,
      size,
      status,
      priority,
      severity,
      campaignId
    );
    const res = await callGetBugReports(query);
    console.log("Fetched bug reports:", res.data);
    return res.data.result;
  };

  // ---------------- Handlers ----------------
  const handleChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () =>
    setFilters({ status: "", priority: "", severity: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await callFetchBugReports({
        status: filters.status,
        priority: filters.priority,
        severity: filters.severity,
        campaignId: campaignId ? Number(campaignId) : undefined,
      });
      setData(result);
    } catch (err) {
      console.error("Error fetching bug reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // ---------------- Navigation ----------------
  const handleView = (bugId: number) => {
    navigate(`/dashboard/projects/${projectId}/campaigns/${campaignId}/issues/${bugId}`);
  };

  // ---------------- UI ----------------
  return (
    <Box p={3}>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Issues</Typography>
        <ExportBugExcel bugs={data} campaignId={campaignId} />
      </Box>
      {/* Filter Bar */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="LOW">LOW</MenuItem>
            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
            <MenuItem value="HIGH">HIGH</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={filters.severity}
            label="Severity"
            onChange={(e) => handleChange("severity", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="MINOR">MINOR</MenuItem>
            <MenuItem value="MAJOR">MAJOR</MenuItem>
            <MenuItem value="CRITICAL">CRITICAL</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            <MenuItem value="COMPLETE">COMPLETE</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Stack>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>ID</TableCell>
                <TableCell sx={{ width: 250 }}>Title</TableCell>
                <TableCell sx={{ width: 100 }}>Priority</TableCell>
                <TableCell sx={{ width: 100 }}>Severity</TableCell>
                <TableCell sx={{ width: 120 }}>Status</TableCell>
                <TableCell sx={{ width: 150 }}>Tester</TableCell>
                <TableCell sx={{ width: 150 }}>Assignee</TableCell>
                <TableCell sx={{ width: 80 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography align="center" color="text.secondary">
                      No bug reports found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell>{b.id}</TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.title}
                    </TableCell>
                    <TableCell>{b.priority}</TableCell>
                    <TableCell>{b.severity}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell>{b.testerUserName}</TableCell>
                    <TableCell>{b.assigneeName}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleView(b.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
