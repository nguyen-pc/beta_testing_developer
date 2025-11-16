import React, { useState } from "react";
import { Box, Button, Typography, Paper, TextField } from "@mui/material";
import {
  callUploadFileToCloud,
  callUploadRewardEvidence,
} from "../../../../config/api";
import { useParams } from "react-router-dom";

const UploadRewardEvidence = () => {
  const { batchId } = useParams();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");

    try {
      const uploadRes = await callUploadFileToCloud(file);
      const url = uploadRes.data.url;

      await callUploadRewardEvidence(batchId!, {
        fileUrl: url,
        fileName: file.name,
        type: "BANK_STATEMENT",
      });

      alert("Evidence uploaded successfully!");
    } catch (err) {
      alert("Failed to upload file!");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600}>
        Upload Payment Evidence
      </Typography>

      <Paper sx={{ mt: 2, p: 3 }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
          Upload Evidence
        </Button>
      </Paper>
    </Box>
  );
};

export default UploadRewardEvidence;
