import { default as ArtPortfolio } from './ArtPortfolio'
import { default as Coursework } from './Coursework'
import { default as ChildrensBook } from './ChildrensBook'

import { Typography } from '@mui/material';

const entries = new Map([
  ["0", {
    title: <Typography variant="h3">Coursework</Typography>,
    body: <Coursework />,
    date: 'December 24, 2021',
    tags: ['Courses', 'Georgia Tech'],
  }],
  ["1", {
    title: <Typography variant="h3">Art Portfolio</Typography>,
    body: <ArtPortfolio />,
    date: 'December 28, 2021',
    tags: ['Art'],
  }],
  ["2", {
    title: <Typography variant="h3">Working as Children's Book Illustrator</Typography>,
    body: <ChildrensBook />,
    date: 'January 2, 2021',
    tags: ['Illustrator', 'Art', 'Free Lance'],
  }],
  ["3", {
    title: '',
    body: <></>,
    date: '',
    tags: '',
  }]
]);

export default entries