import React from 'react';

import { Box, Container, Typography } from '@mui/material';

const welcomes = [
  <p>print("Welcome")</p>,
  <p>std::cout&lt;&lt;"Welcome"&lt;&lt;"\n";</p>,
  <p>printf("Welcome");</p>,
  <p>System.out.println("Welcome");</p>,
  <p>echo "Welcome" </p>,
  <p>Console.WriteLine("Welcome");</p>,
  <p>document.write("Welcome");</p>,
  <p>SELECT "Welcome"</p>,
  <p>putStrLn "Welcome"</p>,
  <p>println("Welcome");</p>
];

const Homescreen = () => {
  return (
    <Container>
      <Box sx={{
        display: 'flex', justifyContent: 'center', pt: '100px', pb: '100px'
      }}>
        <Typography variant='h2'>
          {welcomes[Math.floor(Math.random() * welcomes.length)]}
        </Typography>
      </Box>
    </Container>
  )
}

export default Homescreen;
