"use client"

import { useInstances } from "@/lib/hooks/use-instances"
import { InstanceItem } from "@/components/instances/instance-item"
import { CreateInstanceBtn } from "@/components/instances/create-instance-btn"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const { instances, loading } = useInstances(projectId)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando instâncias...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="mt-2 text-3xl font-bold">Instâncias</h1>
            <p className="text-muted-foreground">Gerencie suas instâncias WhatsApp</p>
          </div>
          <CreateInstanceBtn projectId={projectId} />
        </div>

        {instances.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Nenhuma instância criada ainda</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {instances.map((instance) => (
              <InstanceItem key={instance.id} instance={instance} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
