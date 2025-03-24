"use client"

import type React from "react"

import { MenuBar } from "./menu-bar"
import { WindowComponent } from "./window"
import { DesktopIcons } from "./icons"
import { useDesktop } from "@/providers/desktop"

export const Desktop = () => {
  const { windows, onMouseMove, onMouseUp, onMouseDown } = useDesktop()

  return (
    <div
      className="mac-os-classic mac-pixelatedf-container"
      onMouseDown={(e) => onMouseDown(e, "desktop", null)}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <MenuBar />
      <DesktopIcons />
      {windows.map((window) => <WindowComponent key={window.id} window={window} />)}
    </div>
  )
}

