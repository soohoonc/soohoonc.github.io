"use client"

import type React from "react"

import { useState, useCallback, useRef, createContext, useContext } from "react"

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null
type DraggableItemType = "window" | "icon"

export type Process = {
  id: string
  name: string
  icon?: string
}

export type Window = {
  id: string
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  zIndex: number
  process: string
}

export type DesktopIcon = {
  id: string
  name: string
  icon: string
  position: { x: number; y: number }
  processId: string
}

// Unified dragging state interface
interface DraggingState {
  itemType: DraggableItemType | null
  itemId: string | null
  ghostPosition: { x: number; y: number } | null
}

interface DesktopContextType {
  windows: Window[]
  icons: DesktopIcon[]
  startDrag: (e: React.MouseEvent, id: string, itemType: DraggableItemType) => void
  minimizeWindow: (id: string) => void
  closeWindow: (id: string) => void
  startResize: (e: React.MouseEvent, id: string, direction: ResizeDirection) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  createWindow: (process: Process) => void
  draggingState: DraggingState
  selectIcon: (id: string | null) => void
  selectedIcon: string | null
  openApplication: (iconId: string) => void
}

const DesktopContext = createContext<DesktopContextType | null>(null)

export const DesktopProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeWindow, setActiveWindow] = useState<string>()
  const [windows, setWindows] = useState<Window[]>([])

  // Icon state
  const [icons, setIcons] = useState<DesktopIcon[]>([
    {
      id: "hard-drive",
      name: "Macintosh HD",
      icon: "💾",
      position: { x: 20, y: 20 },
      processId: "finder",
    },
    {
      id: "trash",
      name: "Trash",
      icon: "🗑️",
      position: { x: 20, y: 100 },
      processId: "trash",
    },
    {
      id: "notepad",
      name: "SimpleText",
      icon: "📝",
      position: { x: 20, y: 180 },
      processId: "notepad",
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: "🧮",
      position: { x: 20, y: 260 },
      processId: "calculator",
    },
  ])
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
    offset: { x: number; y: number }
    lastClickTime: number
  }>({
    isDragging: false,
    offset: { x: 0, y: 0 },
    lastClickTime: 0,
  })

  const resizeRef = useRef<{
    isResizing: boolean
    direction: ResizeDirection
    startPos: { x: number; y: number }
    startSize: { width: number; height: number }
    startWindowPos: { x: number; y: number }
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
    (iconId: string) => {
      const icon = icons.find((i) => i.id === iconId)
      if (!icon) return

      const process: Process = {
        id: icon.processId,
        name: icon.name,
        icon: icon.icon,
      }

      createWindow(process)
    },
    [icons],
  )

  const bringToFront = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex))
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    })
    setActiveWindow(id)
  }, [])

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
          if (w.id !== activeWindow) return w

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
    (process: Process) => {
      const newWindow: Window = {
        id: `window-${Date.now()}`,
        title: process.name,
        position: { x: 50, y: 50 },
        size: { width: 400, height: 300 },
        isMinimized: false,
        zIndex: windows.length,
        process: process.id,
      }
      setWindows((prev) => [...prev, newWindow])
      setActiveWindow(newWindow.id)

      // Make createWindow available globally for the desktop icons
      if (typeof window !== "undefined") {
        ; (window as any).createWindow = createWindow
      }
    },
    [windows],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)))
  }, [])

  // Unified start drag function for both windows and icons
  const startDrag = useCallback(
    (e: React.MouseEvent, id: string, itemType: DraggableItemType) => {
      e.preventDefault()
      e.stopPropagation()

      // Handle icon-specific logic
      if (itemType === "icon") {
        // Select the icon
        selectIcon(id)

        // Check for double click
        const currentTime = new Date().getTime()
        const isDoubleClick = currentTime - dragRef.current.lastClickTime < 300
        dragRef.current.lastClickTime = currentTime

        if (isDoubleClick) {
          // Open the application on double click
          openApplication(id)
          return
        }
      }

      // Get the item to drag based on type
      const item = itemType === "window" ? windows.find((w) => w.id === id) : icons.find((i) => i.id === id)

      if (!item) return

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
    startDrag,
    minimizeWindow,
    closeWindow,
    startResize,
    onMouseMove,
    onMouseUp,
    createWindow,
    draggingState,
    selectIcon,
    selectedIcon,
    openApplication,
  }

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export const useDesktop = () => {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider")
  }
  return context
}

