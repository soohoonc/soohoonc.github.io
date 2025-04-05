"use client"

import type { Application, DesktopIcon } from '@/providers/desktop'


export const icons: DesktopIcon[] = [
  {
    id: 'finder-icon',
    name: 'Soohoon',
    icon: '/icons/finder.png', // adjust path as needed
    position: { x: -20, y: 20 },
    command: 'finder'
  },
  {
    id: 'welcome-icon',
    name: 'Welcome',
    icon: '/icons/welcome.png',
    position: { x: -20, y: 100 },
    command: 'teach-text',
    args: {
      path: '/home/soohoon/welcome',
    },
  },
  {
    id: 'trash-icon',
    name: 'Trash',
    icon: '/icons/trash.png',
    position: { x: -20, y: -20 },
    command: 'finder',
    args: {
      path: '/trash',
    },
  },
]

// Export applications configuration
export const applications: Application[] = [
  {
    name: 'Finder',
    command: 'finder',
  },
  {
    name: 'Terminal',
    command: 'terminal',
  },
  {
    name: 'Teach Text',
    command: 'teach-text',
  },
]
