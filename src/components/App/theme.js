import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

const themeBreakpoints = createTheme();

const theme = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 14,
    h1: {
      fontSize: '1.2rem',
      '@media (min-width:480px)': {
        fontSize: '1.7rem',
      },
      [themeBreakpoints.breakpoints.up('sm')]: {
        fontSize: '2.5rem'
      },
      [themeBreakpoints.breakpoints.up('md')]: {
        fontSize: '3rem',
      },
      fontFamily: 'consolas, monospace',
      fontWeight: 100
    },
    h3: {
      fontSize: '1.3rem',
      '@media (min-width:200px)': {
        fontSize: '2.5rem',
      },
      [themeBreakpoints.breakpoints.up('md')]: {
        fontSize: '3rem',
      },
      fontFamily: 'consolas, monospace',
      fontWeight: 500
    },
    h5: {
      fontFamily: 'consolas, monospace',
      fontSize: 30,
    }
  },
};

const light = {
  palette: {
    background: {
      default: "#faf9f6"
    },
    text: {
      primary: "#222222",
      subheader: "#00000099",
    },
    primary: {
      main: "#505050f1",
      link: "#4280eb",
    },
    mode: "light",
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#faf9f6f1",
        },
      },
    },
  },
};

const dark = {
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff",
      subheader: "#ffffffb3",
    },
    primary: {
      main: "#faf9f6",
      link: "#42afeb",
    },
    mode: "dark",
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#151515f1',
        },
      },
    },
  },
};

export const themeLight = createTheme(deepmerge(theme, light));

export const themeDark = createTheme(deepmerge(theme, dark));