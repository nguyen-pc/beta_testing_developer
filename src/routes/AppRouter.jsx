import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import Home from "../pages/home/Home";
import DetailCampaign from "../pages/home/DetailCampaign";
import Dashboard from "../pages/dashboard/Dashboard";
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<Analytics />} />
        <Route path="/dashboard/user/*" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}
