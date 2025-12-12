"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api/client"
import type { WhatsAppInstance, InstanceStatus } from "@/lib/types/database"

function normalizeInstance(raw: unknown): WhatsAppInstance | null {
  if (!raw || typeof raw !== "object") return null

  const obj = raw as Record<string, unknown>

  if (typeof obj.id !== "string" || typeof obj.name !== "string") {
    return null
  }

  const validStatuses: InstanceStatus[] = ["created", "qr_pending", "connected", "disconnected", "error"]
  const rawStatus = typeof obj.status === "string" ? obj.status.toLowerCase() : "disconnected"
  const status = validStatuses.includes(rawStatus as InstanceStatus) ? (rawStatus as InstanceStatus) : "disconnected"

  return {
    id: obj.id,
    project_id: typeof obj.project_id === "string" ? obj.project_id : null,
    user_id: typeof obj.user_id === "string" ? obj.user_id : null,
    name: obj.name,
    phone_number: typeof obj.phone_number === "string" ? obj.phone_number : null,
    status,
    last_qr: typeof obj.last_qr === "string" ? obj.last_qr : null,
    session_data: obj.session_data ?? null,
    last_connected_at: typeof obj.last_connected_at === "string" ? obj.last_connected_at : null,
    created_at: typeof obj.created_at === "string" ? obj.created_at : new Date().toISOString(),
    updated_at: typeof obj.updated_at === "string" ? obj.updated_at : new Date().toISOString(),
  }
}

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
      const data = await apiRequest<unknown[]>(`/api/instances?projectId=${projectId}`)

      const normalized = Array.isArray(data)
        ? data.map(normalizeInstance).filter((i): i is WhatsAppInstance => i !== null)
        : []

      setInstances(normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar instâncias")
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
