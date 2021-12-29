import React, { useEffect, useState } from 'react'

import { 
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Chip,
  Dialog,
  Container,
  ImageList,
  Typography, 
  IconButton,
} from '@mui/material';

import { Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { coursesCompleted } from './courses';

const CoursesTaken = () => {
  
  const [state, setState] = useState({
    width: window.innerWidth,
    open: false,
    course: {
      courseId: 'GT 9999',
      courseTitle: 'The Meaning of Life, the Universe, and Everything',
      professor: 'George Burdell',
      courseSummary: <>42</>,
      tags: [],
      semester: 'Winter 0',
    }
  })

  const getImageListCol = () => {
    if (state.width < 550) {
      return 1;
    } else if (state.width < 900) {
      return 2;
    } else if (state.width < 1200) {
      return 3;
    }
    return 4;
  }

  const handleClose = () => {
    setState((prev) => ({ ...prev, open: false}));
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
          Courses Taken
        </Typography>
      </Box>
      <ImageList cols={getImageListCol()} gap={2}>
      {
        coursesCompleted.map((course) => {
          return (
            <Card  key={course.courseId}>
              <CardActionArea sx={{width: 1, height: 1}} onClick={() => {
                  setState((prev) => ({ ...prev, open: true, course: course }))
                }}>
              <CardHeader
                title={`${course.courseId}: ${course.courseTitle}`}
                subheader={`${course.professor}, ${course.semester}`}
                titleTypographyProps={{variant: 'h6'}}
              />
              </CardActionArea>
            </Card>
          )
        })
      }
      <CourseDialog 
        course={state.course}
        open={state.open}
        onClose={handleClose}
      />
      </ImageList>
    </Container>
  )
}

const CourseDialog = (props) => {

  const { course, open, onClose } = props;

  const theme = useTheme();

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
            {`${course.courseId}: ${course.courseTitle}`}
          </Typography>
          <Typography sx={{
            color: theme.palette.text.subheader
          }}>
            {`${course.professor}, ${course.semester}`}
          </Typography>
        </Box>
        <Box></Box>
        <Box position='absolute' right='0px' sx={{
          p:'5px'
        }}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>
      <Box style={{ overflow: 'auto'}} sx={{
        pb:'12px', px: '24px'
      }}>
        {course.courseSummary}
        <hr />
        {
          course.tags.map((tag, index) => {
            return (
              <Chip key={`${course.courseId}_${index}`} label={tag} variant='outlined' sx={{m: '2px'}}/>
            )
          })
        }
      </Box>
    </Dialog>
  )
}

export default CoursesTaken