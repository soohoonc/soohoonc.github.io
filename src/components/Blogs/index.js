import React from 'react'
import { Link, Route, useRouteMatch } from 'react-router-dom';

import { Box, Container, Typography } from '@mui/material';

import Blog from './Blog'

const blogs = ['1', '2', '3'];

const Blogs = () => {

  const { path, url } = useRouteMatch();

  return (
    <Container sx={{
      display: 'flex',
      justifyContent: 'center',
      padding: '100px'
    }}>
      <Box sx={{
        padding: '30px',
        margin: '10px',
        justifyContent: 'center',
      }}>
        <Typography sx={{
          fontSize: 18,
          fontWeight: 10,
          fontFamily: 'Helvetica, sans-serif',
        }}>
          Currently Under Construction (as is the rest of the website)
        </Typography>
      </Box>
      {
        blogs.map((blog) => {
          return (
          <Link to={`${url}/${blog}`}>
          </Link>
          )
        })
      }
      <Route path={`${path}/:blogid`}>
        <Blog />
      </Route>
     
    </Container>
  )
}

export default Blogs
