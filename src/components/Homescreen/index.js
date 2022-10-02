import React from 'react';
import TypeAnimation from 'react-type-animation';

import { Box, Container, Typography } from '@mui/material';

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
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '40px',
        paddingBottom: '50px'
      }}>
        <Typography variant="h1" fontFamily="consolas">
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
            Hello there, I am a 4rd year CS and math major @ GT :)
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
