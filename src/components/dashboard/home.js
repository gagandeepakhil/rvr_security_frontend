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
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "../snackbar";
import API from "../../constants";

function Home({ role, editable }) {
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false); // Only one field is editable (name)
  const [editValues, setEditValues] = useState({
    name: userDetails?.name,
  });

  const showSnackbar = useSnackbar();

  useEffect(() => {
    // Fetch user details from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserDetails(user);
      setEditValues({
        name: user.name,
      });
    }
  }, []);

  useEffect(() => {
    if (!editing && editValues.name && userDetails?.id) {
      console.log(editValues);
      //send put request to update name to /:id/edit
      fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.editUserDetails}${userDetails.id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: editValues.name,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          //replace _id in data.user with id
          data.user.id = data.user._id;
          delete data.user._id;
          //set user details in local storage
          localStorage.setItem("user", JSON.stringify(data.user));
          setUserDetails(data.user);
          showSnackbar(data.message, 3000, "success");
          setEditing(false);
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
        });
    }
  }, [editing,editValues]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setEditValues(() => ({
      name: e.target.value,
    }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" padding={0.5} textAlign={"center"} gutterBottom>
        Personal Details
      </Typography>

      {userDetails ? (
        <Grid container direction={"column"} spacing={3}>
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
                    src={userDetails.avatar || "/static/images/avatar/1.jpg"} // Dynamic avatar fallback
                  />
                  <Box>
                    {editing ? (
                      <TextField
                        label="Name"
                        value={editValues.name}
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
                {(editable&&!editing) ?(
                  <IconButton onClick={handleEditToggle} size="small">
                    <EditIcon />
                  </IconButton>
                ):(
                  <IconButton onClick={handleEditToggle} size="small">
                    <CheckIcon />
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
                    {role?.roleName?.charAt(0).toUpperCase() +
                      role?.roleName?.slice(1)}
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
                    {userDetails?.createdAt}
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
