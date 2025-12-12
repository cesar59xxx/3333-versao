"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Instance } from "@/lib/types"

export function useInstances(projectId: string | null) {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setInstances([])
      setLoading(false)
      return
    }

    async function fetchInstances() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("whatsapp_instances")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })

        if (error) throw error
        setInstances(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar instâncias")
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchInstances()
  }, [projectId])

  const createInstance = useCallback(
    async (name: string) => {
      if (!projectId) return null

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("whatsapp_instances")
          .insert([{ project_id: projectId, name, status: "disconnected" }])
          .select()
          .single()

        if (error) throw error
        setInstances((prev) => [data, ...prev])
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar instância")
        return null
      }
    },
    [projectId],
  )

  return { instances, loading, error, createInstance }
}
