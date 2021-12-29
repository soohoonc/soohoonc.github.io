import React, { useState, useEffect } from 'react'

import { 
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  IconButton,
  ImageList,
  Typography, 
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { projects } from './projects';

const Projects = () => {

  const [state, setState] = useState({
    open: false,
    width: window.innerWidth,
    project: {
      title: '',
      summary: <></>,
      date: '',
      media: '/assets/images/projects/reviewr.jpg',
      link: '',
      description:<></>
    }
  });

  const handleClose = () => {
    setState((prev) => ({ ...prev, open: false }));
  }

  const getImageHeight = () => {
    if (state.width < 600) {
      return 360;
    } else {
      return 480;
    }
  }

  const getCols = () => {
    if (state.width < 900) {
      return 1;
    }
    return 2;
  }
  
  useEffect(() => {
    const setResponsiveness = () => {
    return setState((prev) => ({ ...prev, width: window.innerWidth }))
  };

  setResponsiveness();
  window.addEventListener("resize", () => setResponsiveness());
  return () => {
    window.removeEventListener("resize", () => setResponsiveness())
  }
}, [])

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        py: '20px'
      }}>
        <Typography variant='h3'>
          Projects
        </Typography>
      </Box>
      <ImageList cols={getCols()} gap={10}>
      {projects.map((project, index) => (
        <Card key={index}>
          <CardActionArea sx={{width: 1, height: 1}} onClick={() => {
            setState((prev) => ({ ...prev, open: true, project: project }))
          }}>
            <CardHeader
              title={project.title}
              subheader={project.date}
            />
            
            <CardMedia
              component="img"
              sx={{ height: getImageHeight() }}
              image={window.location.origin+project.media}
              alt={project.media}
            />
            <CardContent>
              <Typography>
                {project.summary}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
      </ImageList>
      <ProjectDialog 
        project={state.project}
        open={state.open}
        onClose={handleClose}
      />
    </Container>
  )
}

const ProjectDialog = (props) => {

  const theme = useTheme();

  const { project, open, onClose } = props;

  const handleClose = () => {
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      transitionDuration={0}
      maxWidth="md"
      fullWidth
    >
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
      }}>
        <Box sx={{
          py:'12px', px: '24px'
        }}>
          <Typography variant='h6'>
            {project.title}
          </Typography>
          <Typography sx={{
            color: theme.palette.text.subheader
          }}>
            {project.summary}
          </Typography>
          <Typography sx={{
            color: theme.palette.text.subheader
          }}>
            {project.date}
          </Typography>
        </Box>
      
        <Box position='absolute' right='0px' sx={{
          p:'5px'
        }}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>
      <Card style={{ overflow: 'auto'}}>
      <Box sx={{
        py:'12px', px: '24px', width: 1, height: 1
      }}>
        {project.description}
        <CardMedia
          component="img"
          sx={{ width: 1, height: 'auto', py:'12px'}}
          image={window.location.origin+project.media}
          alt={project.media}
        />
        {project.link !== '' && project.link}
      </Box>
      </Card>
    </Dialog>
  )
}

export default Projects;
