import React from 'react'
import { fs } from '@/data/fs'

export type MenuItem = {
  label: string
  dropdown: React.ReactNode
}

export const menuItems: MenuItem[] = [
  {
    label: 'File',
    dropdown: <div>File Menu</div>
  },
  {
    label: 'Edit',
    dropdown: <div>Edit Menu</div>
  },
  {
    label: 'Format',
    dropdown: <div>Format Menu</div>
  }
]

interface TeachTextProps {
  path?: string;
}

const TeachText = ({ path }: TeachTextProps) => {

  const find = (nodes: any[], path: string) => {
    const parts = path.split('/')
    let node = nodes.find(node => node.name === parts[1])
    if (!node) {
      return null
    }
    if (parts.length === 2) {
      return node.content
    }
    return find(node.children, parts.slice(1).join('/'))
  }

  if (!path) {
    return (<div>
      <h1>Welcome to TeachText</h1>
      <p>TeachText is a simple text editor that allows you to create and edit text files.</p>
      <button>Create new file</button>
    </div>)
  }
  const content = find(fs, path)
  if (content) {
    return content
  }

  return (
    <div>
      <h1>File Not Found</h1>
    </div>
  )
}

export default TeachText