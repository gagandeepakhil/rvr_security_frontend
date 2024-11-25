import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  IconButton,
  TextField,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "../snackbar";
import API from "../../constants";

function Home({ role, editable }) {
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const showSnackbar = useSnackbar();

  useEffect(() => {
    // Fetch user details from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserDetails(user);
      setName(user.name);
    }
  }, []);

  const handleEditToggle = () => {
    if (editing && name !== userDetails.name) {
      // Update user details via API
      fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.editUserDetails}${userDetails.id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ name }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error === "jwt expired") {
            showSnackbar("Session Expired. Please login again.", 3000, "error");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setTimeout(() => {
              window.location.href = "/signin";
            }, 3000);
            return;
          }
          // Update user details in state and local storage
          const updatedUser = {
            ...data.user,
            id: data.user._id,
            createdAt: new Date(data.user.createdAt).toLocaleString(),
          };
          delete updatedUser._id;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserDetails(updatedUser);
          showSnackbar(data.message, 3000, "success");
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          showSnackbar("Failed to update user details.", 3000, "error");
        });
    }
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Personal Details
      </Typography>

      {userDetails ? (
        <Grid container direction="column" spacing={3}>
          {/* User Info */}
          <Grid item xs={12}>
            <Card>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      marginRight: 2,
                      backgroundColor: "primary.main",
                    }}
                    alt={userDetails.name}
                    src={userDetails.avatar || "/static/images/avatar/1.jpg"}
                  />
                  <Box>
                    {editing ? (
                      <TextField
                        label="Name"
                        value={name}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="h6">{userDetails.name}</Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                      {userDetails.email}
                    </Typography>
                  </Box>
                </Box>
                {editable && (
                  <IconButton onClick={handleEditToggle} size="small">
                    {editing ? <CheckIcon /> : <EditIcon />}
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Role Info (read-only) */}
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <VerifiedIcon
                  sx={{ marginRight: 2, width: 56, height: 56, color: "green" }}
                />
                <Box>
                  <Typography variant="h6">Role</Typography>
                  <Typography variant="body1">
                    {role?.roleName
                      ? role.roleName.charAt(0).toUpperCase() +
                        role.roleName.slice(1)
                      : "N/A"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Info (read-only) */}
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <EventAvailableIcon
                  sx={{ marginRight: 2, width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6">Joined</Typography>
                  <Typography variant="body1">
                    {userDetails?.createdAt || "N/A"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">Loading user details...</Typography>
      )}
    </Box>
  );
}

export default Home;
