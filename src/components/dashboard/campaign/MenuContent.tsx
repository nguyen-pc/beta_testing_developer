import * as React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

// const mainListItems = [
//   {
//     text: "Home",
//     icon: <HomeRoundedIcon />,
//     path: `/dashboard/projects/${projectId}/campaigns/${campaignId}`,
//   },
//   { text: "Tester", icon: <HomeRoundedIcon />, path: "/dashboard/user" },
//   {
//     text: "Surveys",
//     icon: <AnalyticsRoundedIcon />,
//     path: "/dashboard/surveys",
//   },
//   { text: "Bugs", icon: <PeopleRoundedIcon />, path: "/dashboard/bugs" },
//   {
//     text: "Messages",
//     icon: <PeopleRoundedIcon />,
//     path: "/dashboard/messages",
//   },
//   {
//     text: "Secure Files",
//     icon: <PeopleRoundedIcon />,
//     path: "/dashboard/secure-files",
//   },
//   { text: "Tasks", icon: <AssignmentRoundedIcon />, path: "/dashboard/tasks" },
// ];

// const secondaryListItems = [
//   {
//     text: "Settings",
//     icon: <SettingsRoundedIcon />,
//     path: "/dashboard/settings",
//   },
//   { text: "About", icon: <InfoRoundedIcon />, path: "/dashboard/about" },
//   { text: "Feedback", icon: <HelpRoundedIcon />, path: "/dashboard/feedback" },
// ];

export default function MenuContent() {
  const location = useLocation();
  const { projectId, campaignId } = useParams();
  const mainListItems = [
    {
      text: "Home",
      icon: <HomeRoundedIcon />,
      path: `/dashboard/projects/${projectId}/campaigns/${campaignId}`,
    },
    { text: "Tester", icon: <HomeRoundedIcon />, path: `/dashboard/projects/${projectId}/campaigns/${campaignId}/tester` },
    {
      text: "Surveys",
      icon: <AnalyticsRoundedIcon />,
      path:  `/dashboard/projects/${projectId}/campaigns/${campaignId}/survey`
    },
    { text: "Bugs", icon: <PeopleRoundedIcon />, path:  `/dashboard/projects/${projectId}/campaigns/${campaignId}/issues`  },
    {
      text: "Messages",
      icon: <PeopleRoundedIcon />,
      path: "/dashboard/messages",
    },
    {
      text: "Secure Files",
      icon: <PeopleRoundedIcon />,
      path: "/dashboard/secure-files",
    },
    {
      text: "Test Detail",
      icon: <AssignmentRoundedIcon />,
      path: `/dashboard/projects/${projectId}/campaigns/${campaignId}/edit_detail`,
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
      {/* <List dense>
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
      </List> */}
    </Stack>
  );
}
