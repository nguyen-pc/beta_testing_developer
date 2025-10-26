import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Avatar,
  Chip,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  callGetBugReports,
  callGetDetailBugReport,
  uploadRecording,
} from "../../../config/api";
import { useBugChat } from "../../../hooks/websocket/useBugChat";
import { useAppSelector } from "../../../redux/hooks";
import { formatChatTime } from "../../../util/timeFormatter";

interface Issue {
  id: number;
  title: string;
  description: string;
  expectedResult: string;
  actualResult: string;
  priority: string;
  severity: string;
  status: string;
  testerUserName: string;
  assigneeName: string;
  device: string;
  os: string;
  browser: string;
  attachments: string[];
}

export default function IssueDetailView() {
  const { bugId, campaignId, projectId } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user);

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedIssues, setRelatedIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const { messages, sendMessage, connected } = useBugChat(bugId);

  // 🧩 Fetch Issue Detail
  const fetchIssueDetail = async () => {
    setLoading(true);
    try {
      const res = await callGetDetailBugReport(bugId);
      setIssue(res.data);
    } catch (err) {
      console.error("Error fetching issue detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Fetch Related Issues
  const buildQuery = (page = 0, size = 15, campaignId?: number) => {
    const queryObj: any = { page, size };
    if (campaignId) queryObj.campaignId = campaignId;
    return queryString.stringify(queryObj);
  };

  const fetchRelatedIssues = async () => {
    if (!campaignId) return;
    try {
      const query = buildQuery(0, 20, Number(campaignId));
      const res = await callGetBugReports(query);
      const list = res.data?.result || res.data?.data || [];
      setRelatedIssues(list);
    } catch (err) {
      console.error("Error fetching related issues:", err);
    }
  };

  useEffect(() => {
    fetchIssueDetail();
    fetchRelatedIssues();
  }, [bugId, campaignId]);

  // 🧩 Gửi tin nhắn text
  const handleSend = () => {
    if (!newMsg.trim()) return;
    sendMessage(newMsg, user.id, bugId);
    setNewMsg("");
  };

  // 🧩 Upload file và gửi link
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const folderType = campaignId;
      const uploader = user.id;
      const res = await uploadRecording(file, folderType, uploader);

      const fileName = res.data?.fileName;
      if (fileName) {
        const fileUrl = `http://localhost:8081/storage/${folderType}/${fileName}`;
        sendMessage(`${fileUrl}`, user.id, bugId);
      }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("Upload file failed!");
    }
  };

  if (loading) {
    return (
      <Box
        height="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!issue) {
    return (
      <Typography textAlign="center" mt={10} color="text.secondary">
        Issue not found
      </Typography>
    );
  }

  return (
    <Box display="flex" height="calc(100vh - 100px)">
      {/* 🧭 LEFT SIDEBAR */}
      <Box width="22%" borderRight="1px solid #ddd" p={2} overflow="auto">
        <Typography fontWeight={600} variant="subtitle1" mb={1}>
          Related Issues
        </Typography>

        <TextField
          size="small"
          fullWidth
          placeholder="Search"
          variant="outlined"
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {relatedIssues.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No related issues
          </Typography>
        ) : (
          <Stack spacing={1}>
            {relatedIssues
              .filter((bug) =>
                (bug.title ?? "")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((bug) => (
                <Paper
                  key={bug.id}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor:
                      Number(bugId) === bug.id ? "grey.100" : "transparent",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                  onClick={() =>
                    navigate(
                      `/dashboard/projects/${projectId}/campaigns/${campaignId}/issues/${bug.id}`
                    )
                  }
                >
                  <Typography fontSize={13} fontWeight={500}>
                    {bug.title}
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    {bug.status} • {bug.priority}
                  </Typography>
                </Paper>
              ))}
          </Stack>
        )}
      </Box>

      {/* 🧩 MIDDLE CONTENT */}
      <Box flex={1.5} borderRight="1px solid #ddd" p={3} overflow="auto">
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{issue.title}</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Expected
        </Typography>
        <Typography variant="body2" mb={2}>
          {issue.expectedResult || "—"}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Actual
        </Typography>
        <Typography variant="body2" mb={2}>
          {issue.actualResult || "—"}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Attachments
        </Typography>
        <Box mb={2}>
          {issue.attachments?.length ? (
            issue.attachments.map((file, i) => (
              <Chip
                key={i}
                label={file}
                variant="outlined"
                sx={{ mr: 1, mt: 1 }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No attachments
            </Typography>
          )}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {issue.description || "No description"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Internal Notes {connected ? "🟢" : "🔴"}
        </Typography>

        <List
          dense
          id="chat-container"
          sx={{ maxHeight: 400, overflowY: "auto", mb: 1 }}
        >
          {messages.map((msg, i) => {
            const isOwn = msg.senderId === user.id;
            const content = msg.content;

            const isFile = content.startsWith("http");
            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(content);
            const isVideo = /\.(mp4|webm)$/i.test(content);

            return (
              <ListItem
                key={i}
                alignItems="flex-start"
                sx={{
                  justifyContent: isOwn ? "flex-end" : "flex-start",
                  textAlign: isOwn ? "right" : "left",
                }}
              >
                {!isOwn && (
                  <ListItemAvatar>
                    <Avatar>{msg.senderName ? msg.senderName[0] : "?"}</Avatar>
                  </ListItemAvatar>
                )}

                <Paper
                  sx={{
                    p: 1,
                    px: 1.5,
                    maxWidth: "70%",
                    bgcolor: isOwn ? "primary.main" : "grey.100",
                    color: isOwn ? "white" : "text.primary",
                    borderRadius: 2,
                  }}
                >
                  {isFile ? (
                    isImage ? (
                      <img
                        src={content}
                        alt="attachment"
                        style={{ maxWidth: "100%", borderRadius: 6 }}
                      />
                    ) : isVideo ? (
                      <video
                        src={content}
                        controls
                        style={{ maxWidth: "100%", borderRadius: 6 }}
                      />
                    ) : (
                      <a
                        href={content}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit" }}
                      >
                        {content}
                      </a>
                    )
                  ) : (
                    <Typography variant="body2">{content}</Typography>
                  )}

                  <Typography
                    variant="caption"
                    sx={{ display: "block", opacity: 0.7 }}
                  >
                    {msg.createdAt ? formatChatTime(msg.createdAt) : ""}
                  </Typography>
                </Paper>

                {isOwn && (
                  <ListItemAvatar sx={{ ml: 1 }}>
                    <Avatar>{user.name ? user.name[0] : "U"}</Avatar>
                  </ListItemAvatar>
                )}
              </ListItem>
            );
          })}
        </List>

        {/* 💬 Chat input */}
        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <TextField
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Send a message"
            fullWidth
            size="small"
          />

          <input
            type="file"
            id="chat-file-input"
            hidden
            onChange={handleFileUpload}
          />
          <IconButton
            onClick={() => document.getElementById("chat-file-input")?.click()}
          >
            <AttachFileIcon />
          </IconButton>

          <IconButton
            onClick={handleSend}
            color="primary"
            disabled={!connected}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* 🧱 RIGHT SIDEBAR */}
      <Box width="26%" p={3} overflow="auto">
        <Typography fontWeight={600} variant="subtitle1" mb={1}>
          Bug Details
        </Typography>

        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Status:</strong> {issue.status}
          </Typography>
          <Typography variant="body2">
            <strong>Assignee:</strong> {issue.assigneeName || "Unassigned"}
          </Typography>
          <Typography variant="body2">
            <strong>Priority:</strong> {issue.priority}
          </Typography>
          <Typography variant="body2">
            <strong>Severity:</strong> {issue.severity}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={600} variant="subtitle1" mb={1}>
          Device Info
        </Typography>
        <Typography variant="body2">Device: {issue.device}</Typography>
        <Typography variant="body2">OS: {issue.os}</Typography>
        <Typography variant="body2">Browser: {issue.browser}</Typography>
      </Box>
    </Box>
  );
}
