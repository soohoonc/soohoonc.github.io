import React from 'react'

import { Box, Container, Typography } from '@mui/material';

const projects = [
  {title: 'Reviewr',
  description:
  <p>
    Reviewr Applicatoin
  </p>},
  {title: 'Style Transfer Visualization',
  description:
  <p>
    Style Transfer Visualizatoin
  </p>},
  {title: 'EVA-Feature Matching',
  description:
  <p>
    Exploratory Visual Analytics Database
  </p>},
  {title: 'Stock Movement Prediction with Transformers',
  description:
  <p>
    Stonks
  </p>},
  {title: 'Hurricane Prediction',
  description:
  <p>
    Created a hurricane prediction model.
  </p>},
  {title: 'Grocery Delivery',
  description:<p>
    Created a full stack application for my Database class (CS 4400) as an optional final assignment.
    Used MySQL, Express, React, and Node.js to create. 
  </p>},
  {title: 'Farming Game', 
  description:<p>
    Created a farming game with a team of 5 for my Objects and Design class (CS 2340).
    Acted as the team lead in overseeing git pull requests and adhering to design principles. 
    Created the project in Java and created the UI in JavaFX. 
  </p>},
  {title: '8-bit Computer',
  description:<p>
    Built a 8-bit computer with various integrated
    circuit chips and breadboards inspired by Ben Eater on YouTube 
    and my Computer Organization and Programming course (CS 2110).
    Implemented various components in the Von Neumann model such 
    as the ALU, memory, control logic, clock, counter, and etc.
    Coded some simple programs in C, such as a counter and the 
    fibonacci sequence and converted to assembly to learn more
    about low level programming.
  </p>},
];

const Projects = () => {
  return (
    <Container sx={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }}>
      <Box sx={{
        display: 'flex', justifyContent: 'center'
      }}>
        <Typography variant='h3'>
          Projects
        </Typography>
      </Box>
      
      {projects.map(({title, description}, index) => (
        <Box key={index} sx={{
          p: '10px', m:'10px', boxShadow:2
        }}>
          <Typography variant='h6'>{title}</Typography>
          <Typography>{description}</Typography>
        </Box>
      ))}
    </Container>
  )
}

export default Projects;
