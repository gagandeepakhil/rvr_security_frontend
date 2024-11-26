
# Role-Based Access Control (RBAC) System

## Overview

This project is a Role-Based Access Control (RBAC) system designed with a user-friendly interface for managing users, roles, and permissions. The system supports role-based permissions, token-based authentication, search, filtering, and robust error handling for secure and efficient access control.

## Features

### User Authentication
- **Sign-in Page:** Login using email and password.
- **Sign-up Page:**
  - New users verify their email via OTP.
  - After verification, users send an access request to the admin.

---

### Dashboard Sections
1. **Main Page:** Overview and system summary.
2. **Request Management:**
   - Admin can view all user requests (pending, approved, declined).
   - Admin can accept or reject access requests.
3. **Role Management:**
   - Default roles: **Admin** and **Guest**.
   - Admin can create custom roles with specific permissions:
     - Create, Edit, Delete.
     - View All Users.
     - View Personal Details.
     - Approve User Creation.
     - Manage Roles.
   - If a role is deleted, all associated users are demoted to the Guest role.
4. **User Management:**
   - Admin can:
     - Add users.
     - Edit user details (name, email, role, and status).
   - **Inactive Users:** Cannot log in.
   - Default Admin Account: `admin@example.com` (cannot be deleted or modified).

---

### Search, Filter, and Sorting
- **Search Users:** Quickly locate users.
- **Filter by Roles:** Narrow down users by their assigned roles.
- **Sorting:** Organize user lists based on various criteria.

---

### Security Features
- **Password Management:**
  - Default password for newly created users: Email prefix (trimmed before `@`).
  - Users can update their passwords in their dashboard.
  - Admin password: `Adm!n$tr@t0r`.
- **Input Validation:**
  - Validates email and password formats for security.
- **Token Expiration:** Ensures secure session handling.
- **Error Handling:** Comprehensive error management ensures seamless operation and clear feedback.

---

## Tech Stack
- **Frontend:** React.js, MUI.
- **Backend:** Node.js (MVC Rest architecture).
- **Database:** MongoDB.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) installed or accessible.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/gagandeepakhil/rvr_security_frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rbac-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     OTP_EXPIRATION_TIME=10m
     TOKEN_EXPIRATION_TIME=1h
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage
1. Access the application at `http://localhost:3000` (default).
2. Sign up, verify your email, and send a request to the admin.
3. Admin can manage users, roles, and requests via the dashboard.

---

## Contributions
Feel free to contribute by submitting issues or pull requests. For major changes, please open a discussion to propose your ideas.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments
Special thanks to the open-source community for providing tools and inspiration for this project.
