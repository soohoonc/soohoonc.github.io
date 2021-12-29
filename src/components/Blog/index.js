import React from 'react'
import { useParams } from 'react-router-dom';

import { Container } from '@mui/material'
import * as Entry from './Entry';


const Blog = () => {

  const { id } = useParams();
  
  const BlogComponent = Entry.default[id];

  return (
    <Container>
      <BlogComponent id={id}/>
    </Container>
  )
};

export default Blog