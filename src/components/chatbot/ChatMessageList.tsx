import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "./chatUtils";

interface Props {
  messages: Message[];
  onOptionClick: (option: string) => void;
  typing: boolean;
}

export default function ChatMessageList({
  messages,
  onOptionClick,
  typing,
}: Props) {
  return (
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
            <Box
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: "20px",
                bgcolor: isUser ? "#9C27B0" : "#e0e0e0",
                color: isUser ? "white" : "black",
                maxWidth: "75%",
                wordBreak: "break-word",
                "& code": {
                  fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                  background: isUser ? "rgba(255,255,255,0.15)" : "#f1f1f1",
                  borderRadius: "6px",
                  padding: "0 4px",
                },
              }}
            >
              {isUser ? (
                <Typography variant="body2">{m.text}</Typography>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.text}
                </ReactMarkdown>
              )}

              {m.options && (
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {m.options.map((opt, j) => {
                    // ép kiểu an toàn
                    const label =
                      typeof opt === "string"
                        ? opt
                        : opt?.label || JSON.stringify(opt);
                    return (
                      <Chip
                        key={j}
                        label={label}
                        size="small"
                        onClick={() => onOptionClick(label)}
                        sx={{
                          bgcolor: "white",
                          color: "#9C27B0",
                          border: "1px solid #9C27B0",
                          "&:hover": { bgcolor: "#f3e5f5" },
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}

      {typing && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            sx={{ width: 24, height: 24 }}
          />
          <Typography sx={{ fontSize: 14, color: "gray" }}>
            BetaBot is typing •••
          </Typography>
        </Box>
      )}
    </Box>
  );
}
