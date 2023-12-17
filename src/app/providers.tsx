'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { createFileSystem, type FileSystem } from '@/lib/fs';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
type FSContext = {
  fs: FileSystem;
  path: string;
  setPath: (path: string) => void;
};

const initialFileSystem = {
  hello: () => 'hello'
} as FileSystem;

const initialFileSystemContext = {
    fs: initialFileSystem,
    path: '',
    setPath: (path: string) => {},
};

const FileSystemContext = React.createContext<FSContext>(initialFileSystemContext);

export function useFileSystem() {
  const context = React.useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [fs, setFs] = React.useState<FileSystem>(initialFileSystem);
  const [path, setPath] = React.useState<string>('~');
  React.useEffect(() => {
    async function init() {
      const fs = await createFileSystem();
      console.log(fs.hello())
      fs.cd('/users/guest')
      setFs(fs);
    }
    init();
  }, []);
  return (
    <FileSystemContext.Provider value={{
      fs,
      path,
      setPath
    }}>{children}</FileSystemContext.Provider>
  );
}

type TerminalState = {
  showWelcome: boolean;
  setShowWelcome: (showWelcome: boolean) => void;
  user: string;
  setUser: (user: string) => void;
  host: string;
  setHost: (host: string) => void;
  inputs: string[];
  setInputs: (inputs: string[]) => void;
  outputs: Message[];
  setOutputs: (outputs: Message[]) => void;
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
  const { path } = useFileSystem();
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [user, setUser] = React.useState('guest');
  const [host, setHost] = React.useState('soohoonchoi.com');
  const [inputs, setInputs] = React.useState<string[]>([]);
  const [outputs, setOutputs] = React.useState<Message[]>([]);
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
        inputs,
        setInputs,
        outputs,
        setOutputs,
        inputIndex,
        setInputIndex,
      }}
    >
      {children}
    </TerminalStateContext.Provider>
  );
}
