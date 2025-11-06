import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import {
  callCreateUser,
  callFetchRole,
  callGetCompanyUsers,
} from "../../../config/api";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

const FormUserAdd = () => {
  const [roles, setRoles] = useState([]);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user); // 🧍‍♂️ user đang đăng nhập

  useEffect(() => {
    fetchRoleData();
    fetchCompanyData();
  }, [user?.id]);

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
      if (!user?.id) return;
      const res = await callGetCompanyUsers(user.id);
      const companyData = res?.data;
      if (companyData) {
        const companyId = companyData?.companyId || companyData?.id;
        console.log("🏢 Company ID:", companyId);
        setCurrentCompanyId(companyId);
      }
    } catch (error) {
      console.error("Lỗi khi tải công ty người dùng:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        role: { id: values.role },
        companyProfile: { id: currentCompanyId }, 
      };
      console.log("Submitting form with payload:", payload);
      const res = await callCreateUser(payload);
      if (res?.data) {
        console.log("✅ Tạo người dùng thành công:", res.data);
        navigate("/dashboard/user");
      } else {
        console.error("❌ Tạo người dùng thất bại:", res?.message);
      }
    } catch (error) {
      console.error("🚨 Lỗi khi tạo user:", error);
    }
  };

  return (
    <Box m="20px">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Họ và tên"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />

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

              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Mật khẩu"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Số điện thoại"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />

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

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa chỉ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Tạo người dùng
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// 🧩 Validation
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập họ và tên"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phoneNumber: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

// 🧩 Initial values
const initialValues = {
  name: "",
  gender: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
  role: "",
};

export default FormUserAdd;
