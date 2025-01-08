"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import init, { OS } from '@/os/pkg'

interface WasmContextType {
  wasmInstance: any | null;
  loading: boolean;
  error: Error | null;
}

const WasmContext = createContext<WasmContextType>({
  wasmInstance: null,
  loading: true,
  error: null,
});

export const WasmProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [wasmInstance, setWasmInstance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await init();
        setWasmInstance(new OS())
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initializeWasm();
  }, []);

  return (
    <WasmContext.Provider value={{ wasmInstance, loading, error }}>
      {children}
    </WasmContext.Provider>
  );
};

export const useWasm = () => useContext(WasmContext);
