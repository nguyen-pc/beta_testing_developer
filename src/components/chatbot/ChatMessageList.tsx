import React, { useState } from "react";
import { Box, Avatar, Typography, Paper, Button, Stack } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "./chatUtils";
import UseCaseReviewDialog from "./UseCaseReviewDialog";
import ScenarioReviewDialog from "./ScenarioReviewDialog";
import TestcaseReviewDialog from "./TestcaseReviewDialog";

interface Props {
  messages: Message[];
  onOptionClick: (option: string) => void;
  typing: boolean;
  campaignId?: string | null;
  useCaseId?: string | null;
  testScenarioId?: string | null;
}

export default function ChatMessageList({
  messages,
  typing,
  campaignId,
  useCaseId,
  testScenarioId,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJson, setSelectedJson] = useState("");
  const [reviewType, setReviewType] = useState<
    "usecase" | "scenario" | "testcase" | null
  >(null);

  const handleOpenReview = (
    jsonText: string,
    type: "usecase" | "scenario" | "testcase"
  ) => {
    console.log(`📝 Opening review dialog (${type}):`, jsonText);
    setSelectedJson(jsonText);
    setReviewType(type);
    setOpenDialog(true);
  };

  const renderBotMessage = (text: string) => {
    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F]+/g, "")
      .trim();

    try {
      const json = JSON.parse(cleanText);
      if (Array.isArray(json) && json.length > 0) {
        // 🧠 Nhận diện loại
        const isTestcase =
          json[0]?.steps !== undefined || json[0]?.expectedResult !== undefined;
        const isScenario = json[0]?.precondition !== undefined;
        const isUseCase =
          json[0]?.name !== undefined || json[0]?.description !== undefined;

        const title = isTestcase
          ? "Test Cases"
          : isScenario
          ? "Test Scenarios"
          : "Use Cases";

        const shortList = json.slice(0, 3);

        return (
          <Box>
            <Typography fontWeight={600} mb={1}>
              Generated {title} ({json.length})
            </Typography>

            <Stack spacing={1}>
              {shortList.map((item, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 1.2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {item.title ||
                      item.name ||
                      `Untitled ${title.slice(0, -1)} #${i + 1}`}
                  </Typography>

                  {item.description && (
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  )}

                  {/* 👇 TH Scenario */}
                  {isScenario && item.precondition && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", mt: 0.5 }}
                    >
                      Precondition: {item.precondition}
                    </Typography>
                  )}

                  {/* 👇 TH Testcase */}
                  {isTestcase && (
                    <>
                      {item.preCondition && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          Precondition: {item.preCondition}
                        </Typography>
                      )}
                      {item.steps && (
                        <Typography variant="body2" color="text.secondary">
                          Steps: {item.steps}
                        </Typography>
                      )}
                      {item.expectedResult && (
                        <Typography variant="body2" color="text.secondary">
                          Expected: {item.expectedResult}
                        </Typography>
                      )}
                    </>
                  )}
                </Paper>
              ))}

              {json.length > 3 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  +{json.length - 3} more {title.toLowerCase()} hidden
                </Typography>
              )}

              <Button
                onClick={() =>
                  handleOpenReview(
                    cleanText,
                    isTestcase
                      ? "testcase"
                      : isScenario
                      ? "scenario"
                      : "usecase"
                  )
                }
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              >
                📝 Review & Edit Before Create
              </Button>
            </Stack>
          </Box>
        );
      }
    } catch (err) {
      console.warn("⚠️ Invalid JSON from bot:", err);
    }

    // Nếu không phải JSON → render markdown
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
  };

  return (
    <>
      {/* 💬 Message List */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#fafafa" }}>
        {messages.map((m, i) => {
          const isUser = m.from === "user";
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              {!isUser && (
                <Avatar
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                  sx={{ width: 28, height: 28, mr: 1 }}
                />
              )}
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: "80%",
                  bgcolor: isUser ? "#e1bee7" : "white",
                  borderRadius: 2,
                  borderTopLeftRadius: isUser ? 2 : 0,
                  borderTopRightRadius: isUser ? 0 : 2,
                  wordBreak: "break-word",
                }}
              >
                {isUser ? (
                  <Typography variant="body2">{m.text}</Typography>
                ) : (
                  renderBotMessage(m.text)
                )}
              </Paper>
            </Box>
          );
        })}
      </Box>

      {/* ✨ Typing effect */}
      {typing && (
        <Box sx={{ display: "flex", alignItems: "center", ml: 1, mt: 1 }}>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            sx={{ width: 28, height: 28, mr: 1 }}
          />
          <Paper
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "#f3f3f3",
              fontStyle: "italic",
            }}
          >
            typing...
          </Paper>
        </Box>
      )}

      {/* 🧩 Review Dialogs */}
      {reviewType === "usecase" && (
        <UseCaseReviewDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          rawJson={selectedJson}
          campaignId={Number(campaignId)}
        />
      )}

      {reviewType === "scenario" && (
        <ScenarioReviewDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          rawJson={selectedJson}
          useCaseId={Number(useCaseId)}
        />
      )}

      {reviewType === "testcase" && (
        <TestcaseReviewDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          rawJson={selectedJson}
          testScenarioId={Number(testScenarioId)}
        />
      )}
    </>
  );
}
