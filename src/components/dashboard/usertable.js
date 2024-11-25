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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import API from "../../constants";
import { useSnackbar } from "../snackbar";
import { usePopper } from "../poppercontext";

const UserTable = ({ data, editableFields, columns, rolesList, roleMap }) => {
  const [users, setUsers] = useState(data);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const showSnackbar  = useSnackbar();
  const { confirm } = usePopper();
  useEffect(() => {
    console.log(users);
  }, [users]);
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
    )
      .then((response) => {  
        if(response.status!=200){
          showSnackbar("Something went wrong", 3000, "error");
          return;
        }else{
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

  const handleDeleteClick = async(id) => {

    const result=await confirm("Are you sure you want to delete this user?");
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
      }else{
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

        showSnackbar("User deleted successfully", 3000, "success");}
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
  }
  const renderEditableField = (field, value) => {
    const { columnName, type, options } = field;

    switch (type) {
      case "text":
        return (
          <TextField
            value={value || ""}
            onChange={(e) => handleChange(columnName, e.target.value)}
            fullWidth
          />
        );
      case "select":
        return (
          <Select
            value={value || ""}
            onChange={(e) => handleChange(columnName, e.target.value)}
            fullWidth
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
            fullWidth
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
    <Paper>
      <Toolbar>
        <Typography variant="h6" sx={{ flex: "1 1 auto" }}>
          User Management
        </Typography>
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
          sx={{ marginRight: 2 }}
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
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
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
                <TableCell>
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
                      <IconButton onClick={() => handleEditClick(user.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserTable;
