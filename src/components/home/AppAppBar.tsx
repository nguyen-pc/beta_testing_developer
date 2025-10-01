import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown";
import Sitemark from "../../components/home/SitemarkIcon";
import Link from "@mui/material/Link";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { callLogout } from "../../config/api";
import { setLogoutAction } from "../../redux/slice/accountSlide";
import { useNavigate } from "react-router-dom";
import { Alert, List, ListItemButton, ListItemText } from "@mui/material";
import Popover from "@mui/material/Popover";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDialogOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDialogClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);

  const handleLogout = async () => {
    const res = await callLogout();
    console.log("handleLogout", res);
    if (res && res && +res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      <Alert variant="filled" severity="success">
        Đăng xuất thành công!
      </Alert>;
      navigate("/");
    }
  };

  // const handleDialogOpen = () => {
  //   setDialogOpen(true);
  // };
  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  // };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button variant="text" color="info" size="small">
                Features
              </Button>
              <Button variant="text" color="info" size="small">
                Testimonials
              </Button>
              <Button variant="text" color="info" size="small">
                Highlights
              </Button>
              <Button variant="text" color="info" size="small">
                Pricing
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
              >
                FAQ
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
              >
                Blog
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {!isAuthenticated ? (
              <>
                <Button color="primary" variant="text" size="small">
                  <Link href="/signin" underline="none" color="inherit">
                    Sign in
                  </Link>
                </Button>
                <Button color="primary" variant="contained" size="small">
                  <Link href="/home_signup" underline="none" color="inherit">
                    Sign up
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={handleDialogOpen}>
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
                <Popover
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handleDialogClose}
                  anchorOrigin={{
                    vertical: "bottom", // nằm dưới icon
                    horizontal: "right", // sát cạnh phải icon
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <List>
                    <ListItemButton
                      onClick={() => {
                        navigate("/dashboard");
                        handleDialogClose();
                      }}
                    >
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        navigate("/profile");
                        handleDialogClose();
                      }}
                    >
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        navigate("/payments");
                        handleDialogClose();
                      }}
                    >
                      <ListItemText primary="Payments" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        handleLogout();
                        handleDialogClose();
                      }}
                    >
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Popover>
              </>
            )}

            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
