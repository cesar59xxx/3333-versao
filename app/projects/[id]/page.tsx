"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Smartphone } from "lucide-react"
import { useParams } from "next/navigation"
import type { Instance } from "@/lib/types"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    async function loadProject() {
      try {
        const supabase = createClient()

        // Load project name
        const { data: project } = await supabase.from("projects").select("name").eq("id", projectId).single()

        if (project) setProjectName(project.name)

        // Load instances
        const { data } = await supabase
          .from("instances")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })

        setInstances(data || [])
      } catch (error) {
        console.error("[v0] Error loading project:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

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
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4">
            ← Voltar
          </Link>
          <h1 className="text-4xl font-bold mb-2">{projectName}</h1>
          <p className="text-gray-600">Instâncias WhatsApp</p>
        </div>

        <div className="mb-6">
          <Link href={`/projects/${projectId}/instances/new`}>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Instância
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {instances.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              Nenhuma instância criada
            </Card>
          ) : (
            instances.map((instance) => (
              <Link key={instance.id} href={`/projects/${projectId}/instances/${instance.id}/chat`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-black">{instance.name}</h2>
                      <p className="text-sm text-gray-600 mt-2">
                        {instance.phone_number ? `📱 ${instance.phone_number}` : "Sem telefone vinculado"}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        instance.status === "connected"
                          ? "bg-green-100 text-green-700"
                          : instance.status === "connecting"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {instance.status === "connected"
                        ? "Conectado"
                        : instance.status === "connecting"
                          ? "Conectando..."
                          : "Desconectado"}
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
