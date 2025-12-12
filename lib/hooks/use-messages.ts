"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api/client"
import type { Message } from "@/lib/types/database"

export function useMessages(instanceId: string | null, contactId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    if (!instanceId || !contactId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await apiRequest(`/api/instances/${instanceId}/chats/${contactId}/messages`)
      setMessages(data)
    } catch (err: any) {
      console.error("[v0] Error fetching messages:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [instanceId, contactId])

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  return { messages, loading, error, refetch: fetchMessages, addMessage }
}
