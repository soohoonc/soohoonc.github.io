'use client';

import { type FileSystem } from '@/lib/fs';

export const handleCommand = (command: string, fs: FileSystem, setPath: (path: string) => void) => {
  // still better than yandere dev
  const parsedCommand = command
    .split(' ')
    .map((item) => item.trim())
    .filter((item) => item !== ' ');
  switch (parsedCommand[0]) {
    case 'pwd':
      const curr_path = JSON.parse(fs.pwd());
      return <p>{curr_path}</p>;
    case 'ls':
      const curr_ls: string[] = JSON.parse(fs.ls());
      return (
        <ul>
          {curr_ls.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    case 'cd':
      try {
        if(parsedCommand.length === 1) {
          fs.cd('/users/guest');
          setPath('~');
          return <p></p>
        }
        fs.cd(parsedCommand[1]);
        const newPath = JSON.parse(fs.pwd());
        if (newPath === '/users/guest') {
          setPath('~');
        } else if (newPath === "") {
          setPath('/');
        } else {
          setPath(newPath.split('/').slice(-1)[0]);
        }
        return <p></p>
      } catch {
        return <p>cd: no such file or directory: {parsedCommand[1]}</p>;
      }
    case 'touch':
    case 'mkdir':
    case 'rm':
    case 'mv':
    case 'cp':
      return <p>nope, not yet</p>;
    case 'cat':
      return <p>meow</p>;
    case 'whoami':
      return <p>guest</p>;
    case 'echo':
      return <p>{parsedCommand.slice(1).join(' ')}</p>;
    case 'exit':
      window.close();
      return null;
    case 'sudo':
      return <p>no!</p>;
    case 'clear':
      return null;
    case 'help':
      return (
        <ul>
          <li>[command]: [description]</li>
          {Object.keys(listedCommands).map((key, index) => (
            <li key={index} className='flex flex-row'>
              <span className='ml-[1ch] w-[8ch]'>{key}</span>
              <span>{': '}</span>
              <span className='ml-[2ch]'>{listedCommands[key]}</span>
            </li>
          ))}
        </ul>
      );
    case 'license':
      return (
        <p>
          <a className='link' target='_blank' href='https://opensource.org/license/mit/'>
            MIT
          </a>
        </p>
      );
    case 'credits':
      return (
        <p>
          <a className='link' target='_blank' href='https://bento.me/soohoonchoi'>
            soohoonchoi
          </a>
        </p>
      );
    case 'about':
      return about();
    case 'resume':
      return (
        <p>
          <a
            className='link'
            target='_blank'
            href='https://www.dropbox.com/scl/fi/8zasyts7ohnhqqxddoxt1/SooHoon_Choi_Resume.pdf?rlkey=4bbgzq53nuyzvw1u4h7llwgxk&dl=0'
          >
            see my resume
          </a>
        </p>
      );
    case 'timeline':
      return (
        <ul>
          <li>
            <span className='w-[5ch]'>[time]:</span>
            <span className='ml-[1ch] w-[16ch]'>[location]</span>
            <span className='ml-[5ch]'>: [event]</span>
          </li>
          {timeline.map((item, index) => (
            <li key={index} className='flex flex-row'>
              <span className='ml-[1ch] w-[5ch]'>{item.time}</span>
              <span>{': '}</span>
              <span className='ml-[2ch] w-[14ch]'>{item.location}</span>
              <span>{': '}</span>
              <span className='ml-[2ch]'>{item.event}</span>
            </li>
          ))}
        </ul>
      );
    case 'source':
      return (
        <p>
          <a className='link' target='_blank' href='https://github.com/soohoonc/soohoonc.github.io'>
            github
          </a>
        </p>
      );
    case '':
      return <p> </p>;
    default:
      return <p>{`${parsedCommand[0]}: command not found`}</p>;
  }
};

const listedCommands: { [key: string]: string } = {
  about: 'about me',
  resume: 'view my resume',
  timeline: 'some of my notable moments',
  source: 'view the source code',
  clear: 'clear the terminal screen',
  '(+ more)': 'try messing around, still in the works',
};

const about = () => {
  return (
    <p>
      <a className='link' target='_blank' href='https://bento.me/soohoonchoi'>
        soohoonchoi
      </a>
      <br />i am a cofounder over at{' '}
      <a className='link' target='_blank' href='https://getonboardai.com'>
        onboard ai
      </a>
      .<br />
      recently graduated from{' '}
      <a className='link' target='_blank' href='https://www.gatech.edu/'>
        gt
      </a>{' '}
      with a degree in math and cs.
      <br />i also like to{' '}
      <a className='link' target='_blank' href='https://instagram.com/soohoon.art'>
        art
      </a>
    </p>
  );
};

interface Timeline {
  time: string;
  event: React.ReactElement;
  location: React.ReactElement;
}

const timeline: Timeline[] = [
  {
    time: '1998',
    event: <span>born</span>,
    location: (
      <a className='link' target='_blank' href='https://www.google.com/maps/place/seoul'>
        seoul
      </a>
    ),
  },
  {
    time: '2001',
    event: <span>move to philippines</span>,
    location: (
      <a className='link' target='_blank' href='https://www.google.com/maps/place/makati'>
        makati
      </a>
    ),
  },
  {
    time: '2018',
    event: <span>graduate highschool</span>,
    location: (
      <a className='link' target='_blank' href='https://www.faith.edu.ph'>
        faith academy
      </a>
    ),
  },
  {
    time: '2018',
    event: <span>move to us</span>,
    location: (
      <a className='link' target='_blank' href='https://www.google.com/maps/place/atlanta'>
        atlanta
      </a>
    ),
  },
  {
    time: '2019',
    event: <span>start college</span>,
    location: (
      <a className='link' target='_blank' href='https://www.gatech.edu'>
        georgia tech
      </a>
    ),
  },
  {
    time: '2023',
    event: <span>graduate college</span>,
    location: (
      <a className='link' target='_blank' href='https://www.gatech.edu'>
        georgia tech
      </a>
    ),
  },
  {
    time: '2023',
    event: <span>start ups full time</span>,
    location: (
      <a className='link' target='_blank' href='https://www.google.com/maps/place/sanfrancisco'>
        san francisco
      </a>
    ),
  },
];
