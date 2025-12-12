"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { CheckCheck } from "lucide-react"

interface MessageListProps {
  messages: Message[]
  loading: boolean
}

export function MessageList({ messages, loading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Carregando mensagens...</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Nenhuma mensagem ainda</p>
          <p className="text-sm mt-1">Envie uma mensagem para começar a conversa</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.direction === "OUTBOUND" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                message.direction === "OUTBOUND" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
            >
              <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
              <div
                className={cn(
                  "flex items-center justify-end gap-1 mt-1",
                  message.direction === "OUTBOUND" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                <span className="text-xs">{formatTime(message.created_at)}</span>
                {message.direction === "OUTBOUND" && <CheckCheck className="h-3 w-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
