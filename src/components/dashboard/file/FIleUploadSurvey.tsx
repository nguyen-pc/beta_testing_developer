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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "react-router-dom";
import { callGetSurveysByCampaign, callGetFileSurvey } from "../../../config/api";

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

const FileUploadSurvey = () => {
  const { campaignId } = useParams();
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [fileMap, setFileMap] = useState<Record<number, FileItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveysAndFiles = async () => {
      try {
        if (!campaignId) return;
        setLoading(true);

        // 🧩 1. Lấy danh sách survey
        const surveyRes = await callGetSurveysByCampaign(campaignId);
        const surveyList = surveyRes?.data || [];
        setSurveys(surveyList);

        // 🧩 2. Lấy file cho từng survey song song
        const filePromises = surveyList.map(async (survey: SurveyItem) => {
          try {
            const fileRes = await callGetFileSurvey(survey.surveyId);
            const files = fileRes?.data || [];
            return { surveyId: survey.surveyId, files };
          } catch (err) {
            console.error(
              "Error fetching files for survey",
              survey.surveyId,
              err
            );
            return { surveyId: survey.surveyId, files: [] };
          }
        });

        const allResults = await Promise.all(filePromises);
        const map: Record<number, FileItem[]> = {};
        allResults.forEach((r) => (map[r.surveyId] = r.files));
        setFileMap(map);
      } catch (err: any) {
        setError(err.message || "Failed to load surveys or files");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveysAndFiles();
  }, [campaignId]);

  const handleDownload = (fileName: string) => {
    // ✅ Tùy backend: có thể là /api/v1/files/download/{fileName}
    const downloadUrl = `/uploads/${fileName}`;
    window.open(downloadUrl, "_blank");
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
        // textAlign="center"
      >
        📁 Uploaded Files by Survey
      </Typography>

      {surveys.length === 0 && (
        <Alert severity="info">
          Không có khảo sát nào trong chiến dịch này.
        </Alert>
      )}

      {surveys.map((survey) => (
        <Accordion key={survey.surveyId} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="600">
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
    </Box>
  );
};

export default FileUploadSurvey;
