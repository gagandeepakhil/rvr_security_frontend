import React, { useState, useEffect } from "react";
import { Link, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import API from "../constants";
import { useSnackbar } from "./snackbar";

const Signup = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [currentOtp, setCurrentOtp] = useState("");
  const [verificationOtp, setVerificationOtp] = useState(null);
  const [buttonText, setButtonText] = useState("Send OTP");
  const [isVerified, setIsVerified] = useState(false);

  // Touched states
  const [nameTouched, setNameTouched] = useState(false);
  const [mailTouched, setMailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [otpTouched, setOtpTouched] = useState(false);

  const showSnackbar = useSnackbar();

  //implement timer for resend otp
  const [timer, setTimer] = useState(0); // Timer state
  const [isResendDisabled, setIsResendDisabled] = useState(false); // Resend button state

  // Countdown logic
  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeoutId); // Cleanup on unmount
    }
  }, [timer]);

  // Enable resend button when timer reaches 0
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Error validation
  const validateName = () => (name.trim() ? "" : "Name is required.");
  const validateMail = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? "" : "Enter a valid email.";
  const validatePassword = () => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    else if (!/[A-Z]/.test(password))
      errors.push("At least one uppercase letter");
    else if (!/\d/.test(password)) errors.push("At least one number");
    else if (!/[a-z]/.test(password))
      errors.push("At least one lowercase letter");
    else if (!/[@$!%*?&]/.test(password))
      errors.push("At least one special character");
    return errors;
  };

  function generateMD5(input) {
    input = window.md5.update(input);
    return input;
  }

  const validateOtp = () => {
    if (!currentOtp || !verificationOtp) return "OTP is required.";
    console.log(generateMD5(currentOtp), verificationOtp, currentOtp);

    if (generateMD5(currentOtp) != verificationOtp) {
      return "Invalid OTP. Please try again.";
    }

    return "";
  };

  const requestOTP = async () => {
    // Validate email before sending OTP
    const emailValidationError = validateMail();
    if (emailValidationError) {
      showSnackbar(emailValidationError, 3000, "error");
      return; // Don't send OTP if email is invalid
    }

    if (!mail) {
      showSnackbar("Email is required to request OTP", 3000, "error");
      return;
    }
    showSnackbar("Sending OTP", 3000, "warning");
    const response = await fetch(API.OTP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: mail,
        digit: 6,
        message: "Dear user,",
      }),
    });

    const data = await response.json();
    if (data.otp) {
      setVerificationOtp(data.otp.toString());
      setButtonText("Resend OTP");
      showSnackbar("OTP sent successfully", 3000, "success");
      setIsResendDisabled(true);
      setTimer(60);
    } else {
      showSnackbar("Failed to send OTP. Please try again.", 3000, "error");
    }
  };

  const verifyOTP = () => {
    const otpValidationError = validateOtp();
    if (otpValidationError) {
      showSnackbar(otpValidationError, 3000, "error");
      return;
    }

    showSnackbar("OTP Verified", 3000, "success");
    setIsVerified(true);
    setButtonText("Send request to admin");
  };


  const signUp = async () => {
    const nameValidationError = validateName();
    const mailValidationError = validateMail();
    const passwordValidationError = validatePassword();

    if (
      nameValidationError ||
      mailValidationError ||
      passwordValidationError.length > 0
    ) {
      showSnackbar("Please fix the errors before signing up.", 3000, "error");
      return;
    }

    console.log(name, mail, password);
    showSnackbar("Sending request to admin", 3000, "warning");
    const response = await fetch(
      API.DATA_URL + API.DATA_ENDPOINTS.sendUserRequest,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: mail,
          password: password,
        }),
      }
    );

    const data = await response.json();
    console.log(data, response.status);

    //based on status code
    if (response.status === 200) {
      showSnackbar(data.message, 3000, "success");
    } else {
      showSnackbar(data.message, 3000, "error");
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
      >
        <PersonIcon
          sx={{ alignSelf: "center", fontSize: "7rem" }}
          color="primary"
        />
        <Typography variant="h4" color="primary" textAlign="center">
          SignUp
        </Typography>
        <TextField
          label="Name"
          InputProps={{
            startAdornment: <BadgeIcon sx={{ padding: "0.1rem" }} />,
          }}
          type="text"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setNameTouched(true)}
          autoComplete="off"
          error={nameTouched && !!validateName()}
          helperText={nameTouched ? validateName() : ""}
        />
        <TextField
          label="Email"
          InputProps={{
            startAdornment: <EmailIcon sx={{ padding: "0.1rem" }} />,
          }}
          sx={{
            textTransform: "lowercase",
          }}
          type="email"
          variant="outlined"
          value={mail}
          onChange={(e) => setMail(e.target.value.toLowerCase())}
          onBlur={() => setMailTouched(true)}
          autoComplete="off"
          error={mailTouched && !!validateMail()}
          helperText={mailTouched ? validateMail() : ""}
        />
        <TextField
          label="Password"
          InputProps={{
            startAdornment: <PasswordIcon sx={{ padding: "0.1rem" }} />,
          }}
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          autoComplete="off"
          error={passwordTouched && validatePassword().length > 0}
          helperText={
            passwordTouched &&
            validatePassword().length > 0 && (
              <ul style={{ margin: 0, paddingLeft: "20px", color: "red" }}>
                {validatePassword().map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )
          }
        />

        {verificationOtp && (
          <TextField
            label="OTP"
            type="text"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton onClick={verifyOTP}>
                  <CheckIcon />
                </IconButton>
              ),
            }}
            value={currentOtp}
            onChange={(e) => setCurrentOtp(e.target.value)}
            onBlur={() => setOtpTouched(true)}
            autoComplete="off"
            error={otpTouched && !!validateOtp()}
            helperText={otpTouched ? validateOtp() : ""}
          />
        )}
        {isResendDisabled && (
          <Typography
            variant="body2"
            color="primary"
            textAlign="center"
          >
            You can request OTP in {timer} seonds.
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            textTransform: "none",
          }}
          disabled={isResendDisabled && !isVerified}
          onClick={isVerified ? signUp : requestOTP}
        >
          <Typography>{buttonText}</Typography>
        </Button>

        <Link
          textAlign="center"
          underline="hover"
          fontFamily="monospace"
          href="/signin"
        >
          Already have an account? Click here
        </Link>
      </Stack>
    </Container>
  );
};

export default Signup;
