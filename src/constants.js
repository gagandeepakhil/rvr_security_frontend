const API={
    OTP_URL:"https://mail-otp-sender.vercel.app/",
    // OTP_URL:"http://localhost:3001",
    DATA_URL:"http://localhost:5000",
    DATA_ENDPOINTS:{
        "signin":"/api/users/login",
        "sendUserRequest":"/api/user-requests/send-request",
        "getAllRequests":"/api/user-requests/admin/requests",
        "updateRequestStatus":"/api/user-requests/admin/update-status",
        "getRoleById":"/api/roles/",
        "editUserDetails":"/api/users/",
        "getAllUsers":"/api/users/userslist",
        "getAllRoles":"/api/roles/roleslist",
        "deleteUser":"/api/users/",
        "addUser":"/api/users/add",
        "addRole":"/api/roles/define",
        "deleteRole":"/api/roles/",
        "editRole":"/api/roles/",
        "editPassword":"/api/users"
    }
}

export default API;