import { fs } from '@/data/fs'

interface TeachTextProps {
  path?: string;
}

const TeachText = ({ path }: TeachTextProps) => {

  const find = (nodes: any[], path: string) => {
    const parts = path.split('/').filter(p => p) // Remove empty strings
    let node = nodes[0] // Start from root node

    for (let i = 0; i < parts.length; i++) {
      if (!node.children) return null
      node = node.children.find((n: any) => n.name === parts[i])
      if (!node) return null
    }
    return node?.content || null
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