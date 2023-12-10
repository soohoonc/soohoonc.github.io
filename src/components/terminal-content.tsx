"use client"

import React from 'react'

interface TerminalContentProps {
  messages: Message[]
}
export const TerminalContent = ({
  messages
}: TerminalContentProps) => {
  return (
    <div suppressHydrationWarning>
    {messages.map((message, index) => (
      <span className="bg-transparent outline-none resize-none break-all" key={index}>{message}</span>
    ))}
    </div>
  )
}