import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../lib/apiRequest";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 240;
const icons = [
  <DashboardIcon />,
  <AttachMoneyIcon />,
  <ShoppingCartCheckoutIcon />,
  <SaveAltIcon />,
  <PersonIcon />,
  <LogoutIcon />,
];

interface Props {
  window?: () => Window;
}

interface RouteItem {
  text: string;
  route: string;
}

const routes: RouteItem[] = [
  { text: "Dashboard", route: "/home" },
  { text: "Income", route: "/home/income" },
  { text: "Expenses", route: "/home/expenses" },
  { text: "Savings", route: "/home/savings" },
  { text: "Profile", route: "/home/profile" },
  { text: "Logout", route: "/" },
];

const MainPage: React.FC<Props> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);
  const [activeRoute, setActiveRoute] = React.useState<string>("/home");
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error("useContext must be used within an AuthContextProvider");
  }
  const { updateUser } = authContext;

  // Check if this is a new session and clear localStorage if true
  React.useEffect(() => {
    if (!sessionStorage.getItem("sessionActive")) {
      localStorage.clear(); // Clear localStorage on new session
      sessionStorage.setItem("sessionActive", "true"); // Mark session as active
    }
  }, []);

  React.useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  React.useEffect(() => {
    const savedRoute = localStorage.getItem("activeRoute");
    if (savedRoute) {
      setActiveRoute(savedRoute);
    }
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      localStorage.removeItem("user"); // Clear user data from local storage
      localStorage.removeItem("activeRoute");
      updateUser(null); // Update context to null
      navigate("/"); // Redirect to home or login page
    } catch (error) {
      console.error("Error logging out", error);
      // Optionally, you can display an error message to the user
    }
  };

  const handleNavigation = (route: string) => {
    if (route === "/") {
      handleLogout();
    } else {
      localStorage.setItem("activeRoute", route);
      setActiveRoute(route);
      navigate(route);
    }
  };

  const drawer = (
    <div>
      <Toolbar />

      <Divider />
      <List>
        {routes.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.route)}
              sx={{
                backgroundColor:
                  activeRoute === item.route
                    ? "rgba(0, 0, 0, 0.08)"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    activeRoute === item.route
                      ? "rgba(0, 0, 0, 0.12)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>{icons[index]}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Finance Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainPage;
