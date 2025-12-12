"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api/client"
import type { Contact } from "@/lib/types/database"

export function useContacts(instanceId: string | null) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = useCallback(async () => {
    if (!instanceId) {
      setContacts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<Contact[]>(`/api/instances/${instanceId}/contacts`)
      setContacts(data ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch contacts"
      setError(message)
      setContacts([])
    } finally {
      setLoading(false)
    }
  }, [instanceId])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return { contacts, loading, error, refetch: fetchContacts }
}
