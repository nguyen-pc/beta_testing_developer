import React, { useEffect, useState } from "react";
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
  Paper,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import { useParams } from "react-router-dom";
import queryString from "query-string";
import {
  callGetAllTesterRegister,
  callGetStatistics,
  callApproveTester,
  callRejectTester,
} from "../../../../config/api";

// ---------------- Interface ----------------
interface UserProfileDTO {
  userId: number;
  name: string;
  gender: string;
  location: string;
  education: string;
  income: string;
  devices: string;
}

interface TesterCampaignDTO {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  joinDate: string;
  user?: UserProfileDTO | null;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

interface StatisticsDTO {
  accepted: number;
  rejected: number;
  pending: number;
  applied: number;
  invited: number;
}

// ---------------- Component ----------------
const TesterRecruitingResults: React.FC = () => {
  const { campaignId } = useParams();
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING"
  );
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TesterCampaignDTO[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);

  // ---------------- Build query ----------------
  const buildQuery = (page = 0, size = 15, status?: string) => {
    const queryObj: any = { page, size, sort: "joinDate,desc" };
    if (status) queryObj.status = status;
    return queryString.stringify(queryObj);
  };

  // ---------------- Fetch testers & statistics ----------------
  const fetchTesterProfile = async (status?: string) => {
    if (!campaignId) return;
    try {
      setLoading(true);
      const query = buildQuery(0, 15, status);
      const [res, resStatistic] = await Promise.all([
        callGetAllTesterRegister(campaignId, query),
        callGetStatistics(campaignId),
      ]);

      const safeRows: TesterCampaignDTO[] = (res?.data?.result || []).map(
        (t: TesterCampaignDTO) => ({
          ...t,
          user: t.user || {
            userId: 0,
            name: "N/A",
            gender: "N/A",
            location: "N/A",
            education: "N/A",
            income: "N/A",
            devices: "N/A",
          },
        })
      );

      setRows(safeRows);
      setStatistics(resStatistic?.data || null);
      setMeta(res?.data?.meta || null);

      console.log("✅ Tester profiles:", safeRows);
      console.log("📊 Statistics:", resStatistic?.data);
    } catch (error) {
      console.error("❌ Error fetching tester data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Approve / Reject handlers ----------------
  const handleApproveSelected = async () => {
    if (!Array.isArray(selected) || selected.length === 0) {
      alert("⚠️ Please select at least one tester to approve.");
      return;
    }
    try {
      for (const id of selected) {
        console.log("✅ Approving ID:", id);
        await callApproveTester(id.toString());
      }
      alert("✅ Tester(s) approved successfully!");
      await fetchTesterProfile(filter);
    } catch (error) {
      console.error("❌ Error approving tester:", error);
    }
  };

  const handleRejectSelected = async () => {
    if (!Array.isArray(selected) || selected.length === 0) {
      alert("⚠️ Please select at least one tester to reject.");
      return;
    }
    try {
      for (const id of selected) {
        console.log("🚫 Rejecting ID:", id);
        await callRejectTester(id.toString());
      }
      alert("🚫 Tester(s) rejected successfully!");
      await fetchTesterProfile(filter);
    } catch (error) {
      console.error("❌ Error rejecting tester:", error);
    }
  };

  useEffect(() => {
    if (campaignId) fetchTesterProfile(filter);
  }, [campaignId, filter]);

  // ---------------- Columns ----------------
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => params.row?.user?.name ?? "",
    },
    {
      field: "status",
      headerName: "Applicant Status",
      flex: 1,
      renderCell: (params) => params.row?.status ?? "",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      renderCell: (params) => params.row?.user?.gender ?? "",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1.5,
      renderCell: (params) => params.row?.user?.location ?? "",
    },
    {
      field: "education",
      headerName: "Education",
      flex: 1.5,
      renderCell: (params) => params.row?.user?.education ?? "",
    },
    {
      field: "income",
      headerName: "Income",
      flex: 1,
      renderCell: (params) => params.row?.user?.income ?? "",
    },
    {
      field: "devices",
      headerName: "Devices",
      flex: 1,
      renderCell: (params) => params.row?.user?.devices ?? "",
    },
  ];

  // ---------------- Filter by name ----------------
  const filteredRows = (rows || []).filter((t) =>
    t.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Recruiting Result
      </Typography>

      {/* Filter & Statistics */}
      <Paper elevation={1} sx={{ p: 2, my: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search tester name"
            InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Applicant Status</InputLabel>
            <Select
              value={filter}
              label="Applicant Status"
              onChange={(e) =>
                setFilter(e.target.value as "PENDING" | "APPROVED" | "REJECTED")
              }
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Statistics Chips */}
        {statistics && (
          <Stack direction="row" spacing={2} mt={2}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Accepted: ${statistics.accepted}`}
              color="success"
            />
            <Chip
              icon={<CancelIcon />}
              label={`Rejected: ${statistics.rejected}`}
              color="error"
            />
            <Chip
              icon={<HourglassEmptyIcon />}
              label={`Pending: ${statistics.pending}`}
              color="warning"
            />
            <Chip
              icon={<PersonAddIcon />}
              label={`Applied: ${statistics.applied}`}
              variant="outlined"
            />
            <Chip
              icon={<EmailIcon />}
              label={`Invited: ${statistics.invited}`}
              color="info"
            />
            <Chip
              label={`Total: ${
                statistics.accepted +
                statistics.rejected +
                statistics.pending +
                statistics.applied +
                statistics.invited
              }`}
              variant="outlined"
            />
          </Stack>
        )}
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApproveSelected}
          disabled={selected.length === 0}
        >
          Accept to Test
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleRejectSelected}
          disabled={selected.length === 0}
        >
          Reject
        </Button>
        <Typography sx={{ ml: 2, alignSelf: "center" }}>
          {selected.length} tester(s) selected
        </Typography>
        <Box flexGrow={1} />
        <Button variant="outlined">Edit Screening Survey</Button>
        <Button variant="outlined">Export</Button>
      </Stack>

      {/* DataGrid */}
      <Paper>
        <DataGrid
          autoHeight
          disableVirtualization
          rows={filteredRows || []}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          checkboxSelection
          onRowSelectionModelChange={(model: any) => {
            let selectedIds: number[] = [];

            if (Array.isArray(model)) {
              // Trường hợp tick từng dòng hoặc tick header (v6 đã map sẵn)
              selectedIds = model as number[];
            } else if (model && typeof model === "object" && "ids" in model) {
              // Trường hợp object dạng {type, ids: Set()}
              selectedIds = Array.from(model.ids || []);
            }

            //Giữ logic chọn toàn bộ chỉ trong trang hiện tại
            if (
              selectedIds.length === 0 &&
              selected.length !== filteredRows.length
            ) {
              // Nếu trước đó chưa chọn hết mà header checkbox được tick → chọn toàn bộ trong trang
              selectedIds = filteredRows.map((r) => r.id);
            } else if (
              selectedIds.length === 0 &&
              selected.length === filteredRows.length
            ) {
              // Nếu đang chọn hết mà click lại → bỏ chọn toàn bộ
              selectedIds = [];
            }

            console.log("Selected IDs:", selectedIds);
            setSelected(selectedIds);
          }}
        />
      </Paper>
    </Box>
  );
};

export default TesterRecruitingResults;
