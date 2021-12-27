import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { AppBar, Button, Container, Drawer, IconButton, MenuItem, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material'

import resume from '../../assets/documents/resume.pdf'

const NavBar = () => {

  const [state, setState] = useState({
    mobile: false,
    drawer: false
  });

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 480
      ? setState((prevState) => ({...prevState, mobile: true}))
      : setState((prevState) => ({...prevState, mobile: false}));
    };

    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness())
    }
  }, []);

  return (
    <AppBar sx={{
      background: 'transparent',
      boxShadow: 'none',
      minHeight: '50px',
      justifyContent: 'center',
      position: 'static',
      paddingTop: '20px'
    }}>
      <Toolbar disableGutters>
        {state.mobile ? displayMobile(state.drawer, setState) : displayDesktop()}
      </Toolbar>
    </AppBar>
    
  )
}

const displayDesktop = () => {

  const resumeRedirect = () => {
    window.open(resume)
  }

  return (
    <Container sx={{
      maxWidth: "xl",
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    }}>
        
      <Button to='/' component={Link}> Home </Button>
      <Button to='/projects' component={Link}> Projects </Button>
      <Button to='/blogs' component={Link}> Blog </Button>
      <Button to='/schoi98' component={Link}> About Me </Button>
      <Button onClick={resumeRedirect}> Resume </Button>
    </Container>
  )
}

const displayMobile = ( drawer, setState ) => {

  const resumeRedirect = () => {
    window.open(resume)
  }

  const handleMenuOpen = () =>
      setState((prevState) => ({ ...prevState, drawer: true }));

  const handleMenuClose = () =>
    setState((prevState) => ({ ...prevState, drawer: false }));
  
  return (
    <Container sx={{
      maxWidth: "xl",
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <IconButton onClick={handleMenuOpen}>
        <Menu />
      </IconButton>
      <Drawer open={drawer} onClose={handleMenuClose} anchor='top'>

      <MenuItem component={Link} sx={{justifyContent: 'center'}} to='/' onClick={handleMenuClose}> Home </MenuItem>

      <MenuItem component={Link} sx={{justifyContent: 'center'}} to='/projects' onClick={handleMenuClose}> Projects </MenuItem>

      <MenuItem component={Link} sx={{justifyContent: 'center'}} to='/blogs' onClick={handleMenuClose}> Blog </MenuItem>

      <MenuItem component={Link} sx={{justifyContent: 'center'}} to='/schoi98' onClick={handleMenuClose}> About Me </MenuItem>

      <MenuItem sx={{justifyContent: 'center'}} onClick={resumeRedirect}>Resume</MenuItem>
      </Drawer>
  </Container>
  )
}

export default NavBar;
