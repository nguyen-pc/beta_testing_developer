import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import MenuContent from "./campaign/MenuContent";
import CardAlert from "./CardAlert";
import { useAppSelector } from "../../redux/hooks";
import MenuContentHome from "./home/MenuContentHome";
import NotificationBell from "../NotificationBell";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobileProject({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  const user = useAppSelector((state) => state.account.user);

  // Lấy chữ cái đầu (tự động uppercase)
  const avatarLetter = (
    user?.fullName?.charAt(0) ||
    user?.email?.charAt(0) ||
    "U"
  ).toUpperCase();

  const displayName = user?.fullName || user?.email || "User";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={displayName}
              sx={{
                width: 26,
                height: 26,
                bgcolor: "primary.main",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "white",
              }}
            >
              {avatarLetter}
            </Avatar>

            <Typography component="p" variant="h6">
              {displayName}
            </Typography>
          </Stack>
          <MenuButton>
            {/* <NotificationsRoundedIcon /> */}
            <NotificationBell />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContentHome />
          <Divider />
        </Stack>
        {/* <CardAlert /> */}
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
