"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api/client"
import type { WhatsAppInstance } from "@/lib/types/database"

export function useInstances(projectId: string | null) {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstances = async () => {
    if (!projectId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await apiRequest(`/api/instances?projectId=${projectId}`)
      setInstances(data)
    } catch (err: any) {
      console.error("[v0] Error fetching instances:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstances()
  }, [projectId])

  return { instances, loading, error, refetch: fetchInstances }
}
