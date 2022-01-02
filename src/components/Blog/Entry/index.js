import { default as ArtPortfolio } from './ArtPortfolio'
import { default as CoursesTaken } from './CoursesTaken'
import { default as ChildrensBook } from './ChildrensBook'

const entries = new Map([
  ["0", {
    title: 'Courses Taken',
    body: <CoursesTaken />,
    date: 'December 24, 2021',
    tags: ['Courses', 'Georgia Tech'],
  }],
  ["1", {
    title: 'Art Portfolio',
    body: <ArtPortfolio />,
    date: 'December 28, 2021',
    tags: ['Art'],
  }],
  ["2", {
    title: 'Working as a Children\'s Book Illustrator',
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