const API={
    OTP_URL:"https://mail-otp-sender.vercel.app/",
    // OTP_URL:"http://localhost:3001",
    DATA_URL:"http://localhost:5000",
    DATA_ENDPOINTS:{
        "signin":"/api/users/login",
        "sendUserRequest":"/api/user-requests/send-request",
        "getAllRequests":"/api/user-requests/getAllRequests",
        "updateRequestStatus":"/api/user-requests/updateRequestStatus",
    }
}

export default API;