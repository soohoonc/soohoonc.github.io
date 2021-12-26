import React from 'react'

import { Box, Container, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerBox: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px'
  },
  headerText: {
    fontWeight: 500,
    fontSize: 60,
    fontFamily: 'consolas, monospace'
  },
  textBox: {
    padding: '30px',
  },
  text: {
    fontSize: 16,
    fontWeight: 10,
    fontFamily: 'Helvetica, sans-serif'
  }
}))

export const AboutMe = () => {

  const classes = useStyle();

  return (
    <Container className={classes.container}>
      <Box className={classes.headerBox}>
        <Typography className={classes.headerText}>
          SooHoon Choi
        </Typography>
      </Box>
      <Box className={classes.textBox} sx={{boxShadow:3}}>
        <Typography className={classes.text}>
          I am a third year computer science and mathematics major at the Georgia Institute of Technology.
          I am a Korean Citizen who lived in the Philippines for 18 years in my childhood and am currently a United States permanent resident attending university in Georgia.
          The majority of my day is spent learning and practicing various computer science and programming principles, I enjoy learning more about the field.
          I am interested in all things math and science, but the same could be said for almost any other subject.
          If time permits I like to read up on philosophy, history, and art.
        </Typography>
      </Box>
      
    </Container>
  )
}

export default AboutMe;