"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import init, { OS, ProcessInfo } from '@/os/pkg'

export type Application = {
  name: string
  command: string
  args?: string[]
}

export type Process = {
  pid: number
  parentPid: number
  name: string
  command: string
  state: string
}

interface OsContextType {
  os: OS | null;
  state: 'loading' | 'error' | 'ready';
  processes: Process[];
  spawn: (app: Application) => Promise<number>;
  fork: (parentPid: number) => Promise<number>;
  exec: (pid: number, app: Application) => Promise<void>;
  kill: (pid: number, signal: number) => Promise<void>;
  exit: (pid: number, exitStatus: number) => Promise<void>;
  wait: (parentPid: number, childPid?: number) => Promise<{ pid: number; exitStatus: number }>;
  yield: () => Promise<void>;
  ps: () => Process[];
  getpid: () => number | null;
  procInfo: (pid: number) => Process | null;
  // Terminal compatibility methods
  listProcesses: () => Array<{
    processId: number;
    parentId: number;
    name: string;
    command: string;
    state: string;
    cpuTime: number;
    memoryUsage: number;
  }>;
  spawnProcess: (app: Application) => Promise<number>;
  forkProcess: (parentPid: number) => Promise<number>;
  killProcess: (pid: number) => Promise<void>;
  terminateProcess: (pid: number) => Promise<void>;
  stopProcess: (pid: number) => Promise<void>;
  continueProcess: (pid: number) => Promise<void>;
  waitForChild: (parentPid: number, childPid?: number) => Promise<{ pid: number; exitStatus: number }>;
  exitProcess: (pid: number, exitStatus: number) => Promise<void>;
  getCurrentProcess: () => number | null;
}

const OsContext = createContext<OsContextType>({
  os: null,
  state: 'loading',
  processes: [],
  spawn: async () => 0,
  fork: async () => 0,
  exec: async () => { },
  kill: async () => { },
  exit: async () => { },
  wait: async () => ({ pid: 0, exitStatus: 0 }),
  yield: async () => { },
  ps: () => [],
  getpid: () => null,
  procInfo: () => null,
});

export const OSProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [os, setOS] = useState<OS | null>(null);
  const [state, setState] = useState<OsContextType['state']>('loading');
  const [processes, setProcesses] = useState<Process[]>([]);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert WASM ProcessInfo to our Process type
  const convertProcessInfo = useCallback((info: ProcessInfo): Process => ({
    pid: info.pid,
    parentPid: info.parent_pid,
    name: info.name,
    command: info.command,
    state: info.state,
  }), []);

  // Update process list from kernel
  const updateProcessList = useCallback(() => {
    if (!os) return;

    try {
      const processList = os.ps();
      const newProcesses = processList.map(convertProcessInfo);
      setProcesses(newProcesses);
    } catch (error) {
      console.error('Failed to update process list:', error);
    }
  }, [os, convertProcessInfo]);

  // Initialize WASM and OS (no more tick timer - event-driven!)
  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await init();
        const osInstance = new OS();
        setOS(osInstance);
        setState('ready');
      } catch (err) {
        console.error('Failed to initialize WASM OS:', err);
        setState('error');
      }
    };

    initializeWasm();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Start periodic process list updates when OS is ready (UI only)
  useEffect(() => {
    if (os && state === 'ready') {
      updateProcessList(); // Initial update

      // Only update UI process list, no more kernel ticking
      refreshIntervalRef.current = setInterval(updateProcessList, 500);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [os, state, updateProcessList]);

  const spawn = useCallback(async (app: Application): Promise<number> => {
    if (!os) throw new Error('OS not initialized');

    try {
      const pid = os.spawn(app.name, app.command, app.args || []);
      updateProcessList();
      return pid;
    } catch (error) {
      console.error('spawn() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  const fork = useCallback(async (parentPid: number): Promise<number> => {
    if (!os) throw new Error('OS not initialized');

    try {
      const pid = os.fork(parentPid);
      updateProcessList();
      return pid;
    } catch (error) {
      console.error('fork() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  const exec = useCallback(async (pid: number, app: Application): Promise<void> => {
    if (!os) throw new Error('OS not initialized');

    try {
      os.exec(pid, app.name, app.command, app.args || []);
      updateProcessList();
    } catch (error) {
      console.error('exec() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  const kill = useCallback(async (pid: number, signal: number): Promise<void> => {
    if (!os) throw new Error('OS not initialized');
    if (pid === 1) throw new Error('Cannot kill init process (PID 1)');

    try {
      os.kill(pid, signal);
      updateProcessList();
    } catch (error) {
      console.error('kill() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  const exit = useCallback(async (pid: number, exitStatus: number): Promise<void> => {
    if (!os) throw new Error('OS not initialized');

    try {
      os.exit(pid, exitStatus);
      updateProcessList();
    } catch (error) {
      console.error('exit() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  const wait = useCallback(async (parentPid: number, childPid?: number): Promise<{ pid: number; exitStatus: number }> => {
    if (!os) throw new Error('OS not initialized');

    try {
      const result = os.wait(parentPid, childPid);
      updateProcessList();
      return {
        pid: result.pid,
        exitStatus: result.exit_status,
      };
    } catch (error) {
      console.error('wait() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  // New yield system call for cooperative scheduling
  const yieldCpu = useCallback(async (): Promise<void> => {
    if (!os) throw new Error('OS not initialized');

    try {
      os.yield_cpu();
      updateProcessList();
    } catch (error) {
      console.error('yield() failed:', error);
      throw error;
    }
  }, [os, updateProcessList]);

  const ps = useCallback((): Process[] => {
    return processes;
  }, [processes]);

  const getpid = useCallback((): number | null => {
    if (!os) return null;
    return os.getpid() || null;
  }, [os]);

  const procInfo = useCallback((pid: number): Process | null => {
    return processes.find(p => p.pid === pid) || null;
  }, [processes]);

  return (
    <OsContext.Provider value={{
      os,
      state,
      processes,
      spawn,
      fork,
      exec,
      kill,
      exit,
      wait,
      yield: yieldCpu,
      ps,
      getpid,
      procInfo
    }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = () => useContext(OsContext);
