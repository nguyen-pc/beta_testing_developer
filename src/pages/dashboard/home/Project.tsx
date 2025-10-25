import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "../../../components/dashboard/AppNavbar";
import Header from "../../../components/dashboard/Header";
// import SideMenu from "../../components/dashboard/SideMenu";
import AppTheme from "../../../theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../../../theme/customizations";
import MainProject from "../../../components/dashboard/project/MainProject";
import SideMenu from "../../../components/dashboard/campaign/SideMenu";
import SideMenuHome from "../../../components/dashboard/home/SideMenuHome";
import NotificationsProvider from "../../../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../../../hooks/useDialogs/DialogsProvider";
import { Route, Routes } from "react-router-dom";
import ProjectCreate from "../../../components/dashboard/project/ProjectCreate";
import ProjectShow from "../../../components/dashboard/project/ProjectShow";
import ProjectEdit from "../../../components/dashboard/project/ProjectEdit";
import Dashboard from "../campaign/Dashboard";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Project(props: { disableCustomTheme?: boolean }) {
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
              // alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <NotificationsProvider>
              <DialogsProvider>
                <Routes>
                  <Route index element={<MainProject />} />
                  <Route path="" element={<MainProject />} />
                  <Route path="show/:projectId" element={<ProjectShow />} />
                  <Route path="new" element={<ProjectCreate />} />
                  <Route path=":projectId/edit" element={<ProjectEdit />} />
                  {/* Fallback route nếu không khớp */}
                  <Route path="*" element={<MainProject />} />
                </Routes>
              </DialogsProvider>
            </NotificationsProvider>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
