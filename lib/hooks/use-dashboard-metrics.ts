"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api/client"
import type { DashboardMetrics } from "@/lib/types/database"

const defaultMetrics: DashboardMetrics = {
  date: new Date().toISOString().split("T")[0],
  messages_received_today: 0,
  unique_contacts_today: 0,
  response_rate_today: 0,
  sales_amount_today: 0,
}

export function useDashboardMetrics(projectId: string | null) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    if (!projectId) {
      setMetrics(defaultMetrics)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<DashboardMetrics>(`/api/dashboard?projectId=${projectId}`)
      setMetrics(data ?? defaultMetrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar métricas")
      setMetrics(defaultMetrics)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}
