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
      className="mac-title-bar"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="mr-2">S</span>
          <span className="font-bold">File</span>
        </div>
        <span>Edit</span>
        <span>View</span>
        <span>Special</span>
        <span>Help</span>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <span>{formattedTime}</span>
      </div>
    </div>
  )
}

