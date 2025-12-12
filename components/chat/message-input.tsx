"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending || disabled) return

    setIsSending(true)
    try {
      await onSendMessage(message.trim())
      setMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem..."
          className="min-h-[60px] max-h-[120px] resize-none"
          disabled={disabled || isSending}
        />
        <Button type="submit" size="icon" disabled={!message.trim() || disabled || isSending} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
