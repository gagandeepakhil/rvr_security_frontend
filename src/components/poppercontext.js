import React, { createContext, useContext, useState, useCallback } from "react";
import { Popper, Button, Typography, Box } from "@mui/material";

const PopperContext = createContext();

export const PopperProvider = ({ children }) => {
  const [popperState, setPopperState] = useState({
    open: false,
    message: "",
    resolve: null,
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setPopperState({ open: true, message, resolve });
    });
  }, []);

  const handleClose = (result) => {
    if (popperState.resolve) {
      popperState.resolve(result);
    }
    setPopperState({ open: false, message: "", resolve: null });
  };

  return (
    <PopperContext.Provider value={{ confirm }}>
      {children}
      <Popper
        open={popperState.open}
        placement="auto"
        style={{
          zIndex: 1300,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Box
          sx={{ p: 2, backgroundColor: "white", borderRadius: 1, boxShadow: 3,opacity:0.9 ,border: "1px solid black",backdropFilter:"blur(5px)" }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            {popperState.message}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClose(true)}
            >
              Ok
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Popper>
    </PopperContext.Provider>
  );
};

export const usePopper = () => useContext(PopperContext);
