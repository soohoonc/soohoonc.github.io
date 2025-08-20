"use client"

import React, { createContext, useContext } from 'react';
import init, { OS } from '@/os/pkg'

const OsContext = createContext<OS>({} as OS);

export const OSProvider: React.FC<React.PropsWithChildren<{}>> = async ({ children }) => {
  await init();
  const os = new OS();
  return (
    <OsContext.Provider value={os}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = () => useContext(OsContext);
