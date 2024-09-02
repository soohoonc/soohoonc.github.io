'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkHtml from 'remark-html';

import { useShell } from '@/providers/shell'

export const File = () => {
  const router = useRouter()
  const shell = useShell()

  const [path, setPath] = React.useState('')
  const [content, setContent] = React.useState('')

  // React.useEffect(() => {
  //   const setSource = async () => {
  //     const mdxSource = await serialize(content, {
  //       mdxOptions: {
  //         remarkPlugins: [remarkHtml],
  //         rehypePlugins: [],
  //       },
  //     });
  //     setMdxSource(mdxSource);
  //   }
  //   setSource();
  // }, [])
  // if (!mdxSource) return null;
  // return (
  //   <MDXRemote {...mdxSource} />
  // );
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setPath(hash)
      loadFileContent(hash)
    }

    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const loadFileContent = async (path: string) => {
    setContent(path)
  }

  const renderContent = () => {
    if (content === '') {
      return <div>loading...</div>
    }

    return <div>{content}</div>
  }

  return (
    // <div>
    //   {renderContent()}
    // </div>
    <div className="w-full p-0 m-0">
      <h1>Soohoon Choi</h1>
      <h3 className="mb-2">about me</h3>
      <p className="my-2">
        Cofounder at <a href="https://greptile.com" target="_blank">Greptile</a>.<br/>
        Georgia Tech computer science and mathematics class of 2023.
        </p>
        Interested in (but not limited to):
        <ul className="m-2">
          <li>ai</li>
          <li>knowledge graphs</li>
          <li>art</li>
          <li>most subjects tbh</li>
        </ul>
      <h3 className="mb-2">blog</h3>
        coming soon
        {/* <ul className="m-2">
          <li><a href="/b/one-year-sf">one year in sf</a></li>
        </ul> */}
      {/* <h3 className="mb-2">fun</h3>
      <p className="my-2">
        type cmdk + k to get started
      </p> */}
      <h3 className="mb-2">contact</h3>
      <div className="flex flex-row space-x-2">
          <div><a href="https://github.com/soohoonc">Github</a></div>
          <div><a href="https://linkedin.com/in/soohoonchoi">LinkedIn</a></div>
          <div><a href="https://x.com/soohoonchoi">Twitter</a></div>
      </div>
    </div>
  )
}
