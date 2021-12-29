import React, { useState, useEffect } from 'react'

import { 
  Box,
  Container,
  ImageList,
  ImageListItem,
  Typography, 
} from '@mui/material';

import { artwork } from './artwork';

const ArtPortfolio = () => {

  const artPath = window.location.origin;

  const [state, setState] = useState({
    width: window.innerWidth,
  });

  const getImageListCol = () => {
    if (state.width < 800) {
      return 1;
    }
    return 2;
  }

  useEffect(() => {
    const setResponsiveness = () => {
      return setState((prev) => ({ ...prev, width: window.innerWidth}));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness())
    }
  }, []);

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        py: '20px'
      }}>
        <Typography variant="h5">
          Art Portfolio
        </Typography>
      </Box>
      <Box>
        <ImageList cols={getImageListCol()}>
          {
            artwork.map((work, index) => {
              return (
                <ImageListItem key={index}>
                  <img
                    src={artPath + work.path}
                    alt={work.path}
                    loading="lazy"
                  />
                </ImageListItem>
              )
            })
          }
        </ImageList>
      </Box>
    </Container>
  )
}

export default ArtPortfolio
