import React from 'react';
import { useParams } from 'react-router-dom';

import { Container, Box, Typography } from '@mui/material';

import { default as entries } from './Entry';

const Blog= () => {

  const { id } = useParams();
  const entry = entries.get(parseInt(id));

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        py: '20px'
      }}>
        <Typography variant="h5">
          {entry.title}
        </Typography>
      </Box>
      <Box>
        {entry.body}
      </Box>
    </Container>
  )
}

export default Blog