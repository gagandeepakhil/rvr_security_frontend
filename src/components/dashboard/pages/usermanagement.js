import React from "react";
import API from "../../../constants";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import UserTable from "./usertable";
import { useSnackbar } from "../../snackbar";

const UserManagement = () => {
  const [usersData, setUsersData] = React.useState([]);
  const [rolesList, setRolesList] = React.useState([]);
  const [roleMap, setRoleMap] = React.useState({});
  const [currentPermissions, setCurrentPermissions] = React.useState({});

  const showSnackbar = useSnackbar();

  const editableFields = ["name", "email", "roleName", "status"];
  const columns = [
    {
      columnName: "name",
      type: "text",
      displayName: "Name",
    },
    {
      columnName: "email",
      type: "email",
      displayName: "Email",
    },
    {
      columnName: "roleName",
      type: "select",
      options: rolesList,
      displayName: "Role",
    },
    {
      columnName: "status",
      type: "select",
      options: ["Active", "Inactive"],
      displayName: "Status",
    },
    {
      columnName: "createdAt",
      type: "date",
      displayName: "Created At",
    },
  ];
  const getAllUsers = async () => {
    try {
      const response = await fetch(
        `${API.DATA_URL}${API.DATA_ENDPOINTS.getAllUsers}`,
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

  const getCurrentPermissions = async () => {
    const roleId = JSON.parse(localStorage.getItem("user")).roleId;
    try {
      fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.getRoleById}${roleId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setCurrentPermissions(data.role.permissions);
          showSnackbar("Data loaded", 3000, "success");
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefrehsh = () => {
    showSnackbar("Loading data", 3000, "info");
    getAllUsers().then((data) => {
      if (data?.error) {
        showSnackbar(data?.error, 3000, "error");
        return;
      }
      // setUserData(data.users);
      //create users data
      var usersData = [];
      data?.users?.forEach((user) => {
        usersData.push({
          id: user._id,
          name: user.name,
          email: user.email,
          roleName: user.roleId.roleName,
          status: user.status,
          createdAt: user.createdAt,
        });
      });
      console.log(usersData, data);

      setUsersData(usersData);
    });
    getAllRoles()
      .then((data) => {
        console.log(data);
        if (data?.error) {
          showSnackbar(data?.error, 3000, "error");
          return;
        }
        //map role Name to id
        const roleMap = {};
        data?.roles?.forEach((role) => {
          roleMap[role?.roleName] = role._id;
        });
        console.log(roleMap);
        setRoleMap(roleMap);
        setRolesList(data?.roles?.map((role) => role?.roleName));
      })
      .catch((error) => {
        console.error(error);
        showSnackbar(error?.message, 3000, "error");
      });
    getCurrentPermissions();
  };

  React.useEffect(() => {
    handleRefrehsh();
  }, []);

  return (
    <>
    {usersData.length > 0 ? (
        <UserTable
          editableFields={editableFields}
          columns={columns}
          rolesList={rolesList}
          data={usersData}
          roleMap={roleMap}
          currentPermissions={currentPermissions}
          handleRefresh={handleRefrehsh}
        />
      ): <p>No users found</p>}</>
      
  );
};

export default UserManagement;
