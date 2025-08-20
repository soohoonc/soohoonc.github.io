"use client"

import type { DesktopIcon } from '@/providers/desktop'


export type Application = {
  name: string
  command: string
}


export const icons: DesktopIcon[] = [
  {
    id: 'finder-icon',
    name: 'Drive',
    icon: '/icons/finder.png', // adjust path as needed
    position: { x: -20, y: 20 },
    command: 'finder'
  },
  {
    id: 'terminal-icon',
    name: 'Terminal',
    icon: '/icons/terminal.png',
    position: { x: -20, y: 180 },
    command: 'terminal'
  },
  {
    id: 'process-manager-icon',
    name: 'Processes',
    icon: '/icons/process.png',
    position: { x: -20, y: 260 },
    command: 'process-manager'
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

export const applications: Application[] = [
  {
    name: 'Finder',
    command: 'finder'
  },
  {
    name: 'Terminal',
    command: 'terminal'
  },
  {
    name: 'Process Manager',
    command: 'process-manager'
  },
  {
    name: 'Teach Text',
    command: 'teach-text'
  },
]
