import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// Create RTL Cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create Custom Theme
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#eb6a1d', // Orange Brand Color
      contrastText: '#fff',
    },
    secondary: {
      main: '#064e3b', // Green Brand Color
    },
  },
  typography: {
    fontFamily: 'Cairo, sans-serif',
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12, // Rounded-xl
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            opacity: 0.9,
            boxShadow: 'none',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Toaster position="top-center" reverseOrder={false} />
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
)
