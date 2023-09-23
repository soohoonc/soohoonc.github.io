import React from 'react';

import { projects } from './projects';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Projects = () => {
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <Card className='bg-transparent flex flex-col gap-4 max-w-lg text-sm border-none shadow-none text-justify leading-relaxed p-4'>
        <ScrollArea className="h-96">
      {
        projects.map((project) => {
          return (
            <div key={project.title} className="p-4">
              <div className='flex flex-row justify-between'>
                <a href={project.link} className="text-purple-600 dark:text-purple-400">
                  {project.title}
                </a>
                <p>
                  {project.date}
                </p>
              </div>
              <p className="">{project.summary}</p>
              {/* <Collapsible className="justify-end">
                <CollapsibleTrigger>
                  <p className="text-xs"></p>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {project.description}
                </CollapsibleContent>
              </Collapsible> */}
            </div>
          )
        })
      }
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Projects;
