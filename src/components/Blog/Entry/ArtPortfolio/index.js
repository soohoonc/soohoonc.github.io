import React, { useState, useEffect } from 'react'

import { 
  Box,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { artwork } from './artwork';

const ArtPortfolio = () => {

  const artPath = window.location.origin;

  const [state, setState] = useState({
    width: window.innerWidth,
    select: null,
  });

  const getImageListCol = () => {
    if (state.width < 800) {
      return 1;
    }
    return 2;
  }

  const imageListItemTheme = createTheme({
    components: {
      MuiImageListItem: {
        styleOverrides: {
          root: {
            '& .hidden-bar': {
              display: 'none',
            },
            '&:hover .hidden-bar': {
            display: 'flex',
            },
          },
        },
      },
    },
  })

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
      <Box>
        <ThemeProvider theme={imageListItemTheme}>
        <ImageList cols={getImageListCol()}>
          {
            artwork.map((work, index) => {
              return (
                <ImageListItem key={index} id="imglistitem">
                  <img
                    src={artPath + work.path}
                    alt={work.path}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={work.title}
                    subtitle={work.description}
                    className='hidden-bar'
                  />
                </ImageListItem>
              )
            })
          }
        </ImageList>
        </ThemeProvider>
      </Box>
    </Container>
  )
}

export default ArtPortfolio
