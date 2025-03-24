"use client"

import React, { useEffect } from "react"

import { useState, useCallback, useRef, createContext, useContext, lazy } from "react"
import { icons as initialIcons, applications } from "@/components/applications"
import { useIsMobile, useWindowSize } from "@/lib/utils"

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null
type DraggableItemType = "window" | "icon" | null
type Position = { x: number; y: number }
type Dimension = { width: number; height: number }

export type Application = {
  name: string
  command: string
  tools?: {
    name: string,
    dropdown: React.ReactNode
  }[]
}

export type DesktopIcon = {
  id: string
  name: string
  icon: string
  position: Position
  command: string
  args?: Record<string, any>
}

export type Window = {
  id: string
  title: string
  position: Position
  size: Dimension
  zIndex: number
  application: Application
  content: React.ReactNode
}

// Unified dragging state interface
interface DraggingState {
  itemType: DraggableItemType | null
  itemId: string | null
  ghostPosition: Position | null
}

interface DesktopContextType {
  windows: Window[]
  icons: DesktopIcon[]
  // minimizeWindow: (id: string) => void
  closeWindow: (id: string) => void
  startResize: (e: React.MouseEvent, id: string, direction: ResizeDirection) => void
  onMouseDown: (e: React.MouseEvent, id: string, itemType: DraggableItemType) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  createWindow: (application: Application, args: any, options?: {
    position: Position
    size: Dimension
  }) => void
  draggingState: DraggingState
  selectIcon: (id: string | null) => void
  selectedIcon: string | null
  openApplication: (command: string, args: any) => void
}

const DesktopContext = createContext<DesktopContextType | null>(null)

export const DesktopProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  const { width, height } = useWindowSize();
  const [activeWindow, setActiveWindow] = useState<Window | null>(null)
  const [windows, setWindows] = useState<Window[]>([])
  const [icons, setIcons] = useState<DesktopIcon[]>(initialIcons)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  // Unified dragging state
  const [draggingState, setDraggingState] = useState<DraggingState>({
    itemType: null,
    itemId: null,
    ghostPosition: null,
  })

  // Drag refs
  const dragRef = useRef<{
    isDragging: boolean
    offset: Position
    lastClickTime: number
  }>({
    isDragging: false,
    offset: { x: 0, y: 0 },
    lastClickTime: 0,
  })

  const resizeRef = useRef<{
    isResizing: boolean
    direction: ResizeDirection
    startPos: Position
    startSize: { width: number; height: number }
    startWindowPos: Position
  }>({
    isResizing: false,
    direction: null,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startWindowPos: { x: 0, y: 0 },
  })

  // Select an icon
  const selectIcon = useCallback((id: string | null) => {
    setSelectedIcon(id)
  }, [])

  // Open an application from an icon
  const openApplication = useCallback(
    (command: string, args: any) => {
      const application = applications.find((a) => a.command === command)
      if (!application) return
      createWindow(application, args)
    },
    [icons],
  )

  const bringToFront = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex))
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    })
    setActiveWindow(windows.find((w) => w.id === id) || null)
  }, [windows])

  const startResize = useCallback(
    (e: React.MouseEvent, id: string, direction: ResizeDirection) => {
      e.preventDefault()
      e.stopPropagation()

      const window = windows.find((w) => w.id === id)
      if (!window) return

      resizeRef.current = {
        isResizing: true,
        direction,
        startPos: { x: e.clientX, y: e.clientY },
        startSize: { ...window.size },
        startWindowPos: { ...window.position },
      }

      bringToFront(id)
    },
    [windows, bringToFront],
  )

  const onResize = useCallback(
    (e: React.MouseEvent) => {
      if (!resizeRef.current.isResizing || !activeWindow) return

      const { direction, startPos, startSize, startWindowPos } = resizeRef.current
      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y
      const minWidth = 200
      const minHeight = 100

      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== activeWindow.id) return w

          const newSize = { ...w.size }
          const newPos = { ...w.position }

          // Handle different resize directions
          if (direction?.includes("e")) {
            newSize.width = Math.max(minWidth, startSize.width + deltaX)
          }
          if (direction?.includes("w")) {
            const newWidth = Math.max(minWidth, startSize.width - deltaX)
            newPos.x = startWindowPos.x + (startSize.width - newWidth)
            newSize.width = newWidth
          }
          if (direction?.includes("s")) {
            newSize.height = Math.max(minHeight, startSize.height + deltaY)
          }
          if (direction?.includes("n")) {
            const newHeight = Math.max(minHeight, startSize.height - deltaY)
            newPos.y = startWindowPos.y + (startSize.height - newHeight)
            newSize.height = newHeight
          }

          return {
            ...w,
            size: newSize,
            position: newPos,
          }
        }),
      )
    },
    [activeWindow],
  )

  const endResize = useCallback(() => {
    resizeRef.current.isResizing = false
    resizeRef.current.direction = null
  }, [])

  const createWindow = useCallback(
    (application: Application, args: any, options?: any) => {
      const Component = lazy(async () => {
        // Dynamically import the component based on the command path
        return import(`@/components/applications/${application.command}`)
          .then(module => ({ default: module.default || module }))
          .catch(error => {
            console.error('Failed to load component:', error)
            return { default: () => <div>Failed to load application</div> }
          })
      })

      const newWindow: Window = {
        id: `window-${Date.now()}`,
        title: application.name,
        position: options?.position || { x: 50, y: 50 },
        size: options?.size || { width: 400, height: 300 },
        zIndex: windows.length,
        application: application,
        content: < Component {...args} />
      }
      setWindows((prev) => [...prev, newWindow])
      setActiveWindow(newWindow)
    },
    [windows],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  // const minimizeWindow = useCallback((id: string) => {
  //   setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)))
  // }, [])

  // Unified start drag function for both windows and icons
  const onMouseDown = useCallback(
    (e: React.MouseEvent, id: string, itemType: DraggableItemType) => {
      e.preventDefault()
      e.stopPropagation()
      // Handle icon-specific logic
      if (itemType === "icon") {
        // Select the icon
        selectIcon(id)
        const icon = icons.find((i) => i.id === id)
        if (!icon) return
        // Check for double click
        const currentTime = new Date().getTime()
        const isDoubleClick = currentTime - dragRef.current.lastClickTime < 300
        dragRef.current.lastClickTime = currentTime

        if (isDoubleClick) {
          // Open the application on double click
          openApplication(icon.command, icon.args)
          return
        }
      }

      // Get the item to drag based on type
      const item = itemType === "window" ? windows.find((w) => w.id === id) : icons.find((i) => i.id === id)

      if (!item) {
        setSelectedIcon(null)
        return
      }

      // Set up dragging state
      dragRef.current = {
        isDragging: true,
        offset: {
          x: e.clientX - item.position.x,
          y: e.clientY - item.position.y,
        },
        lastClickTime: dragRef.current.lastClickTime,
      }

      // Update dragging state
      setDraggingState({
        itemType,
        itemId: id,
        ghostPosition: item.position,
      })

      // Bring window to front if dragging a window
      if (itemType === "window") {
        bringToFront(id)
      }
    },
    [windows, icons, selectIcon, openApplication, bringToFront],
  )

  // Unified drag function
  const onDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!dragRef.current.isDragging || !draggingState.itemId) return

      // Calculate new position
      const newPosition = {
        x: e.clientX - dragRef.current.offset.x,
        y: e.clientY - dragRef.current.offset.y,
      }

      // Update ghost position
      setDraggingState((prev) => ({
        ...prev,
        ghostPosition: newPosition,
      }))
    },
    [draggingState.itemId],
  )

  // Unified end drag function
  const endDrag = useCallback(() => {
    if (dragRef.current.isDragging && draggingState.itemId && draggingState.ghostPosition) {
      // Update position based on item type
      if (draggingState.itemType === "window") {
        // Update window position
        setWindows((prev) =>
          prev.map((w) => (w.id === draggingState.itemId ? { ...w, position: draggingState.ghostPosition! } : w)),
        )
      } else if (draggingState.itemType === "icon") {
        // Update icon position
        setIcons((prev) =>
          prev.map((icon) =>
            icon.id === draggingState.itemId ? { ...icon, position: draggingState.ghostPosition! } : icon,
          ),
        )
      }
    }

    // Reset dragging state
    dragRef.current.isDragging = false
    setDraggingState({
      itemType: null,
      itemId: null,
      ghostPosition: null,
    })
  }, [draggingState])

  // Mouse move and up handlers
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (resizeRef.current.isResizing) {
        onResize(e)
      } else if (dragRef.current.isDragging) {
        onDrag(e)
      }
    },
    [onDrag, onResize],
  )

  const onMouseUp = useCallback(() => {
    endDrag()
    endResize()
  }, [endDrag, endResize])

  const value = {
    windows,
    icons,
    // minimizeWindow,
    closeWindow,
    startResize,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    createWindow,
    draggingState,
    selectIcon,
    selectedIcon,
    openApplication,
  }

  useEffect(() => {
    setWindows([])
    createWindow({
      name: 'Teach Text',
      command: 'teach-text'
    }, {
      path: '/home/soohoon/welcome'
    }, {
      ...(isMobile ? { size: { width, height: 400 } } : {}),
      ...(isMobile ? { position: { x: 0, y: 40 } } : {})
    })
  }, [isMobile])

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export const useDesktop = () => {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider")
  }
  return context
}

