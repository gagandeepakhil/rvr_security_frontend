import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Home from "./home";
import UserManagement from "./usermanagement";
import RoleManagement from "./rolemanagement";
import UserRequests from "./requestmanagement";
import API from "../../constants";

const AppLayout = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("Home");
  const [role, setRole] = useState("");

  const handleLogout = () => {
    // Perform logout logic here
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const getRoleById = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);

      if (Object.keys(user).length === 0) window.location.href = "/signin";
      //send get request with roleId as query parameter
      const response = await fetch(
        API.DATA_URL + API.DATA_ENDPOINTS.getRoleById + user.roleId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const role = await response.json();
        return role;
      } else {
        throw new Error("Failed to fetch role");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getRoleById();
      console.log(role);

      setRole(role?.role);
    };
    fetchRole();
  }, []);

  //based on permission show dashboard
  useEffect(() => {
    const permissions = role?.permissions;

    if (permissions && Object.keys(permissions).length > 0) {
      const updatedMenuItems = [];

      // Conditionally add menu items based on permissions
      if (permissions?.view_personal_details) {
        updatedMenuItems.push({
          label: "Home",
          icon: <HomeIcon />,
          component: <Home role={role} editable={permissions.edit} />,
        });
      }

      if (permissions?.view_all_users ) {
        updatedMenuItems.push({
          label: "User Management",
          icon: <GroupIcon />,
          component: <UserManagement />,
        });
      }

      if (permissions?.role_management) {
        updatedMenuItems.push({
          label: "Role Management",
          icon: <SecurityIcon />,
          component: <RoleManagement />,
        });
      }

      if (permissions?.approve_user_creation) {
        updatedMenuItems.push({
          label: "User Requests",
          icon: <NotificationsIcon />,
          component: <UserRequests />,
        });
      }

      // Update the menu items based on the permissions
      setMenuItems(updatedMenuItems);
    }
  }, [role]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "space-evenly",
      }}
    >
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {role?.roleName?.charAt(0).toUpperCase() + role?.roleName?.slice(1)}{" "}
            Dashboard
          </Typography>
          <IconButton color="inherit" edge="end" onClick={() => handleLogout()}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        sx={{
          width: isExpanded ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isExpanded ? 240 : 60,
            transition: "width 0.1s ease-in-out",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar />
        <List
          sx={{
            cursor: "pointer",
          }}
        >
          {menuItems.map((item, index) => {
            const isSelected = selectedComponent === item.label;
            return (
              <ListItem
                button
                key={index}
                onClick={() => setSelectedComponent(item.label)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  paddingY: "12px",
                  transition: "padding 0.1s ease-in-out",
                  backgroundColor: isSelected
                    ? "rgba(0, 0, 255, 0.1)"
                    : "transparent", // Change the background color for selected
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 255, 0.2)", // Hover effect
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isExpanded ? "40px" : "0px",
                    justifyContent: "center",
                    transition: "min-width 0.1s ease-in-out",
                    color: isSelected ? "blue" : "inherit", // Change icon color for selected
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isExpanded && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: isExpanded ? 1 : 0,
                      transition: "opacity 0.1s ease-in-out",
                      color: isSelected ? "blue" : "inherit", // Change text color for selected
                      fontSize: "small",
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          //   marginLeft: isExpanded ? "240px" : "60px",
          transition: "margin-left 0.1s ease-in-out",
        }}
      >
        <Toolbar />
        {menuItems.find((item) => item.label === selectedComponent)?.component}
      </Box>
    </Box>
  );
};

export default AppLayout;
