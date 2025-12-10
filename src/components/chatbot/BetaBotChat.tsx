import React, { useState, useEffect } from "react";
import { IconButton, Zoom, Fade, Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useAppSelector } from "../../redux/hooks";
import {
  sendChatMessage,
  startChatSession,
  getChatHistory,
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
import { useNavigate, useParams } from "react-router-dom";

const FORCE_NEW_ON_LOAD = false;

interface BetaBotChatProps {
  onBotGenerateEntity?: (mode: string, data: any[]) => void;
}

export default function BetaBotChat({ onBotGenerateEntity }: BetaBotChatProps) {
  const user = useAppSelector((s) => s.account.user);
  const [open, setOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [messages, setMessages] = useState(defaultWelcome);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [defaultMode, setDefaultMode] = useState("general");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [useCaseId, setUseCaseId] = useState<string | null>(null);
  const [testScenarioId, setTestScenarioId] = useState<string | null>(null);

  //  Tạo session mới
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

  useEffect(() => {
    const path = window.location.pathname;
     // Bắt projectId trong URL
    const projectMatch = path.match(/projects\/(\d+)/);
    if (projectMatch) setProjectId(projectMatch[1]);
    console.log("Detected projectId from URL:", projectMatch?.[1]);

    // Bắt campaignId trong URL
    const campaignMatch = path.match(/campaigns\/(\d+)/);
    if (campaignMatch) setCampaignId(campaignMatch[1]);
    console.log("Detected campaignId from URL:", campaignMatch?.[1]);

    // // Bắt useCaseId trong URL
    // const useCaseMatch = path.match(/usecase\/(\d+)/);
    // if (useCaseMatch) setUseCaseId(useCaseMatch[1]);

    // // Bắt testScenarioId trong URL
    // const testScenarioMatch = path.match(/test-scenario\/(\d+)/);
    // if (testScenarioMatch) setTestScenarioId(testScenarioMatch[1]);
  }, [window.location.pathname]);
  //  Load session cũ hoặc tạo mới
  useEffect(() => {
    const init = async () => {
      if (!user?.id) return;
      if (FORCE_NEW_ON_LOAD) return await createNewSession();

      let sid = readSession(user.id);
      if (sid) {
        try {
          const res = await getChatHistory(sid, user.id);
          const data = res?.data?.data ?? res?.data ?? [];
          if (Array.isArray(data) && data.length > 0) {
            setMessages(normalizeHistoryToMessages(data));
          }
          setSessionId(sid);
        } catch {
          await createNewSession();
        }
      } else {
        await createNewSession();
      }
    };
    void init();
  }, [user?.id]);

  // Nghe event mở chatbot từ các trang
  useEffect(() => {
    const handleOpen = (e: any) => {
      setOpen(true);
      const { mode, campaignId, useCaseId, testScenarioId } = e.detail || {};
      console.log(
        " Opening BetaBot with mode:",
        mode,
        "campaignId:",
        campaignId,
        "useCaseId:",
        useCaseId,
        "testScenarioId:",
        testScenarioId
      );
      if (mode?.startsWith("@")) setInput(mode + " ");
      if (campaignId) setCampaignId(campaignId);
      if (useCaseId) setUseCaseId(useCaseId);
      if (testScenarioId) setTestScenarioId(testScenarioId);
    };
    window.addEventListener("open-betabot", handleOpen);
    return () => window.removeEventListener("open-betabot", handleOpen);
  }, []);

  //  Xác định mode từ cú pháp
  const detectMode = (msg: string): string => {
    if (msg.startsWith("@usecase")) return "usecase";
    if (msg.startsWith("@testcase")) return "testcase";
    if (msg.startsWith("@testscenario")) return "testscenario";
    if (msg.startsWith("@survey")) return "survey";
    return defaultMode;
  };

  //  Gửi tin nhắn đến chatbot
  const handleSend = async (text?: any) => {
    const msg = (typeof text === "string" ? text : input).trim();
    if (!msg || !sessionId) return;
    const mode = detectMode(msg);

    setMessages((p) => [...p, { from: "user", text: msg }]);
    setInput("");
    setSending(true);
    setTyping(true);

    try {
      const { data } = await sendChatMessage({
        sessionId,
        message: msg,
        userId: user?.id,
        mode,
        campaignId: campaignId || undefined,
      });
      const reply = data?.result?.reply ?? data?.reply ?? data?.response ?? "…";

      //  Nếu bot trả JSON hợp lệ → callback
      try {
        const parsed = JSON.parse(reply);
        if (Array.isArray(parsed) && parsed[0]) {
          onBotGenerateEntity?.(mode, parsed);
        }
      } catch {}

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
          text: " Sorry, I’m having trouble connecting to AI service.",
        },
      ]);
      setTyping(false);
    } finally {
      setSending(false);
    }
  };

  const handleSelectSession = async (sessionUuid: string, msgs: any[]) => {
    setSessionId(sessionUuid);
    setMessages(msgs);
  };

  return (
    <>
      {/*  Floating bubble */}
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

      {/*  Main Chat UI */}
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
            campaignId={campaignId}
            useCaseId={useCaseId}
            testScenarioId={testScenarioId}
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

      {/*  Session List Dialog */}
      <ChatSessionDialog
        userId={user?.id}
        open={sessionDialogOpen}
        onClose={() => setSessionDialogOpen(false)}
        onSelectSession={handleSelectSession}
      />
    </>
  );
}
