import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  sending: boolean;
  sessionReady: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  sending,
  sessionReady,
}: Props) {
  return (
    <Box sx={{ display: "flex", p: 1.5, borderTop: "1px solid #ddd" }}>
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        placeholder={
          !sessionReady ? "Initializing session..." : sending ? "Thinking..." : "Type your message..."
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sessionReady && onSend()}
        disabled={sending || !sessionReady}
        sx={{ "& fieldset": { borderRadius: "20px" } }}
      />
      <IconButton onClick={onSend} disabled={sending || !sessionReady}>
        {sending ? <CircularProgress size={22} /> : <SendIcon sx={{ color: "#9C27B0" }} />}
      </IconButton>
    </Box>
  );
}
