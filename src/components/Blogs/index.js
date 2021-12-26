import React from 'react'

import { Box, Container, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '100px'
  },
  textBox: {
    padding: '30px',
    margin: '10px',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 10,
    fontFamily: 'Helvetica, sans-serif',
  }
}))
const Blogs = () => {
  
  const classes = useStyle();

  return (
    <Container className={classes.container}>
      <Box className={classes.textBox}>
        <Typography className={classes.text}>
          Currently Under Construction (as is the rest of the website)
        </Typography>
      </Box>
    </Container>
  )
}

export default Blogs
