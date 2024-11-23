import React, { useState } from "react";
import { Link, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PersonIcon from '@mui/icons-material/Person';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) ? "" : "Please enter a valid email address.";
  };

  const validatePassword = () => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    else if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    else if (!/\d/.test(password)) errors.push("At least one number");
    else if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    else if (!/[@$!%*?&]/.test(password))
      errors.push("At least one special character");
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailValidationError = validateEmail();
    const passwordValidationError = validatePassword();

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (!emailValidationError && !passwordValidationError) {
      // Proceed with form submission (e.g., API call)
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
        <PersonIcon sx={{ alignSelf: "center", fontSize: "7rem" }} color="primary" />
        <Typography variant="h4" color="primary" textAlign={"center"}>
          SignIn
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
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
