import React, { useState } from "react";
import { Link, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import { useSnackbar } from "./snackbar";
import API from "../constants";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const showSnackbar = useSnackbar();

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email)
      ? ""
      : "Please enter a valid email address.";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate email
    const emailValidationError = validateEmail();
    setEmailError(emailValidationError);
  
    if (emailValidationError) return;
  
    try {
      // Show loading indicator or disable the submit button here (optional)
      const response = await fetch(API.DATA_URL + API.DATA_ENDPOINTS.signin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Process successful login
        const user = {
          ...data.user,
          createdAt: formatDate(data.user.createdAt), // Assuming formatDate is defined
        };
  
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", data.token);
  
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        // Handle errors from the server
        showSnackbar(data.message || "Something went wrong", 3000, "error");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error during sign-in:", error);
      showSnackbar("Something went wrong. Please try again later.", 3000, "error");
    } finally {
      // Hide loading indicator or enable the submit button here (if used)
      console.log("Form submitted", { email, password });
    }
  };  

  return (
    <Container
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          minWidth: "50%",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        direction="column"
        alignContent={"center"}
        justifyContent="space-evenly"
      >
        <PersonIcon
          sx={{ alignSelf: "center", fontSize: "7rem" }}
          color="primary"
        />
        <Typography variant="h4" color="primary" textAlign={"center"}>
          SignIn
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          InputProps={{
            startAdornment: <EmailIcon sx={{ padding: "0.1rem" }} />,
          }}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={emailError}
          error={Boolean(emailError)}
          autoComplete="off"
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          InputProps={{
            startAdornment: <PasswordIcon sx={{ padding: "0.1rem" }} />,
          }}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={passwordError}
          error={Boolean(passwordError)}
          autoComplete="off"
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            textTransform: "none",
          }}
          onClick={handleSubmit}
        >
          <Typography>Sign In</Typography>
        </Button>

        <Link
          textAlign={"center"}
          underline="hover"
          fontFamily={"monospace"}
          href="/"
        >
          New user? Click here
        </Link>
      </Stack>
    </Container>
  );
};

export default Signin;
