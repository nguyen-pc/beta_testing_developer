import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import { useParams } from "react-router-dom";
import {
  callCreateTesterSurvey,
  callGetForm,
  callGetSurvey,
  callSubmitForm,
} from "../../../../config/api";
import ReactQuill from "react-quill";
import { useAppSelector } from "../../../../redux/hooks";

interface Choice {
  choiceId: number;
  choiceText: string;
}

interface Question {
  questionId: number;
  questionName: string;
  questionType: "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "FILE_UPLOAD";
  isRequired: boolean;
  choices: Choice[];
}

interface Survey {
  surveyId: number;
  surveyName: string;
  subTitle: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function SurveyForm() {
  const { campaignId, surveyId } = useParams(); // Lấy ID từ URL
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const user = useAppSelector((state) => state.account.user);

  // 🧩 Gọi API để lấy survey + questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [surveyRes, formRes] = await Promise.all([
          callGetSurvey(campaignId, surveyId),
          callGetForm(campaignId, surveyId),
        ]);
        setSurvey(surveyRes.data);
        setQuestions(formRes.data);
      } catch (err: any) {
        setError(err.message || "Failed to load survey data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surveyId]);

  const handleChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, value]) => {
        if (typeof value === "string" && isNaN(Number(value))) {
          return {
            question: { questionId: Number(questionId) },
            answerText: value,
            choices: [],
          };
        }

        if (!isNaN(Number(value))) {
          return {
            question: { questionId: Number(questionId) },
            answerText: "",
            choices: [{ choiceId: Number(value) }],
          };
        }

        if (Array.isArray(value)) {
          return {
            question: { questionId: Number(questionId) },
            answerText: "",
            choices: value.map((id) => ({ choiceId: id })),
          };
        }

        return {
          question: { questionId: Number(questionId) },
          answerText: "",
          choices: [],
        };
      }),
    };

    console.log("📤 Submit payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await callSubmitForm(campaignId, surveyId, payload);
      console.log("✅ Response submitted successfully:", res.data);
      if (res.data.responseId) {
        const payloadTesterSurvey = {
          completed: true,
          completionDate: new Date().toISOString(),
          userId: user.id, // vì chưa có hệ thống user nên tạm để null
          surveyId: surveyId,
          responseId: res.data.responseId,
        };
        console.log("Response ID:", res.data.responseId);
        console.log("Payload Tester Survey:", payloadTesterSurvey);
        const resCreate = await callCreateTesterSurvey(payloadTesterSurvey);
        console.log("Tester Survey created:", resCreate);
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
    }
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
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      {/* 🧭 Phần thông tin survey */}
      {survey && (
        <>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {survey.surveyName}
            </Typography>
            {survey.subTitle && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {survey.subTitle}
              </Typography>
            )}
          </Box>
          {survey.description && (
            <Box
              sx={{
                color: "text.secondary",
                mb: 4,
              }}
              dangerouslySetInnerHTML={{ __html: survey.description }}
            />
          )}
          <Divider sx={{ mb: 4 }} />
        </>
      )}

      {/* 🔄 Danh sách câu hỏi */}
      {questions.map((q, index) => (
        <Box
          key={q.questionId}
          sx={{
            mb: 4,
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            {index + 1}. {q.questionName}
            {q.isRequired && (
              <Typography component="span" color="error" ml={0.5}>
                *
              </Typography>
            )}
          </Typography>

          {q.questionType === "TEXT" && (
            <TextField
              fullWidth
              label="Your answer"
              variant="outlined"
              size="small"
              onChange={(e) => handleChange(q.questionId, e.target.value)}
            />
          )}

          {q.questionType === "LONG_TEXT" && (
            <Box sx={{ mt: 1, pb: 2 }}>
              <ReactQuill
                theme="snow"
                value={answers[q.questionId] || ""}
                onChange={(value) => handleChange(q.questionId, value)}
                style={{
                  width: "100%",
                  height: "150px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  backgroundColor: "white",
                }}
              />
            </Box>
          )}

          {q.questionType === "MULTIPLE_CHOICE" && (
            <RadioGroup
              onChange={(e) => handleChange(q.questionId, e.target.value)}
            >
              {q.choices.map((choice) => (
                <FormControlLabel
                  key={choice.choiceId}
                  value={choice.choiceId}
                  control={<Radio />}
                  label={choice.choiceText}
                />
              ))}
            </RadioGroup>
          )}

          {q.questionType === "CHECKBOX" && (
            <FormGroup>
              {q.choices.map((choice) => (
                <FormControlLabel
                  key={choice.choiceId}
                  control={
                    <Checkbox
                      onChange={(e) => {
                        const prev = answers[q.questionId] || [];
                        const updated = e.target.checked
                          ? [...prev, choice.choiceId]
                          : prev.filter((v: string) => v !== choice.choiceId);
                        handleChange(q.questionId, updated);
                      }}
                    />
                  }
                  label={choice.choiceText}
                />
              ))}
            </FormGroup>
          )}

          {q.questionType === "FILE_UPLOAD" && (
            <Button
              variant="outlined"
              component="label"
              onChange={(e: any) =>
                handleChange(q.questionId, e.target.files?.[0])
              }
            >
              Upload File
              <input type="file" hidden />
            </Button>
          )}
        </Box>
      ))}

      {/* ✅ Nút submit */}
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
}
