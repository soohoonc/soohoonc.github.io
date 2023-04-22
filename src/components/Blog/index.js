import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Container, Box, Drawer, Fab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'

import { Toc } from '@mui/icons-material';

import NavBarBlog from '../NavBarBlog'
import { default as entries } from './Entry';

const Blog = () => {

  const theme = useTheme();

  const { id } = useParams();
  const entry = entries.get(id);
  const [state, setState] = useState({
    drawer: false,
    mobile: false,
  });

  const handleOpen = () => {
    setState((prev) => ({ ...prev, drawer: true}))
  }

  const handleClose = () => {
    setState((prev) => ({ ...prev, drawer: false}))
  }

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 480
      ? setState((prev) => ({...prev, mobile: true}))
      : setState((prev) => ({...prev, mobile: false}));
    };
    window.scrollTo(0,0);
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness())
    }
  }, [entry]);

  return (
    <Container>
      { entry !== undefined ?
      <Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          py: '20px'
        }}>
        <Typography variant="h5">
          {entry.title}
        </Typography>
      </Box>
    {entry.body}
    </Box>
    :
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      py: '20px'
    }}>
      <Typography>
        Sorry, this page does not exist.
      </Typography>
    </Box>}
    {state.mobile ? <NavBarBlog /> : 
    <Box>
    <Fab 
    size='small'
    onClick={handleOpen}
    sx={{
       m: 0,
       top: theme.spacing(10),
       right: theme.spacing(2),
       bottom: 'auto',
       left: 'auto',
       position: 'fixed',
    }}>
      <Toc />
    </Fab>
    <Drawer 
      open={state.drawer}
      onClose={handleClose}
      onClick={handleClose}
      anchor={'right'}
    >
      <NavBarBlog />
    </Drawer></Box>}
    </Container>
  )
}
export default Blog