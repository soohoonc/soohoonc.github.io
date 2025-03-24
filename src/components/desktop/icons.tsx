"use client"
import { cn } from "@/lib/utils"
import { useDesktop } from "@/providers/desktop"
import Image from 'next/image'

// The main DesktopIcons component
export const DesktopIcons = () => {
  const { icons, startDrag, draggingState, selectedIcon } = useDesktop()

  return (
    <div className="absolute inset-0">
      {/* Render all icons */}
      {icons.map((icon) => {
        const isBeingDragged = draggingState.itemType === "icon" && draggingState.itemId === icon.id

        return (
          <div
            key={icon.id}
            className="absolute flex flex-col items-center w-16"
            style={{
              left: icon.position.x,
              top: icon.position.y,
              cursor: isBeingDragged ? "grabbing" : "default",
              opacity: isBeingDragged ? 0.5 : 1,
              transition: isBeingDragged ? "none" : "all 0.1s ease-out",
            }}
            onMouseDown={(e) => startDrag(e, icon.id, "icon")}
          >
            <div className="w-8 h-8 flex items-center justify-center mb-1">
              <img
                src={icon.icon}
                alt={icon.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div
              className={cn("mac-icon-label", selectedIcon === icon.id && "mac-icon-label-selected")}
            >
              {icon.name}
            </div>
          </div>
        )
      })}

      {/* Render ghost outline during dragging */}
      {draggingState.itemType === "icon" && draggingState.itemId && draggingState.ghostPosition && (
        <div
          className="absolute flex flex-col items-center w-16 pointer-events-none z-50"
          style={{
            left: draggingState.ghostPosition.x,
            top: draggingState.ghostPosition.y,
          }}
        >
          <div className="w-8 h-8 flex items-center justify-center mb-1 border border-white border-dashed">
            {/* Empty outline */}
          </div>
          <div className="border border-white border-dashed bg-transparent text-white px-1 py-0.5 text-[10px] text-center">
            {icons.find((i) => i.id === draggingState.itemId)?.name || ""}
          </div>
        </div>
      )}
    </div>
  )
}

