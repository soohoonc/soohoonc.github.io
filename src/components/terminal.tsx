"use client"

import React from 'react';
import { TerminalContent } from './terminal-content';
import { TerminalInput } from './terminal-input';

export const Terminal = () => {
  const terminalInputRef = React.useRef<HTMLSpanElement>(null);

  const focusInput = () => {
    terminalInputRef.current?.focus();
  }

  return (
    <div className="font-mono text-xs md:text-base h-screen flex flex-col overflow-y-scroll" onClick={focusInput}> 
      <TerminalContent/>
      <TerminalInput
        ref={terminalInputRef}
      />
    </div>
  );
};
