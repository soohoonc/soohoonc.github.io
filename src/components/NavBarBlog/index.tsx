import * as React from 'react'
import { NavLink } from 'react-router-dom';

import { Container, Typography, Box } from '@mui/material';

import { dir } from './dir'
import { useTheme } from '@mui/material/styles';

const NavBarBlog = () => {

  const theme = useTheme();

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <Box boxShadow={3} sx={{
        px: '30px',
        py: '10px',
        mx: '-24px',
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
        <NavLink to={`/blogs`} key={'home'} style={{
              textDecoration: 'none', color: theme.palette.primary.link
        }}>
          <Typography>
            Blogs Home Page
          </Typography>
        </NavLink>
        {
          dir.map(({ id, name }) => {
            return (
            <NavLink to={`/blogs/${id}`} key={id} style={{
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
