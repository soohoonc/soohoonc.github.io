'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useOs } from '@/providers/os';

export type MenuItem = {
  label: string
  dropdown: React.ReactNode
}

export const menuItems: MenuItem[] = [
  {
    label: 'Terminal',
    dropdown: <div>Terminal Menu</div>
  },
  {
    label: 'Shell',
    dropdown: <div>Shell Menu</div>
  },
  {
    label: 'Edit',
    dropdown: <div>Edit Menu</div>
  }
]

type HistoryEntry = {
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
};

const user = 'user';
const hostname = 'ostep-os';

const Terminal = () => {
  const shellInputRef = useRef<HTMLSpanElement>(null);
  const os = useOs();
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      type: 'output',
      content: `Welcome to OSTEP OS Terminal!
Type 'help' to see available commands.

This terminal connects to a real UNIX-like kernel implementing
Operating Systems: Three Easy Pieces concepts.`,
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('/home/user');

  const focusInput = useCallback(() => {
    shellInputRef.current?.focus();
  }, []);

  return (
    <div
      className='font-mono flex flex-col overflow-y-scroll pt-2 pb-2 px-2 h-full'
      onClick={focusInput}
      style={{ backgroundColor: '#000000', color: '#00ff00' }}
    >
      <TerminalHistory history={history} />
      <TerminalInput
        ref={shellInputRef}
        value={currentInput}
        onChange={setCurrentInput}
        onSubmit={() => { }}
        prompt={`${user}@${hostname}:${currentDirectory}$ `}
      />
    </div>
  );
};

interface TerminalHistoryProps {
  history: HistoryEntry[];
}

const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex-1 overflow-y-auto">
      {history.map((entry, index) => (
        <div key={index} className={`whitespace-pre-wrap ${entry.type === 'command' ? 'text-white' :
          entry.type === 'error' ? 'text-red-400' :
            'text-green-400'
          }`}>
          {entry.content}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  prompt: string;
}

const TerminalInput = React.forwardRef<HTMLSpanElement, TerminalInputProps>(
  ({ value, onChange, onSubmit, prompt }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit(value);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
      onChange(e.currentTarget.textContent || '');
    };

    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.textContent = value;
      }
    }, [value, ref]);

    return (
      <div className="flex items-center text-white">
        <span className="text-green-400">{prompt}</span>
        <span
          ref={ref}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1"
          style={{ minWidth: '1ch' }}
          autoFocus
          suppressContentEditableWarning
        />
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';

export default Terminal;