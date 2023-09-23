import React from 'react';

import { experiences } from './experiences';

import { Card } from '@/components/ui/card';

const Experience = () => {
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <Card className='flex flex-col gap-4 max-w-lg text-sm border-none shadow-none bg-transparent text-justify leading-relaxed p-4 '>
        {experiences.map((experience) => {
          return (
            <div key={experience.title}>
              <div className='flex flex-row justify-between'>
                <p>
                  {experience.title} @{' '}
                  <a className={`text-purple-600 dark:text-purple-400`} href={experience.link}>
                    {experience.company}
                  </a>
                </p>
                <p>
                  {experience.date} | {experience.location}
                </p>
              </div>
              <p>{experience.description}</p>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Experience;
