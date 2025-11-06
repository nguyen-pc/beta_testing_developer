import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  callAddUserToProject,
  callRemoveUserFromProject,
  callGetUsersByProject,
  callGetCompanyUsers,
  callFetchUserByCompanyId,
} from "../../../config/api";
import { useAppSelector } from "../../../redux/hooks";

interface ProjectTeamManagerProps {
  projectId: number | string;
}

interface ProjectMember {
  userId: number;
  userName: string;
  role: string;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
}

const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({
  projectId,
}) => {
  const user = useAppSelector((state) => state.account.user);
  const [open, setOpen] = useState<boolean>(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [selectedRole, setSelectedRole] = useState<string>("Tester");
  const [loading, setLoading] = useState<boolean>(true);

  // 🧩 Lấy danh sách thành viên của dự án
  const fetchMembers = async () => {
    try {
      const res = await callGetUsersByProject(Number(projectId));
      console.log("Fetched project members:", res?.data);
      if (res?.data) setMembers(res.data);
    } catch (err) {
      console.error("Lỗi tải thành viên:", err);
    }
  };

  // 🧩 Lấy danh sách user thuộc công ty của user hiện tại
  const fetchAvailableUsers = async () => {
    try {
      if (!user?.id) return;
      setLoading(true);

      // Lấy thông tin công ty của user
      const companyRes = await callGetCompanyUsers(user.id);
      const companyData = companyRes?.data;
      if (!companyData) {
        console.warn("Không tìm thấy công ty của user");
        return;
      }

      const companyId = companyData?.companyId || companyData?.id;
      if (!companyId) {
        console.warn("Không có companyId trong response");
        return;
      }

      // Gọi danh sách user trong công ty
      const userRes = await callFetchUserByCompanyId(companyId);
      setAvailableUsers(userRes?.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách user công ty:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchMembers();
  }, [projectId]);

  const handleOpen = () => {
    fetchAvailableUsers();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddMember = async () => {
    try {
      if (!selectedUser) return;
      const res = await callAddUserToProject(
        Number(projectId),
        Number(selectedUser),
        selectedRole
      );
      console.log("Added member to project:", res?.data);
      await fetchMembers();
      setSelectedUser("");
      setOpen(false);
    } catch (err) {
      console.error("Lỗi thêm thành viên:", err);
    }
  };

  // 🧩 Xóa thành viên
  const handleRemoveMember = async (userId: number) => {
    try {
      await callRemoveUserFromProject(Number(projectId), userId);
      await fetchMembers();
    } catch (err) {
      console.error("Lỗi xóa thành viên:", err);
    }
  };

  const handleSelectUser = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(e.target.value as number | "");
  };

  const handleSelectRole = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRole(e.target.value as string);
  };

  return (
    <Box mt={5}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Project Team Members
        </Typography>
        <Button
          variant="outlined"
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleOpen}
        >
          Add Member
        </Button>
      </Box>

      {/* Danh sách thành viên */}
      {members.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No team members yet.
        </Typography>
      ) : (
        <List
          dense
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
          {members.map((member) => (
            <ListItem
              key={member.userId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveMember(member.userId)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>{member.userName?.charAt(0) || "U"}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.userName}
                secondary={`Role: ${member.role}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Dialog thêm thành viên */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Member to Project</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="subtitle2">Select User</Typography>
              <Select
                fullWidth
                value={selectedUser}
                onChange={handleSelectUser}
                displayEmpty
              >
                <MenuItem value="">-- Select User --</MenuItem>
                {availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="subtitle2">Select Role</Typography>
              <Select
                fullWidth
                value={selectedRole}
                onChange={handleSelectRole}
              >
                <MenuItem value="Tester">Tester</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="outlined"
            onClick={handleAddMember}
            disabled={loading || !selectedUser}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTeamManager;
