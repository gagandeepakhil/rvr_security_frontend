import React from "react";
import API from "../../constants";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import UserTable from "./usertable";

const UserManagement = () => {
  const [userData, setUserData] = React.useState([
    {
      id: "674361d1cff8fbf180a9ba63",
      name: "Admin",
      email: "admin@example.com",
      roleName: "admin",
      status: "Active",
      createdAt: "2024-11-24T17:26:41.382Z",
    },
    {
      id: "674362dfcff8fbf180a9ba82",
      name: "Gagan",
      email: "gagandeepdunna9@gmail.com",
      roleName: "guest",
      status: "Active",
      createdAt: "2024-11-24T17:31:11.397Z",
    },
  ]);
  const [rolesList, setRolesList] = React.useState(["admin", "guest"]);

  const editableFields = ["name", "email", "roleName", "status", "createdAt"];
  const columns = [
    {
      columnName: "name",
      type: "text",
    },
    {
      columnName: "email",
      type: "email",
    },
    {
      columnName: "roleName",
      type: "select",
      options: rolesList,
    },
    {
      columnName: "status",
      type: "select",
      options: ["Active", "Inactive"],
    },
    {
      columnName: "createdAt",
      type: "date",
    },
  ];
  //  const getAllUsers = async () => {
  //     try {
  //         const response = await fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.getAllUsers}`, {
  //             method: "GET",
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 "x-auth-token": localStorage.getItem("token"),
  //             },
  //         });
  //         const data = await response.json();
  //         return data;
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  // React.useEffect(() => {
  //     getAllUsers().then((data) => {
  //         // setUserData(data.users);
  //         console.log(data);

  //     });
  // }, []);

  // const getAllRoles = async () => {
  //     try {
  //         const response = await fetch(`${API.DATA_URL}${API.DATA_ENDPOINTS.getAllRoles}`, {
  //             method: "GET",
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 "x-auth-token": localStorage.getItem("token"),
  //             },
  //         });
  //         const data = await response.json();
  //         return data;
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  // React.useEffect(() => {
  //     getAllRoles().then((data) => {
  //         console.log(data);

  //     });
  // }, []);

  return (
    <Stack spacing={2} direction={"column"}>
      <Typography variant="h5" align="center">
        User Management
      </Typography>
      <UserTable
        data={userData}
        editableFields={columns.filter((col) =>
          editableFields.includes(col.columnName)
        )}
        columns={columns.map((col) => col.columnName)}
      />
    </Stack>
  );
};

export default UserManagement;
