import React from 'react'

import { AppBar, Box, Container, Link } from '@mui/material';
import { LinkedIn, GitHub } from '@mui/icons-material'

const Item = (props) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        m:1,
        pr:2,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}


const Contact = () => {
  return (
    <AppBar position='static' style = {{ background: 'transparent', boxShadow: 'none' }}>
      
      <Container maxWidth="xl" style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center'
      }}>
        <Link href="https://github.com/schoi98" target="blank" underline="none">
          <Box sx={{ display: 'flex', flexDirection:'row', alignItems: 'center' }}>
            <Item sx={{ m:0, pr:0 }}><GitHub/></Item>
            <Item>GitHub</Item>
          </Box>
        </Link>
        <Link href="https://www.linkedin.com/in/soohoonchoi/" target="blank" underline="none">
          <Box sx={{ display: 'flex', flexDirection:'row', alignItems: 'center' }}>
            <Item sx={{ m:0, pr:0 }}><LinkedIn/></Item>
            <Item>LinkedIn</Item>
          </Box>
          
        </Link>
      </Container>
    </AppBar>
  )
}

export default Contact;
