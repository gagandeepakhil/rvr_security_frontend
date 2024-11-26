import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  Toolbar,
} from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useSnackbar } from "../../snackbar";
import API from "../../../constants";

const UserRequests = () => {
  const showSnackbar = useSnackbar();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [filteredRequests, setFilteredRequests] = useState({
    approved: [],
    declined: [],
    pending: [],
    all: [],
  });

  const getUserRequests = async () => {
    try {
      showSnackbar("Fetching requests...", 3000, "info");
      const response = await fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.getAllRequests}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "jwt expired") {
          // Handle session expiration
          showSnackbar("Session expired. Please log in again.", 3000, "error");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            window.location.href = "/signin";
          }, 3000);
          return;
        }

        // Show error message for other cases
        showSnackbar(
          data.message || "Failed to fetch requests.",
          3000,
          "error"
        );
        console.error(data.message || "Error fetching requests.");
        return;
      }

      // Set requests in state
      showSnackbar("Requests fetched successfully.", 3000, "success");
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      showSnackbar(
        "An unexpected error occurred. Please try again.",
        3000,
        "error"
      );
    }
  };

  useEffect(() => {
    getUserRequests();
  }, []);

  useEffect(() => {
    const approved = requests.filter(
      (request) => request.status === "Approved"
    );
    const declined = requests.filter(
      (request) => request.status === "Declined"
    );
    const pending = requests.filter((request) => request.status === "Pending");

    setFilteredRequests({
      approved,
      declined,
      pending,
      all: requests,
    });
  }, [requests]);

  useEffect(() => {
    console.log(filteredRequests);
  }, [filteredRequests]);
  const handleAction = (id, action) => {
    var status = action === "Approved" ? "Approved" : "Declined";
    console.log(id, status);

    fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.updateRequestStatus}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ requestId: id, status }),
    })
      .then(async (response) => {
        console.log(response);
        var data = await response.json();
        if (response.status === 200) {
          showSnackbar(data.message, 3000, "success");
          getUserRequests();
        } else {
          showSnackbar(data.message, 3000, "error");
        }
      })
      .catch((error) => {
        showSnackbar("Something went wrong", 3000, "error");
      });
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderTable = (data) => (
    <TableContainer component={Paper}>
      <Table
        sx={{
          width: "100%",
          overflowX: "scroll",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Email</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
            <TableCell>
              <strong>Created At</strong>
            </TableCell>
            {activeTab === 1 && (
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((request) => (
            <TableRow key={request._id}>
              <TableCell>{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{formatDate(request.createdAt)}</TableCell>
              {activeTab === 1 && (
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAction(request._id, "Approved")}
                    sx={{ marginRight: 1 }}
                  >
                    <PersonAddIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleAction(request._id, "Declined")}
                  >
                    <PersonRemoveIcon />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container sx={{ padding: 0, minWidth: "96%", margin: 0 }}>
      <Toolbar />
      {/* Tabs for navigation with color coding */}
      <Box
        component={Paper}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 0,
          margin: 0,
          marginBottom: 3,
          flexWrap: "wrap",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="inherit"
          TabIndicatorProps={{
            sx: {
              backgroundColor: ["gray", "orange", "green", "red"][activeTab], // Colors for each tab
            },
          }}
          sx={{
            marginRight: 2,
            "& .MuiTab-root": {
              color: "gray",
              "&.Mui-selected": {
                color: ["gray", "orange", "green", "red"][activeTab], // Tab text color
                fontWeight: "bold",
              },
            },
            // minWidth: "98%",
            // overflowX: "scroll",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            // flexWrap: "wrap",
          }}
        >
          <Tab label="All Requests" />
          <Tab label="Pending Requests" />
          <Tab label="Approved Requests" />
          <Tab label="Declined Requests" />
        </Tabs>

        {/* Refresh Button */}
        <Button
          variant="outlined"
          color="primary"
          onClick={getUserRequests}
          sx={{ margin: "auto", alignSelf: "center" }}
          size="small"
        >
          <LoopIcon />
        </Button>
      </Box>

      {/* Render the table based on active tab */}
      {activeTab === 0 && renderTable(filteredRequests.all)}
      {activeTab === 1 && renderTable(filteredRequests.pending)}
      {activeTab === 2 && renderTable(filteredRequests.approved)}
      {activeTab === 3 && renderTable(filteredRequests.declined)}
    </Container>
  );
};

export default UserRequests;
