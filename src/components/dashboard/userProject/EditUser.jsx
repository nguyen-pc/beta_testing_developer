import {
  Box,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  callFetchUserById,
  callFetchRole,
  callUpdateUser,
  callGetCompanyUsers,
} from "../../../config/api";
import { useAppSelector } from "../../../redux/hooks";

const EditUser = () => {
  const location = useLocation();
  const userData = location.state;
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const currentUser = useAppSelector((state) => state.account.user);
  const [displayUser, setDisplayUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.id) {
      fetchUserData();
      fetchRoleData();
      fetchCompanyData();
    }
  }, [userData?.id]);

  const fetchUserData = async () => {
    try {
      const res = await callFetchUserById(userData.id);
      if (res?.data) {
        setDisplayUser(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleData = async () => {
    try {
      const res = await callFetchRole("page=1&size=100");
      if (res?.data?.result) setRoles(res.data.result);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu vai trò:", error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      if (!currentUser?.id) return;
      const res = await callGetCompanyUsers(currentUser.id);
      const companyData = res?.data;
      if (companyData) {
        const companyId = companyData?.companyId || companyData?.id;
        setCurrentCompanyId(companyId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy công ty hiện tại:", error);
    }
  };

  // 🧩 Submit cập nhật
  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        id: userData.id,
        name: values.name,
        gender: values.gender,
        phoneNumber: values.phoneNumber,
        address: values.address,
        role: { id: values.role },
        companyProfile: { id: currentCompanyId }, // ✅ tự động gán công ty hiện tại
      };
      console.log("Submitting payload:", payload);

      const res = await callUpdateUser(payload);
      if (res?.statusCode === 200) {
        console.log("✅ Cập nhật thành công:", res.data);
        navigate("/dashboard/user");
      } else {
        console.error("❌ Lỗi cập nhật:", res);
      }
    } catch (error) {
      console.error("🚨 Lỗi khi cập nhật user:", error);
    }
  };

  if (loading || !displayUser) {
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
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          name: displayUser?.name || "",
          gender: displayUser?.gender || "",
          email: displayUser?.email || "",
          phoneNumber: displayUser?.phoneNumber || "",
          address: displayUser?.address || "",
          role: displayUser?.role ? displayUser.role.id : "",
        }}
        enableReinitialize
        validationSchema={userEditSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Họ và tên */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Họ và tên"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Giới tính */}
              <TextField
                select
                fullWidth
                variant="filled"
                label="Giới tính"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: "span 2" }}
              >
                <MenuItem value="MALE">MALE</MenuItem>
                <MenuItem value="FEMALE">FEMALE</MenuItem>
                <MenuItem value="OTHER">OTHER</MenuItem>
              </TextField>

              {/* Email (không sửa) */}
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                value={values.email}
                name="email"
                disabled
                sx={{ gridColumn: "span 2" }}
              />

              {/* Số điện thoại */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Số điện thoại"
                name="phoneNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
              {/* Vai trò */}
              <TextField
                select
                fullWidth
                variant="filled"
                label="Vai trò"
                name="role"
                value={values.role}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* Địa chỉ */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa chỉ"
                name="address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Cập nhật người dùng
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// 🧩 Validation
const userEditSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập họ và tên"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  phoneNumber: yup
    .string()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      "Số điện thoại không hợp lệ"
    ),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
});

export default EditUser;
