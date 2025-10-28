import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import * as XLSX from "xlsx";
import { callUploadEmailTesters } from "../../../../config/api";

interface Props {
  recruitMethod: string;
  setRecruitMethod: (val: string) => void;
  testerCount: number;
  setTesterCount: (val: number) => void;
  campaignId?: string;
}

const RecruitMethodSection: React.FC<Props> = ({
  recruitMethod,
  setRecruitMethod,
  testerCount,
  setTesterCount,
  campaignId,
}) => {
  const [emailFile, setEmailFile] = useState<File | null>(null);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🧩 Upload Excel/CSV
  const handleUpload = async () => {
    if (!campaignId || !emailFile) {
      alert("⚠️ Please select a file first!");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<{ email: string }>(worksheet);
        const emails = jsonData
          .map((r) => r.email?.trim().toLowerCase())
          .filter((e) => e);

        if (emails.length === 0) {
          alert("⚠️ File missing valid 'email' column!");
          setUploading(false);
          return;
        }

        // Gọi API upload từng email
        for (const email of emails) {
          try {
            await callUploadEmailTesters(campaignId, { email });
          } catch (err) {
            console.error("❌ Failed:", email, err);
          }
        }

        setEmailList(emails);
        alert(`✅ Uploaded ${emails.length} emails successfully!`);
      } catch (error) {
        console.error("❌ Error reading file:", error);
        alert("Invalid file format. Please check again.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(emailFile);
  };

  return (
    <Card variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Typography fontWeight={600} mb={2}>
        How do you want to recruit testers?
      </Typography>

      {/* Method Select */}
      <Grid container spacing={2}>
        {[
          {
            id: "panel",
            title: "BetaTesting Panel",
            desc: "Recruit from our tester pool.",
          },
          {
            id: "email",
            title: "Invite via Email",
            desc: "Upload or invite testers via email list.",
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
                transition: "0.2s",
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

      {/* Tester count */}
      <Box mt={4}>
        <Typography fontWeight={600} mb={1}>
          How many testers would you like to recruit?
        </Typography>
        <TextField
          type="number"
          size="small"
          value={testerCount}
          onChange={(e) => setTesterCount(Number(e.target.value))}
          sx={{ width: 150 }}
        />
      </Box>

      {/* Upload email */}
      {recruitMethod === "email" && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 2,
            backgroundColor: "background.default",
          }}
        >
          <Typography fontWeight={600} mb={1}>
            Upload list of tester emails
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Choose File
              <input
                type="file"
                accept=".csv,.xlsx"
                hidden
                onChange={(e) =>
                  setEmailFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </Button>

            {emailFile && (
              <Stack direction="row" spacing={1} alignItems="center">
                <DescriptionIcon color="action" />
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {emailFile.name}
                </Typography>
              </Stack>
            )}

            <Button
              variant="outlined"
              onClick={handleUpload}
              disabled={!emailFile || uploading}
              sx={{ textTransform: "none" }}
            >
              {uploading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} /> Uploading...
                </>
              ) : (
                "Upload Emails"
              )}
            </Button>
          </Stack>

          {/* Preview */}
          {emailList.length > 0 && (
            <Box mt={3}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Preview ({emailList.length} emails)
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  maxHeight: 180,
                  overflowY: "auto",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <List dense>
                  {emailList.slice(0, 10).map((email, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <EmailFileIcon />
                      </ListItemIcon>
                      <ListItemText primary={email} />
                    </ListItem>
                  ))}
                </List>
                {emailList.length > 10 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    ...and {emailList.length - 10} more
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </Paper>
      )}
    </Card>
  );
};

const EmailFileIcon = () => (
  <UploadFileIcon fontSize="small" color="disabled" />
);

export default RecruitMethodSection;
