'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const Desktop = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
   
  }, []);

  const loadFileContent = async (path: string) => {
    setContent(path);
  };

  return (
    <div>
      <h1>Desktop</h1>
    </div>
  );
};
