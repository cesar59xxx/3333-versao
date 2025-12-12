"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types/database"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (err: any) {
        console.error("[v0] Error fetching projects:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}
