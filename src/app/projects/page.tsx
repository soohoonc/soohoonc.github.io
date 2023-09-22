import React from 'react'

import { projects } from './projects'

import { Card } from '@/components/ui/card'

const Projects = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
    <Card className="flex flex-col gap-4 max-w-lg text-sm border-none text-justify leading-relaxed p-4 text-slate-400">
      We're under construction
    </Card>
  </div>
    // <div>
    //   <h1>Projects</h1>
    //   {
    //     projects.map((project) => {
    //       return (
    //         <div>
    //           <h1>{project.title}</h1>
    //         </div>
    //       )
    //     })
    //   }
    // </div>
  )
}

export default Projects