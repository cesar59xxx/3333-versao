"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Project {
  id: string
  name: string
  created_at: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
        setProjects(data || [])
      } catch (error) {
        console.error("[v0] Error loading projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Meus Projetos</h1>
          <p className="text-gray-600">Gerencie seus projetos WhatsApp</p>
        </div>

        <div className="mb-6">
          <Link href="/projects/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white">+ Novo Projeto</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {projects.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">Nenhum projeto criado ainda</Card>
          ) : (
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <h2 className="text-xl font-semibold text-black">{project.name}</h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(project.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
