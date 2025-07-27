
import React from 'react'

export type MenuItem = {
  label: string
  dropdown: React.ReactNode
}

export const menuItems: MenuItem[] = [
  {
    label: 'Finder',
    dropdown: <div>Finder Menu</div>
  },
  {
    label: 'File',
    dropdown: <div>File Menu</div>
  },
  {
    label: 'Edit',
    dropdown: <div>Edit Menu</div>
  },
  {
    label: 'View',
    dropdown: <div>View Menu</div>
  }
]

interface FinderProps {
  path?: string;
}

const Finder = ({ path = '/home/soohoon' }: FinderProps) => {
  return (
    <div>
      <h1>Finder</h1>
      <p>{path}</p>
    </div>
  );
}

export default Finder;