import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import {
  callGetSurveysByCampaign,
  callGetFileSurvey,
} from "../../../config/api";

interface FileItem {
  fileId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploaderName?: string;
  uploaderEmail?: string;
  createdAt?: string;
}

interface SurveyItem {
  surveyId: number;
  surveyName: string;
  description: string;
}

type PreviewKind = "image" | "pdf" | "video" | "audio" | "unknown";

const FileUploadSurvey = () => {
  const { campaignId } = useParams();

  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [fileMap, setFileMap] = useState<Record<number, FileItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Preview state
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    const fetchSurveysAndFiles = async () => {
      try {
        if (!campaignId) return;

        setLoading(true);
        setError(null);

        // 1) Lấy danh sách survey
        const surveyRes = await callGetSurveysByCampaign(campaignId);
        const surveyList: SurveyItem[] = surveyRes?.data || [];
        setSurveys(surveyList);

        // 2) Lấy file cho từng survey song song
        const filePromises = surveyList.map(async (survey: SurveyItem) => {
          try {
            const fileRes = await callGetFileSurvey(survey.surveyId);
            const files: FileItem[] = fileRes?.data || [];
            return { surveyId: survey.surveyId, files };
          } catch (err) {
            console.error(
              "Error fetching files for survey",
              survey.surveyId,
              err
            );
            return { surveyId: survey.surveyId, files: [] as FileItem[] };
          }
        });

        const allResults = await Promise.all(filePromises);

        const map: Record<number, FileItem[]> = {};
        allResults.forEach((r) => (map[r.surveyId] = r.files));
        setFileMap(map);
      } catch (err: any) {
        setError(err?.message || "Failed to load surveys or files");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveysAndFiles();
  }, [campaignId]);

  // ✅ Bạn đang dùng url static /uploads/{fileName} => dùng luôn cho download/preview
  const getFileUrl = (fileName: string) =>
    `http://localhost:8081/storage/11/${fileName}`;

  const getPreviewKind = (f: FileItem): PreviewKind => {
    const name = (f.fileName || "").toLowerCase();
    const type = (f.fileType || "").toLowerCase();
    const ext = name.includes(".") ? name.split(".").pop() : "";
    const key = `${type} ${ext}`;

    if (/(image\/|png|jpg|jpeg|webp|gif)/.test(key)) return "image";
    if (/(application\/pdf|pdf)/.test(key)) return "pdf";
    if (/(video\/|mp4|webm|mov)/.test(key)) return "video";
    if (/(audio\/|mp3|wav|ogg)/.test(key)) return "audio";
    return "unknown";
  };

  const handleDownload = (fileName: string) => {
    const downloadUrl = getFileUrl(fileName);
    window.open(downloadUrl, "_blank");
  };

  const handlePreview = (file: FileItem) => {
    setSelectedFile(file);
    setOpenPreview(true);
  };

  const closePreview = () => {
    setOpenPreview(false);
    setSelectedFile(null);
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
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Uploaded Files by Survey
      </Typography>

      {surveys.length === 0 && (
        <Alert severity="info">
          Không có khảo sát nào trong chiến dịch này.
        </Alert>
      )}

      {surveys.map((survey) => (
        <Accordion key={survey.surveyId} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight={600}>
              {survey.surveyName}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {fileMap[survey.surveyId]?.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>File Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Size (KB)</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Uploader</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {fileMap[survey.surveyId].map((file) => (
                      <TableRow key={file.fileId}>
                        <TableCell>{file.fileName}</TableCell>
                        <TableCell>{file.fileType || "N/A"}</TableCell>
                        <TableCell>
                          {(file.fileSize / 1024).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {file.uploaderName
                            ? `${file.uploaderName} (${
                                file.uploaderEmail || "no email"
                              })`
                            : "Unknown"}
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="Xem file">
                            <IconButton
                              color="info"
                              onClick={() => handlePreview(file)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Download file">
                            <IconButton
                              color="primary"
                              onClick={() => handleDownload(file.fileName)}
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
            ) : (
              <Typography color="text.secondary">
                Không có file nào được upload cho khảo sát này.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* ✅ Dialog Preview */}
      <Dialog open={openPreview} onClose={closePreview} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography fontWeight={700} noWrap>
            Xem trước: {selectedFile?.fileName}
          </Typography>
          <IconButton onClick={closePreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ minHeight: 520 }}>
          {!selectedFile
            ? null
            : (() => {
                const url = getFileUrl(selectedFile.fileName);
                const kind = getPreviewKind(selectedFile);

                if (kind === "image") {
                  return (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box
                        component="img"
                        src={url}
                        alt={selectedFile.fileName}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: 520,
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  );
                }

                if (kind === "pdf") {
                  return (
                    <Box sx={{ width: "100%", height: 520 }}>
                      <iframe
                        src={url}
                        title="PDF Preview"
                        style={{ width: "100%", height: "100%", border: 0 }}
                      />
                    </Box>
                  );
                }

                if (kind === "video") {
                  return (
                    <video controls style={{ width: "100%", maxHeight: 520 }}>
                      <source src={url} />
                      Trình duyệt không hỗ trợ xem video.
                    </video>
                  );
                }

                if (kind === "audio") {
                  return (
                    <audio controls style={{ width: "100%" }}>
                      <source src={url} />
                      Trình duyệt không hỗ trợ nghe audio.
                    </audio>
                  );
                }

                return (
                  <Alert severity="warning">
                    File này chưa hỗ trợ xem trước. Vui lòng tải xuống để xem.
                  </Alert>
                );
              })()}
        </DialogContent>

        <DialogActions>
          {selectedFile && (
            <Button
              variant="contained"
              onClick={() => handleDownload(selectedFile.fileName)}
            >
              Download
            </Button>
          )}
          <Button variant="outlined" onClick={closePreview}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUploadSurvey;
