import React from 'react'

import { experiences } from './experiences'

const Experience = () => {
  return (
    <div>
      <h1>Experience</h1>
      {
        experiences.map((experience) => {
          return (
            <div>
              <h1>{experience.title}</h1>
            </div>
          )
        })
      }
    </div>
  )
}

export default Experience