"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api/client"
import type { DashboardMetrics } from "@/lib/types/database"

export function useDashboardMetrics(projectId: string | null) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    if (!projectId) {
      setMetrics(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<DashboardMetrics>(`/api/dashboard?projectId=${projectId}`)
      setMetrics(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch metrics"
      setError(message)
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}
