import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getUserSessions, getChatHistory } from "../../config/api";
import { normalizeHistoryToMessages } from "./chatUtils";

interface ChatSessionDialogProps {
  userId: number;
  open: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string, messages: any[]) => void;
}

export default function ChatSessionDialog({
  userId,
  open,
  onClose,
  onSelectSession,
}: ChatSessionDialogProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await getUserSessions(userId);
      const data = res?.data?.data ?? res?.data ?? [];
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (s: any) => {
    try {
      const res = await getChatHistory(s.sessionUuid, userId);
      const data = res?.data?.data ?? [];
      const msgs = normalizeHistoryToMessages(data);
      onSelectSession(s.sessionUuid, msgs);
      onClose();
    } catch (err) {
      console.error("Load history failed:", err);
    }
  };

  useEffect(() => {
    if (open) fetchSessions();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>💬 Your Previous Sessions</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />
        ) : sessions.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "gray", my: 2 }}>
            No sessions found
          </Typography>
        ) : (
          <List>
            {sessions.map((s, i) => (
              <ListItemButton key={i} onClick={() => handleSelect(s)}>
                <ListItemText
                  primary={s.topic || `Chat ${i + 1}`}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(s.createdAt).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: "90%" }}
                      >
                        {s.lastMessage || "(No message yet)"}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
