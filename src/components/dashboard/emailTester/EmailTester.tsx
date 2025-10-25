import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // 🧩 đọc file Excel/CSV
import {
  callGetEmailTesterCampaign,
  callUploadEmailTesters,
} from "../../../config/api";
import {
  formatChatTime,
  formatChatTimeEmail,
} from "../../../util/timeFormatter";
import SendEmailDialog from "./SendEmailDialog";

interface EmailTester {
  id: number;
  email: string;
  status: "PENDING" | "SENT" | "FAILED";
  sentAt?: string | null;
  campaignId: number;
  campaignTitle: string;
  createdAt: string;
}

const EmailTesterPage: React.FC = () => {
  const { campaignId } = useParams();
  const [rows, setRows] = useState<EmailTester[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "SENT" | "FAILED"
  >("ALL");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ---------------- Fetch email testers ----------------
  const fetchEmailTesters = async () => {
    if (!campaignId) return;
    try {
      setLoading(true);
      const res = await callGetEmailTesterCampaign(campaignId);
      console.log("📨 Fetched email testers:", res);
      if (res?.data) setRows(res.data);
    } catch (err) {
      console.error("❌ Error fetching email testers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTesters();
  }, [campaignId]);

  // ---------------- Upload file and create email testers ----------------
  const handleUpload = async () => {
    if (!campaignId || !selectedFile) {
      alert("⚠️ Please select a file before uploading!");
      return;
    }

    try {
      setUploading(true);

      // 🧠 Đọc file Excel hoặc CSV
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<{ email: string }>(worksheet);

        if (jsonData.length === 0) {
          alert("⚠️ File trống hoặc không đúng định dạng!");
          setUploading(false);
          return;
        }

        // 🧩 Chuyển danh sách email
        const emails = jsonData
          .map((row) => row.email?.trim().toLowerCase())
          .filter((e) => e);

        if (emails.length === 0) {
          alert("⚠️ Không tìm thấy cột 'email' trong file!");
          setUploading(false);
          return;
        }

        console.log("📬 Emails to create:", emails);

        // 📨 Gọi API tạo từng EmailTester
        for (const email of emails) {
          try {
            const payload = {
              email: email,
            };
            await callUploadEmailTesters(campaignId, payload);
            console.log("✅ Created:", email);
          } catch (error) {
            console.error("❌ Failed for:", email, error);
          }
        }

        alert(`✅ Uploaded ${emails.length} emails successfully!`);
        setSelectedFile(null);
        await fetchEmailTesters();
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      alert("Upload failed. Please check your file format.");
    } finally {
      setUploading(false);
    }
  };

  // ---------------- Filter & Search ----------------
  const filteredRows = rows.filter((row) => {
    const matchesSearch = row.email
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ? true : row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ---------------- Columns ----------------
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.value;
        if (status === "PENDING")
          return (
            <Chip
              icon={<HourglassEmptyIcon />}
              label="Pending"
              color="warning"
            />
          );
        if (status === "SENT")
          return (
            <Chip icon={<CheckCircleIcon />} label="Sent" color="success" />
          );
        if (status === "FAILED")
          return <Chip icon={<ErrorIcon />} label="Failed" color="error" />;
        return status;
      },
    },
    // {
    //   field: "sentAt",
    //   headerName: "Sent At",
    //   flex: 1.5,
    //   valueFormatter: (params) => {
    //     const row = params.row;
    //     return row.sentAt
    //       ? formatChatTime(row.sentAt)
    //       : formatChatTime(row.createdAt);
    //   },
    // },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      renderCell: (params) => formatChatTimeEmail(params.row.createdAt),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Email Testers Management
      </Typography>

      {/* Filter & Upload */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search email..."
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" />,
            }}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "ALL" | "PENDING" | "SENT" | "FAILED"
                )
              }
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="SENT">Sent</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </Select>
          </FormControl>

          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={(e) =>
              setSelectedFile(e.target.files ? e.target.files[0] : null)
            }
            style={{ display: "none" }}
            id="upload-email-file"
          />
          <label htmlFor="upload-email-file">
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              component="span"
            >
              Choose File
            </Button>
          </label>

          {selectedFile && (
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {selectedFile.name}
            </Typography>
          )}

          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Uploading...
              </>
            ) : (
              "Upload & Create"
            )}
          </Button>

          <Button
            variant="contained"
            startIcon={<EmailIcon />}
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Send Invitation
          </Button>
        </Stack>
      </Paper>

      {/* DataGrid */}
      <Paper>
        <DataGrid
          autoHeight
          disableVirtualization
          loading={loading}
          rows={filteredRows}
          columns={columns}
          getRowId={(r) => r.id}
          sx={{ border: 0 }}
        />

        <SendEmailDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          campaignId={campaignId!}
          onSent={fetchEmailTesters}
        />
      </Paper>
    </Box>
  );
};

export default EmailTesterPage;
