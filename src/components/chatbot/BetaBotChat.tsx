import React, { useState, useEffect } from "react";
import { IconButton, Zoom, Fade, Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useAppSelector } from "../../redux/hooks";
import {
  sendChatMessage,
  startChatSession,
  getChatHistory,
  getUserSessions,
} from "../../config/api";

import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ChatSessionDialog from "./ChatSessionDialog";
import {
  defaultWelcome,
  normalizeHistoryToMessages,
  readSession,
  writeSession,
  removeSession,
} from "./chatUtils";

const FORCE_NEW_ON_LOAD = false; // ✅ có thể đổi sang true nếu muốn mỗi lần load tạo session mới

export default function BetaBotChat() {
  const user = useAppSelector((s) => s.account.user);

  const [open, setOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);

  const [messages, setMessages] = useState(defaultWelcome);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // ✅ Tạo session mới
  const createNewSession = async () => {
    if (!user?.id) return;
    setMessages(defaultWelcome);
    setSessionId("");
    try {
      const res = await startChatSession(user.id, "New Chat");
      const sid =
        res?.data?.result?.sessionUuid ||
        res?.data?.sessionUuid ||
        res?.sessionUuid;
      if (sid) {
        writeSession(sid, user.id);
        setSessionId(sid);
      }
    } catch (err) {
      console.error("Create session failed:", err);
    }
  };

  // ✅ Load session hiện có (nếu có) hoặc tạo mới
  useEffect(() => {
    const init = async () => {
      if (!user?.id) return;

      if (FORCE_NEW_ON_LOAD) {
        await createNewSession();
        return;
      }

      let sid = readSession(user.id);
      if (sid) {
        try {
          const res = await getChatHistory(sid, user.id);
          const data = res?.data?.data ?? res?.data ?? [];
          if (Array.isArray(data) && data.length > 0) {
            const msgs = normalizeHistoryToMessages(data);
            setMessages(msgs);
          }
          setSessionId(sid);
        } catch {
          console.warn("⚠️ Invalid session, creating new...");
          await createNewSession();
        }
      } else {
        await createNewSession();
      }
    };
    void init();
  }, [user?.id]);

  // ✅ Gửi tin nhắn
  const handleSend = async (text?: any) => {
    const msg =
      typeof text === "string" ? text.trim() : String(input ?? "").trim();
    if (!msg || !sessionId) return;

    setMessages((p) => [...p, { from: "user", text: msg }]);
    setInput("");
    setSending(true);
    setTyping(true);

    try {
      const { data } = await sendChatMessage({
        sessionId,
        message: msg,
        userId: user?.id,
      });
      const reply = data?.result?.reply ?? data?.reply ?? data?.response ?? "…";
      setTimeout(() => {
        setMessages((p) => [...p, { from: "bot", text: String(reply) }]);
        setTyping(false);
      }, 400);
    } catch (e: any) {
      const code = e?.response?.status;
      if ([401, 403, 404].includes(code)) {
        removeSession(user?.id);
        await createNewSession();
      }
      setMessages((p) => [
        ...p,
        {
          from: "bot",
          text: "⚠️ Sorry, I’m having trouble connecting to AI service.",
        },
      ]);
      setTyping(false);
    } finally {
      setSending(false);
    }
  };

  // ✅ Khi chọn session từ danh sách
  const handleSelectSession = async (sessionUuid: string, msgs: any[]) => {
    setSessionId(sessionUuid);
    setMessages(msgs);
  };

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <Zoom in>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              bgcolor: "#9C27B0",
              color: "white",
              width: 60,
              height: 60,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "#8e24aa" },
            }}
          >
            <ChatIcon fontSize="large" />
          </IconButton>
        </Zoom>
      )}

      {/* Main chat UI */}
      <Fade in={open}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 360,
            height: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
          }}
        >
          <ChatHeader
            onNewChat={createNewSession}
            onClose={() => setOpen(false)}
            onOpenSessionList={() => setSessionDialogOpen(true)}
          />

          <ChatMessageList
            messages={messages}
            typing={typing}
            onOptionClick={handleSend}
          />

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            sending={sending}
            sessionReady={!!sessionId}
          />
        </Paper>
      </Fade>

      {/* 📂 Session List Dialog */}
      <ChatSessionDialog
        userId={user?.id}
        open={sessionDialogOpen}
        onClose={() => setSessionDialogOpen(false)}
        onSelectSession={handleSelectSession}
      />
    </>
  );
}
