"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import init, { OS } from '@/os/pkg'

export type Application = {
  name: string
  command: string
}

export type Process = {
  processId: number
  name: string
  command: string
}

interface OsContextType {
  os: any | null;
  state: 'loading' | 'error' | 'ready';
  pcb: Map<number, Process>;
  spawnProcess: (application: Application) => number;
  killProcess: (processId: number) => void;
}

const OsContext = createContext<OsContextType>({
  os: null,
  state: 'loading',
  pcb: new Map<number, Process>(),
  spawnProcess: () => 0,
  killProcess: () => {},
});

export const OSProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [os, setOS] = useState<any | null>(null);
  const [state, setState] = useState<OsContextType['state']>('loading');
  const [pcb, setPcb] = useState<Map<number, Process>>(new Map());
  const [nextPid, setNextPid] = useState<number>(2);

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await init();
        setOS(OS.new());
        
        const finderProcess: Process = {
          processId: 1,
          name: 'Finder',
          command: 'finder'
        };
        
        setPcb(new Map([[1, finderProcess]]));
        setState('ready');
      } catch (err) {
        console.log(err);
        setState('error');
      }
    };

    initializeWasm();
  }, []);

  const spawnProcess = useCallback((application: Application): number => {
    const processId = nextPid;
    setNextPid(prev => prev + 1);
    
    const process: Process = {
      processId,
      name: application.name,
      command: application.command
    };
    
    setPcb(prev => new Map(prev).set(processId, process));
    return processId;
  }, [nextPid]);

  const killProcess = useCallback((processId: number): void => {
    if (processId === 1) return; // Can't kill Finder
    setPcb(prev => {
      const newPcb = new Map(prev);
      newPcb.delete(processId);
      return newPcb;
    });
  }, []);

  return (
    <OsContext.Provider value={{ os, state, pcb, spawnProcess, killProcess }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = () => useContext(OsContext);
