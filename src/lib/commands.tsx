"use client"

const commands: { [key: string] : string} = {
  'whoami': 'who am i?',
  'clear': 'clear the terminal screen',
  'others': 'try messing around, still in da works',
};

const whoami = () => {
  return (
    <p>
      <a className="text-indigo-400" target="_blank" href="https://bento.me/soohoonchoi">soohoonchoi</a><br/>
      i am a cofounder over at <a className="text-indigo-400" target="_blank" href="https://getonboardai.com">onboard ai</a>.<br/>
      recently graduated from <a className="text-indigo-400" target="_blank" href="https://www.gatech.edu/">gt</a> with a degree in math and cs.<br/>
      i also like to <a className="text-indigo-400" target="_blank" href="https://instagram.com/soohoon.art">art</a><br/>
      (this is the wrong use of `whoami` btw)
    </p>
  )
}

export const handleCommand = (command: string) => {
  // still better than yandere dev
  switch(command.split(' ')[0]) {
    case 'ls':
    case 'cd':
    case 'pwd':
      return (<p>nothing to see here</p>) as Message
    case 'touch':
    case 'mkdir':
    case 'rm':
    case 'mv':
    case 'cp':
      return (<p>nope, not yet</p>) as Message 
    case 'cat':
      return (<p>🐱🐱🐱 meow 🐱🐱🐱</p>) as Message
    case 'whoami':
      return whoami();
    case 'echo':
      return (<p>{command.split(' ').slice(1).join(' ')}</p>) as Message
    case 'exit':
      window.close();
      return null;
    case 'sudo':
      return (<p>ey!</p>) as Message
    case 'clear':
      return null;
    case 'help':
      return (
        <ul>
          {Object.keys(commands).map((key, index) => (
            <li key={index}>{`${key}: ${commands[key]}`}</li>
          ))}
        </ul>
      ) as Message
    case '':
      return <p> </p>
    default:
      return (<p>{`${command}: command not found`}</p>)
  }
}