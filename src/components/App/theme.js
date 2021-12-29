import { createTheme } from '@mui/material/styles';

export const themeLight = createTheme({
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
});

export const themeDark = createTheme({
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
});