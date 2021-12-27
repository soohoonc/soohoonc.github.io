import React from 'react';
import TypeAnimation from 'react-type-animation';

import { Box, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

theme.typography.h1 = {
  fontSize: '1.3rem',
  '@media (min-width:480px)': {
    fontSize: '1.7rem',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem',
  },
  fontFamily: 'consolas, monospace',
  fontWeight: 100
};

const welcomes = [
  'print("Welcome")', 5000,
  'std::cout<<"Welcome"<<"\\n";', 5000,
  'printf("Welcome");', 5000,
  'System.out.println("Welcome");', 5000,
  'echo "Welcome"', 5000,
  'Console.WriteLine("Welcome");', 5000,
  'document.write("Welcome");', 5000,
  'SELECT "Welcome"', 5000,
  'putStrLn "Welcome"', 5000,
  'println("Welcome");', 5000, ''
];

const Homescreen = () => {

  return (
    <ThemeProvider theme={theme}>
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '40px',
        paddingBottom: '50px'
      }}>
        <Typography variant="h1">
          <TypeAnimation
            cursor={true}
            sequence={welcomes}
            repeat={Infinity}
          />
        </Typography>
      </Box>
      <Container sx={{
        padding: '40px',
        textAlign: 'center',
        boxShadow: 3
      }}>
        <Box>
          <Typography>
            Hello there, I am a 3rd year CS and math major @ GT :)
          </Typography>
        </Box>
        <Box>
          <Typography>
            You can check out some of the projects I have done, my resume, and just more about me in general.<br />
          </Typography>
        </Box>
      </Container>
    </Container>
    </ThemeProvider>
  )
}

export default Homescreen;
