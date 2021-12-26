import React from 'react'
import { Link } from 'react-router-dom';
import { AppBar, Button, Container } from '@mui/material';
// import { makeStyles } from '@mui/styles';

import resume from '../../assets/documents/resume.pdf'

const resumeRedirect = () => {
  console.log('get resume')
  window.open(resume)
}

// const useStyle = makeStyles((theme) => ({
//   appbar: {
//     background: 'transparent',
//     boxShadow: 'none',
//     minHeight: '50px',
//     justifyContent: 'center',
//     position: 'static',
//     paddingTop: '20px'
//   },
//   container: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   link: {
//     textDecoration: 'none'
//   },
// }));

const NavBar = () => {

  return (
    <AppBar sx={{
      background: 'transparent',
      boxShadow: 'none',
      minHeight: '50px',
      justifyContent: 'center',
      position: 'static',
      paddingTop: '20px'
    }}>
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
    </AppBar>
  )
}

export default NavBar;
