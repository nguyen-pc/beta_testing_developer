import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "../../components/dashboard/AppNavbar";
import Header from "../../components/dashboard/Header";
import AppTheme from "../../theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "../../theme/customizations";
import NotificationsProvider from "../../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../../hooks/useDialogs/DialogsProvider";
import { Routes, Route } from "react-router-dom";
import UserManagement from "../../components/dashboard/userProject/UserManagement";
import FormUserAdd from "../../components/dashboard/userProject/FormUserAdd";
import EditUser from "../../components/dashboard/userProject/EditUser";
import SideMenuHome from "../../components/dashboard/home/SideMenuHome";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function User(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenuHome />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <NotificationsProvider>
              <DialogsProvider>
                {/* Định nghĩa các route con theo dạng relative */}
                <Routes>
                  {/* Khi vào /dashboard/user/, hiển thị EmployeeList */}
                  <Route index element={<UserManagement />} />
                  <Route path="" element={<UserManagement />} />
                  {/* <Route path=":id" element={<EmployeeShow />} /> */}
                  <Route path="new" element={<FormUserAdd />} />
                  <Route path=":id/edit" element={<EditUser />} />
                  {/* Fallback route nếu không khớp */}
                  <Route path="*" element={<UserManagement />} />
                </Routes>
              </DialogsProvider>
            </NotificationsProvider>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
