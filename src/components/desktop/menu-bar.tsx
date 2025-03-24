"use client"

import { useState, useEffect } from "react"

export const MenuBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 5000)

    return () => clearInterval(timer)
  }, [])

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
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Special</span>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <span>{formattedTime}</span>
      </div>
    </div>
  )
}

