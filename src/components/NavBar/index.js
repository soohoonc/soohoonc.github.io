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
      <Link to='/' style={{
        textDecoration: 'none'
      }}>
        <Button> Home </Button>
      </Link>

      <Link to='/projects' style={{
        textDecoration: 'none'
      }}>
        <Button> Projects </Button>
      </Link>

      <Link to='/blogs' style={{
        textDecoration: 'none'
      }}>
        <Button> Blog </Button>
      </Link>

      <Link to='/schoi98' style={{
        textDecoration: 'none'
      }}>
        <Button> About Me </Button>
      </Link>

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
      <Drawer open={drawer} onClose={handleMenuClose} anchor='top'
      sx={{ '& .paper': { backgroundColor: '#222222'}}}>

      <Link to='/' onClick={handleMenuClose} style={{
        textDecoration: 'none'
      }}>
        <MenuItem sx={{justifyContent: 'center'}}>  Home </MenuItem>
      </Link>

      <Link to='/projects' onClick={handleMenuClose} style={{
        textDecoration: 'none'
      }}>
        <MenuItem sx={{justifyContent: 'center'}}> Projects </MenuItem>
      </Link>

      <Link to='/blogs' onClick={handleMenuClose} style={{
        textDecoration: 'none'
      }}>
        <MenuItem sx={{justifyContent: 'center'}}> Blog </MenuItem>
      </Link>

      <Link to='/schoi98' onClick={handleMenuClose} style={{
        textDecoration: 'none'
      }}>
        <MenuItem sx={{justifyContent: 'center'}}>  About Me </MenuItem>
      </Link>

      <MenuItem sx={{justifyContent: 'center'}} onClick={resumeRedirect}>Resume</MenuItem>
      </Drawer>
  </Container>
  )
}

export default NavBar;
