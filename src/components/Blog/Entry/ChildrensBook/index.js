import React from 'react';

import { Box, Typography } from '@mui/material';

const ChildrensBook = () => {

  const artPath = window.location.origin;

  return (
    <Box>
      <Box sx={{
      display:'flex',
      justifyContent: 'center',
      }}>
        <Typography>
          Currently under the works, Here is a quick sample of an image I drew while waiting...
        </Typography>
      </Box>
      <Box sx={{
        display:'flex',
        justifyContent: 'center',
        p:'20px'
      }}>
        <img src={artPath +'/assets/images/children_book/img1.jpg'} alt={'welp I guess not'} style={{width: '480px'}}/>
      </Box>
    </Box>
  )
}

export default ChildrensBook
