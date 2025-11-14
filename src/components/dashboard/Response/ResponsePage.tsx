import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  TableContainer,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { callGetSurveyResults } from "../../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import ExportSurveyResultExcel from "./ExportSurveyResultExcel";

export default function ResponsePage() {
  // const { surveyId } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { projectId, campaignId, surveyId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!surveyId) return;
        const res = await callGetSurveyResults(surveyId);
        console.log("Survey Results:", res);
        if (res.statusCode === 200) {
          setData(res.data);
        } else {
          setError("Failed to load survey results");
        }
      } catch (err: any) {
        console.error(err);
        setError("Error fetching survey data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surveyId]);

  // ✅ Lấy danh sách câu hỏi để render cột
  const questions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const allQuestions = new Map<number, string>();
    data.forEach((tester) => {
      tester.response?.answers.forEach((ans: any) => {
        allQuestions.set(ans.question.questionId, ans.question.questionName);
      });
    });
    return Array.from(allQuestions.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [data]);

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading survey results...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!data || data.length === 0)
    return (
      <>
        <Box textAlign="center">
          <Typography sx={{ mt: 10, mb: 2 }}>
            No survey responses found.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(
                `/dashboard/projects/${projectId}/campaigns/${campaignId}/survey`
              )
            }
          >
            Back to Surveys
          </Button>
        </Box>
      </>
    );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
        <Typography variant="h5" mb={2}>
          Survey Results
        </Typography>

        <Grid>
          <ExportSurveyResultExcel responses={data} surveyId={surveyId} />

          <Button
            sx={{ ml: 2 }}
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(
                `/dashboard/projects/${projectId}/campaigns/${campaignId}/survey/${surveyId}/analysis`
              )
            }
          >
            Analysis Response
          </Button>

        </Grid>
      </Box>

      {/* ✅ Thêm TableContainer với scroll ngang và dọc */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "75vh", // chiều cao tối đa của bảng
          overflowX: "auto", // bật thanh trượt ngang
          overflowY: "auto", // bật thanh trượt dọc
          borderRadius: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Completion Date</b>
              </TableCell>

              {/* ✅ Render cột câu hỏi */}
              {questions.map((q) => (
                <TableCell
                  key={q.id}
                  sx={{ minWidth: 200, fontWeight: "bold" }}
                >
                  {q.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((tester) => (
              <TableRow key={tester.id} hover>
                <TableCell>{tester.username}</TableCell>
                <TableCell>{tester.email}</TableCell>
                <TableCell>
                  <Chip
                    label={tester.completed ? "Completed" : "Pending"}
                    color={tester.completed ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(tester.completionDate).toLocaleString("vi-VN")}
                </TableCell>

                {/* ✅ Cột câu trả lời */}
                {questions.map((q) => {
                  const ans = tester.response?.answers.find(
                    (a: any) => a.question.questionId === q.id
                  );

                  if (!ans)
                    return (
                      <TableCell key={q.id}>
                        <Typography color="text.secondary">—</Typography>
                      </TableCell>
                    );

                  if (
                    ans.question.questionType === "TEXT" ||
                    ans.question.questionType === "LONG_TEXT"
                  ) {
                    return (
                      <TableCell key={q.id}>
                        <Typography
                          variant="body2"
                          dangerouslySetInnerHTML={{
                            __html: ans.answerText || "—",
                          }}
                        />
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={q.id}>
                      {ans.choices?.length > 0 ? (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {ans.choices.map((c: any) => (
                            <Chip
                              key={c.choiceId}
                              label={c.choiceText}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        sx={{mt:3}}
        color="primary"
        onClick={() =>
          navigate(
            `/dashboard/projects/${projectId}/campaigns/${campaignId}/survey`
          )
        }
      >
        Back to Surveys
      </Button>
    </Box>
  );
}
