import { createTheme, type PaletteColor, type PaletteColorOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Palette {
    day: PaletteColor;
    night: PaletteColor;
  }
  interface PaletteOptions {
    day?: PaletteColorOptions;
    night?: PaletteColorOptions;
  }
}

declare module '@mui/material/ToggleButton' {
  interface ToggleButtonPropsColorOverrides {
    day: true;
    night: true;
  }
}

const { palette } = createTheme();


const createColor = (mainColor: string) => palette.augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
    mode: 'dark',
    // primary: {
    //   main: '#A5D6A7',
    //   light: '#d7ffd9',
    //   dark: '#75a478',
    //   contrastText: 'rgba(0, 0, 0, 0.87)'
    // },
    primary: createColor('#5D8736'),
    day: createColor('#E2852E'),
    night: createColor('#6594B1'),

    text: {
      primary: '#f6f7f8',
      secondary: '#a3beb6'
    },
    divider: '#a3beb6',
    background: {
      paper: '#171717',
      default: '#1f1f1f'
    }
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
