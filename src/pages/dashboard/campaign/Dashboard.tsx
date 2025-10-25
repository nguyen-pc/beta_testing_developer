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
import MainGrid from "../../../components/dashboard/MainGrid";
import SideMenu from "../../../components/dashboard/campaign/SideMenu";
import AppTheme from "../../../theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../../../theme/customizations";
import NotificationsProvider from "../../../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../../../hooks/useDialogs/DialogsProvider";
import { Route, Routes } from "react-router-dom";
import CampaignEdit from "../../../components/dashboard/campaign/CampaignEdit";
import TabTesterHome from "../../../components/dashboard/home/tester/TabTesterHome";
// import IssuesPage from "./IssuesPage";
import IssueDetailView from "../../../components/dashboard/issue/IssueDetailView";
import IssueGridView from "../../../components/dashboard/issue/IssueGridView";
import SurveyListByCampaign from "../../../components/dashboard/Response/SurveyListByCampaign";
import ResponsePage from "../../../components/dashboard/Response/ResponsePage";
import ResponseDetail from "../../../components/dashboard/Response/ResponseDetail";
import EmailTester from "../../../components/dashboard/emailTester/EmailTester";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
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
                  <Route index element={<MainGrid />} />
                  <Route path="tester" element={<TabTesterHome />} />
                  <Route path="edit_detail" element={<CampaignEdit />} />
                  <Route path="issues" element={<IssueGridView />} />
                  <Route path="issues/:bugId/" element={<IssueDetailView />} />
                  <Route path="survey" element={<SurveyListByCampaign />} />
                  <Route path="email" element={<EmailTester />} />
                  <Route path="survey/:surveyId/results" element={<ResponsePage />} />
                  <Route path="survey/:surveyId/analysis" element={<ResponseDetail />} />

                  
                  {/* Fallback route nếu không khớp */}
                  <Route path="*" element={<MainGrid />} />

                </Routes>
              </DialogsProvider>
            </NotificationsProvider>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
