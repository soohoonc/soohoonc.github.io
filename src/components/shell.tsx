'use client';

import React from 'react';
import { useShell } from '@/providers/shell';

export const Shell = () => {
  const shellInputRef = React.useRef<HTMLSpanElement>(null);
  
  const focusInput = () => {
    shellInputRef.current?.focus();
  };

  return (
    <div
      className='font-mono flex flex-col overflow-y-scroll pt-2'
      onClick={focusInput}
    >
      <ShellHistory />
      <ShellInput ref={shellInputRef} />
    </div>
  );
};

interface ShellRef {
  focus: () => void;
}

const ShellInput = React.forwardRef<ShellRef | null>((_, ref) => {
  const [input, setInput] = React.useState<string>('');
  const inputRef = React.useRef<ShellRef>(null);
  const { history, execute, user, hostname } = useShell();

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const output = execute(input);
      // Add the input and output to history
      history.add({ role: 'user', content: `${user.get()}@${hostname.get()} $ ${input}` });
      history.add({ role: 'assistant', content: output });
      setInput('');
    }
  };

  const handleChange = (e: React.FormEvent<HTMLSpanElement>) => {
    setInput(e.currentTarget.textContent || '');
  };

  return (
    <div className='bg-transparent outline-none resize-none break-all'>
      <span>{`${user.get()}@${hostname.get()} $ `}</span>
      <span
        contentEditable
        ref={inputRef as React.RefObject<HTMLSpanElement>}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        className='bg-transparent outline-none'
        autoFocus
      />
    </div>
  );
});

export const ShellHistory = () => {
  const { history } = useShell();
  const [currentTime, setCurrentTime] = React.useState(getTime());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="border-t w-full">
      <p suppressHydrationWarning className="m-0 py-2">
        <a href='https://soohoonchoi.com' className='link'>
          soohoonchoi
        </a>{' '}
        <React.Suspense fallback={null}>
          {currentTime}
        </React.Suspense>
        <br />
        Type &quot;help&quot;, &quot;credits&quot; or &quot;license&quot; for more.
      </p>
      {history.get().map((message, index) => (
        <React.Fragment key={index}>
          <span>{message.content}</span>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

ShellInput.displayName = 'ShellInput';

function getTime() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${formattedDate}, ${formattedTime}`;
}