"use client"

import { getFormattedDate } from './utils';

export const getWelcomeMessage = () => {
  return (
    <p suppressHydrationWarning>
      soohoonchoi ({getFormattedDate()})<br/>
      Type &quot;help&quot;, &quot;credits&quot; or &quot;license&quot; for more.
    </p>
  )
};

const commands: { [key: string] : string} = {
  'about': 'about me',
  'resume': 'view my resume',
  'source': 'view the source code',
  'clear': 'clear the terminal screen',
  '(+ more)': 'try messing around, still in the works',
};

const about = () => {
  return (
    <p>
      <a className="text-indigo-400" target="_blank" href="https://bento.me/soohoonchoi">soohoonchoi</a><br/>
      i am a cofounder over at <a className="text-indigo-400" target="_blank" href="https://getonboardai.com">onboard ai</a>.<br/>
      recently graduated from <a className="text-indigo-400" target="_blank" href="https://www.gatech.edu/">gt</a> with a degree in math and cs.<br/>
      i also like to <a className="text-indigo-400" target="_blank" href="https://instagram.com/soohoon.art">art</a>
    </p>
  )
}

export const handleCommand = (command: string) => {
  // still better than yandere dev
  switch(command.split(' ')[0]) {
    case 'pwd':
      return <p>/users/guest</p>
    case 'ls':
    case 'cd':
    case 'touch':
    case 'mkdir':
    case 'rm':
    case 'mv':
    case 'cp':
      return <p>nope, not yet</p>
    case 'cat':
      return <p>🐱🐱🐱 meow 🐱🐱🐱</p>
    case 'whoami':
      return <p>guest</p>
    case 'echo':
      return <p>{command.split(' ').slice(1).join(' ')}</p>
    case 'exit':
      window.close();
      return null;
    case 'sudo':
      return <p>no!</p>
    case 'clear':
      return null;
    case 'help':
      return (
        <ul>
          <li>[command]: [description]</li>
          {Object.keys(commands).map((key, index) => (
            <li key={index} className="flex flex-row">
              <span className="ml-[1ch] w-[8ch]">
                {key}
              </span>
              <span>
                {': '}
              </span>
              <span className="ml-[2ch]">
                {commands[key]}
              </span>
            </li>
          ))}
        </ul>
      )
    case 'license':
      return (<p><a className='text-indigo-400' target="_blank" href="https://opensource.org/license/mit/">MIT</a></p>)
    case 'credits':
      return (<p>
          <a className="text-indigo-400" target="_blank" href="https://bento.me/soohoonchoi">soohoonchoi</a>
        </p>)
    case 'about':
      return about();
    case 'resume':
      return <p><a className='text-indigo-400' target="_blank" href="https://www.dropbox.com/scl/fi/8zasyts7ohnhqqxddoxt1/SooHoon_Choi_Resume.pdf?rlkey=4bbgzq53nuyzvw1u4h7llwgxk&dl=0">see my resume</a></p>
    case 'source': 
      return <p><a className='text-indigo-400' target="_blank" href='https://github.com/soohoonc/soohoonc.github.io'>github</a></p>
    case '':
      return <p> </p>
    default:
      return <p>{`${command.split(' ')[0]}: command not found`}</p>
  }
}