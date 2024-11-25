import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Tooltip,
  Paper,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import LoopIcon from "@mui/icons-material/Loop";
import API from "../../constants";
import { useSnackbar } from "../snackbar";
import AddModeratorIcon from "@mui/icons-material/AddModerator";

const permissionList = [
  {
    key: "create",
    label: "Create",
    description:
      "Allows creating new entities such as records, items, or users.",
  },
  {
    key: "edit",
    label: "Edit",
    description:
      "Allows editing existing entities such as records, items, or users.",
  },
  {
    key: "delete",
    label: "Delete",
    description: "Allows deleting entities such as records, items, or users.",
  },
  {
    key: "view_all_users",
    label: "View All Users",
    description: "Allows viewing details of all users in the system.",
  },
  {
    key: "view_personal_details",
    label: "View Personal Details",
    description: "Allows viewing personal details of individual users.",
  },
  {
    key: "approve_user_creation",
    label: "Approve User Creation",
    description: "Allows approving the creation of new users in the system.",
  },
  {
    key: "role_management",
    label: "Role Management",
    description:
      "Allows managing roles, including creating, editing, or deleting roles.",
  },
];

const RolePermissionManagement = () => {
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");

  const showSnackbar = useSnackbar();

  // Handle entering edit mode
  const handleEdit = (role) => {
    setEditingRoleId(role.roleId);
    setEditedRole({ ...role });
  };

  // Handle saving changes
  const handleSave = () => {
    if(!editedRole?.roleName){
        showSnackbar("Role name cannot be empty",3000, "error");
        return;
    }
    var body={
        roleName: editedRole?.roleName,
        permissions: editedRole?.permissions
    }
    fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.editRole}${editingRoleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if(response.status!=200){
            showSnackbar("Failed to update role",3000, "error");
            return;
        }
        return response.json();
      })
      .then((data) => {
          setRoles(
            roles.map((role) =>
              role.roleId === editingRoleId ? editedRole : role
            )
          );
          setEditingRoleId(null);
          setEditedRole(null);
          showSnackbar(data?.message,3000, "success");
      })
      .catch((error) => {
        showSnackbar("Failed to update role",3000, "error");
      });
  };

  // Handle canceling edit
  const handleCancel = () => {
    setEditingRoleId(null);
    setEditedRole(null);
  };

  // Handle permission toggle during edit
  const handlePermissionChange = (permissionKey) => {
    setEditedRole({
      ...editedRole,
      permissions: {
        ...editedRole.permissions,
        [permissionKey]: !editedRole.permissions[permissionKey],
      },
    });
  };

  // Handle role name change during edit
  const handleRoleNameChange = (e) => {
    setEditedRole({ ...editedRole, roleName: e.target.value });
  };

  // Add a new role
  const handleAddRole = () => {
    if (newRoleName.trim()) {
      var body = {
        roleName: newRoleName,
        permissions: {},
      };
      fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.addRole}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      }).then(async (response) => {
        if (response.status != 201) {
          console.log(response);
          showSnackbar("Something went wrong", 3000, "error");
        } else {
          const data = await response.json();
          console.log(data);

          var roleData = {};
          roleData.roleId = data?.role?._id;
          roleData.roleName = data?.role?.roleName;
          roleData.permissions = data?.role?.permissions;
          setRoles([...roles, roleData]);
          setNewRoleName("");
          showSnackbar("Role added successfully", 3000, "success");
        }
      });
    }
  };

  //Delete role
  const handleDelete = (role) => {
    fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.deleteRole}${role?.roleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      if (response.status != 200) {
        showSnackbar("Something went wrong", 3000, "error");
      } else {
        setRoles(roles.filter((delRole) => delRole.roleId !== role?.roleId));
        showSnackbar("Role deleted successfully", 3000, "success");
      }
    });
  };
  // Get all roles
  const getAllRoles = async () => {
    try {
      const response = await fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.getAllRoles}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    getAllRoles().then((data) => {
        var rolesList = [];
        data?.roles?.forEach((role) => {
          rolesList?.push({
            roleId: role?._id,
            roleName: role?.roleName,
            permissions: role?.permissions,
          });
        });
        setRoles(rolesList);
      });
  }
  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Container>
      {/* Add New Role Section */}
      <Paper sx={{ p: 2, mb: 2, alignContent: "center" }}>
        <Typography variant="h5" gutterBottom>
          Role & Permission Management
        </Typography>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginTop: "0.5rem",
          }}
        >
          <TextField
            label="Role Name"
            variant="outlined"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            size="small"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddRole}
            size="small"
            sx={{
              height: "2.5rem",
            }}
          >
            <AddModeratorIcon />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRefresh}
            size="small"
            sx={{
              height: "2.5rem",
            }}
          >
            <LoopIcon />
          </Button>
        </div>
      </Paper>

      {/* Roles Table */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "4px 8px", fontWeight: "bold" }}>
                Role Name
              </TableCell>
              <TableCell sx={{ padding: "4px 8px", fontWeight: "bold" }}>
                Permissions
              </TableCell>
              <TableCell
                sx={{ padding: "4px 8px", fontWeight: "bold" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.roleId}>
                {/* Role Name */}
                <TableCell
                  sx={{
                    padding: "4px 8px",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  }}
                >
                  {editingRoleId === role.roleId ? (
                    <TextField
                      value={editedRole.roleName}
                      onChange={handleRoleNameChange}
                      size="small"
                      variant="outlined"
                      style={{ fontSize: "0.75rem" }}
                    />
                  ) : (
                    role.roleName
                  )}
                </TableCell>

                {/* Permissions */}
                <TableCell sx={{ padding: "4px 8px" }}>
                  {permissionList.map((permission) => (
                    <div
                      key={permission.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "2px",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem" }}>
                        {permission.label}
                      </span>
                      {editingRoleId === role.roleId ? (
                        <Checkbox
                          checked={!!editedRole.permissions[permission.key]}
                          onChange={() =>
                            handlePermissionChange(permission.key)
                          }
                          size="small"
                        />
                      ) : (
                        <Checkbox
                          checked={!!role.permissions[permission.key]}
                          disabled
                          size="small"
                        />
                      )}
                    </div>
                  ))}
                </TableCell>

                {/* Actions */}
                <TableCell
                  sx={{
                    padding: "4px 8px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                  align="center"
                >
                  {editingRoleId === role.roleId ? (
                    <>
                      <Tooltip title="Save">
                        <IconButton
                          color="primary"
                          onClick={handleSave}
                          size="small"
                          disabled={
                            role?.roleName == "admin" ||
                            role?.roleName == "guest"
                          }
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          color="secondary"
                          onClick={handleCancel}
                          size="small"
                          disabled={
                            role?.roleName == "admin" ||
                            role?.roleName == "guest"
                          }
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(role)}
                          size="small"
                          disabled={
                            role?.roleName == "admin" ||
                            role?.roleName == "guest"
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(role)}
                          size="small"
                          disabled={
                            role?.roleName == "admin" ||
                            role?.roleName == "guest"
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RolePermissionManagement;
