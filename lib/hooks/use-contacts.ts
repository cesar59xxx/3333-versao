"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api/client"
import type { Contact } from "@/lib/types/database"

export function useContacts(instanceId: string | null) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    if (!instanceId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await apiRequest(`/api/instances/${instanceId}/contacts`)
      setContacts(data)
    } catch (err: any) {
      console.error("[v0] Error fetching contacts:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [instanceId])

  return { contacts, loading, error, refetch: fetchContacts }
}
