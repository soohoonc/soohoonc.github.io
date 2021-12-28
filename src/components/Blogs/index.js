import React from 'react'
import { NavLink } from 'react-router-dom';

import { Box, Container, Grid, Typography } from '@mui/material';
import { useTheme, ThemeProvider } from '@mui/material/styles';

import NavBarBlog from '../NavBarBlog';


const Blogs = () => {

  const theme = useTheme();

  theme.typography.h3 = {
    fontSize: '1.5rem',
    '@media (min-width:360px)': {
      fontSize: '2.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
    fontFamily: 'consolas, monospace',
    fontWeight: 500
  };

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
          Blogs
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 0, md: 0}} columns={{xs:4, md: 12}}>
        <Grid item xs={0} md={1} />
        <Grid item xs={4} md={7}>
          <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>         
            {welcomeArticle(theme)}
          </Container>
        </Grid>
        <Grid item xs={4} md={4}>
          <NavBarBlog />
        </Grid>
      </Grid>
    </Container>
    </ThemeProvider>
  )
}

const welcomeArticle = (theme) => {
  return (
    <Box boxShadow={3} sx={{
      px: '30px',
      py: '10px'
    }}>
    <Typography variant='h6' sx={{
      pb: '10px'
    }}>
      Welcome to My Blog
    </Typography>
    
    <Typography>
      &emsp;Hello, this portion of the website is still currently in the works but I hope to upload anything from random musings, college courses,
      to maybe even full on lecture type/informative articles on topics ranging from math and computer science to art. <br />
      &emsp;It is just a space that I have full control over to share about things that I want to talk about and topics that interest me,
      I hope that with the expansion of this portion of the website others can get to know more about me as a person.
    </Typography>
    <Typography variant='h6' sx={{
      pt: '20px'
    }}>
      Latest Entries
    </Typography>
    <NavLink to='/blogs/0'  style={{
      textDecoration: 'none', color: theme.palette.primary.link
    }}>
      <Typography>
        Courses Taken: Summary of courses during my undergraduate years
      </Typography>
    </NavLink>
    </Box>
    
  )
}

export default Blogs
