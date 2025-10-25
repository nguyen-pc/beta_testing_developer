import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

export default function MenuContentHome() {
  const location = useLocation();
  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },
    { text: "User", icon: <HomeRoundedIcon />, path: "/dashboard/user" },
    {
      text: "Project",
      icon: <AnalyticsRoundedIcon />,
      path: "/dashboard/projects",
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

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path ? item.path : undefined}
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
              to={item.path ? item.path : undefined}
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
