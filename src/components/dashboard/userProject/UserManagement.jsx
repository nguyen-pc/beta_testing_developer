import {
  Box,
  Button,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import {
  callDeleteUser,
  callGetCompanyUsers,
  callFetchUserByCompanyId,
} from "../../../config/api";

const UserManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const user = useAppSelector((state) => state.account.user);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        setLoading(true);

        // 1️⃣ Lấy thông tin công ty của user
        const companyRes = await callGetCompanyUsers(user.id);
        const companyData = companyRes?.data;
        if (!companyData) {
          console.warn("Không tìm thấy công ty của user");
          return;
        }
        console.log("🏢 Company data:", companyData);

        const companyId = companyData?.companyId || companyData?.id;
        if (!companyId) {
          console.warn("Không có companyId trong response");
          return;
        }

        // 2️⃣ Lấy danh sách user theo companyId
        const userRes = await callFetchUserByCompanyId(companyId);
        const usersInCompany = userRes?.data || [];
        setCompanyUsers(usersInCompany);
        console.log(" Users in company:", usersInCompany);
      } catch (error) {
        console.error("Lỗi khi gọi API tuần tự:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const res = await callDeleteUser(id);
      if (res?.data?.statusCode === 200) {
        setCompanyUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  const handleEdit = (id) => {
    const userData = companyUsers.find((u) => u.id === id);
    if (userData) {
      navigate(`/dashboard/user/${id}/edit`, { state: userData });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Họ tên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Vai trò",
      width: 150,
      renderCell: (params) => (
        <span>{params.row.role ? params.row.role.name : "—"}</span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 160,
      renderCell: (params) => (
        <>
          {params.row.createdAt
            ? dayjs(params.row.createdAt).format("DD-MM-YYYY HH:mm:ss")
            : ""}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 130,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon style={{ color: "#ffa500" }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon style={{ color: "#ff4d4f" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

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
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h2> Danh sách người dùng cùng công ty</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/user/new")}
        >
          + Thêm người dùng
        </Button>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={companyUsers || []}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default UserManagement;
