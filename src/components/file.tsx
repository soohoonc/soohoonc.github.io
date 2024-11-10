'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkHtml from 'remark-html';

import { useShell } from '@/providers/shell';

interface FileProps {
  filePath: string;
  fileContent: string;
}

export const File = ({ filePath, fileContent }: FileProps) => {
  const router = useRouter();
  const shell = useShell();
  const [path, setPath] = useState(filePath);
  const [content, setContent] = useState<string>(fileContent);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const setSource = async () => {
      const mdxSource = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkHtml],
          rehypePlugins: [],
        },
      });
      setMdxSource(mdxSource);
    }
    setSource();
  }, [])

  if (!mdxSource) return null;

  // useEffect(() => {
  //   const handleHashChange = () => {
  //     const hash = window.location.hash.slice(1);
  //     setPath(hash);
  //     loadFileContent(hash);
  //   };

  //   handleHashChange();

  //   window.addEventListener('hashchange', handleHashChange);
  //   return () => window.removeEventListener('hashchange', handleHashChange);
  // }, []);

  // const loadFileContent = async (path: string) => {
  //   setContent(path);
  // };

  return (
    <MDXRemote {...mdxSource} />
  );
};
