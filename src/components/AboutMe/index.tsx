import * as React from 'react'

import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const AboutMe = () => {

const path = window.location.origin

const theme = useTheme()

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
          I recently graduated from Georgia Tech with a B.S. in Computer Science and Mathematics.
          I am currently working on <a style={{
            textDecoration: 'none' , color: theme.palette.primary.link
          }}href="https://tabnam.com/">Tabnam</a>.
          As a nerd at heart, I love to learn more about any field of study. Some selected topics that I am interested in right now is algebraic topology, category theory, type theory, and  artificial intelligence.
          Feel free to reach out to me if you wanna chat about anything!
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