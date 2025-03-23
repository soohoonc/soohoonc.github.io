"use client"
import { useDesktop } from "@/providers/desktop"

interface WindowProps {
  window: {
    id: string
    title: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    isMinimized: boolean
    zIndex: number
    process: string
  }
}

export const WindowComponent = ({ window }: WindowProps) => {
  const { startDrag, minimizeWindow, closeWindow, startResize, draggingState } = useDesktop()

  // Check if this window is being dragged
  const isBeingDragged = draggingState.itemType === "window" && draggingState.itemId === window.id

  // Get the ghost position for this window if it's being dragged
  const ghostPosition = isBeingDragged && draggingState.ghostPosition ? draggingState.ghostPosition : null

  // Render different content based on the process type
  const renderContent = () => {
    switch (window.process) {
      case "finder":
        return (
          <div className="grid grid-cols-4 gap-4 p-2 mac-scrollbar">
            <div className="flex flex-col items-center">
              <div className="text-2xl">📁</div>
              <div className="text-[10px] text-center">System</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl">📁</div>
              <div className="text-[10px] text-center">Applications</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl">📁</div>
              <div className="text-[10px] text-center">Documents</div>
            </div>
          </div>
        )
      case "notepad":
        return (
          <div className="p-4">
            <textarea
              className="w-full h-full min-h-[200px] p-2 border border-black resize-none focus:outline-none text-xs mac-scrollbar"
              placeholder="Type your notes here..."
              style={{ backgroundColor: "#ffffff" }}
            />
          </div>
        )
      case "calculator":
        return (
          <div className="p-4" style={{ backgroundColor: "#eeeeee" }}>
            <div className="bg-white p-2 mb-2 text-right border border-black">0</div>
            <div className="grid grid-cols-4 gap-1">
              {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"].map((key) => (
                <button
                  key={key}
                  className="bg-gray-200 hover:bg-gray-300 p-2 border border-black text-xs"
                  style={{ boxShadow: "1px 1px 0 #000000" }}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )
      case "trash":
        return (
          <div className="p-4 flex flex-col items-center justify-center h-full" style={{ backgroundColor: "#ffffff" }}>
            <div className="text-5xl mb-2">🗑️</div>
            <p className="text-xs text-gray-500">Trash is empty</p>
          </div>
        )
      default:
        return (
          <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
            <p className="text-xs text-gray-700">Content for {window.title}</p>
          </div>
        )
    }
  }

  return (
    <>
      {/* The actual window that stays in place during dragging */}
      <div
        className="absolute mac-window"
        style={{
          left: window.position.x,
          top: window.position.y,
          width: window.size.width,
          height: window.size.height,
          zIndex: window.zIndex,
          opacity: isBeingDragged ? 0.7 : 1,
          transition: isBeingDragged ? "none" : "all 0.1s ease-out",
          backgroundColor: "#ffffff",
          boxShadow: "2px 2px 0 rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Title Bar */}
        <div
          className="mac-title-bar"
          onMouseDown={(e) => startDrag(e, window.id, "window")}
          style={{
            background: "linear-gradient(to right, #cccccc, #999999)",
          }}
        >
          <div className="flex gap-1">
            <button
              className="w-3 h-3 border border-black flex items-center justify-center text-[8px]"
              style={{ backgroundColor: "#ffffff" }}
              onClick={() => closeWindow(window.id)}
            >
              ×
            </button>
            <button
              className="w-3 h-3 border border-black flex items-center justify-center text-[8px]"
              style={{ backgroundColor: "#ffffff" }}
              onClick={() => minimizeWindow(window.id)}
            >
              -
            </button>
          </div>
          <span className="absolute left-1/2 transform -translate-x-1/2 text-xs font-bold">{window.title}</span>
        </div>

        {/* Content Area */}
        <div className="mac-window-content mac-scrollbar" style={{ height: "calc(100% - 20px)" }}>
          {renderContent()}
        </div>

        {/* Resize Handles */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={(e) => startResize(e, window.id, "se")}
        />
        <div
          className="absolute top-0 left-0 w-1 h-full cursor-ew-resize"
          onMouseDown={(e) => startResize(e, window.id, "w")}
        />
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize"
          onMouseDown={(e) => startResize(e, window.id, "e")}
        />
        <div
          className="absolute top-0 left-0 h-1 w-full cursor-ns-resize"
          onMouseDown={(e) => startResize(e, window.id, "n")}
        />
        <div
          className="absolute bottom-0 left-0 h-1 w-full cursor-ns-resize"
          onMouseDown={(e) => startResize(e, window.id, "s")}
        />
      </div>

      {/* Ghost outline during dragging */}
      {isBeingDragged && ghostPosition && (
        <div
          className="absolute border border-white border-dashed pointer-events-none z-50"
          style={{
            left: ghostPosition.x,
            top: ghostPosition.y,
            width: window.size.width,
            height: window.size.height,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Title bar outline */}
          <div className="h-5 border-b border-white border-dashed flex items-center justify-center">
            <span className="text-xs text-white">{window.title}</span>
          </div>
        </div>
      )}
    </>
  )
}

