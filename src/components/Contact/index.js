import React, { useState, useEffect } from 'react'

import { AppBar, Box, Container, Link } from '@mui/material';
import { LinkedIn, GitHub, Email } from '@mui/icons-material';

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

  const [state, setState] = useState({
    mobile: false,
  })

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 480
      ? setState((prev) => ({...prev, mobile: true}))
      : setState((prev) => ({...prev, mobile: false}));
    };
    window.scrollTo(0,0)
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness())
    }
  }, []);

  return (
    <AppBar sx={{
      position: 'static',
      background: 'transparent',
      boxShadow: 'none'
    }}>
      
      <Container maxWidth="xl" sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: '50px',
        paddingBottom: '100px'
      }}>
        <Link href="https://github.com/schoi98" target="blank" underline="none">
          <Box sx={{
            display: 'flex',
            flexDirection:'row',
            alignItems: 'center'
          }}>
            <Item sx={{ m:0, pr:0 }}><GitHub/></Item>
            {state.mobile ? <Box sx={{px:'10px'}}/> : <Item>GitHub</Item>}
          </Box>
        </Link>
        <Link href="https://www.linkedin.com/in/soohoonchoi/" target="blank" underline="none">
          <Box sx={{
            display: 'flex',
            flexDirection:'row',
            alignItems: 'center'
          }}>
            <Item sx={{ m:0, pr:0 }}><LinkedIn/></Item>
            {state.mobile ? <Box sx={{px:'10px'}}/> : <Item>LinkedIn</Item>}
          </Box>
        </Link>
        <Link href="mailto:soohoonchoi@gmail.com" underline="none">
          <Box sx={{
            display: 'flex',
            flexDirection:'row',
            alignItems: 'center'
          }}>
            <Item sx={{ m:0, pr:0 }}><Email/></Item>
            {state.mobile ? <Box sx={{px:'10px'}}/> : <Item>Email</Item>}
          </Box>
        </Link>
      </Container>
    </AppBar>
  )
}

export default Contact;
