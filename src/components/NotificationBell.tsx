import React, { useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  callFetchUserNotifications,
  callMarkNotificationAsRead,
} from "../config/api";
import { useAppSelector } from "../redux/hooks";
import { useNotificationSocket } from "../hooks/websocket/useNotificationSocket";

export default function NotificationBell() {
  const user = useAppSelector((state) => state.account.user);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 🧩 Lấy danh sách thông báo ban đầu
  useEffect(() => {
    if (!user?.id) return;
    callFetchUserNotifications(user.id).then((res) =>
      setNotifications(res.data)
    );
  }, [user?.id]);

  // 🧩 Realtime nhận thông báo mới
  useNotificationSocket(user?.id, (msg) => {
    setNotifications((prev) => [msg, ...prev]);
  });

  // 🧩 Đánh dấu là đã đọc
  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.isRead) {
        await callMarkNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      }

      // Mở link nếu có
      if (notification.link) {
        window.location.href = notification.link;
      }
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
    }
  };

  return (
    <Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        {notifications.length === 0 && (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications yet.
            </Typography>
          </MenuItem>
        )}

        {notifications.map((n) => (
          <MenuItem
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            sx={{
              alignItems: "flex-start",
              backgroundColor: n.isRead
                ? "transparent"
                : "rgba(25, 118, 210, 0.08)",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.15)",
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: n.isRead ? 400 : 600 }}
              >
                {n.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: "300px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {n.message}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
