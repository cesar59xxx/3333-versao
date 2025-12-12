"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, QrCode, AlertCircle, CheckCircle, Clock, LogOut } from "lucide-react"
import type { WhatsAppInstance } from "@/lib/types/database"
import { apiRequest } from "@/lib/api/client"

interface InstanceCardProps {
  instance: WhatsAppInstance
  onStartInstance: (instanceId: string) => void
  onQrCodeClick: (instance: WhatsAppInstance) => void
}

const statusConfig: Record<
  string,
  {
    label: string
    icon: typeof Clock
    variant: "secondary" | "default" | "destructive"
    className?: string
  }
> = {
  CREATED: {
    label: "Criado",
    icon: Clock,
    variant: "secondary",
  },
  created: {
    label: "Criado",
    icon: Clock,
    variant: "secondary",
  },
  QR_PENDING: {
    label: "Aguardando QR",
    icon: QrCode,
    variant: "default",
  },
  qr_pending: {
    label: "Aguardando QR",
    icon: QrCode,
    variant: "default",
  },
  CONNECTED: {
    label: "Conectado",
    icon: CheckCircle,
    variant: "default",
    className: "bg-primary text-primary-foreground",
  },
  connected: {
    label: "Conectado",
    icon: CheckCircle,
    variant: "default",
    className: "bg-primary text-primary-foreground",
  },
  DISCONNECTED: {
    label: "Desconectado",
    icon: AlertCircle,
    variant: "secondary",
  },
  disconnected: {
    label: "Desconectado",
    icon: AlertCircle,
    variant: "secondary",
  },
  ERROR: {
    label: "Erro",
    icon: AlertCircle,
    variant: "destructive",
  },
  error: {
    label: "Erro",
    icon: AlertCircle,
    variant: "destructive",
  },
}

const defaultConfig = {
  label: "Desconhecido",
  icon: AlertCircle,
  variant: "secondary" as const,
}

export function InstanceCard({ instance, onStartInstance, onQrCodeClick }: InstanceCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const config = statusConfig[instance.status] || defaultConfig
  const Icon = config.icon

  const normalizedStatus = instance.status?.toUpperCase() || "DISCONNECTED"

  const handleStart = async () => {
    setIsLoading(true)
    try {
      await apiRequest(`/api/instances/${instance.id}/start`, {
        method: "POST",
      })
      onStartInstance(instance.id)
    } catch (error) {
      console.error("[Baileys] Error starting instance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await apiRequest(`/api/instances/${instance.id}/logout`, {
        method: "POST",
      })
      onStartInstance(instance.id) // Trigger refetch
    } catch (error) {
      console.error("[Baileys] Error logging out instance:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{instance.name}</CardTitle>
          </div>
          <Badge variant={config.variant} className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {instance.phone_number && (
            <div className="text-sm">
              <span className="text-muted-foreground">Número: </span>
              <span className="font-medium">{instance.phone_number}</span>
            </div>
          )}

          {instance.last_connected_at && (
            <div className="text-sm text-muted-foreground">
              Última conexão: {new Date(instance.last_connected_at).toLocaleString("pt-BR")}
            </div>
          )}

          <div className="flex gap-2">
            {(normalizedStatus === "CREATED" ||
              normalizedStatus === "DISCONNECTED" ||
              normalizedStatus === "ERROR") && (
              <Button onClick={handleStart} disabled={isLoading} className="flex-1">
                {isLoading ? "Iniciando..." : "Iniciar"}
              </Button>
            )}

            {normalizedStatus === "QR_PENDING" && (
              <Button onClick={() => onQrCodeClick(instance)} className="flex-1">
                <QrCode className="mr-2 h-4 w-4" />
                Ver QR Code
              </Button>
            )}

            {normalizedStatus === "CONNECTED" && (
              <>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <a href={`/instances/${instance.id}/chat`}>Abrir chat</a>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut} title="Desconectar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
