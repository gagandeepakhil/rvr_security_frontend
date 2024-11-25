import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const UserTable = ({ data, editableFields, columns }) => {
  const [users, setUsers] = useState(data);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

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
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingRowId ? { ...user, ...editValues } : user
      )
    );
    setEditingRowId(null);
    setEditValues({});
  };

  const handleDeleteClick = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const handleChange = (field, value) => {
    setEditValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

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
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      default:
        return value; // Default to plain text for unsupported types
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((field) => (
              <TableCell key={field}>{field}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {columns.map((field) => {
                const editableField = editableFields.find(
                  (f) => f.columnName === field
                );
                return (
                  <TableCell key={field}>
                    {editingRowId === user.id && editableField ? (
                      renderEditableField(editableField, editValues[field])
                    ) : typeof user[field] === "object" ? (
                      JSON.stringify(user[field])
                    ) : (
                      user[field] || ""
                    )}
                  </TableCell>
                );
              })}
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
  );
};

export default UserTable;
