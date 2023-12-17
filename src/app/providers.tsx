'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { createFileSystem, type FileSystem } from '@/lib/fs';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const initialFileSystem = {
  hello: () => 'hello',
} as FileSystem;

const FileSystemContext = React.createContext<FileSystem>(initialFileSystem)

export function useFileSystem() {
  const context = React.useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [fs, setFs] = React.useState<FileSystem>(initialFileSystem);
  const [path, setPath] = React.useState<string>('');
  React.useEffect(() => {
    async function init() {
      const fs = await createFileSystem();
      console.log(fs.hello())
      fs.cd('/users/guest')
      setPath(fs.pwd())
      setFs(fs);
    }
    init();
  }, []);
  return (
    <FileSystemContext.Provider value={fs}>{children}</FileSystemContext.Provider>
  );
}

type TerminalState = {
  showWelcome: boolean;
  setShowWelcome: (showWelcome: boolean) => void;
  user: string;
  setUser: (user: string) => void;
  host: string;
  setHost: (host: string) => void;
  path: string;
  setPath: (path: string) => void;
  inputs: string[];
  setInputs: (inputs: string[]) => void;
  outputs: Message[];
  setOutputs: (outputs: Message[]) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  inputIndex: number;
  setInputIndex: (inputIndex: number) => void;
};

const TerminalStateContext = React.createContext<TerminalState | null>(null);

export function useTerminalState() {
  const context = React.useContext(TerminalStateContext);
  if (!context) {
    throw new Error('useTerminalState must be used within a TerminalStateProvider');
  }
  return context;
}

export function TerminalStateProvider({ children }: { children: React.ReactNode }) {
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [user, setUser] = React.useState('guest');
  const [host, setHost] = React.useState('soohoonchoi.com');
  const [path, setPath] = React.useState('~');
  const [inputs, setInputs] = React.useState<string[]>([]);
  const [outputs, setOutputs] = React.useState<Message[]>([]);
  const [prompt, setPrompt] = React.useState(`${user}@${host} ${path} $`);
  const [inputIndex, setInputIndex] = React.useState(0);

  return (
    <TerminalStateContext.Provider
      value={{
        showWelcome,
        setShowWelcome,
        user,
        setUser,
        host,
        setHost,
        path,
        setPath,
        inputs,
        setInputs,
        outputs,
        setOutputs,
        prompt,
        setPrompt,
        inputIndex,
        setInputIndex,
      }}
    >
      {children}
    </TerminalStateContext.Provider>
  );
}
