'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { createFileSystem, type FileSystem } from '@/lib/fs';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
const FileSystemContext = React.createContext<FileSystem|null>(null);

export function FileSystemProvider({
  children
}: { children: React.ReactNode }) {
  const [initialFileSystem, setInitialFileSystem] = React.useState<FileSystem|null>(null);
  React.useEffect(() => {
    async function init() {
      const fs = await createFileSystem();
      console.log(fs);
      setInitialFileSystem(fs);
    }
    init()
  }, [])
  return (
    <FileSystemContext.Provider value={initialFileSystem}>
      {children}
    </FileSystemContext.Provider>
  );
}