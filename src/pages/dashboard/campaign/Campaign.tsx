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
import AppTheme from "../../../theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../../../theme/customizations";
import SideMenuCreateCampaign from "../../../components/dashboard/campaign/SideMenuCreateCampaign";
import Dashboard from "./Dashboard";
import DetailCampaignCreate from "../../../components/dashboard/campaign/CampaignCreate";
import NotificationsProvider from "../../../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../../../hooks/useDialogs/DialogsProvider";
import { Route, Routes } from "react-router-dom";
import RecruitingCampaignCreate from "../../../components/dashboard/campaign/recruiting/RecruitingCampaign";
import UseCasePage from "../../../components/dashboard/campaign/testcase/UseCasePage.tsx";
import ScenarioPage from "../../../components/dashboard/campaign/testcase/ScenarioPage.tsx";
import TestcasePage from "../../../components/dashboard/campaign/testcase/TestCasePage.tsx";
import SurveyBuilderAdvanced from "../../../components/dashboard/campaign/survey/SurveyBuilderAdvanced.tsx";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Campaign(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenuCreateCampaign />
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
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            <NotificationsProvider>
              <DialogsProvider>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="create" element={<DetailCampaignCreate />} />
                  <Route
                    path="createRecruiting"
                    element={<RecruitingCampaignCreate />}
                  />
                  <Route path="surveys" element={<SurveyBuilderAdvanced />} />
                  <Route
                    path="test-case"
                    element={<UseCasePage campaignId={3} />}
                  />
                  <Route path="test_scenario/:useCaseId" element={<ScenarioPage />} />

                  <Route path="testcase/:testScenarioId" element={<TestcasePage />}/>
                  
                  {/* Fallback route nếu không khớp */}
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </DialogsProvider>
            </NotificationsProvider>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
