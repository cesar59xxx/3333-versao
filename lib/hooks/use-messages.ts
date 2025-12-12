"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Message } from "@/lib/types"

export function useMessages(instanceId: string | null, contactId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!instanceId || !contactId) {
      setMessages([])
      setLoading(false)
      return
    }

    async function fetchMessages() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("instance_id", instanceId)
          .eq("contact_id", contactId)
          .order("created_at", { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchMessages()
  }, [instanceId, contactId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!instanceId || !contactId) return false

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { error } = await supabase.from("messages").insert([
          {
            instance_id: instanceId,
            contact_id: contactId,
            content,
            direction: "outbound",
            is_from_agent: true,
          },
        ])

        if (error) throw error
        return true
      } catch (err) {
        console.error("Erro ao enviar mensagem:", err)
        return false
      }
    },
    [instanceId, contactId],
  )

  return { messages, loading, sendMessage }
}
