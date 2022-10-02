import React from 'react';
import TypeAnimation from 'react-type-animation';

import { Box, Container, Typography } from '@mui/material';

const welcomes = [
  'print("Welcome")', 5000,               // Python
  'std::cout<<"Welcome"<<"\\n";', 5000,   // C++
  'printf("Welcome");', 5000,             // C
  'System.out.println("Welcome");', 5000, // Java
  'echo "Welcome"', 5000,                 // Shell
  'Console.WriteLine("Welcome");', 5000,  // C#
  'document.write("Welcome");', 5000,     // Javascript
  'SELECT "Welcome"', 5000,               // SQL
  'putStrLn "Welcome"', 5000,             // Haskell
  'println("Welcome");', 5000, ''         // Lots of languages tbh
];

const Homescreen = () => {

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
            Hello there, I am a 4th year computer science and math major @ Georgia Tech :)
          </Typography>
        </Box>
        <Box>
          <Typography>
            You can check out my work experience, projects completed, my resume, and just more about me in general.<br />
          </Typography>
        </Box>
      </Container>
    </Container>
  )
}

export default Homescreen;
