"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Message } from "@/lib/types"

export function useMessages(instanceId: string, contactId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("instance_id", instanceId)
          .eq("contact_id", contactId)
          .order("created_at", { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar mensagens")
      } finally {
        setLoading(false)
      }
    }

    if (instanceId && contactId) fetchMessages()
  }, [instanceId, contactId])

  return { messages, loading, error }
}
