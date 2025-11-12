import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import {
  callGetQuestionSurvey,
  callGetResponseByQuestion,
} from "../../../config/api";
import ChartSection from "./ChartSection";
import TextResponseList from "./TextResponseList";
import SentimentSection from "./SentimentSection";
import WordCloudSection from "./WordCloudSection";
import { useNavigate, useParams } from "react-router-dom";

export default function SurveyAnalyticsPage() {
  const { projectId, campaignId, surveyId } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [analysisMap, setAnalysisMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [showAnalysisMap, setShowAnalysisMap] = useState<
    Record<number, boolean>
  >({});
  const navigate = useNavigate();

  // 🧩 1️⃣ Lấy danh sách câu hỏi + phản hồi
  useEffect(() => {
    const fetchSurveyAnalytics = async () => {
      try {
        if (!campaignId || !surveyId) return;
        setLoading(true);

        const questionRes = await callGetQuestionSurvey(campaignId, surveyId);
        const questionList = questionRes.data || [];

        const questionsWithResponses = await Promise.all(
          questionList.map(async (q: any) => {
            const res = await callGetResponseByQuestion(
              q.questionId.toString()
            );
            return { ...q, answers: res.data?.answers || [] };
          })
        );

        setQuestions(questionsWithResponses);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu khảo sát:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyAnalytics();
  }, [campaignId, surveyId]);

  // 🧩 2️⃣ Gọi AI phân tích cho TEXT & LONG_TEXT
  useEffect(() => {
    const analyzeAllTextQuestions = async () => {
      const results: Record<number, any> = {};

      for (const q of questions) {
        const normalizedType =
          q.questionType?.toUpperCase().replace(/[-\s]/g, "_") || "";

        if (
          (normalizedType === "LONG_TEXT" || normalizedType === "TEXT") &&
          q.answers.length > 0
        ) {
          const texts = q.answers.map((a: any) =>
            a.answerText ? a.answerText.replace(/<[^>]+>/g, "") : ""
          );
          try {
            const res = await axios.post("http://localhost:8000/analyze", {
              texts,
            });
            results[q.questionId] = res.data;
          } catch (err) {
            console.error(`❌ Lỗi AI cho câu hỏi ${q.questionId}:`, err);
          }
        }
      }

      setAnalysisMap(results);
    };

    if (questions.length > 0) {
      analyzeAllTextQuestions();
    }
  }, [questions]);

  // 🧩 3️⃣ Toggle ẩn/hiện phân tích AI
  const handleToggleAnalysis = (questionId: number) => {
    setShowAnalysisMap((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // 🧩 4️⃣ Giao diện
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Chưa có dữ liệu câu hỏi nào cho khảo sát này.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid display="flex" justifyContent="space-between" mt={3}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          📊 Phân tích kết quả khảo sát
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate(
              `/dashboard/projects/${projectId}/campaigns/${campaignId}/survey/${surveyId}/results`
            )
          }
        >
          Back to Results
        </Button>
      </Grid>

      {questions.map((q) => {
        const { questionId, questionName, questionType, answers = [] } = q;
        const normalizedType =
          questionType?.toUpperCase().replace(/[-\s]/g, "_") || "";

        // 🧠 Tính dữ liệu biểu đồ
        let chartData: { name: string; value: number }[] = [];
        if (
          normalizedType === "MULTIPLE_CHOICE" ||
          normalizedType === "CHECKBOX" ||
          normalizedType === "RATING"
        ) {
          const counts: Record<string, number> = {};
          answers.forEach((a: any) => {
            const text = a.choiceText || "Không chọn";
            counts[text] = (counts[text] || 0) + 1;
          });
          chartData = Object.entries(counts).map(([name, value]) => ({
            name,
            value,
          }));
        }

        const noChartTypes = ["TEXT", "LONG_TEXT", "FILE_UPLOAD"];
        const showChart = !noChartTypes.includes(normalizedType);

        const analysis = analysisMap[questionId];
        const showAnalysis = showAnalysisMap[questionId];

        return (
          <Card key={questionId} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {questionName}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {showChart ? (
                <ChartSection data={chartData} />
              ) : (
                <>
                  {/* Nút ẩn/hiện phân tích AI */}
                  {(normalizedType === "LONG_TEXT" ||
                    normalizedType === "TEXT") &&
                    analysis && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleToggleAnalysis(questionId)}
                        sx={{ mb: 2 }}
                      >
                        {showAnalysis
                          ? "Ẩn kết quả phân tích"
                          : "Hiện kết quả phân tích AI"}
                      </Button>
                    )}

                  {/* Phân tích AI */}
                  {showAnalysis &&
                    (normalizedType === "LONG_TEXT" ||
                      normalizedType === "TEXT") &&
                    analysis && (
                      <>
                        <SentimentSection
                          summary={analysis.sentiment_summary}
                        />
                        <WordCloudSection
                          keyPhrases={analysis.key_phrases}
                          words={analysis.word_cloud}
                        />
                      </>
                    )}

                  {/* Danh sách phản hồi */}
                  <TextResponseList answers={answers} />
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}
