import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  callCreateMessageRejectReason,
  callGetMessageRejectReasons,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";

interface RejectChatDialogProps {
  open: boolean;
  onClose: () => void;
  reason: any; // CampaignRejectReasonDTO
}

export default function RejectChatDialog({
  open,
  onClose,
  reason,
}: RejectChatDialogProps) {
  const user = useAppSelector((state) => state.account.user);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await callGetMessageRejectReasons(reason.id);
      setMessages(res.data || []);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("❌ Lỗi khi tải tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      setSending(true);
      await callCreateMessageRejectReason(reason.id, user?.id, {
        content: newMessage,
      });
      setNewMessage("");
      await loadMessages();
    } catch (err) {
      console.error("❌ Lỗi khi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (open && reason?.id) loadMessages();
  }, [open, reason?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // parse lý do (tránh hiển thị JSON raw)
  const parseReason = (raw: string) => {
    try {
      const obj = JSON.parse(raw);
      return obj.reason || raw;
    } catch {
      return raw;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold" color="primary.main">
        Phản hồi cho lý do từ chối
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: 400,
          overflowY: "auto",
          bgcolor: "#fafbfc",
        }}
      >
        <Box mb={1}>
          <Typography variant="body2" color="text.secondary">
            <b>Lý do:</b> {parseReason(reason.initialReason)}
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              return (
                <Box
                  key={msg.id}
                  display="flex"
                  flexDirection={isMine ? "row-reverse" : "row"}
                  alignItems="flex-end"
                  gap={1}
                >
                  {!isMine && (
                    <Avatar
                      sx={{ width: 28, height: 28, bgcolor: "secondary.main" }}
                    >
                      C
                    </Avatar>
                  )}
                  <Paper
                    sx={{
                      p: 1.2,
                      maxWidth: "75%",
                      bgcolor: isMine ? "primary.main" : "grey.100",
                      color: isMine ? "#fff" : "text.primary",
                      borderRadius: 2,
                      borderTopRightRadius: isMine ? 0 : 2,
                      borderTopLeftRadius: isMine ? 2 : 0,
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {(() => {
                        try {
                          // Parse JSON nếu message bị trả dạng {"content": "..."}
                          const parsed = JSON.parse(msg.content);
                          return parsed.content || msg.content;
                        } catch {
                          return msg.content;
                        }
                      })()}
                    </Typography>

                    <Typography
                      variant="caption"
                      color={
                        isMine ? "rgba(255,255,255,0.8)" : "text.secondary"
                      }
                      sx={{ display: "block", mt: 0.5, fontSize: "0.7rem" }}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </Typography>
                  </Paper>
                  {isMine && (
                    <Avatar
                      sx={{ width: 28, height: 28, bgcolor: "primary.main" }}
                    >
                      A
                    </Avatar>
                  )}
                </Box>
              );
            })}

            {messages.length === 0 && (
              <Typography
                color="text.secondary"
                textAlign="center"
                py={2}
                fontStyle="italic"
              >
                Chưa có phản hồi nào.
              </Typography>
            )}

            <div ref={chatEndRef} />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: "column", alignItems: "stretch" }}>
        <Box display="flex" alignItems="center" gap={1} width="100%">
          <TextField
            placeholder="Nhập phản hồi..."
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Tooltip title="Gửi">
            <IconButton color="primary" onClick={handleSend} disabled={sending}>
              <SendRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
