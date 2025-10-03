import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import Home from "../pages/home/Home";
import DetailCampaign from "../pages/home/DetailCampaign";
import Dashboard from "../pages/dashboard/campaign/Dashboard";
import DashboardHome from "../pages/dashboard/home/DashboardHome";
import Project from "../pages/dashboard/home/Project";
import Analytics from "../pages/dashboard/Analytics";
import User from "../pages/dashboard/User";
import Profile from "../pages/profile/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUpSide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home/detail/:id" element={<DetailCampaign />} />
        <Route path="/home_signup" element={<HomeSignUp />} />

        {/* Dashboard ở trang home */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/projects/*" element={<Project />} />
        <Route path="/dashboard/user/*" element={<User />} />

        <Route path="/dashboard/project/:id/campaign" element={<Dashboard />} />

        {/*Dashboard ở trang campaign */}
      </Routes>
    </BrowserRouter>
  );
}
