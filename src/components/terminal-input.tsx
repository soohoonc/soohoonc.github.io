import React from 'react'

import { handleCommand } from '@/lib/commands'

interface TerminalInputProps {
  user: string
  host: string
  path: string
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

export const TerminalInput = React.forwardRef(({
  user,
  host,
  path,
  messages,
  setMessages,
}: TerminalInputProps, ref) => {
  const [input, setInput] = React.useState('')
  const [prompt, setPrompt] = React.useState(`${user}@${host} ${path} $`)
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const output = handleCommand(input)
      setMessages(output ? [...messages, (<p key={messages.length}>{`${prompt} ${input}`}</p>), output] : [])
      setInput('')
    }
  }

  const handleChange = (e: React.BaseSyntheticEvent) => {
    setInput(e.target.innerText)
  }

  React.useEffect(() => {
    if (input === '' && inputRef.current) {
      inputRef.current.innerText = ''; // Correct assignment
    }
  }, [input]);

  return (
    <div className='bg-transparent outline-none resize-none break-all'>
      <span className="mr-[1ch]">{prompt}</span>
      <span
        contentEditable
        ref={inputRef}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        content={input}
        className='bg-transparent outline-none caret-white'
        autoFocus
      />
    </div>
  )
})
TerminalInput.displayName = 'TerminalInput'