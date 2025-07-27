"use client"

import React, { useEffect } from "react"

import { useState, useCallback, useRef, createContext, useContext, lazy } from "react"
import { icons as initialIcons, applications } from "@/components/applications"
import { useIsMobile, useWindowSize } from "@/lib/utils"
import { useOs } from "./os"
import type { Application } from "./os"

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null
type DraggableItemType = "window" | "icon" | null
type Position = { x: number; y: number }
type Dimension = { width: number; height: number }

export type DesktopIcon = {
  id: string
  name: string
  icon: string
  position: Position
  command: string
  args?: Record<string, any>
}

export type Window = {
  processId: number
  id: string
  title: string
  position: Position
  size: Dimension
  zIndex: number
  content: React.ReactNode
}

interface DraggingState {
  itemType: DraggableItemType | null
  itemId: string | null
  ghostPosition: Position | null
}

interface DesktopContextType {
  windows: Window[]
  icons: DesktopIcon[]
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
  selectedProcessId: number
}

const DesktopContext = createContext<DesktopContextType | null>(null)

export const DesktopProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  const { width, height } = useWindowSize();
  const { spawnProcess, killProcess, state: osState } = useOs()
  const [activeWindow, setActiveWindow] = useState<Window | null>(null)
  const [windows, setWindows] = useState<Window[]>([])
  const [icons, setIcons] = useState<DesktopIcon[]>(initialIcons)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [selectedProcessId, setSelectedProcessId] = useState<number>(1)
  const [initialAppCreated, setInitialAppCreated] = useState<boolean>(false)
  const [draggingState, setDraggingState] = useState<DraggingState>({
    itemType: null,
    itemId: null,
    ghostPosition: null,
  })

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

  const selectIcon = useCallback((id: string | null) => {
    setSelectedIcon(id)
  }, [])

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
    const window = windows.find((w) => w.id === id)
    setActiveWindow(window || null)
    if (window) {
      setSelectedProcessId(window.processId)
    }
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
        return import(`@/components/applications/${application.command}`)
          .then(module => ({ default: module.default || module }))
          .catch(error => {
            console.error('Failed to load component:', error)
            return { default: () => <div>Failed to load application</div> }
          })
      })

      const processId = spawnProcess(application)

      const newWindow: Window = {
        id: `window-${Date.now()}`,
        title: application.name,
        position: options?.position || { x: 50, y: 50 },
        size: options?.size || { width: 640, height: 480 },
        zIndex: 0,
        processId,
        content: <Component {...args} />
      }
      
      setWindows(prev => {
        const newWindows = [...prev, newWindow]
        newWindow.zIndex = newWindows.length - 1
        return newWindows
      })
      setActiveWindow(newWindow)
      setSelectedProcessId(processId)
    },
    [spawnProcess],
  )

  const closeWindow = useCallback((id: string) => {
    const window = windows.find(w => w.id === id)
    if (window) {
      killProcess(window.processId)
    }
    
    setWindows((prev) => {
      const remainingWindows = prev.filter((w) => w.id !== id)
      
      // When closing any window, always default back to Finder (like macOS)
      if (window) {
        setSelectedProcessId(1)
        setActiveWindow(null)
      }
      
      return remainingWindows
    })
  }, [windows, killProcess, selectedProcessId])


  const onMouseDown = useCallback(
    (e: React.MouseEvent, id: string, itemType: DraggableItemType) => {
      e.preventDefault()
      e.stopPropagation()
      if (itemType === "icon") {
        selectIcon(id)
        const icon = icons.find((i) => i.id === id)
        if (!icon) return
        const currentTime = new Date().getTime()
        const isDoubleClick = currentTime - dragRef.current.lastClickTime < 300
        dragRef.current.lastClickTime = currentTime

        if (isDoubleClick) {
          openApplication(icon.command, icon.args)
          return
        }
      }

      const item = itemType === "window" ? windows.find((w) => w.id === id) : icons.find((i) => i.id === id)

      if (!item) {
        setSelectedIcon(null)
        return
      }

      dragRef.current = {
        isDragging: true,
        offset: {
          x: e.clientX - item.position.x,
          y: e.clientY - item.position.y,
        },
        lastClickTime: dragRef.current.lastClickTime,
      }

      setDraggingState({
        itemType,
        itemId: id,
        ghostPosition: item.position,
      })

      if (itemType === "window") {
        bringToFront(id)
      }
    },
    [windows, icons, selectIcon, openApplication, bringToFront],
  )

  const onDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!dragRef.current.isDragging || !draggingState.itemId) return

      const newPosition = {
        x: e.clientX - dragRef.current.offset.x,
        y: e.clientY - dragRef.current.offset.y,
      }

      setDraggingState((prev) => ({
        ...prev,
        ghostPosition: newPosition,
      }))
    },
    [draggingState.itemId],
  )

  const endDrag = useCallback(() => {
    if (dragRef.current.isDragging && draggingState.itemId && draggingState.ghostPosition) {
      if (draggingState.itemType === "window") {
        setWindows((prev) =>
          prev.map((w) => (w.id === draggingState.itemId ? { ...w, position: draggingState.ghostPosition! } : w)),
        )
      } else if (draggingState.itemType === "icon") {
        setIcons((prev) =>
          prev.map((icon) =>
            icon.id === draggingState.itemId ? { ...icon, position: draggingState.ghostPosition! } : icon,
          ),
        )
      }
    }

    dragRef.current.isDragging = false
    setDraggingState({
      itemType: null,
      itemId: null,
      ghostPosition: null,
    })
  }, [draggingState])

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
    closeWindow,
    startResize,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    createWindow,
    draggingState,
    selectIcon,
    selectedIcon,
    selectedProcessId,
    openApplication,
  }


  useEffect(() => {
    if (osState !== 'ready' || initialAppCreated) return

    const application = { name: 'Teach Text', command: 'teach-text' }
    const windowSize = isMobile ? { width, height: 480 } : { width: 640, height: 480 }
    const centerX = (width - windowSize.width) / 2
    const centerY = (height - windowSize.height) / 2
    
    createWindow(application, { path: '/home/soohoon/welcome' }, {
      size: windowSize,
      position: isMobile 
        ? { x: 0, y: 40 }
        : { x: Math.max(0, centerX), y: Math.max(40, centerY) }
    })
    setInitialAppCreated(true)
  }, [osState, initialAppCreated, isMobile, width, height])

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export const useDesktop = () => {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider")
  }
  return context
}

