import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <Card className='max-w-lg text-sm border-none text-justify leading-relaxed p-4'>
        Hi there, I&apos;m{' '}
        <a className='text-purple-400' href='https://bento.me/soohoonchoi'>
          Soohoon Choi
        </a>
        . I am currently a cofounder at{' '}
        <a className='text-purple-400' href='https://getonboard.dev/'>
          Onboard AI
        </a>
        , exploring the application of LLMs for devs. Outside of work I like to create{' '}
        <a className='text-cyan-400' href=''>
          visual art
        </a>
        ,{' '}
        <a className='text-sky-400' href=''>
          read
        </a>
        , and (trying) to{' '}
        <a className='text-blue-400' href=''>
          write
        </a>
        . I am currently based in{' '}
        <a className='text-red-500' href='https://www.google.com/maps/place/San+Francisco'>
          San Francisco
        </a>{' '}
        and am always down to grab a coffee. I recently graduated{' '}
        <a className='text-yellow-400' href='https://www.gatech.edu/'>
          Georgia Tech
        </a>{' '}
        with a degree in computer science and mathematics.
        <p className='text-right text-lg'>■</p>
      </Card>
    </div>
  );
}
