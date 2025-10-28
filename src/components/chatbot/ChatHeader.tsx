import React from "react";
import { Box, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderOpen";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";

interface ChatHeaderProps {
  onNewChat: () => void;
  onClose: () => void;
  onOpenSessionList: () => void;
}

export default function ChatHeader({
  onNewChat,
  onClose,
  onOpenSessionList,
}: ChatHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: "#9C27B0",
        color: "white",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Bot info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          sx={{ width: 36, height: 36, bgcolor: "white" }}
        />
        <Box>
          <Typography fontWeight={600}>BetaBot</Typography>
          <Typography fontSize={12} sx={{ opacity: 0.8 }}>
            🟢 Online Now
          </Typography>
        </Box>
      </Box>

      {/* Action buttons */}
      <Box>
        <Tooltip title="Session list">
          <IconButton
            onClick={onOpenSessionList}
            sx={{ color: "white", mr: 1 }}
          >
            <FolderIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="New chat">
          <IconButton onClick={onNewChat} sx={{ color: "white", mr: 1 }}>
            <ReplayIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Close chat">
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
