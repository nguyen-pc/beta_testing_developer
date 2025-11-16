import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { callUploadSingleFile } from "../../../../config/api";

interface EvidenceUploadFieldProps {
  folder?: string;
  value?: string | null; // backend trả về fileName hoặc fileUrl
  onChange: (fileName: string | null) => void;
}

export default function EvidenceUploadField({
  folder = "reward-evidences",
  value,
  onChange,
}: EvidenceUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  // Xác định preview: ảnh → hiển thị ảnh, PDF → icon PDF
  const isPDF = value?.toLowerCase().endsWith(".pdf");
  const previewUrl = value
    ? `http://localhost:8081/storage/${folder}/${value}`
    : null;

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);

        const res = await callUploadSingleFile(file, folder);
        const fileName = res?.data?.fileName;

        if (fileName) {
          onChange(fileName);
        }
      } catch (error) {
        console.error("Upload evidence failed:", error);
        alert("Upload thất bại! Vui lòng thử lại.");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed #b0b0b0",
        borderRadius: 4,
        p: 3,
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": { borderColor: "#1976d2", backgroundColor: "#f8faff" },
      }}
    >
      {uploading ? (
        <CircularProgress />
      ) : previewUrl ? (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          {/* Nếu là ảnh → hiển thị preview */}
          {!isPDF ? (
            <img
              src={previewUrl}
              alt="Evidence Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                borderRadius: 12,
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 120,
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <PictureAsPdfIcon sx={{ fontSize: 50, color: "red" }} />
            </Box>
          )}

          <IconButton
            size="small"
            color="error"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "#fff" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography fontWeight={600}>Kéo & thả file vào đây</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Hỗ trợ Upload: PNG, JPG, PDF (≤ 10MB)
          </Typography>

          <Button variant="contained" component="label">
            Chọn file
            <input type="file" hidden accept="image/*,application/pdf" onChange={handleFileSelect} />
          </Button>
        </Box>
      )}
    </Box>
  );
}
