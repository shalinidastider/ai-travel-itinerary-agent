'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#9D97FF',
      dark: '#4A42CC',
    },
    secondary: {
      main: '#FF6B9D',
      light: '#FF9DC0',
      dark: '#CC4A7A',
    },
    background: {
      default: '#0A0E1A',
      paper: '#121829',
    },
    success: {
      main: '#00E5A0',
      light: '#33EDB6',
      dark: '#00B880',
    },
    warning: {
      main: '#FFB547',
      light: '#FFC76E',
      dark: '#CC9039',
    },
    error: {
      main: '#FF5252',
      light: '#FF7B7B',
      dark: '#CC4242',
    },
    text: {
      primary: '#E8EAF6',
      secondary: '#9FA8DA',
    },
    divider: 'rgba(159, 168, 218, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)',
          boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%)',
            boxShadow: '0 6px 30px rgba(108, 99, 255, 0.45)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(159, 168, 218, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(159, 168, 218, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(108, 99, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(108, 99, 255, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: 'rgba(159, 168, 218, 0.15)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(108, 99, 255, 0.4)',
            },
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(159, 168, 218, 0.08)',
          borderRadius: '12px !important',
          marginBottom: 8,
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: '0 0 8px 0',
          },
        },
      },
    },
  },
});

export default theme;
