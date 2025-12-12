"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useInstances } from "@/lib/hooks/use-instances"
import { InstanceCard } from "@/components/instances/instance-card"
import { CreateInstanceDialog } from "@/components/instances/create-instance-dialog"
import { QRCodeDialog } from "@/components/instances/qr-code-dialog"
import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export function InstancesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get("project")

  const { instances, loading, createInstance } = useInstances(projectId)
  const [selectedInstance, setSelectedInstance] = useState<(typeof instances)[0] | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)

  async function handleCreateInstance(name: string) {
    const result = await createInstance(name)
    if (result) {
      router.refresh()
    }
  }

  async function handleDeleteInstance(instanceId: string) {
    if (!confirm("Tem certeza que deseja deletar esta instância?")) return

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error } = await supabase.from("whatsapp_instances").delete().eq("id", instanceId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Erro ao deletar:", err)
    }
  }

  if (!projectId) {
    return (
      <div className="p-8">
        <p>Selecione um projeto para ver as instâncias</p>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8">Carregando instâncias...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Instâncias</h1>
          <CreateInstanceDialog onCreateInstance={handleCreateInstance} />
        </div>

        {instances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma instância criada</p>
            <CreateInstanceDialog onCreateInstance={handleCreateInstance} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instances.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onShowQR={() => {
                  setSelectedInstance(instance)
                  setShowQRDialog(true)
                }}
                onDelete={() => handleDeleteInstance(instance.id)}
              />
            ))}
          </div>
        )}

        {selectedInstance && (
          <QRCodeDialog
            open={showQRDialog}
            onOpenChange={setShowQRDialog}
            qrCode={selectedInstance.last_qr}
            instanceName={selectedInstance.name}
          />
        )}
      </div>
    </div>
  )
}
