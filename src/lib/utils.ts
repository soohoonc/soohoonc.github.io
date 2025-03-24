import { type ClassValue, clsx } from 'clsx';
import { useState, useEffect, useLayoutEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { debounce } from 'lodash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', debounce(updateSize, 1000));
    updateSize()
    return (): void => window.removeEventListener('resize', updateSize);
  }, []);

  return isMobile;
};
