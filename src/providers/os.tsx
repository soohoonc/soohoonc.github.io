"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import init, { OS } from '@/os/pkg'

interface OsContextType {
  os: any | null;
  state: 'loading' | 'error' | 'ready';
}

const OsContext = createContext<OsContextType>({
  os: null,
  state: 'loading',
});

export const OSProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [os, setOS] = useState<any | null>(null);
  const [state, setState] = useState<OsContextType['state']>('loading');

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await init();
        setOS(OS.new());
        setState('ready');
      } catch (err) {
        console.log(err);
        setState('error');
      }
    };

    initializeWasm();
  }, []);

  return (
    <OsContext.Provider value={{ os, state }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = () => useContext(OsContext);
