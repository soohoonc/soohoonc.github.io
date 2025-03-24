import type { Application } from '@/providers/desktop'

// Export applications configuration
export const applications: Application[] = [
  {
    id: 'finder',
    name: 'Finder',
    icon: {
      id: 'finder-icon',
      name: 'Drive',
      icon: '/icons/finder.png', // adjust path as needed
      position: { x: 20, y: 20 },
      command: 'finder'
    },
    command: 'finder'
  },
  // {
  //   id: 'stickies',
  //   name: 'Stickies',
  //   icon: {
  //     id: 'stickies-icon',
  //     name: 'Stickies',
  //     icon: '/icons/stickies.png',
  //     position: { x: 20, y: 100 },
  //     command: 'stickies',
  //   },
  //   command: 'stickies',
  // },
  // {
  //   id: 'terminal',
  //   name: 'Terminal',
  //   icon: {
  //     id: 'terminal-icon',
  //     name: 'Terminal',
  //     icon: '/icons/terminal.png',
  //     position: { x: 20, y: 180 },
  //     command: 'terminal',
  //   },
  //   command: 'terminal',
  // },
  {
    id: 'welcome',
    name: 'Welcome',
    icon: {
      id: 'welcome-icon',
      name: 'Welcome',
      icon: '/icons/welcome.png',
      position: { x: 20, y: 100 },
      command: 'teach-text',
      args: {
        path: '/welcome',
      },
    },
    command: 'teach-text',
    args: {
      path: '/welcome',
    },
  },
  {
    id: 'trash',
    name: 'Trash',
    icon: {
      id: 'trash-icon',
      name: 'Trash',
      icon: '/icons/trash.png',
      position: { x: 20, y: 180 },
      command: 'trash',
    },
    command: 'trash',
  },
]
