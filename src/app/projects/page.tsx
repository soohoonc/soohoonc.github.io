import React from 'react'

import { projects } from './projects'

const Projects = () => {
  return (
    <div>
      <h1>Projects</h1>
      {
        projects.map((project) => {
          return (
            <div>
              <h1>{project.title}</h1>
            </div>
          )
        })
      }
    </div>
  )
}

export default Projects