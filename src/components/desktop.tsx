"use client"

import { useState, useCallback, useRef } from 'react';
import { useWindowSize } from '@/lib/utils';
import { useOs } from '@/providers/os';

// Types for our windows and processes
type Window = {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
  process: string;
};

type Process = {
  id: string;
  name: string;
  icon?: string;
};

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;


export const Desktop = () => {
  // State management
  const os = useOs();
  const { width, height } = useWindowSize();
  const [windows, setWindows] = useState<Window[]>([{
    id: 'test',
    title: 'test',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 400 },
    isMinimized: false,
    zIndex: 2,
    process: '4'
  }]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const dragRef = useRef<{ isDragging: boolean; offset: { x: number; y: number } }>({
    isDragging: false,
    offset: { x: 0, y: 0 },
  });
  const resizeRef = useRef<{
    isResizing: boolean;
    direction: ResizeDirection;
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
    startWindowPos: { x: number; y: number };
  }>({
    isResizing: false,
    direction: null,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startWindowPos: { x: 0, y: 0 },
  });

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      return prev.map(w =>
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
    setActiveWindow(id);
  }, []);

  // Previous window management functions remain the same...
  // [createWindow, closeWindow, minimizeWindow, bringToFront]

  const startResize = useCallback((
    e: React.MouseEvent,
    id: string,
    direction: ResizeDirection
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const window = windows.find(w => w.id === id);
    if (!window) return;

    resizeRef.current = {
      isResizing: true,
      direction,
      startPos: { x: e.clientX, y: e.clientY },
      startSize: { ...window.size },
      startWindowPos: { ...window.position },
    };

    bringToFront(id);
  }, [windows, bringToFront]);

  const onResize = useCallback((e: React.MouseEvent) => {
    if (!resizeRef.current.isResizing || !activeWindow) return;

    const { direction, startPos, startSize, startWindowPos } = resizeRef.current;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    const minWidth = 200;
    const minHeight = 100;

    setWindows(prev => prev.map(w => {
      if (w.id !== activeWindow) return w;

      let newSize = { ...w.size };
      let newPos = { ...w.position };

      // Handle different resize directions
      if (direction?.includes('e')) {
        newSize.width = Math.max(minWidth, startSize.width + deltaX);
      }
      if (direction?.includes('w')) {
        const newWidth = Math.max(minWidth, startSize.width - deltaX);
        newPos.x = startWindowPos.x + (startSize.width - newWidth);
        newSize.width = newWidth;
      }
      if (direction?.includes('s')) {
        newSize.height = Math.max(minHeight, startSize.height + deltaY);
      }
      if (direction?.includes('n')) {
        const newHeight = Math.max(minHeight, startSize.height - deltaY);
        newPos.y = startWindowPos.y + (startSize.height - newHeight);
        newSize.height = newHeight;
      }

      return {
        ...w,
        size: newSize,
        position: newPos,
      };
    }));
  }, [activeWindow]);

  const endResize = useCallback(() => {
    resizeRef.current.isResizing = false;
    resizeRef.current.direction = null;
  }, []);


  // Window management functions
  const createWindow = useCallback((process: Process) => {
    const newWindow: Window = {
      id: `window-${Date.now()}`,
      title: process.name,
      position: { x: 50, y: 50 },
      size: { width: 400, height: 300 },
      isMinimized: false,
      zIndex: windows.length,
      process: process.id,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  // Drag handling
  const startDrag = useCallback((e: React.MouseEvent, id: string) => {
    const window = windows.find(w => w.id === id);
    if (!window) return;

    dragRef.current = {
      isDragging: true,
      offset: {
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y,
      },
    };
    bringToFront(id);
  }, [windows, bringToFront]);

  const onDrag = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.isDragging || !activeWindow) return;

    setWindows(prev => prev.map(w =>
      w.id === activeWindow ? {
        ...w,
        position: {
          x: e.clientX - dragRef.current.offset.x,
          y: e.clientY - dragRef.current.offset.y,
        },
      } : w
    ));
  }, [activeWindow]);

  const endDrag = useCallback(() => {
    dragRef.current.isDragging = false;
  }, []);


  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (resizeRef.current.isResizing) {
      onResize(e);
    } else if (dragRef.current.isDragging) {
      onDrag(e);
    }
  }, [onDrag, onResize]);

  const onMouseUp = useCallback(() => {
    endDrag();
    endResize();
  }, [endDrag, endResize]);

  return (
    <>
      <div
        className="relative h-full bg-stone-950 overflow-hidden"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Desktop Windows */}
        {windows.map(window => !window.isMinimized && (
          <div
            key={window.id}
            className="absolute border bg-stone-950"
            style={{
              left: window.position.x,
              top: window.position.y,
              width: window.size.width,
              height: window.size.height,
              zIndex: window.zIndex,
            }}
          >
            {/* Window Title Bar */}
            <div
              className="h-8 px-2 border-b flex items-center justify-between"
              onMouseDown={(e) => startDrag(e, window.id)}
            >
              <span className="text-sm font-medium">{window.title}</span>
              <div>
                <button
                  className="px-2 py-1"
                  onClick={() => minimizeWindow(window.id)}
                >
                  -
                </button>
                <button
                  className="px-2 py-1"
                  onClick={() => closeWindow(window.id)}
                >
                  x
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-4">
              {/* WASM Process Content would go here */}
              <div className="text-sm text-gray-400">
                Process: {window.process}
              </div>
            </div>
            <div
              className="absolute top-0 left-0 w-1 h-full cursor-w-resize"
              onMouseDown={(e) => startResize(e, window.id, 'w')}
            />
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-e-resize"
              onMouseDown={(e) => startResize(e, window.id, 'e')}
            />
            <div
              className="absolute top-0 left-0 h-1 w-full cursor-n-resize"
              onMouseDown={(e) => startResize(e, window.id, 'n')}
            />
            <div
              className="absolute bottom-0 left-0 h-1 w-full cursor-s-resize"
              onMouseDown={(e) => startResize(e, window.id, 's')}
            />
            {/* Corner resize handles */}
            <div
              className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
              onMouseDown={(e) => startResize(e, window.id, 'nw')}
            />
            <div
              className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
              onMouseDown={(e) => startResize(e, window.id, 'ne')}
            />
            <div
              className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
              onMouseDown={(e) => startResize(e, window.id, 'sw')}
            />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
              onMouseDown={(e) => startResize(e, window.id, 'se')}
            />
          </div>
        ))}
      </div >
      <div className="absolute bottom-0 left-0 w-full h-8 border-t border-zinc-400">
        <div className="flex items-start h-full">
          <button
            key='terminal'
            className={`px-3 py-1 h-full text-sm bg-background border-r`}
            onClick={() => {
              createWindow({
                id: `test-${windows.length}`,
                name: `test-${windows.length}`
              })
            }}>
            &gt;
          </button>
          {windows.map(window => (
            <button
              key={window.id}
              className={`px-4 py-1 h-full text-sm bg-background border-r`}
              onClick={() => {
                if (window.isMinimized) {
                  minimizeWindow(window.id);
                }
                bringToFront(window.id);
              }}
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
