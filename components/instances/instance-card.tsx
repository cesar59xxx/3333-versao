"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, QrCode, AlertCircle, CheckCircle, Clock, LogOut, Wifi, WifiOff } from "lucide-react"
import type { WhatsAppInstance, InstanceStatus } from "@/lib/types/database"
import { apiRequest } from "@/lib/api/client"

interface StatusConfig {
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant: "default" | "secondary" | "destructive" | "outline"
  className: string
}

function getStatusConfig(status: InstanceStatus): StatusConfig {
  const configs: Record<InstanceStatus, StatusConfig> = {
    created: {
      label: "Criado",
      icon: Clock,
      variant: "secondary",
      className: "",
    },
    qr_pending: {
      label: "Aguardando QR",
      icon: QrCode,
      variant: "default",
      className: "bg-yellow-500 hover:bg-yellow-600",
    },
    connected: {
      label: "Conectado",
      icon: CheckCircle,
      variant: "default",
      className: "bg-green-600 hover:bg-green-700",
    },
    disconnected: {
      label: "Desconectado",
      icon: WifiOff,
      variant: "secondary",
      className: "",
    },
    error: {
      label: "Erro",
      icon: AlertCircle,
      variant: "destructive",
      className: "",
    },
  }
  return configs[status] || configs.disconnected
}

interface InstanceCardProps {
  instance: WhatsAppInstance
  onRefresh: () => void
  onQrCodeClick: (instance: WhatsAppInstance) => void
}

export function InstanceCard({ instance, onRefresh, onQrCodeClick }: InstanceCardProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const status = instance.status
  const config = getStatusConfig(status)
  const StatusIcon = config.icon

  const handleStart = async () => {
    setIsStarting(true)
    try {
      await apiRequest(`/api/instances/${instance.id}/start`, { method: "POST" })
      onRefresh()
    } catch (err) {
      console.error("Erro ao iniciar:", err)
    } finally {
      setIsStarting(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await apiRequest(`/api/instances/${instance.id}/logout`, { method: "POST" })
      onRefresh()
    } catch (err) {
      console.error("Erro ao desconectar:", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
            <CardTitle className="text-lg truncate">{instance.name}</CardTitle>
          </div>
          <Badge variant={config.variant} className={config.className}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {instance.phone_number && (
            <p className="text-sm">
              <span className="text-muted-foreground">Número: </span>
              <span className="font-medium">{instance.phone_number}</span>
            </p>
          )}

          {instance.last_connected_at && (
            <p className="text-sm text-muted-foreground">
              Última conexão: {new Date(instance.last_connected_at).toLocaleString("pt-BR")}
            </p>
          )}

          <div className="flex gap-2">
            {(status === "created" || status === "disconnected" || status === "error") && (
              <Button onClick={handleStart} disabled={isStarting} className="flex-1">
                <Wifi className="mr-2 h-4 w-4" />
                {isStarting ? "Iniciando..." : "Iniciar"}
              </Button>
            )}

            {status === "qr_pending" && (
              <Button onClick={() => onQrCodeClick(instance)} className="flex-1">
                <QrCode className="mr-2 h-4 w-4" />
                Ver QR Code
              </Button>
            )}

            {status === "connected" && (
              <>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href={`/instances/${instance.id}/chat`}>Abrir chat</Link>
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
