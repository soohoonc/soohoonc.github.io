import * as React from 'react';

import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// const welcomes = [
//   'print("Welcome")', 5000,               // Python
//   'std::cout<<"Welcome"<<"\\n";', 5000,   // C++
//   'printf("Welcome");', 5000,             // C
//   'System.out.println("Welcome");', 5000, // Java
//   'echo "Welcome"', 5000,                 // Shell
//   'Console.WriteLine("Welcome");', 5000,  // C#
//   'document.write("Welcome");', 5000,     // Javascript
//   'SELECT "Welcome"', 5000,               // SQL
//   'putStrLn "Welcome"', 5000,             // Haskell
//   'println("Welcome");', 5000, ''         // Lots of languages tbh
// ];

const Homescreen = () => {

  const theme = useTheme();

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '40px',
        paddingBottom: '50px'
      }}>
        <Typography variant="h1" sx={{fontFamily: [
      'consolas',
      'monospace',
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
    ].join(',')}}>
      
      {/* </Typography> */}
          {/* <TypeAnimation
            cursor={true}
            sequence={welcomes}
            repeat={Infinity}
          /> */}
          Welcome
        </Typography>
      </Box>
      <Container sx={{
        padding: '40px',
        textAlign: 'center',
        boxShadow: 3
      }}>
        <Box>
          <Typography>
            I am currently building <a style={{
            textDecoration: 'none' , color: theme.palette.primary.link
          }}href="https://tabnam.com/">Tabnam</a>
          </Typography>
        </Box>
        <Box>
          <Typography>
            This website is currently under construction<br />
          </Typography>
        </Box>
      </Container>
    </Container>
  )
}

export default Homescreen;
