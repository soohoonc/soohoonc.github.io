'use client';

import React from 'react';
import remarkHtml from 'remark-html';
// import { serialize } from 'next-mdx-remote/serialize';
// import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';

// @ts-ignore
export const MarkdownViewer = ({ content }) => {
  // const [source, setSource] = React.useState<MDXRemoteSerializeResult<
  //   Record<string, unknown>,
  //   Record<string, unknown>
  // > | null>(null);
  React.useEffect(() => {
    // const parseContent = async () => {
    //   const mdxSource = await serialize(content, {
    //     mdxOptions: {
    //       remarkPlugins: [remarkHtml],
    //       rehypePlugins: [],
    //     },
    //   });
    //   setSource(mdxSource);
    // };
    // parseContent();
  }, [content]);
  // if (!source) return null;
  return <div>{content}</div>;
  // return <MDXRemote {...source} />;
};
