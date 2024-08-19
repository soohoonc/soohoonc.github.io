'use client'

import { MDXRemote } from 'next-mdx-remote';

interface MarkdownViewerProps {
  source: any;
}

export const MarkdownViewer = ({
  source,
}: MarkdownViewerProps) => {
  return (
    <MDXRemote {...source} />
  );
}