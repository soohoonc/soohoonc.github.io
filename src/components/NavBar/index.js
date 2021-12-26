import React from 'react'
import { Link } from 'react-router-dom';
import { AppBar, Button, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

import resume from '../../assets/documents/resume.pdf'

const resumeRedirect = () => {
  console.log('get resume')
  window.open(resume)
}

const useStyle = makeStyles((theme) => ({
  appbar: {
    background: 'transparent',
    boxShadow: 'none',
    minHeight: '50px',
    justifyContent: 'center',
    position: 'static',
    paddingTop: '20px'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    textDecoration: 'none'
  },
  button: {
    color: theme.default
  }
}));

const NavBar = () => {

  const classes = useStyle();

  return (
    <AppBar  className={classes.appbar}>
      <Container maxWidth="xl" className={classes.container}>
          <Link to='/' className={classes.link}>
            <Button className={classes.button}> Home </Button>
          </Link>

          <Link to='/projects' className={classes.link}>
            <Button className={classes.button}> Projects </Button>
          </Link>

          <Link to='/blogs' className={classes.link}>
            <Button className={classes.button}> Blog </Button>
          </Link>

          <Link to='/schoi98' className={classes.link}>
            <Button className={classes.button}> About Me </Button>
          </Link>

          <Button onClick={resumeRedirect}> Resume </Button>
      </Container>
    </AppBar>
  )
}

export default NavBar;
