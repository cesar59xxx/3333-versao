"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectSelector } from "@/components/dashboard/project-selector"
import { CreateInstanceDialog } from "@/components/instances/create-instance-dialog"
import { InstanceCard } from "@/components/instances/instance-card"
import { QrCodeDialog } from "@/components/instances/qr-code-dialog"
import { useProjects } from "@/lib/hooks/use-projects"
import { useInstances } from "@/lib/hooks/use-instances"
import { useSocket } from "@/lib/hooks/use-socket"
import type { WhatsAppInstance } from "@/lib/types/database"
import Link from "next/link"

export function InstancesContent() {
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const { instances, loading: instancesLoading, refetch: refetchInstances } = useInstances(selectedProjectId)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [qrDialogInstance, setQrDialogInstance] = useState<WhatsAppInstance | null>(null)
  const [currentQrCode, setCurrentQrCode] = useState<string | null>(null)
  const { socket } = useSocket()

  // Auto-select first project
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId])

  // Socket event handlers
  useEffect(() => {
    if (!socket) return

    const handleQr = (data: { instanceId: string; qr: string }) => {
      if (qrDialogInstance?.id === data.instanceId) {
        setCurrentQrCode(data.qr)
      }
    }

    const handleStatus = (data: { instanceId: string; status: string }) => {
      refetchInstances()
      if (data.status.toLowerCase() === "connected" && qrDialogInstance?.id === data.instanceId) {
        setQrDialogInstance(null)
        setCurrentQrCode(null)
      }
    }

    socket.on("qr", handleQr)
    socket.on("instance_status", handleStatus)
    socket.on("message_received", refetchInstances)

    return () => {
      socket.off("qr", handleQr)
      socket.off("instance_status", handleStatus)
      socket.off("message_received", refetchInstances)
    }
  }, [socket, qrDialogInstance, refetchInstances])

  const handleQrCodeClick = useCallback((instance: WhatsAppInstance) => {
    setQrDialogInstance(instance)
    setCurrentQrCode(instance.last_qr)
  }, [])

  const handleQrDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setQrDialogInstance(null)
      setCurrentQrCode(null)
    }
  }, [])

  const handleCreateSuccess = useCallback(() => {
    refetchInstances()
  }, [refetchInstances])

  const handleProjectCreated = useCallback(() => {
    refetchProjects()
  }, [refetchProjects])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">WhatsApp SaaS</h1>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/instances">Instâncias</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Instâncias WhatsApp</h2>
              <p className="text-muted-foreground">Gerencie suas conexões do WhatsApp</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-full md:w-64">
                {!projectsLoading && (
                  <ProjectSelector
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    onSelectProject={setSelectedProjectId}
                    onProjectCreated={handleProjectCreated}
                  />
                )}
              </div>
              <Button onClick={() => setShowCreateDialog(true)} disabled={!selectedProjectId}>
                <Plus className="mr-2 h-4 w-4" />
                Nova instância
              </Button>
            </div>
          </div>

          {instancesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 rounded-lg border bg-card animate-pulse" />
              ))}
            </div>
          ) : instances.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {instances.map((instance) => (
                <InstanceCard
                  key={instance.id}
                  instance={instance}
                  onRefresh={refetchInstances}
                  onQrCodeClick={handleQrCodeClick}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhuma instância encontrada</h3>
              <p className="text-muted-foreground mb-4">Crie sua primeira instância para começar</p>
              <Button onClick={() => setShowCreateDialog(true)} disabled={!selectedProjectId}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira instância
              </Button>
            </div>
          )}
        </div>
      </main>

      {selectedProjectId && (
        <CreateInstanceDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          projectId={selectedProjectId}
          onSuccess={handleCreateSuccess}
        />
      )}

      <QrCodeDialog
        instance={qrDialogInstance}
        open={!!qrDialogInstance}
        onOpenChange={handleQrDialogClose}
        qrCode={currentQrCode}
      />
    </div>
  )
}
