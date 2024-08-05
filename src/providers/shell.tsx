

'use client';

import * as React from 'react';

const initialShellState: ShellState = {
  history: [] as Message[],
  user: 'guest',
  hostname: 'soohoonchoi.com',
  shell: {} as Shell
}

const ShellStateReducer = (state: ShellState, action: ShellStateAction): ShellState => {
  switch (action.type) {
    case 'addHistory':
      return {
        ...state,
        history: [...state.history, action.payload]
      };
    case 'clearHistory':
      return {
        ...state,
        history: []
      };
    case 'setUser':
      return {
        ...state,
        user: action.payload
      };
    case 'setHostname':
      return {
        ...state,
        hostname: action.payload
      };
    case 'setShell':
      return {
        ...state,
        shell: action.payload
      };
    default:
      return state;
  }
}

interface ShellContext {
  history: {
    get: () => Message[];
    add: (message: Message) => void;
    clear: () => void;
  },
  user: {
    get: () => string;
    set: (user: string) => void;
  },
  hostname: {
    get: () => string;
    set: (hostname: string) => void;
  },
  execute: (command: string) => string;
}

const ShellContext = React.createContext<ShellContext | undefined>(undefined);


export function useShell() {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(ShellStateReducer, initialShellState);
  const shellContext = {
    history: {
      get: () => state.history,
      add: (message: Message) => dispatch({ type: 'addHistory', payload: message }),
      clear: () => dispatch({ type: 'clearHistory' })
    },
    user: {
      get: () => state.user,
      set: (user: string) => dispatch({ type: 'setUser', payload: user })
    },
    hostname: {
      get: () => state.hostname,
      set: (hostname: string) => dispatch({ type: 'setHostname', payload: hostname })
    },
    execute: (command: string) => {
      return state.shell.run(command);
    }
  }
  React.useEffect(() => {
    async function init() {
      const shell = {
        run: (command: string) => {
          return command;
        }
      } as Shell;
      // const shell = await getShell();
      dispatch({ type: 'setShell', payload: shell });
    }
    init();
  }, []);

  return (
    <ShellContext.Provider
      value={shellContext}
    >
      {children}
    </ShellContext.Provider>
  );
}