"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Instance } from "@/lib/types"

export function useInstances(projectId: string) {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInstances() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("instances").select("*").eq("project_id", projectId)

        if (error) throw error
        setInstances(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar instâncias")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) fetchInstances()
  }, [projectId])

  return { instances, loading, error }
}
