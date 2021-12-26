import React from 'react';

import { Box, Container, Typography } from '@mui/material';
// import { makeStyles } from '@mui/styles';

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

// const useStyle = makeStyles((theme) => ({
//   box: {
//     display: 'flex',
//     justifyContent: 'center',
//     paddingTop: '40px',
//     paddingBottom: '50px'
//   },
//   container: {
//     padding: '40px',
//     textAlign: 'center',
//   },
//   welcomeText: {
//     fontFamily: 'consolas, monospace',
//     fontSize: 72,
//     fontweight: 100,
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: 10,
//     fontFamily: 'Helvetica, sans-serif',
//   }
// }));


const Homescreen = () => {

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '40px',
        paddingBottom: '50px'
      }}>
        <Typography sx={{
          fontFamily: 'consolas, monospace',
          fontSize: 72,
          fontweight: 100,
        }}>
          {welcomes[Math.floor(Math.random() * welcomes.length)]}
        </Typography>
      </Box>
      <Container sx={{
        padding: '40px',
        textAlign: 'center',
        boxShadow: 3
      }}>
        <Box>
          <Typography sx={{
            fontSize: 18,
            fontWeight: 10,
            fontFamily: 'Helvetica, sans-serif',
          }}>
            Hello there, I am a 3rd year CS and math major @ GT :)
          </Typography>
        </Box>
        <Box>
          <Typography sx={{
            fontSize: 18,
            fontWeight: 10,
            fontFamily: 'Helvetica, sans-serif',
          }}>
            You can check out some of the projects I have done, my resume, and just more about me in general.<br />
          </Typography>
        </Box>
      </Container>
      
    </Container>
  )
}

export default Homescreen;
