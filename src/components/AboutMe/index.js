import React from 'react'

import { Box, Container, Typography } from '@mui/material';

export const AboutMe = () => {

const path = window.location.origin

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
        <Typography variant="h3">
          SooHoon Choi
        </Typography>
      </Box>
      <Box sx={{
        p: '30px',
        boxShadow:3
      }}>
        <Typography>
          I am a fourth year computer science and mathematics major at the Georgia Institute of Technology.
          I am a Korean Citizen who lived in the Philippines for 18 years in my childhood and am currently a United States permanent resident attending university in Atlanta, Georgia.
          The majority of my day is spent learning and practicing various computer science and programming principles, I enjoy learning more about the field.
          I am interested in all things math and science, but the same could be said for most other subjects.
          If time permits I like to read up on philosophy, history, and art.
          I haven't been able to paint too often in the past few years because life has become so busy :(.
        </Typography>
        
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pt: '50px'
      }}>
        <Typography>
          Built with
        </Typography>
        <img src={path + '/assets/images/react_icon.svg'} alt={'react_icon.svg'} style={{width:'45px'}}/>
      </Box>
    </Container>
  )
}

export default AboutMe;