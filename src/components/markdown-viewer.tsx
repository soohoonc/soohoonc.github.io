'use client'

import React from 'react';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkHtml from 'remark-html';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer = ({
  content,
}: MarkdownViewerProps) => {
  const [mdxSource, setMdxSource] = React.useState<MDXRemoteSerializeResult | null>(null);
  React.useEffect(() => {
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
  return (
    <MDXRemote {...mdxSource} />
  );
}