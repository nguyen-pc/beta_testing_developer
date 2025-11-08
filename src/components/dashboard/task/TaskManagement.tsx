import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Button,
  Pagination,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppSelector } from "../../../redux/hooks";
import {
  callFetchUserNotifications,
  callMarkNotificationAsRead,
} from "../../../config/api";
import dayjs from "dayjs";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt?: string;
}

const ITEMS_PER_PAGE = 6;

const TaskManagement: React.FC = () => {
  const user = useAppSelector((state) => state.account.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "today">("all");
  const [page, setPage] = useState(1);

  // 🧩 Fetch all notifications
  const fetchNotifications = async () => {
    try {
      if (!user?.id) return;
      setLoading(true);

      const res = await callFetchUserNotifications(user.id);
      const data = res?.data || [];

      // Lọc type = BUG_ASSIGNMENT
      const filtered = data.filter(
        (n: Notification) => n.type === "BUG_ASSIGNMENT"
      );

      setNotifications(filtered);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Đánh dấu đã đọc
  const handleMarkAsRead = async (id: number) => {
    try {
      await callMarkNotificationAsRead(String(id));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // 🧩 Lọc danh sách
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "today") {
      return dayjs(n.createdAt).isSame(dayjs(), "day");
    }
    return true;
  });

  // 🧩 Tính phân trang
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginated = filteredNotifications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight={600}>
          🧩 Assigned Bug Notifications
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, value) => value && setFilter(value)}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="unread">Unread</ToggleButton>
          <ToggleButton value="today">Today</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Typography color="text.secondary" variant="body2" mb={1}>
        Total: {filteredNotifications.length} notifications
      </Typography>

      {filteredNotifications.length === 0 ? (
        <Typography color="text.secondary">No notifications found.</Typography>
      ) : (
        <List
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : theme.palette.grey[50],
            borderRadius: 2,
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {paginated.map((n) => (
            <React.Fragment key={n.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  opacity: n.isRead ? 0.7 : 1,
                  bgcolor: n.isRead
                    ? "transparent"
                    : "rgba(25, 118, 210, 0.05)",
                  "&:hover": { bgcolor: "action.hover" },
                  transition: "0.3s",
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <BugReportIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {n.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={n.type}
                        color="primary"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {dayjs(n.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                      {n.link && (
                        <Button
                          size="small"
                          sx={{ mt: 0.5 }}
                          onClick={() => (window.location.href = n.link!)}
                        >
                          View Bug
                        </Button>
                      )}
                    </>
                  }
                />

                {!n.isRead && (
                  <IconButton onClick={() => handleMarkAsRead(n.id)}>
                    <CheckCircleIcon color="success" />
                  </IconButton>
                )}
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default TaskManagement;
