import React from "react";
import API from "../../constants";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import UserTable from "./usertable";

const UserManagement = () => {
  const [usersData, setUsersData] = React.useState([]);
  const [rolesList, setRolesList] = React.useState([]);
  const [roleMap, setRoleMap] = React.useState({});

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

  React.useEffect(() => {
    getAllUsers().then((data) => {
      // setUserData(data.users);
      //create users data
      var usersData=[];
      data.users.forEach((user) => {
        usersData.push({
          id:user._id,
          name: user.name,
          email: user.email,
          roleName: user.roleId.roleName,
          status: user.status,
          createdAt: user.createdAt,
        });
      })
      console.log(usersData,data);
      
      setUsersData(usersData);
    });
    getAllRoles().then((data) => {
      console.log(data);
      //map role Name to id
      const roleMap = {};
      data.roles.forEach((role) => {
        roleMap[role.roleName] = role._id;
      });
      console.log(roleMap);
      setRoleMap(roleMap);
      setRolesList(data.roles.map((role) => role.roleName));
    });
  }, []);

  return (
    <Stack spacing={2} direction={"column"}>
      {usersData.length > 0 && (
        <UserTable
        editableFields={editableFields}
        columns={columns}
        rolesList={rolesList}
        data={usersData}
        roleMap={roleMap}
      />
      )}
    </Stack>
  );
  
};

export default UserManagement;
