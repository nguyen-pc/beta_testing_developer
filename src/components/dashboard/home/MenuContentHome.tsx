import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useAppSelector } from "../../../redux/hooks";

export default function MenuContentHome() {
  const user = useAppSelector((state) => state.account.user);
  const location = useLocation();

  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },
    {
      text: "Team Members",
      icon: <PeopleRoundedIcon />,
      path: "/dashboard/user",
      role: "Test Leader",
    },
    {
      text: "Projects",
      icon: <AnalyticsRoundedIcon />,
      path: "/dashboard/projects",
    },
    {
      text: "Tasks",
      icon: <AssignmentRoundedIcon />,
      path: "/dashboard/tasks",
    },
  ];

  const secondaryListItems = [
    {
      text: "Settings",
      icon: <SettingsRoundedIcon />,
      path: "/dashboard/settings",
    },
    {
      text: "Company Profile",
      icon: <InfoRoundedIcon />,
      path: "/dashboard/company-profile",
    },
    {
      text: "Feedback",
      icon: <HelpRoundedIcon />,
      path: "/dashboard/feedback",
    },
  ];

  // ✅ Lọc menu chính theo vai trò
  const filteredMainList = mainListItems.filter(
    (item) => !item.role || user?.role?.name === item.role
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {filteredMainList.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path || undefined}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path || undefined}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
