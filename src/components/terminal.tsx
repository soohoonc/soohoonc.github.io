"use client"

import React, { useState, useEffect, useRef } from 'react';
import { TerminalContent } from './terminal-content';
import { TerminalInput } from './terminal-input';

export const Terminal = () => {
  const [user, setUser] = useState('guest');
  const [host, setHost] = useState('soohoonchoi.com');
  const [path, setPath] = useState('~');
  const [messages, setMessages] = useState<Message[]>(["type 'help' + Enter to get started"]);
  const terminalInputRef = useRef<HTMLTextAreaElement>(null);

  const focusInput = () => {
    terminalInputRef.current?.focus();
  }
  return (
    <div className="font-mono h-screen flex flex-col overflow-y-scroll" onClick={focusInput}> 
      <TerminalContent messages={messages} />
      <TerminalInput 
        ref={terminalInputRef}
        user={user}
        host={host}
        path={path}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};
