import * as React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import { useCampaignContext } from "../../../context/CampaignContext"; // 👈 import context

export default function MenuContentCreateCampaign() {
  const location = useLocation();
  const { projectId, campaignId: paramCampaignId } = useParams();
  const { campaignId } = useCampaignContext();

  const activeCampaignId = campaignId || paramCampaignId; // ưu tiên context

  const mainListItems = [
    {
      text: "Test Details",
      icon: <LooksOneIcon />,
      path: `/dashboard/projects/${projectId}/campaigns/new/create`,
    },
    {
      text: "Test Recruiting",
      icon: <LooksTwoIcon />,
      path: activeCampaignId
        ? `/dashboard/projects/${projectId}/campaigns/new/${activeCampaignId}/createRecruiting`
        : undefined,
    },
    {
      text: "TestCase",
      icon: <Looks3Icon />,
      path: activeCampaignId
        ? `/dashboard/projects/${projectId}/campaigns/new/${activeCampaignId}/test-case`
        : undefined,
    },
    {
      text: "Surveys",
      icon: <Looks4Icon />,
      path: activeCampaignId
        ? `/dashboard/projects/${projectId}/campaigns/new/${activeCampaignId}/survey`
        : undefined,
    },
    {
      text: "Launch",
      icon: <Looks5Icon />,
      path: activeCampaignId
        ? `/dashboard/projects/${projectId}/campaigns/new/${activeCampaignId}/launch`
        : undefined,
    },
  ];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path || ""}
              disabled={!item.path}
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
