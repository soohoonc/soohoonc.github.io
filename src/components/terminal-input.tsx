import React from 'react';

import { handleCommand } from '@/lib/commands';
import { useTerminalState, useFileSystem } from '@/app/providers';

export const TerminalInput = React.forwardRef(({}, ref) => {
  const {
    setShowWelcome,
    user,
    host,
    inputs,
    setInputs,
    outputs,
    setOutputs,
    inputIndex,
    setInputIndex,
  } = useTerminalState();
  const [input, setInput] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { fs, path, setPath } = useFileSystem();

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const inputsLength = inputs.length;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const output = handleCommand(input.trim(), fs, setPath);
      if (!output) setShowWelcome(false);
      setInputs(output ? [...inputs, `${user}@${host} ${path} $ ${input}`] : []);
      setOutputs(output ? [...outputs, output] : []);
      setInputIndex(inputsLength);
      setInput('');
      setInputText('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setInput(inputs[inputIndex] || '');
      setInputText(inputs[inputIndex] || '');
      const newIndex = inputIndex - 1 < 0 ? 0 : inputIndex - 1;
      if (newIndex >= 0) setInputIndex(newIndex);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = inputIndex + 1 > inputsLength ? inputsLength : inputIndex + 1;
      if (newIndex < inputs.length) setInputIndex(newIndex);
      setInput(inputs[newIndex] || '');
      setInputText(inputs[newIndex] || '');
    }
  };

  const handleChange = (e: React.BaseSyntheticEvent) => {
    if (e.target.innerText === '') setInputIndex(inputs.length - 1);
    setInput(e.target.innerText);
  };

  const setInputText = (target: string) => {
    if (inputRef.current) {
      inputRef.current.innerText = target;
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <div className='bg-transparent outline-none resize-none break-all'>
      <span className='mr-[1ch]'>{`${user}@${host} ${path} $`}</span>
      <span
        contentEditable
        ref={inputRef}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        content={input}
        className='bg-transparent outline-none'
        autoFocus
      />
    </div>
  );
});
TerminalInput.displayName = 'TerminalInput';
