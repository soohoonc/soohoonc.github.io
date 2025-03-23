"use client"

import type React from "react"

import { MenuBar } from "./menu-bar"
import { WindowComponent } from "./window"
import { DesktopIcons } from "./icons"
import { useDesktop } from "@/providers/desktop"

export const Desktop = () => {
  const { windows, onMouseMove, onMouseUp, selectIcon } = useDesktop()

  // Handle background click to deselect icons
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      selectIcon(null)
    }
  }

  return (
    <div
      className="h-screen w-screen mac-os-classic"
      style={{
        backgroundColor: "#ceceff",
      }}
      onClick={handleBackgroundClick}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <MenuBar />
      <DesktopIcons />
      {windows.map((window) => !window.isMinimized && <WindowComponent key={window.id} window={window} />)}
    </div>
  )
}

