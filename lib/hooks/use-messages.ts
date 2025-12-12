"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api/client"
import type { Message } from "@/lib/types/database"

export function useMessages(instanceId: string | null, contactId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!instanceId || !contactId) {
      setMessages([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<Message[]>(`/api/instances/${instanceId}/chats/${contactId}/messages`)
      setMessages(data ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch messages"
      setError(message)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [instanceId, contactId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  return { messages, loading, error, refetch: fetchMessages, addMessage }
}
