import React from 'react'

import { Box, Container, Typography } from '@mui/material';

import { projects } from './projects';

const Projects = () => {

  return (
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
        <Typography sx={{
          fontWeight: 500,
          fontSize: 60,
          fontFamily: 'consolas, monospace'
        }}>
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
            fontWeight: 30,
            fontFamily: 'Helvetica, sans-serif'
          }}>{title}</Typography>
          <Typography sx={{
            fontSize: 18,
            fontWeight: 10,
            fontFamily: 'Helvetica, sans-serif'
          }}>{description}</Typography>
        </Box>
      ))}
    </Container>
  )
}

export default Projects;
