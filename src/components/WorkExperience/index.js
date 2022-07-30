import React  from 'react'

import { 
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  ImageList,
  Typography, 
} from '@mui/material';

import { experiences } from './experiences';

const WorkExperience = () => {

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        py: '20px'
      }}>
        <Typography variant='h3'>
          Work Experience
        </Typography>
      </Box>
      <ImageList cols={1} gap={10}>
      {experiences.map((experiences, index) => (
        <Card key={index}>
            <CardContent>
              <Grid container spacing={4} sx={{display: 'flex', alignItems: 'center'}}>
                <Grid item>
                  <img src={window.location.origin+experiences.media} alt={experiences.media} width="100"/>
                </Grid>
                <Grid item>
                  <Typography variant="h4" component="div">
                    <b>{experiences.company}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" component="div">
                    {experiences.title}
                  </Typography>
                </Grid>
              </Grid>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {experiences.location} :: {experiences.date}
              </Typography>
              <Typography>
                {experiences.description}
              </Typography>
            </CardContent>
        </Card>
      ))}
      </ImageList>
    </Container>
  )
}

export default WorkExperience;
