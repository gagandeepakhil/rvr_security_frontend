import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Create a Context
const SnackbarContext = createContext();

// Provider Component
export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    autoHideDuration: 6000,
    color: 'default',
  });

  const showSnackbar = (message, duration = 6000, color = 'default') => {
    setSnackbarState({
      open: true,
      message,
      autoHideDuration: duration,
      color,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={handleClose}
        message={snackbarState.message}
        ContentProps={{
          style: {
            backgroundColor:
              snackbarState.color === 'success'
                ? '#4caf50'
                : snackbarState.color === 'error'
                ? '#f44336'
                : snackbarState.color === 'warning'
                ? '#ff9800'
                : snackbarState.color === 'info'
                ? '#2196f3'
                : '#333',
            color: '#fff',
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </SnackbarContext.Provider>
  );
};

// Custom Hook to Use Snackbar
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
