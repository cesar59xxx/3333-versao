"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api/client"
import type { WhatsAppInstance } from "@/lib/types/database"

export function useInstances(projectId: string | null) {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInstances = useCallback(async () => {
    if (!projectId) {
      setInstances([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<WhatsAppInstance[]>(`/api/instances?projectId=${projectId}`)
      setInstances(data ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch instances"
      setError(message)
      setInstances([])
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchInstances()
  }, [fetchInstances])

  return { instances, loading, error, refetch: fetchInstances }
}
