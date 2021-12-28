import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom';

import { Container, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { dir } from './dir'

const NavBarBlog = () => {
  
  const match = useRouteMatch();
  const theme = useTheme();

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <Box boxShadow={3} sx={{
        px: '30px',
        py: '10px'
      }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Typography variant='h6' sx={{
          pb: '10px'
        }}>
          Directory
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        {
          dir.map(({ id, name }) => {
            return (
            <NavLink to={`${match.url}/${id}`} key={id} style={{
              textDecoration: 'none', color: theme.palette.primary.link
            }}>
              <Typography>
                {name}
              </Typography>
            </NavLink>
            )
          })
        }
      </Box>
      </Box>
    </Container>
  )
}

export default NavBarBlog
