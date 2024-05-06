'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { getShell, type Shell } from '@/lib/fs';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
type FSContext = {
  shell: Shell;
  path: string;
  setPath: (path: string) => void;
};

const initialShell = {
} as Shell;

const initialShellContext = {
    shell: initialShell,
    path: '',
    setPath: (path: string) => {},
};

const ShellContext = React.createContext<FSContext>(initialShellContext);

export function useShell() {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [shell, setShell] = React.useState<Shell>(initialShell);
  const [path, setPath] = React.useState<string>('~');
  React.useEffect(() => {
    async function init() {
      const shell = await getShell();
      // console.log(fs.hello())
      // fs.cd('/users/guest')
      setShell(shell);
    }
    init();
  }, []);
  return (
    <ShellContext.Provider value={{
      shell,
      path,
      setPath
    }}>{children}</ShellContext.Provider>
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
  const { path } = useShell();
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
