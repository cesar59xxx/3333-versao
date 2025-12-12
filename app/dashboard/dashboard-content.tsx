"use client"

import { useRouter } from "next/navigation"
import { useProjects } from "@/lib/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export function DashboardContent() {
  const { projects, loading } = useProjects()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreateProject(name: string) {
    setIsCreating(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error } = await supabase.from("projects").insert([{ name }])

      if (error) throw error
      router.refresh()
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projetos</h1>
          <Button
            onClick={() => {
              const name = prompt("Nome do projeto:")
              if (name) handleCreateProject(name)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/instances?project=${project.id}`)}
            >
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Criado em {new Date(project.created_at).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
