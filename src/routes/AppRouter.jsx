import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import Home from "../pages/home/Home";
import DetailCampaign from "../pages/home/DetailCampaign";
import Dashboard from "../pages/dashboard/campaign/Dashboard";
import Campaign from "../pages/dashboard/campaign/Campaign";
import DashboardHome from "../pages/dashboard/home/DashboardHome";
import Project from "../pages/dashboard/home/Project";
import Analytics from "../pages/dashboard/Analytics";
import User from "../pages/dashboard/User";
import Profile from "../pages/profile/Profile";
import ViewQuestion from "../components/dashboard/campaign/survey/ViewQuestion";
import ScenarioPage from "../components/dashboard/campaign/testcase/ScenarioPage";
import NotificationsProvider from "../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../hooks/useDialogs/DialogsProvider";
import PrivateRoute from "./PrivateRoute";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUpSide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home/detail/:id" element={<DetailCampaign />} />
        <Route path="/home_signup" element={<HomeSignUp />} />

        {/* Dashboard ở trang home */}
        {/* Private routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard/projects/*" element={<Project />} />
        <Route path="/dashboard/user/*" element={<User />} />

        {/*Dashboard ở trang campaign */}
        <Route
          path="/dashboard/projects/:projectId/campaigns/:campaignId/*"
          element={<Dashboard />}
        />
        <Route
          path="/dashboard/projects/:projectId/campaigns/new/*"
          element={<Campaign />}
        />
        <Route
          path="/campaigns/:campaignId/surveys/:surveyId/view-question"
          element={<ViewQuestion />}
        />
        {/* <Route
          path="/dashboard/test_scenario/:useCaseId"
          element={<ScenarioPage />}
        /> */}
      </Routes>
    </BrowserRouter>
  );
}
