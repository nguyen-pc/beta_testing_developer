import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
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
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        borderTop: "1px solid #eee",
        bgcolor: "#fafafa",
      }}
    >
      <TextField
        fullWidth
        placeholder="Type your message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={!sessionReady}
        size="small"
        autoFocus
      />
      <IconButton
        color="primary"
        onClick={onSend}
        disabled={!sessionReady || sending}
        sx={{ ml: 1 }}
      >
        {sending ? <CircularProgress size={20} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
}
