import React from 'react'

import { Box, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { projects } from './projects';

const theme = createTheme();

theme.typography.h3 = {
  fontSize: '2rem',
  '@media (min-width:200px)': {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem',
  },
  fontFamily: 'consolas, monospace',
  fontWeight: 500
};

const Projects = () => {

  return (
    <ThemeProvider theme={theme}>
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '30px'
      }}>
        <Typography variant='h3'>
          Projects
        </Typography>
      </Box>
      
      {projects.map(({title, description}, index) => (
        <Box key={index} sx={{
          padding: '30px',
          margin: '10px',
          boxShadow:3
        }}>
          <Typography sx={{
            fontSize: 28,
          }}>{title}</Typography>
          <Typography>{description}</Typography>
        </Box>
      ))}
    </Container>
    </ThemeProvider>
  )
}

export default Projects;
