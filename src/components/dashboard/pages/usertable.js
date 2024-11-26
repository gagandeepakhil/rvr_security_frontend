import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  TableSortLabel,
  Toolbar,
  InputAdornment,
  Typography,
  Button,
  Container,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAdd from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import API from "../../../constants";
import { useSnackbar } from "../../snackbar";
import { usePopper } from "../../poppercontext";
import InfoIcon from "@mui/icons-material/Info";
import LoopIcon from "@mui/icons-material/Loop";


const UserTable = ({
  data,
  editableFields,
  columns,
  rolesList,
  roleMap,
  currentPermissions,
  handleRefresh,
}) => {
  const [users, setUsers] = useState(data);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const showSnackbar = useSnackbar();
  const { confirm } = usePopper();
  useEffect(() => {
    console.log(users);
  }, [users]);
  const [isAddingUser, setIsAddingUser] = React.useState(false);

  const handleAddUser = () => {
    setIsAddingUser(true);
    // setNewUser({}); // Initialize a blank user object
    setEditValues({});
  };

  const handleSaveNewUser = () => {
    // Add the new user to the list
    // setUsers([...users, { id: generateUniqueId(), ...newUser }]);

    const validationEmail = validateEmail(editValues.email);
    if (validationEmail) {
      showSnackbar(validationEmail, 3000, "error");
      return;
    }

    //make sure no fields are empty
    if (
      !editValues.name ||
      !editValues.email ||
      !editValues.roleName ||
      !editValues.status
    ) {
      showSnackbar("Please fill in all fields", 3000, "error");
      return;
    }

    var body = {
      name: editValues.name,
      email: editValues.email,
      roleId: roleMap[editValues.roleName],
      status: editValues.status,
      password: editValues.email.split("@")[0],
    };
    fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.addUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status != 201) {
          response.json().then((data) => {
            showSnackbar(data.message, 3000, "error");
          });
        } else {
          response.json().then((data) => {
            console.log(data);

            var roleName = "";
            //find role name based on value of rolemanp
            Object.values(roleMap).forEach((value, index) => {
              if (value === data.user.roleId) {
                roleName = Object.keys(roleMap)[index];
              }
            });

            var newUser = {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              //find role name from role id
              roleName: roleName,
              status: data.user.status,
              createdAt: data.user.createdAt,
            };
            console.log(newUser);
            setUsers([...users, newUser]);

            showSnackbar(data.message, 3000, "success");
          });
        }
      })
      .catch((error) => {
        console.log(error);

        showSnackbar("Something went wrong", 3000, "error");
      });
    setIsAddingUser(false);
    setEditValues({});
  };

  const handleCancelNewUser = () => {
    setIsAddingUser(false);
    setEditValues({});
  };

  const handleEditClick = (id) => {
    setEditingRowId(id);
    const userToEdit = users.find((user) => user.id === id);
    setEditValues(userToEdit);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditValues({});
  };

  const handleSaveEdit = () => {
    const emailError = validateEmail(editValues.email);
    if (emailError) {
      showSnackbar(emailError, 3000, "error");
      return;
    }
    var body = {
      name: editValues.name,
      email: editValues.email,
      roleId: roleMap[editValues.roleName],
      status: editValues.status,
    };
    fetch(
      `${API.DATA_URL}${API.DATA_ENDPOINTS.editUserDetails}${editingRowId}/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      }
    ).then((response) => {
      if (response.status != 200) {
        showSnackbar("Something went wrong", 3000, "error");
        return;
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingRowId ? { ...user, ...editValues } : user
          )
        );
        showSnackbar("User details updated successfully", 3000, "success");
      }
    });
    setEditingRowId(null);
    setEditValues({});
  };

  const handleDeleteClick = async (id) => {
    const result = await confirm("Are you sure you want to delete this user?");
    if (!result) return;
    fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.deleteUser}${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      if (response.status != 200) {
        showSnackbar("Something went wrong", 3000, "error");
      } else {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

        showSnackbar("User deleted successfully", 3000, "success");
      }
    });
  };

  const handleChange = (field, value) => {
    setEditValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) ? "" : "Please enter a valid email.";
  };
  const renderEditableField = (field, value) => {
    const { columnName, type, options } = field;

    switch (type) {
      case "text":
        return (
          <TextField
            value={value || ""}
            onChange={(e) => handleChange(columnName, e.target.value)}
            size="small"
          />
        );
      case "select":
        return (
          <Select
            value={value || ""}
            onChange={(e) => handleChange(columnName, e.target.value)}
            size="small"
            disabled={
              editingRowId == JSON.parse(localStorage?.getItem("user"))?.id
            }
          >
            {options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      case "email":
        return (
          <TextField
            value={value || ""}
            onChange={(e) => handleChange(columnName, e.target.value)}
            size="small"
          />
        );
      default:
        return value; // Default to plain text for unsupported types
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole ? user.roleName === filterRole : true;
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Container
      sx={{
        minWidth:"96%",
        padding:0,
        margin:0
      }}
    >
      <Toolbar/>
      <Paper
        sx={{
          p: 1,
          mb: 2,
          alignContent: "center",
          minWidth:"96%"
        }}
      >
        {/* <Toolbar> */}
        <Typography variant="h5" margin={2}>
          User Management
        </Typography>
        <Stack
          direction="row"
          alignItems={"center"}
          spacing={1}
          maxWidth={"100%"}
        >
          {/* //check if 'create' attribute is true in currentPermissions */}
          {currentPermissions?.create && (
            <Button variant="outlined" color="primary" onClick={handleAddUser}>
              <PersonAdd />
            </Button>
          )}
          <Button variant="outlined" color="primary" onClick={handleRefresh}>
            <LoopIcon />
          </Button>
          <TextField
            variant="outlined"
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Roles</MenuItem>
            {rolesList.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          <Tooltip
            title={`Default password is mail id trimmed before '@'. For example, If email is  'user123@example.com'  then default password is  'user123'. `}
          >
            <InfoIcon color="primary" />
          </Tooltip>
        </Stack>
        {/* </Toolbar> */}
      </Paper>
      <TableContainer component={Paper}>
        <Table
          sx={{
            overflowX:"scroll"
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                },
                "& th:hover": {
                  cursor: "pointer",
                },
                "& th.Mui-active": {
                  color: "primary.main",
                },
                "& th.Mui-active:hover": {
                  color: "primary.main",
                },
              }}
            >
              {columns.map(({ columnName, displayName }) => (
                <TableCell key={columnName}>
                  <TableSortLabel
                    active={sortConfig.key === columnName}
                    direction={
                      sortConfig.key === columnName
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort(columnName)}
                  >
                    {displayName}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isAddingUser && (
              <TableRow>
                {columns.map(({ columnName, type, options }) => (
                  <TableCell key={columnName}>
                    {renderEditableField(
                      { columnName, type, options },
                      editValues[columnName] || ""
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={handleSaveNewUser}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={handleCancelNewUser}>
                    <CancelIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            {filteredUsers.map(
              (user) =>
                user?.email != "admin@example.com" && (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    {columns.map(({ columnName, type, options }) => (
                      <TableCell key={columnName}>
                        {editingRowId === user.id &&
                        editableFields.includes(columnName)
                          ? renderEditableField(
                              { columnName, type, options },
                              editValues[columnName]
                            )
                          : columnName === "createdAt"
                          ? formatDate(user[columnName]) // Format the createdAt field
                          : typeof user[columnName] === "object"
                          ? JSON.stringify(user[columnName])
                          : user[columnName] || ""}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        minWidth: "80px",
                      }}
                    >
                      {editingRowId === user.id ? (
                        <>
                          <IconButton onClick={handleSaveEdit}>
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={handleCancelEdit}>
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {currentPermissions?.edit && (
                            <IconButton
                              onClick={() => handleEditClick(user.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {currentPermissions?.delete && (
                            <IconButton
                              onClick={() => handleDeleteClick(user.id)}
                              disabled={
                                localStorage.getItem("user") &&
                                JSON.parse(localStorage.getItem("user"))?.id ==
                                  user?.id
                                  ? true
                                  : false
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserTable;
