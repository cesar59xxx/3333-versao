"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api/client"
import type { DashboardMetrics } from "@/lib/types/database"

export function useDashboardMetrics(projectId: string | null) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    async function fetchMetrics() {
      try {
        setLoading(true)
        const data = await apiRequest(`/api/dashboard?projectId=${projectId}`)
        setMetrics(data)
      } catch (err: any) {
        console.error("[v0] Error fetching metrics:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Refresh every 30s

    return () => clearInterval(interval)
  }, [projectId])

  return { metrics, loading, error }
}
