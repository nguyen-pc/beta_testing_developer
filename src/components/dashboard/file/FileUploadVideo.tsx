import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useParams } from "react-router-dom";
import { callGetVideoFilesByCampaign } from "../../../config/api";

interface VideoFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploaderName?: string;
  uploaderEmail?: string;
  uploadedAt?: string;
}

const FileUploadVideo: React.FC = () => {
  const { campaignId } = useParams();
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!campaignId) return;
        setLoading(true);
        const res = await callGetVideoFilesByCampaign(Number(campaignId));
        setVideos(res.data || []);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [campaignId]);

  const handlePreview = (video: VideoFile) => {
    setCurrentVideo(video);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setCurrentVideo(null);
  };

  // ✅ Dùng đường dẫn thật từ backend
  const getVideoUrl = (fileName: string) =>
    `http://localhost:8081/storage/${campaignId}/${fileName}`;

  const handleDownload = (fileName: string) => {
    window.open(getVideoUrl(fileName), "_blank");
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  return (
    <Box >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
         Uploaded Videos
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Danh sách video được upload trong chiến dịch #{campaignId}
      </Typography>

      {videos.length === 0 ? (
        <Alert severity="info">
          Không có video nào được upload trong chiến dịch này.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Video Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Size (MB)</strong>
                </TableCell>
                <TableCell>
                  <strong>Uploader</strong>
                </TableCell>
                <TableCell>
                  <strong>Uploaded At</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.fileName}</TableCell>
                  <TableCell>{v.fileType}</TableCell>
                  <TableCell>
                    {(v.fileSize / (1024 * 1024)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {v.uploaderName
                      ? `${v.uploaderName} (${v.uploaderEmail || "no email"})`
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {v.uploadedAt
                      ? new Date(v.uploadedAt).toLocaleString("vi-VN")
                      : "--"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem video">
                      <IconButton
                        color="primary"
                        onClick={() => handlePreview(v)}
                      >
                        <PlayCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Tải xuống">
                      <IconButton
                        color="secondary"
                        onClick={() => handleDownload(v.fileName)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 🎥 Dialog preview video */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Xem video: {currentVideo?.fileName}</DialogTitle>
        <Divider />
        <DialogContent sx={{ textAlign: "center" }}>
          {currentVideo && (
            <video
              width="100%"
              height="auto"
              controls
              style={{
                borderRadius: 8,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <source
                src={getVideoUrl(currentVideo.fileName)}
                type={currentVideo.fileType || "video/webm"}
              />
              Trình duyệt của bạn không hỗ trợ xem video này.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FileUploadVideo;
