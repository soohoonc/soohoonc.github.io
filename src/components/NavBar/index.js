import React from 'react'
import { Link } from 'react-router-dom';
import { AppBar, Button, Container } from '@mui/material';

import resume from '../../assets/documents/resume.pdf'

const resumeRedirect = () => {
  console.log('get resume')
  window.open(resume)
}

const NavBar = () => {
  return (
    <AppBar position='static' style={{
      background: 'transparent', boxShadow: 'none', minHeight: '50px', justifyContent: 'bottom'
      }}>
      <Container maxWidth="xl" style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: '100px'
      }}>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Button> Home </Button>
          </Link>

          <Link to='/projects' style={{ textDecoration: 'none' }}>
            <Button> Projects </Button>
          </Link>

          <Button onClick={resumeRedirect} className="button"> Resume </Button>

          <Link to='/schoi98' style={{ textDecoration: 'none' }}>
            <Button> About Me </Button>
          </Link>
      </Container>
    </AppBar>
  )
}

export default NavBar;
