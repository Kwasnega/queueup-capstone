import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5596ff',
      light: '#7db3ff',
      dark: '#3d7bdb',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#6c757d',
      light: '#9ca3af',
      dark: '#495057',
      contrastText: '#ffffff'
    },
    error: {
      main: '#e05656',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000'
    },
    info: {
      main: '#17a2b8',
      light: '#4dd0e1',
      dark: '#0c5460',
      contrastText: '#ffffff'
    },
    success: {
      main: '#28a745',
      light: '#66bb6a',
      dark: '#155724',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      disabled: '#9ca3af'
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    common: {
      black: '#000000',
      white: '#ffffff'
    },
    divider: '#e5e7eb'
  },
  typography: {
    fontFamily: 'Inter, Poppins, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    '0 4px 12px rgba(0,0,0,0.06)',
    '0 8px 32px rgba(0,0,0,0.08)',
    '0 10px 30px rgba(0,0,0,0.1)',
    '0 12px 24px rgba(0,0,0,0.15)',
    '0 2px 8px rgba(0,0,0,0.15)',
    '0 6px 18px rgba(0,0,0,0.05)',
    '0 20px 40px rgba(0,0,0,0.2)',
    '0 8px 32px rgba(0,0,0,0.4)',
    '0 4px 12px rgba(0,0,0,0.2)',
    '0 2px 8px rgba(0,0,0,0.04)',
    '0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.15)',
    '0 12px 24px rgba(0,0,0,0.1)',
    '0 10px 30px rgba(0,0,0,0.1)',
    '0 8px 32px rgba(0,0,0,0.08)',
    '0 6px 18px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.06)',
    '0 2px 8px rgba(0,0,0,0.04)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    }
  }
});

export default theme;