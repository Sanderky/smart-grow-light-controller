import { createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Theme {
    box: {
      bgColor: string;
      borderRadius: string;
      borderColor: string;

    };
  }

  interface ThemeOptions {
    box?: {
      bgColor?: string;
      borderRadius: string;
      borderColor: string;

    };
  }
}


const theme = createTheme({
  palette: {
    text: {
      primary: '#f6f7f8'
    }
  },
  box: {
    // bgColor: 'rgba(101, 117, 133, 0.16)',
    bgColor: '#15181b',
    borderRadius: '8px',
    borderColor: '#21262b'
  },
  typography: {
    body1: {
      color: '#a3beb6'
    },
    h1: {
      color: '#f6f7f8',
      fontWeight: 'bold'
    },
    h3: {
      color: '#f6f7f8',
      fontSize: '1.2rem',
      fontWeight: '400'
    }
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#a3beb6',
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        standardWarning: {
          backgroundColor: 'rgba(173, 104, 0, 0.12)',
          border: '1px solid rgba(245, 196, 0, 0.1)',
          color: '#f6f7f8'

        }
      }
    }
  }
});

export default theme;
