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
import { callUploadSingleFile } from "../../config/api";

interface BannerUploadFieldProps {
  folder?: string;
  value?: string | null; // lưu fileName trả về từ backend
  onChange: (fileName: string | null) => void;
}

export default function BannerUploadField({
  folder = "project-banners",
  value,
  onChange,
}: BannerUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(
    value ? `http://localhost:8081/storage/${folder}/${value}` : null
  );
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        const res = await callUploadSingleFile(file, folder);
        const fileName = res?.data?.fileName;
        if (fileName) {
          onChange(fileName);
          setPreview(`http://localhost:8081/storage/${folder}/${fileName}`);
        }
      } catch (error) {
        console.error("❌ Upload failed:", error);
        alert("Upload file thất bại. Vui lòng thử lại!");
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
    setPreview(null);
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
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": { borderColor: "#1976d2", backgroundColor: "#f8faff" },
      }}
    >
      {uploading ? (
        <CircularProgress />
      ) : preview ? (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <img
            src={preview}
            alt="Banner preview"
            style={{
              width: "100%",
              maxHeight: 200,
              borderRadius: 12,
              objectFit: "cover",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
          <IconButton
            size="small"
            color="error"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography fontWeight={600}>Kéo & thả ảnh vào đây</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            hoặc chọn ảnh từ thiết bị của bạn (PNG, JPG, ≤ 5MB)
          </Typography>
          <Button variant="contained" component="label">
            Chọn ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
        </Box>
      )}
    </Box>
  );
}
