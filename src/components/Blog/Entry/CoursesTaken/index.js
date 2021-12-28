import React, { useEffect, useState } from 'react'

import { 
  Box, 
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  ImageList,
  Typography 
} from '@mui/material';
import { useTheme } from '@mui/material/styles'

import { coursesCompleted } from './courses';

const CoursesTaken = () => {

  const theme = useTheme();

  const [state, setState] = useState({
    width: window.innerWidth,
  })
  
  theme.typography.h5 = {
    fontFamily: 'consolas, monospace',
    fontSize: 30
  }

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
            <Card>
              <CardHeader
                title={`${course.courseId}: ${course.courseTitle}`}
                subheader={`${course.professor}, ${course.semester}`}
                titleTypographyProps={{variant: 'h6'}}
              />
              <CardContent>
                {course.courseSummary}
              </CardContent>
              <CardActions>
                {/* <Button style={{ color: theme.palette.primary.link }}
                onClick={handleReadMore(course)}>
                  Read More
                </Button> */}
              </CardActions>
            </Card>
          )
        })
      }
      </ImageList>
    </Container>
  )
}

export default CoursesTaken
