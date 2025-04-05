import { fs } from '@/data/fs'
import { useState } from 'react'
import { useDesktop } from '@/providers/desktop'

interface FinderProps {
  path?: string;
}

const Finder = ({ path = '/home/soohoon' }: FinderProps) => {
  const [currentPath, setCurrentPath] = useState(path)
  const { openApplication } = useDesktop()

  const findNode = (nodes: any[], path: string) => {
    const parts = path.split('/').filter(p => p) // Remove empty strings
    let node = nodes[0] // Start from root node

    for (let i = 0; i < parts.length; i++) {
      if (!node.children) return null
      node = node.children.find((n: any) => n.name === parts[i])
      if (!node) return null
    }
    return node
  }

  const getCurrentDirectory = () => {
    if (currentPath === '/') {
      return fs[0].children || []
    }
    const node = findNode(fs, currentPath)
    return node?.children || []
  }

  const handleItemClick = (item: any) => {
    if (item.type === 'directory') {
      setCurrentPath(currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`)
    } else if (item.type === 'file') {
      // Open file in TeachText
      openApplication('teach-text', { path: `${currentPath}/${item.name}` })
    }
  }

  const handleBackClick = () => {
    const parts = currentPath.split('/').filter(p => p)
    if (parts.length > 0) {
      setCurrentPath(parts.length === 1 ? '/' : `/${parts.slice(0, -1).join('/')}`)
    }
  }

  const items = getCurrentDirectory()

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-2 border-b">
        <button
          onClick={handleBackClick}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
        >
          ← Back
        </button>
        <span className="ml-4">{currentPath}</span>
      </div>

      <div className="flex-1 p-2">
        {items.map((item: any) => (
          <div
            key={item.name}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleItemClick(item)}
          >
            <span className="mr-2">
              {item.type === 'directory' ? '📁' : '📄'}
            </span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Finder;