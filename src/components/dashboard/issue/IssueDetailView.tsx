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
  Alert,
  Dialog,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  callGetBugReports,
  callGetDetailBugReport,
  uploadRecording,
  callGetAttachmentsByBugId,
  callGetBugReportDevice,
  callGetUsersByProject,
  callUpdateBugReport,
  callCreateNotification,
} from "../../../config/api";
import { useBugChat } from "../../../hooks/websocket/useBugChat";
import { useAppSelector } from "../../../redux/hooks";
import { formatChatTime } from "../../../util/timeFormatter";
import parse from "html-react-parser";
import { a } from "@react-spring/web";

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

interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string | null;
  uploadedAt: string;
}

interface DeviceInfo {
  id: number;
  device: string;
  os: string;
  browser: string;
  createdAt: string;
  bugId: number;
}
const bugStatuses = [
  "TO_DO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETE",
  "DONE",
  "NEEDS_INFORMATION",
  "OUT_OF_SCOPE",
];

export default function IssueDetailView() {
  const { bugId, campaignId, projectId } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user);

  const [issue, setIssue] = useState<Issue | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedIssues, setRelatedIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const { messages, sendMessage, connected } = useBugChat(bugId);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [assignees, setAssignees] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleCreateNotification = async (
    targetUserId: number,
    title: string,
    message: string,
    type: string,
    link?: string
  ) => {
    try {
      const notificationData = {
        userId: targetUserId,
        title,
        message,
        type,
        link,
      };
      await callCreateNotification(notificationData);
      console.log("✅ Notification created:", notificationData);
    } catch (err) {
      console.error("❌ Error creating notification:", err);
    }
  };

  const handleUpdateBugReport = async () => {
    try {
      const data = {
        assigneeId: selectedAssignee,
        status: selectedStatus,
      };

      await callUpdateBugReport(String(bugId), data);
      alert(" Bug report updated successfully!");

      // ✅ Cập nhật local state mà không mất dữ liệu cũ
      setIssue((prev) => ({
        ...prev!,
        assigneeId: selectedAssignee,
        status: selectedStatus,
      }));

      // 🧩 Gửi notification cho người được assign (nếu có)
      if (selectedAssignee) {
        const title = "Bug assignment updated";
        const message = `You have been assigned to bug #${bugId} with status "${selectedStatus}"`;
        const link = `/dashboard/projects/${projectId}/campaigns/${campaignId}/issues/${bugId}`;

        await handleCreateNotification(
          selectedAssignee,
          title,
          message,
          "BUG_ASSIGNMENT",
          link
        );
      }

      alert("Bug report updated successfully!");
    } catch (err) {
      console.error("Error updating bug report:", err);
      alert(" Failed to update bug report!");
    }
  };

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const res = await callGetUsersByProject(Number(projectId));
        setAssignees(res.data || []);
      } catch (err) {
        console.error("Error fetching assignees:", err);
      }
    };
    if (projectId) fetchAssignees();
  }, [projectId]);

  // 🧩 Fetch Issue Detail
  const fetchIssueDetail = async () => {
    setLoading(true);
    try {
      const res = await callGetDetailBugReport(bugId);
      console.log("Issue detail:", res.data);
      setIssue(res.data);
    } catch (err) {
      console.error("Error fetching issue detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Attachments ----------------
  const fetchAttachments = async (bugId: number) => {
    setLoadingFiles(true);
    try {
      const res = await callGetAttachmentsByBugId(bugId);
      const data = res.data.data || res.data;
      setAttachments(data || []);
    } catch (err) {
      console.error("Error fetching attachments:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // ---------------- Fetch Device Info ----------------
  const fetchDeviceInfo = async (bugId: number) => {
    setLoadingDevice(true);
    try {
      const res = await callGetBugReportDevice(String(bugId));
      const data = res.data.data || res.data;
      setDeviceInfo(data || []);
    } catch (err) {
      console.error("Error fetching device info:", err);
    } finally {
      setLoadingDevice(false);
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
    fetchAttachments(bugId);
    fetchDeviceInfo(bugId);
  }, [bugId, campaignId]);

  // 🧩 Gửi tin nhắn text
  const handleSend = async () => {
    if (!newMsg.trim()) return;
    sendMessage(newMsg, user.id, bugId);
    setNewMsg("");
    console.log("Sending message:", issue?.testerId);

    if (user.id) {
      const title = `New message in bug #${bugId}`;
      const message = `${user.name || "Someone"} sent a new message in bug: ${
        issue?.title || ""
      }`;
      const link = `/dashboard/projects/${projectId}/campaigns/${campaignId}/issues/${bugId}`;

      await handleCreateNotification(
        issue?.testerId,
        title,
        message,
        "BUG_CHAT",
        link
      );
    }
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
      <Box
        flex={1.5}
        borderRight="1px solid #ddd"
        p={3}
        display="flex"
        flexDirection="column"
        height="100%"
      >
        {/* HEADER */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{issue.title}</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* SCROLLABLE CONTENT */}
        <Box flex={1} overflow="auto" pr={1} id="chat-scroll-area">
          {/* Expected */}
          <Typography variant="subtitle2" gutterBottom>
            Expected
          </Typography>
          <Typography variant="body2" mb={2}>
            {parse(issue?.expectedResult) || "—"}
          </Typography>

          {/* Actual */}
          <Typography variant="subtitle2" gutterBottom>
            Actual
          </Typography>
          <Typography variant="body2" mb={2}>
            {issue.actualResult || "—"}
          </Typography>

          {/* Description */}
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {parse(issue?.description) || "No description"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* CHAT MESSAGES */}
          <List dense>
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
                      <Avatar>
                        {msg.senderName ? msg.senderName[0] : "?"}
                      </Avatar>
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
        </Box>

        {/*  CHAT INPUT FIXED */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: "white",
            pt: 1.5,
            pb: 1.5,
            borderTop: "1px solid #ddd",
            zIndex: 10,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              p: 1.2,
              borderRadius: 4,
              border: "2px solid #c1c9d0", // ⭐ border nổi
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // ⭐ shadow đẹp
            }}
          >
            <TextField
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Nhập tin nhắn…"
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                  borderRadius: 3,
                  "& fieldset": {
                    border: "1px solid #d0d7de",
                  },
                  "&:hover fieldset": {
                    borderColor: "#9098a0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                    borderWidth: 2,
                  },
                },
              }}
            />

            <input
              type="file"
              hidden
              id="chat-file-input"
              onChange={handleFileUpload}
            />

            <IconButton
              onClick={() =>
                document.getElementById("chat-file-input")?.click()
              }
              sx={{
                borderRadius: 3,
                border: "1px solid #d0d7de",
                bgcolor: "#f8f9fa",
                "&:hover": { bgcolor: "#edf0f2" },
              }}
            >
              <AttachFileIcon />
            </IconButton>

            <IconButton
              onClick={handleSend}
              disabled={!connected}
              sx={{
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* 🧱 RIGHT SIDEBAR */}
      <Box width="26%" p={3} overflow="auto">
        <Typography fontWeight={600} variant="subtitle1" mb={1}>
          Bug Details
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Status
            </Typography>
            <Select
              fullWidth
              size="small"
              value={selectedStatus || issue.status || ""}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {bugStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {/* Assignee select */}
          <Box>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Assignee
            </Typography>
            <Select
              fullWidth
              size="small"
              value={selectedAssignee || issue.assigneeId || ""}
              onChange={(e) => setSelectedAssignee(Number(e.target.value))}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {assignees.map((member) => (
                <MenuItem key={member.userId} value={member.userId}>
                  {member.userName} ({member.role})
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Save button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ mt: 1 }}
            onClick={handleUpdateBugReport}
          >
            Update
          </Button>

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
        {loadingDevice ? (
          <CircularProgress size={24} />
        ) : deviceInfo.length === 0 ? (
          <Alert severity="info" sx={{ mt: 1 }}>
            No device info for this bug.
          </Alert>
        ) : (
          deviceInfo.map((d) => (
            <Box
              key={d.id}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 1.5,
                mb: 1,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="body2">
                <strong>Device:</strong> {d.device}
              </Typography>
              <Typography variant="body2">
                <strong>OS:</strong> {d.os}
              </Typography>
              <Typography variant="body2">
                <strong>Browser:</strong> {d.browser}
              </Typography>
            </Box>
          ))
        )}
        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={600} variant="subtitle1" mb={1}>
          Attachments
        </Typography>
        {loadingFiles ? (
          <CircularProgress size={24} />
        ) : attachments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No attachments
          </Typography>
        ) : (
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {attachments.map((file) => {
              const fileUrl =
                file.fileUrl ||
                `${import.meta.env.VITE_BACKEND_URL}/storage/attachment/${
                  file.fileName
                }`;
              const isImage = file.fileType?.startsWith("image/");
              const isVideo = file.fileType?.startsWith("video/");

              return (
                <Box
                  key={file.id}
                  onClick={() => setPreviewUrl(fileUrl)}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={file.fileName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : isVideo ? (
                    <video
                      src={fileUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ height: "100%", p: 1 }}
                    >
                      <Typography
                        variant="caption"
                        textAlign="center"
                        sx={{ px: 1, wordBreak: "break-word" }}
                      >
                        {file.fileName}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
      {/* Preview Dialog */}
      {previewUrl && (
        <Dialog
          open={!!previewUrl}
          onClose={() => setPreviewUrl(null)}
          fullWidth
          maxWidth="lg"
        >
          <Box sx={{ position: "relative", bgcolor: "#000", p: 2 }}>
            <IconButton
              onClick={() => setPreviewUrl(null)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
                zIndex: 2,
              }}
            >
              <CloseIcon />
            </IconButton>

            {previewUrl.match(/\.(mp4|webm)$/i) ? (
              <video
                controls
                src={previewUrl}
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
