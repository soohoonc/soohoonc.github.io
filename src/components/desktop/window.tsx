"use client"
import { useDesktop, type Window } from "@/providers/desktop"

interface WindowProps {
  window: Window
}

export const WindowComponent = ({ window }: WindowProps) => {
  const { onMouseDown, closeWindow, startResize, draggingState } = useDesktop()
  const isBeingDragged = draggingState.itemType === "window" && draggingState.itemId === window.id
  const ghostPosition = isBeingDragged && draggingState.ghostPosition ? draggingState.ghostPosition : null

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
          onMouseDown={(e) => onMouseDown(e, window.id, "window")}
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

            </button>
            {/* <button
              className="w-3 h-3 border border-black flex items-center justify-center text-[8px]"
              style={{ backgroundColor: "#ffffff" }}
              onClick={() => minimizeWindow(window.id)}
            >
              -
            </button> */}
          </div>
          <span className="absolute left-1/2 transform -translate-x-1/2 text-xs font-bold">{window.title}</span>
        </div>

        {/* Content Area */}
        <div className="mac-window-content mac-scrollbar" style={{ height: "calc(100% - 20px)" }}>
          {window.content}
        </div>

        {/* Resize Handles */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize border border-black"
          onMouseDown={(e) => startResize(e, window.id, "se")}
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

