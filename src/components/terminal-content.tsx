"use client"

import React from 'react'

interface TerminalContentProps {
  messages: Message[]
}
export const TerminalContent = ({
  messages
}: TerminalContentProps) => {
  return (
    <>
    {messages.map((message, index) => (
      <p key={index}>{message}</p>
    ))}
    </>
  )
}