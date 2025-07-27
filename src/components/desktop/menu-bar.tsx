"use client"

import { useOs } from "@/providers/os"
import { useDesktop } from "@/providers/desktop"
import { useState, useEffect } from "react"
import type { MenuItem } from "@/components/applications/finder"

async function getMenuItemsForCommand(command: string): Promise<MenuItem[]> {
  try {
    const menuModule = await import(`@/components/applications/${command}`)
    return menuModule.menuItems
  } catch (error) {
    console.warn(`No menu items found for command: ${command}`)
    return []
  }
}

export const MenuBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const { selectedProcessId } = useDesktop()
  const { pcb } = useOs()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const selectedProcess = pcb.get(selectedProcessId)
    if (!selectedProcess) {
      setMenuItems([])
      return
    }

    const loadMenuItems = async () => {
      const items = await getMenuItemsForCommand(selectedProcess.command)
      setMenuItems(items)
    }

    loadMenuItems()
  }, [selectedProcessId, pcb])

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div
      className="mac-title-bar mac-pixel-text"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="pl-4 pr-2 font-bold text-center text-xl">λ</span>
        </div>
        {menuItems.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <span>{formattedTime}</span>
      </div>
    </div>
  )
}

