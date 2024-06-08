'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import parse from 'html-react-parser';
import { getShell, type Shell } from '@/lib/fs';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
type ShellContext = {
  execute: (command: string) => React.ReactNode | null;
  prompt: string;
};

const initialShell = {} as Shell;

const initialShellContext = {
  execute: (command: string) => null,
  prompt: '',
};

const ShellContext = React.createContext<ShellContext>(initialShellContext);

export function useShell() {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  console.log('Welcome to my website!');
  const [shell, setShell] = React.useState<Shell>(initialShell);
  const [prompt, setPrompt] = React.useState<string>('');
  const execute = (command: string) => {
    if (!shell) {
      console.error('Shell not initialized');
      return;
    }
    const result = JSON.parse(shell.run(command));
    console.log('execute', result);
    setPrompt(`${result.user}@${result.host} ${result.path} $`);
    return parse(result.result) as React.ReactNode | null;
  };
  React.useEffect(() => {
    async function init() {
      const shell = await getShell();
      const result = JSON.parse(shell.run('hello'));
      console.log(result.result);
      setPrompt(`${result.user}@${result.host} ${result.path} $`);
      setShell(shell);
    }
    init();
  }, []);

  return (
    <ShellContext.Provider
      value={{
        prompt,
        execute,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

type TerminalState = {
  showWelcome: boolean;
  setShowWelcome: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [inputs, setInputs] = React.useState<string[]>([]);
  const [outputs, setOutputs] = React.useState<Message[]>([]);
  const [inputIndex, setInputIndex] = React.useState(0);

  return (
    <TerminalStateContext.Provider
      value={{
        showWelcome,
        setShowWelcome,
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
